import { useState } from "react";
import "./App.css";
import SettingsPage from "./components/SettingsPage";
import HeaderBar from "./components/HeaderBar";
import MenuPage from "./components/MenuPage";
import LibraryPage from "./components/LibraryPage";
import ReaderPage from "./components/ReaderPage";
import EditorPage from "./components/EditorPage";
import LoginPage from "./components/LoginPage";

function App() {
  // app state
  const [mode, setMode] = useState("read");
  const [page, setPage] = useState("login"); // ← start on login
  const [previousPage, setPreviousPage] = useState("menu");

  const [books, setBooks] = useState([]);
  const [activeBookIndex, setActiveBookIndex] = useState(null);

  const addBook = (title, pages) => {
    setBooks((prev) => [...prev, { title, pages }]);
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

export default App;