import { useState, useEffect } from "react";
import EditorCanvas from "./components/canvas/EditorCanvas";
import "./App.css";
import SettingsPage from "./components/SettingsPage";
// helpers for pushing images into the Supabase storage bucket
import { uploadImage, getImageUrl } from './lib/storage'

function App() {
  // read or edit mode
  const [mode, setMode] = useState("read");
  const [page, setPage] = useState("menu");
  const [previousPage, setPreviousPage] = useState("menu");

  // uploaded books: array of { title, pages: [url, url, ...] }
  const [books, setBooks] = useState([]);
  const [activeBookIndex, setActiveBookIndex] = useState(null);

  const addBook = (title, pages) => {
    setBooks((prev) => [...prev, { title, pages }]);
  };

  const activeBook = activeBookIndex !== null ? books[activeBookIndex] : null;

  const goReaderLibrary = () => {
    setMode("read");
    setPage("library");
  };

  const goEditLibrary = () => {
    setMode("edit");
    setPage("library");
  };

  const goSettings = () => {
    if (page !== "settings") {
      setPreviousPage(page);
    }
    setPage("settings");
  };

  return (
    <div className="appBg">
      <div className="window">
        <HeaderBar onOpenSettings={goSettings} />

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
            pages={activeBook?.pages || []}
          />
        )}

        {page === "editor" && (
          <EditorPage
            onBack={() => setPage("library")}
            pages={activeBook?.pages || []}
          />
        )}

        {page === "settings" && (
          <SettingsPage onBack={() => setPage(previousPage)} />
        )}
      </div>
    </div>
  );
}

/* ---------------- HEADER ---------------- */

function HeaderBar({ onOpenSettings }) {
  return (
    <div className="headerBar">
      <div className="headerLeft">
        <div className="appIcon" aria-hidden="true" />
        <div className="appTitle">VSD Storybook Reader</div>
      </div>

      <div className="headerRight">
        <button
          className="iconBtn"
          title="Settings"
          aria-label="Settings"
          onClick={onOpenSettings}
        >
          <span className="iconSymbol">⚙️</span>
        </button>
        <button className="iconBtn" title="Help" aria-label="Help">
          <span className="iconSymbol">❓</span>
        </button>
        <button className="iconBtn" title="About" aria-label="About">
          <span className="iconSymbol">ℹ️</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------- MENU ---------------- */

function MenuPage({ onOpenLibrary, onEditStorybooks }) {
  return (
    <div className="menuPage">

      {/* title at the top */}
      <div className="menuTop">
        <h1 className="menuTitle">VSD Storybook</h1>
        <span className="menuEmoji">📖</span>
        <p className="menuSubtitle">Choose how you want to get started</p>
      </div>

      {/* two action buttons */}
      <div className="menuActions">
        <button className="menuActionBtn menuActionPrimary" onClick={onOpenLibrary}>
          <span className="menuBtnIcon">📚</span>
          <span className="menuBtnLabel">Open Library</span>
          <span className="menuBtnSub">Read a storybook</span>
        </button>

        <button className="menuActionBtn menuActionSecondary" onClick={onEditStorybooks}>
          <span className="menuBtnIcon">✏️</span>
          <span className="menuBtnLabel">Edit Storybooks</span>
          <span className="menuBtnSub">Upload and add hotspots</span>
        </button>
      </div>

      {/* recently viewed section at the bottom */}
      <div className="recentBar">
        <p className="recentBarTitle">Recently Viewed</p>
        <div className="recentBarBooks">
          {/* 3 placeholder slots - real books will show here later */}
          <div className="recentBookSlot">
            <div className="recentBookCover" />
            <p className="recentBookName">Book title</p>
          </div>
          <div className="recentBookSlot">
            <div className="recentBookCover" />
            <p className="recentBookName">Book title</p>
          </div>
          <div className="recentBookSlot">
            <div className="recentBookCover" />
            <p className="recentBookName">Book title</p>
          </div>
        </div>
      </div>

    </div>
  );
}

function RecentRow() {
  return (
    <div className="recentRow">
      <div className="recentThumb" aria-hidden="true" />
      <div className="recentLine" />
    </div>
  );
}

/* ---------------- LIBRARY ---------------- */

function LibraryPage({ mode, books, onBack, onOpenBook, onBookUploaded }) {
  // whether the import modal is visible; appears when user clicks Upload Book
  const [showImport, setShowImport] = useState(false)
  const modeLabel = mode === "read" ? "Reader Mode" : "Edit Mode";

  return (
    <div className="content">
      <button className="backBtn" onClick={onBack}>
        ← Back to Menu
      </button>

      <div className="libraryHeaderRow">
        <div className="libraryTitleBlock">
          <h1 className="pageTitle">Your Library</h1>
          <div className={`modePill ${mode === "edit" ? "modePillEdit" : ""}`}>
            {modeLabel}
          </div>
        </div>

        <button
          className="uploadBtn"
          type="button"
          onClick={() => setShowImport(true)}
          style={{ cursor: 'pointer', opacity: 1 }}
        >
          Upload Book
        </button>
      </div>

      {/* import modal component shown on demand */}
      {showImport && (
        <ImportFiles
          onClose={() => setShowImport(false)}
          onBookUploaded={onBookUploaded}
        />
      )}

      <div className="libraryGrid">
        {books.length === 0 && (
          <div style={{ color: 'rgba(255,255,255,0.5)', gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>
            No books yet. Click "Upload Book" to add one.
          </div>
        )}
        {books.map((book, i) => (
          <BookCard key={i} title={book.title} coverUrl={book.pages[0]} onOpen={() => onOpenBook(i)} />
        ))}
      </div>
    </div>
  );
}

function BookCard({ title, coverUrl, onOpen }) {
  return (
    <button className="bookCard" onClick={onOpen} type="button">
      {coverUrl ? (
        <img src={coverUrl} alt={title} className="bookCover" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      ) : (
        <div className="bookCover" aria-hidden="true" />
      )}
      <div className="bookTitle">{title}</div>
    </button>
  );
}

/* ---------------- READER ---------------- */

function ReaderPage({ onBack, pages }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const totalPages = pages.length;
  const imageUrl = pages[currentPage];

  // pressing Escape exits fullscreen
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setIsFullscreen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (isFullscreen) {
    return (
      <div className="readerFullscreen">
        <img src={imageUrl} alt={`Page ${currentPage + 1}`} className="readerFullscreenImg" />

        {totalPages > 1 && (
          <div className="readerFullscreenControls">
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0}>← Prev</button>
            <span>{currentPage + 1} / {totalPages}</span>
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages - 1}>Next →</button>
          </div>
        )}

        <button onClick={() => setIsFullscreen(false)}>✕ Exit Fullscreen</button>
      </div>
    );
  }

  return (
    <div className="content">
      <button className="backBtn" onClick={onBack}>← Back to Library</button>
      <button onClick={() => setIsFullscreen(true)}>⛶ Fullscreen</button>

      <div className="readerShell">
        {imageUrl ? <img src={imageUrl} alt="" /> : <div>No pages available.</div>}
      </div>
    </div>
  );
}

export default App;