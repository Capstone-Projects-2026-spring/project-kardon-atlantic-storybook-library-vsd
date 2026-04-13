import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { useAuth } from "./context/AuthContext";
import { createBook, deleteBook, getMyBooks } from "./services/books";
import { createPage, getPagesByBookId } from "./services/pages";
import ErrorBoundary from "./components/ErrorBoundary";
import SettingsPage from "./components/SettingsPage";
import HeaderBar from "./components/HeaderBar";
import MenuPage from "./components/MenuPage";
import LibraryPage from "./components/LibraryPage";
import ReaderPage from "./components/ReaderPage";
import EditorPage from "./components/EditorPage";
import LoginPage from "./components/LoginPage";

function App() {
  const { user, loading } = useAuth();
  // app state
  const [mode, setMode] = useState("read");
  const [page, setPage] = useState("login"); // ← start on login
  const [previousPage, setPreviousPage] = useState("menu");

  useEffect(() => {
    if (loading) return; // don't redirect while checking session
    if (user) {
      setPage("menu");
    } else {
      setPage("login");
    }
  }, [user, loading]);

  const [books, setBooks] = useState([]);
  const [activeBookIndex, setActiveBookIndex] = useState(null);

  // Fetch books from Supabase whenever the user logs in
  const fetchBooks = useCallback(async () => {
    if (!user) return;
    const { data, error } = await getMyBooks();
    if (error) {
      console.error("Failed to fetch books:", error.message);
      return;
    }
    // For each book, load its pages so we have image URLs ready
    const booksWithPages = await Promise.all(
      (data || []).map(async (book) => {
        let pages = [];
        try {
          const { data: pageData } = await getPagesByBookId(book.id);
          pages = pageData || [];
        } catch (e) {
          console.error(`Failed to load pages for book ${book.id}:`, e.message);
        }
        return {
          id: book.id,
          title: book.title,
          cover_image_url: book.cover_image_url || null,
          pages: pages.map((p) => ({
            id: p.id,
            image_url: p.image_url,
          })),
        };
      })
    );
    setBooks(booksWithPages);
  }, [user]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Save book + pages to Supabase, then refresh the list
  const addBook = async (title, pageUrls) => {
    const { data: newBook, error } = await createBook({
      title,
      coverImageUrl: pageUrls[0] || null,
      pageCount: pageUrls.length,
    });

    if (error || !newBook) {
      console.error("Failed to create book:", error?.message || "No data returned");
      throw new Error(error?.message || "Failed to create book. Please try again.");
    }

    try {
      // Create a page row for each uploaded image
      for (let i = 0; i < pageUrls.length; i++) {
        const { error: pageErr } = await createPage({
          bookId: newBook.id,
          pageNumber: i + 1,
          imageUrl: pageUrls[i],
        });

        if (pageErr) {
          throw new Error(`Failed to save page ${i + 1}: ${pageErr.message}`);
        }
      }

      // Refresh from database so state is in sync
      await fetchBooks();
    } catch (e) {
      const { error: rollbackErr } = await deleteBook(newBook.id);
      if (rollbackErr) {
        console.error("Failed to roll back incomplete book:", rollbackErr.message);
      }
      throw e;
    }
  };

  const activeBook =
    activeBookIndex !== null ? books[activeBookIndex] : null;

  const goReaderLibrary = () => {
    setMode("read");
    setPage("library");
  };

  const goEditLibrary = () => {
    setMode("edit");
    setPage("library");
  };

  const goSettings = () => {
    if (page !== "settings") setPreviousPage(page);
    setPage("settings");
  };

  // Show nothing while we check for an existing session
  if (loading) {
    return (
      <div className="appBg">
        <div className="window" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="appBg">
      <div className="window">
        <ErrorBoundary>
          {/* hide header on login */}
          {page !== "login" && (
            <HeaderBar onOpenSettings={goSettings} />
          )}

          {page === "login" && (
            <LoginPage onEnter={() => setPage("menu")} />
          )}

          {page === "menu" && (
            <MenuPage
              onOpenLibrary={goReaderLibrary}
              onEditStorybooks={goEditLibrary}
            />
          )}

          {page === "library" && (
            <LibraryPage
              mode={mode}
              books={books}
              onBack={() => {
                setMode("read");
                setPage("menu");
              }}
              onOpenBook={(index) => {
                setActiveBookIndex(index);
                setPage(mode === "read" ? "reader" : "editor");
              }}
              onBookUploaded={addBook}
            />
          )}

          {page === "reader" && (
            <ReaderPage
              onBack={() => setPage("library")}
              pageData={activeBook?.pages || []}
            />
          )}

          {page === "editor" && (
            <EditorPage
              onBack={() => setPage("library")}
              pageData={activeBook?.pages || []}
            />
          )}

          {page === "settings" && (
            <SettingsPage onBack={() => setPage(previousPage)} />
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
