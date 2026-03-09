import { useState } from "react";
import EditorCanvas from "./components/canvas/EditorCanvas";
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
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const [hotspots, setHotspots] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [shapeMode, setShapeMode] = useState("rectangle");

  const [comment, setComment] = useState("");

  const selectedHotspot = hotspots.find((h) => h.id === selectedId) || null;
  const pageHotspots = hotspots.filter((h) => h.page === currentPage);

  const handleHotspotCreated = ({ coordinates, shape_type, page }) => {
    const id = `hs_${Date.now()}`;
    setHotspots([...hotspots, {
      id, word: `word${hotspots.length + 1}`, coordinates, shape_type, page,
    }]);
    setSelectedId(id);
  };

  const handleSelect = (id) => setSelectedId(id);

  const handleMove = (id, newCoords) => {
    setHotspots(hotspots.map((h) => h.id === id ? { ...h, coordinates: newCoords } : h));
  };

  const handleUpdateWord = (word) => {
    if (!selectedId) return;
    setHotspots(hotspots.map((h) => h.id === selectedId ? { ...h, word } : h));
  };

  const handleUpdateSize = (size) => {
    if (!selectedHotspot) return;
    const s = Math.max(10, Math.min(200, size));
    let newCoords;
    if (selectedHotspot.shape_type === "circle") {
      newCoords = { ...selectedHotspot.coordinates, radius: s };
    } else {
      const ratio = selectedHotspot.coordinates.width / selectedHotspot.coordinates.height;
      newCoords = { ...selectedHotspot.coordinates, width: s, height: s / ratio };
    }
    setHotspots(hotspots.map((h) => h.id === selectedId ? { ...h, coordinates: newCoords } : h));
  };

  const handleDelete = (id) => {
    setHotspots(hotspots.filter((h) => h.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  function goNextPage() { if (currentPage < totalPages) setCurrentPage(currentPage + 1); }
  function goPrevPage() { if (currentPage > 1) setCurrentPage(currentPage - 1); }
  function saveComment() { alert("Comment saved!"); }

  return (
    <div className="content">
      <button className="backBtn" onClick={onBack}>
        ← Back to Library
      </button>

      <h2 className="pageTitle" style={{ marginTop: "10px" }}>Edit Mode</h2>

      <div className="editorLayout">
        {/* left side: Konva canvas + page switcher */}
        <div className="editorLeft">
          <div className="editorCanvas" style={{ padding: 0, overflow: "hidden" }}>
            <EditorCanvas
              hotspots={hotspots}
              shapeMode={shapeMode}
              currentPage={currentPage}
              onHotspotCreated={handleHotspotCreated}
              onSelect={handleSelect}
              onMove={handleMove}
            />
          </div>

          <div className="pageSwitcher">
            <button className="pageBtn" onClick={goPrevPage} disabled={currentPage === 1}>← Prev</button>
            <span className="pageCount">{currentPage} / {totalPages}</span>
            <button className="pageBtn" onClick={goNextPage} disabled={currentPage === totalPages}>Next →</button>
          </div>
        </div>

        {/* right side: tools */}
        <div className="editorRight">
          {/* shape mode picker */}
          <div className="toolSection">
            <p className="toolLabel">Draw Hotspot</p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>
              Click & drag on the image to create a hotspot
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className={`bigBtn ${shapeMode === "rectangle" ? "bigBtnPrimary" : ""}`}
                style={{ flex: 1 }}
                onClick={() => setShapeMode("rectangle")}
              >
                Rectangle
              </button>
              <button
                className={`bigBtn ${shapeMode === "circle" ? "bigBtnPrimary" : ""}`}
                style={{ flex: 1 }}
                onClick={() => setShapeMode("circle")}
              >
                Circle
              </button>
            </div>
          </div>

          {/* hotspot list */}
          {pageHotspots.length > 0 && (
            <div className="toolSection">
              <p className="toolLabel">Hotspots on this page ({pageHotspots.length})</p>
              <div className="hotspotList">
                {pageHotspots.map((h) => (
                  <div
                    key={h.id}
                    className="hotspotTag"
                    onClick={() => setSelectedId(h.id)}
                    style={{
                      cursor: "pointer",
                      border: selectedId === h.id ? "1px solid #6d6af0" : "1px solid transparent",
                    }}
                  >
                    <span>{h.word} ({Math.round(h.coordinates.x)}, {Math.round(h.coordinates.y)})</span>
                    <button className="removeBtn" onClick={(e) => { e.stopPropagation(); handleDelete(h.id); }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* selected hotspot editor */}
          {selectedHotspot && (
            <div className="toolSection">
              <p className="toolLabel">Edit Hotspot</p>
              <input
                className="wordInput"
                type="text"
                placeholder="vocabulary word"
                value={selectedHotspot.word}
                onChange={(e) => handleUpdateWord(e.target.value)}
              />
              <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                Size
                <input
                  type="range" min="10" max="200"
                  value={selectedHotspot.shape_type === "circle"
                    ? selectedHotspot.coordinates.radius
                    : selectedHotspot.coordinates.width}
                  onChange={(e) => handleUpdateSize(parseInt(e.target.value))}
                  style={{ width: "100%", marginTop: 4 }}
                />
              </label>
              <button
                className="bigBtn"
                style={{ background: "rgba(255,100,100,0.25)", color: "#ff6b6b" }}
                onClick={() => handleDelete(selectedHotspot.id)}
              >
                Delete Hotspot
              </button>
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