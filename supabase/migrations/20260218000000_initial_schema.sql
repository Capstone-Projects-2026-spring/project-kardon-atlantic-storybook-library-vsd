-- Initial schema for the VSD Storybook Library
-- Sets up all tables, indexes, triggers, and RLS policies

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- =====================
-- TABLES
-- =====================

-- Users mirrors Supabase Auth so we can store a display name alongside the email.
-- The trigger below keeps this in sync whenever someone signs up.
CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       VARCHAR(255) UNIQUE NOT NULL,
  username    VARCHAR(100) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- One record per uploaded storybook.
CREATE TABLE public.books (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title           VARCHAR(255) NOT NULL,
  cover_image_url TEXT,
  page_count      INTEGER DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- Each page belongs to a book and holds the image URL for that page.
-- page_number starts at 1 and must be unique within a book.
CREATE TABLE public.pages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id     UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  image_url   TEXT NOT NULL,
  page_text   TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_page_number_per_book UNIQUE (book_id, page_number)
);

-- Hotspots are the interactive regions drawn on a page.
-- coordinates is stored as JSONB to support rectangles, circles, and polygons.
CREATE TABLE public.hotspots (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id     UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  word        VARCHAR(255) NOT NULL,
  coordinates JSONB NOT NULL,
  shape_type  VARCHAR(50) DEFAULT 'rectangle',
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Caretakers can leave notes on pages for themselves or collaborators.
CREATE TABLE public.page_comments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id      UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Tracks book sharing between users.
-- The unique constraint prevents sharing the same book to the same person twice.
CREATE TABLE public.shared_books (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id             UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  shared_by_user_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  shared_with_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  shared_at           TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_book_share UNIQUE (book_id, shared_with_user_id)
);


-- =====================
-- INDEXES
-- =====================

-- Speed up library lookups by user
CREATE INDEX idx_books_user_id ON public.books(user_id);

-- Used when loading pages in order for a given book
CREATE INDEX idx_pages_book_id_page_number ON public.pages(book_id, page_number);

-- Used when loading all hotspots for a page
CREATE INDEX idx_hotspots_page_id ON public.hotspots(page_id);

-- Used when loading comments for a page
CREATE INDEX idx_page_comments_page_id ON public.page_comments(page_id);

-- Used when showing a user the books that have been shared with them
CREATE INDEX idx_shared_books_shared_with ON public.shared_books(shared_with_user_id);


-- =====================
-- TRIGGERS
-- =====================

-- Keeps updated_at current whenever a row is changed
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- When someone signs up through Supabase Auth, automatically create their users row
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- =====================
-- ROW LEVEL SECURITY
-- =====================

ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotspots      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_books  ENABLE ROW LEVEL SECURITY;

-- Users can only read and edit their own profile
CREATE POLICY users_select ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY users_update ON public.users FOR UPDATE USING (auth.uid() = id);

-- Book owners have full access; users a book was shared with can read it
CREATE POLICY books_owner_all ON public.books
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY books_shared_select ON public.books
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shared_books
      WHERE book_id = books.id
        AND shared_with_user_id = auth.uid()
    )
  );

-- Pages follow the same rules as their parent book
CREATE POLICY pages_owner_all ON public.pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.books
      WHERE id = pages.book_id AND user_id = auth.uid()
    )
  );

CREATE POLICY pages_shared_select ON public.pages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shared_books
      WHERE book_id = pages.book_id
        AND shared_with_user_id = auth.uid()
    )
  );

-- Hotspot access follows the book
CREATE POLICY hotspots_owner_all ON public.hotspots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.pages p
      JOIN public.books b ON b.id = p.book_id
      WHERE p.id = hotspots.page_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY hotspots_shared_select ON public.hotspots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pages p
      JOIN public.shared_books sb ON sb.book_id = p.book_id
      WHERE p.id = hotspots.page_id
        AND sb.shared_with_user_id = auth.uid()
    )
  );

-- Comment access also follows the book
CREATE POLICY comments_owner_all ON public.page_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.pages p
      JOIN public.books b ON b.id = p.book_id
      WHERE p.id = page_comments.page_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY comments_shared_select ON public.page_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pages p
      JOIN public.shared_books sb ON sb.book_id = p.book_id
      WHERE p.id = page_comments.page_id
        AND sb.shared_with_user_id = auth.uid()
    )
  );

-- Book owners can manage their shares; recipients can see what's been shared with them
CREATE POLICY shared_books_owner_all ON public.shared_books
  FOR ALL USING (auth.uid() = shared_by_user_id);

CREATE POLICY shared_books_recipient_select ON public.shared_books
  FOR SELECT USING (auth.uid() = shared_with_user_id);
