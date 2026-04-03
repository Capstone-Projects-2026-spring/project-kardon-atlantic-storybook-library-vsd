import { useState } from "react";
import "./App.css";
import SettingsPage from "./components/SettingsPage";
import HeaderBar from "./components/HeaderBar";
import MenuPage from "./components/MenuPage";
import LibraryPage from "./components/LibraryPage";
import ReaderPage from "./components/ReaderPage";
import EditorPage from "./components/EditorPage";
import LoginPage from "./components/LoginPage";
import { createBook } from "./services/books";

function App() {
  // app state
  const [mode, setMode] = useState("read");
  const [page, setPage] = useState("login"); // ← start on login
  const [previousPage, setPreviousPage] = useState("menu");

  const [books, setBooks] = useState([]);
  const [activeBookIndex, setActiveBookIndex] = useState(null);
  const [recentBookStack, setRecentBookStack] = useState([]); // Stack of recently accessed book IDs

  const addBook = async (title, pages) => {
    // Save to database
    const coverImageUrl = pages[0] || null;
    const pageCount = pages.length;
    const { data, error } = await createBook({ title, coverImageUrl, pageCount });
    
    // Generate a unique ID (either from database or local)
    const bookId = data?.id || `local_${Date.now()}_${Math.random()}`;
    
    if (!error && data) {
      // Store with database ID for tracking access
      setBooks((prev) => [...prev, { id: bookId, title, pages, dbData: data }]);
    } else {
      // Fallback: store locally with temporary ID
      setBooks((prev) => [...prev, { id: bookId, title, pages }]);
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

  const addToRecentStack = (bookId, bookTitle, coverImageUrl) => {
    setRecentBookStack((prev) => {
      // Remove if already in stack, then add to front
      const filtered = prev.filter((item) => item.id !== bookId);
      const newStack = [{ id: bookId, title: bookTitle, cover_image_url: coverImageUrl }, ...filtered];
      // Keep only last 3
      return newStack.slice(0, 3);
    });
  };

  const goToMenu = () => {
    setMode("read");
    setPage("menu");
  };

  const handleOpenBook = (index) => {
    const book = books[index];
    // Track in session stack
    if (book?.id) {
      addToRecentStack(book.id, book.title, book.pages?.[0]);
    }
    setActiveBookIndex(index);
    setPage(mode === "read" ? "reader" : "editor");
  };

  const handleOpenRecentBook = (bookId) => {
    // Find the book by ID and open it
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
      handleOpenBook(index);
    }
  };

  return (
    <div className="appBg">
      <div className="window">
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
            recentBooks={recentBookStack}
            onOpenRecentBook={handleOpenRecentBook}
          />
        )}

        {page === "library" && (
          <LibraryPage
            mode={mode}
            books={books}
            onBack={() => {
              goToMenu();
            }}
            onOpenBook={handleOpenBook}
            onBookUploaded={addBook}
          />
        )}

        {page === "reader" && (
          <ReaderPage
            onBack={() => goToMenu()}
            pages={activeBook?.pages || []}
          />
        )}

        {page === "editor" && (
          <EditorPage
            onBack={() => goToMenu()}
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

export default App;