import { useState } from "react";
import "./App.css";
//testing supabase
import './lib/supabase'

function App() {
  // read or edit mode
  const [mode, setMode] = useState("read");
  const [page, setPage] = useState("menu");

  const goReaderLibrary = () => {
    setMode("read");
    setPage("library");
  };

  const goEditLibrary = () => {
    setMode("edit");
    setPage("library");
  };

  return (
    <div className="appBg">
      <div className="window">
        <HeaderBar />

        {page === "menu" && (
          <MenuPage
            onOpenLibrary={goReaderLibrary}
            onEditStorybooks={goEditLibrary}
          />
        )}

        {page === "library" && (
          <LibraryPage
            mode={mode}
            onBack={() => {
              setMode("read");
              setPage("menu");
            }}
            onOpenBook={() => setPage(mode === "read" ? "reader" : "editor")}
          />
        )}

        {page === "reader" && (
          <ReaderPage onBack={() => setPage("library")} />
        )}

        {page === "editor" && (
          <EditorPage onBack={() => setPage("library")} />
        )}
      </div>
    </div>
  );
}

/* ---------------- HEADER ---------------- */

function HeaderBar() {
  return (
    <div className="headerBar">
      <div className="headerLeft">
        <div className="appIcon" aria-hidden="true" />
        <div className="appTitle">VSD Storybook Reader</div>
      </div>

      <div className="headerRight">
        <button className="iconBtn" title="Settings" aria-label="Settings">
          <span className="iconGlyph">⚙️</span>
        </button>
        <button className="iconBtn" title="Help" aria-label="Help">
          <span className="iconGlyph">❓</span>
        </button>
        <button className="iconBtn" title="About" aria-label="About">
          <span className="iconGlyph">ℹ️</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------- MENU ---------------- */

function MenuPage({ onOpenLibrary, onEditStorybooks }) {
  return (
    <div className="content">
      <div className="mainCard">
        <div className="cardTitleRow">
          <span className="cardTitleIcon" aria-hidden="true">
            📖
          </span>
          <h1 className="cardTitle">Storybook Menu</h1>
        </div>

        <div className="cardButtons">
          <button className="bigBtn bigBtnPrimary" onClick={onOpenLibrary}>
            Open Library
          </button>

          <button className="bigBtn" onClick={onEditStorybooks}>
            Edit Storybooks
          </button>
        </div>
      </div>

      <div className="recentSection">
        <div className="recentHeader">Recent Storybooks</div>

        <div className="recentList">
          <RecentRow />
          <RecentRow />
          <RecentRow />
        </div>

        <div className="viewLibraryRow">
          <button className="viewLibraryBtn" type="button" onClick={onOpenLibrary}>
            View Library →
          </button>
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

function LibraryPage({ mode, onBack, onOpenBook }) {
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

        <button className="uploadBtn" type="button" disabled>
          Upload Book
        </button>
      </div>
      
        <button className="bigBtn" type="button" disabled style={{ width: "min(900px, 95%)" }}>
          Hotspot Editor (later)
        </button>

      <div className="libraryGrid">
        <BookCard title="Storybook 1" onOpen={onOpenBook} />
        <BookCard title="Storybook 2" onOpen={onOpenBook} />
        <BookCard title="Storybook 3" onOpen={onOpenBook} />
        <BookCard title="Storybook 4" onOpen={onOpenBook} />
        <BookCard title="Storybook 5" onOpen={onOpenBook} />
        <BookCard title="Storybook 6" onOpen={onOpenBook} />
        <BookCard title="Storybook 7" onOpen={onOpenBook} />
        <BookCard title="Storybook 8" onOpen={onOpenBook} />
        <BookCard title="Storybook 9" onOpen={onOpenBook} />
        <BookCard title="Storybook 10" onOpen={onOpenBook} />
      </div>
    </div>
  );
}

function BookCard({ title, onOpen }) {
  return (
    <button className="bookCard" onClick={onOpen} type="button">
      <div className="bookCover" aria-hidden="true" />
      <div className="bookTitle">{title}</div>
    </button>
  );
}

/* ---------------- READER ---------------- */

function ReaderPage({ onBack }) {
  return (
    <div className="content">
      <button className="backBtn" onClick={onBack}>
        ← Back to Library
      </button>

      <div className="readerShell">
        <div className="readerText">Reader Mode: storybook will show here later.</div>
      </div>
    </div>
  );
}

/* ---------------- EDITOR ---------------- */

function EditorPage({ onBack }) {
  return (
    <div className="content">
      <button className="backBtn" onClick={onBack}>
        ← Back to Library
      </button>

      <div className="readerShell">
        <div className="readerText">
          Edit Mode: VSD editor will go here later.
        </div>
      </div>

      {/* Testing the image uploader*/}
      <h2>Image Upload Test</h2>
    </div>
  );
}

export default App;