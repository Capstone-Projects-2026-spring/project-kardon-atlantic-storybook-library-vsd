import { useState } from "react";
import "./App.css";

// import "./lib/supabase";

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

        {page === "reader" && <ReaderPage onBack={() => setPage("library")} />}

        {page === "editor" && <EditorPage onBack={() => setPage("library")} />}
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

      <div className="libraryGrid">
        {Array.from({ length: 10 }).map((_, i) => (
          <BookCard key={i} title={`Storybook ${i + 1}`} onOpen={onOpenBook} />
        ))}
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
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // placeholder for now

  function goNext() {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }

  function goPrev() {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }

  return (
    <div className="content">
      <button className="backBtn" onClick={onBack}>
        ← Back to Library
      </button>

      <div className="readerShell">
        <div className="readerText">
          Page {currentPage} of {totalPages} — storybook will show here later.
        </div>
      </div>

      {/* page switching */}
      <div className="pageSwitcher">
        <button className="pageBtn" onClick={goPrev} disabled={currentPage === 1}>
          ← Prev
        </button>
        <span className="pageCount">{currentPage} / {totalPages}</span>
        <button className="pageBtn" onClick={goNext} disabled={currentPage === totalPages}>
          Next →
        </button>
      </div>
    </div>
  );
}

/* ---------------- EDITOR ---------------- */

function EditorPage({ onBack }) {
  // track which page number we're on
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // placeholder until real book data comes in

  // each hotspot has a word the caretaker types in
  const [hotspots, setHotspots] = useState([]);
  const [wordInput, setWordInput] = useState("");

  // comment the caretaker can leave on this page
  const [comment, setComment] = useState("");
  const [savedComment, setSavedComment] = useState("");

  function addHotspot() {
    if (!wordInput.trim()) return;
    const newHotspot = {
      id: Date.now(), // simple unique id for now
      word: wordInput.trim(),
      page: currentPage,
    };
    setHotspots([...hotspots, newHotspot]);
    setWordInput(""); // clear input after adding
  }

  function removeHotspot(id) {
    setHotspots(hotspots.filter((h) => h.id !== id));
  }

  function saveComment() {
    setSavedComment(comment);
    alert("Comment saved!");
  }

  function goNextPage() {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }

  function goPrevPage() {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }

  return (
    <div className="content">
      <button className="backBtn" onClick={onBack}>
        ← Back to Library
      </button>

      <h2 className="pageTitle" style={{ marginTop: "10px" }}>Edit Mode</h2>

      <div className="editorLayout">

        {/* left side: page display + page switcher */}
        <div className="editorLeft">
          <div className="editorCanvas">
            {/* this box represents the current page being edited */}
            <p className="editorPageLabel">Page {currentPage} of {totalPages}</p>
            <p className="editorPageHint">Page image will display here</p>
          </div>

          {/* page switching buttons */}
          <div className="pageSwitcher">
            <button
              className="pageBtn"
              onClick={goPrevPage}
              disabled={currentPage === 1}
            >
              ← Prev
            </button>
            <span className="pageCount">{currentPage} / {totalPages}</span>
            <button
              className="pageBtn"
              onClick={goNextPage}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </div>

        {/* right side: hotspot tools + comments */}
        <div className="editorRight">

          {/* hotspot section */}
          <div className="toolSection">
            <p className="toolLabel">Add Hotspot Word</p>
            <input
              className="wordInput"
              type="text"
              placeholder="type a word e.g. cat"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
            />
            <button className="bigBtn bigBtnPrimary" onClick={addHotspot}>
              + Add Hotspot
            </button>
          </div>

          {/* list of hotspots added so far on this page */}
          {hotspots.filter((h) => h.page === currentPage).length > 0 && (
            <div className="toolSection">
              <p className="toolLabel">Hotspots on this page:</p>
              <div className="hotspotList">
                {hotspots
                  .filter((h) => h.page === currentPage)
                  .map((h) => (
                    <div key={h.id} className="hotspotTag">
                      <span>🔵 {h.word}</span>
                      <button
                        className="removeBtn"
                        onClick={() => removeHotspot(h.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* comment section */}
          <div className="toolSection">
            <p className="toolLabel">Page Comment (optional)</p>
            <textarea
              className="commentBox"
              placeholder="leave a note for yourself or other editors..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <button className="bigBtn" onClick={saveComment}>
              Save Comment
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App; 