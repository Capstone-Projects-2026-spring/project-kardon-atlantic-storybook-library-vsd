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
        <button className="iconBtn" title="Settings" aria-label="Settings" onClick={onOpenSettings}>
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

  // fullscreen mode - image takes entire screen
  if (isFullscreen) {
    return (
      <div className="readerFullscreen">
        <img
          src={imageUrl}
          alt={`Page ${currentPage + 1}`}
          className="readerFullscreenImg"
        />

        {/* page switcher floats at the bottom */}
        {totalPages > 1 && (
          <div className="readerFullscreenControls">
            <button
              className="readerFullscreenBtn"
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 0}
            >
              ← Prev
            </button>
            <span className="readerFullscreenCount">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              className="readerFullscreenBtn"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages - 1}
            >
              Next →
            </button>
          </div>
        )}

        {/* exit fullscreen button top right */}
        <button
          className="exitFullscreenBtn"
          onClick={() => setIsFullscreen(false)}
          title="Exit fullscreen (Esc)"
        >
          ✕ Exit Fullscreen
        </button>
      </div>
    );
  }

  // normal mode
  return (
    <div className="content">
      <button className="backBtn" onClick={onBack}>
        ← Back to Library
      </button>

      {/* fullscreen toggle button */}
      <button
        className="fullscreenToggleBtn"
        onClick={() => setIsFullscreen(true)}
        title="Go fullscreen"
      >
        ⛶ Fullscreen
      </button>

      <div className="readerShell"
        style={{ overflow: 'hidden', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Page ${currentPage + 1}`}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <div className="readerText">No pages available.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pageSwitcher">
          <button className="pageBtn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0}>
            ← Prev
          </button>
          <span className="pageCount">{currentPage + 1} / {totalPages}</span>
          <button className="pageBtn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages - 1}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
/* ---------------- EDITOR ---------------- */

function EditorPage({ onBack, pages }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pages.length;
  const imageUrl = pages[currentPage - 1];

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
              imageUrl={imageUrl}
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


/* ---------------- UPLOADER ---------------- */

// modal used by the library page to pick multiple images and push them
// into the Supabase `image` bucket. shows status per file and a close
// button when done.
/* ---------------- Upload Files ---------------- */

function ImportFiles({ onClose, onBookUploaded }) {
  const [files, setFiles] = useState([])
  const [bookTitle, setBookTitle] = useState('')
  const [results, setResults] = useState({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  // when the file input changes, keep only png/jpg and warn about others
  function handleSelect(e) {
    setError(null)
    const list = Array.from(e.target.files || [])
    const allowed = list.filter(f => /image\/(png|jpeg|jpg)/.test(f.type))
    const rejected = list.filter(f => !/image\/(png|jpeg|jpg)/.test(f.type))
    if (rejected.length) setError(`Rejected: ${rejected.map(r => r.name).join(', ')}`)
    setFiles(allowed)
    setResults({})
  }

  // upload all files as pages of a single book
  async function handleUploadAll() {
    if (!files.length) return
    setBusy(true)
    const newResults = {}
    const pageUrls = []

    for (const f of files) {
      newResults[f.name] = { status: 'uploading' }
      setResults({ ...newResults })
      try {
        const path = await uploadImage(f)
        if (!path) {
          newResults[f.name] = { status: 'error', error: 'Upload failed' }
        } else {
          const url = getImageUrl(path)
          newResults[f.name] = { status: 'done', path, url }
          pageUrls.push(url)
        }
      } catch (e) {
        newResults[f.name] = { status: 'error', error: e.message || String(e) }
      }
      setResults({ ...newResults })
    }

    // create one book with all successfully uploaded pages
    if (pageUrls.length > 0) {
      const title = bookTitle.trim() || `Storybook ${Date.now()}`
      onBookUploaded(title, pageUrls)
    }

    setBusy(false)
  }

  return (
    <div className="modalOverlay">
      <div className="modalBox">

        {/* modal title */}
        <h2 className="modalTitle">📚 Upload a Storybook</h2>
        <p className="modalSubtitle">Select multiple images — they become pages in order</p>

        {/* book title input */}
        <div className="modalField">
          <label className="modalLabel">Book Title</label>
          <input
            type="text"
            placeholder="e.g. The Very Hungry Caterpillar"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            className="modalInput"
          />
        </div>

        {/* file picker */}
        <div className="modalField">
          <label className="modalLabel">Choose Pages (PNG or JPG)</label>
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg"
            onChange={handleSelect}
            className="modalFileInput"
          />
        </div>

        {/* error message if any files were rejected */}
        {error && <p className="modalError">{error}</p>}

        {/* file list - shows each file and its upload status */}
        {files.length > 0 && (
          <div className="modalFileList">
            {files.map((f) => {
              const r = results[f.name]
              return (
                <div key={f.name} className="modalFileRow">
                  <span className="modalFileName">{f.name}</span>
                  <span className="modalFileSize">{Math.round(f.size / 1024)} KB</span>
                  <span className="modalFileStatus">
                    {r ? (
                      r.status === 'uploading' ? '⏳ Uploading...' :
                      r.status === 'done' ? '✅ Done' :
                      <span style={{ color: '#e05555' }}>❌ {r.error}</span>
                    ) : '⬜ Waiting'}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {files.length === 0 && (
          <p className="modalNoFiles">No files selected yet.</p>
        )}

        {/* action buttons */}
        <div className="modalActions">
          <button
            className="modalBtnPrimary"
            onClick={handleUploadAll}
            disabled={busy || !files.length}
          >
            {busy ? 'Uploading...' : '⬆ Upload All'}
          </button>
          <button className="modalBtnSecondary" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  )
}