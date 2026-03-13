import { useState } from "react";
import "./App.css";
// helpers for pushing images into the Supabase storage bucket
import { uploadImage, getImageUrl } from './lib/storage'

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
      {showImport && <ImportFiles onClose={() => setShowImport(false)} />}

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

/* ---------------- UPLOADER ---------------- */

// modal used by the library page to pick multiple images and push them
// into the Supabase `image` bucket. shows status per file and a close
// button when done.
/* ---------------- Upload Files ---------------- */

function ImportFiles({ onClose }) {
  const [files, setFiles] = useState([])
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

  // take all selected files and send them to Supabase one-by-one.
  // updates `results` so the UI can show progress and final links.
  async function handleUploadAll() {
    if (!files.length) return
    setBusy(true)
    const newResults = {}

    for (const f of files) {
      newResults[f.name] = { status: 'uploading' } 
      setResults({ ...newResults })
      try {
        const path = await uploadImage(f)  // upload the file to Supabase storage; returns the path or null if it failed
        if (!path) {
          newResults[f.name] = { status: 'error', error: 'Upload failed' }
        } else {
          const url = getImageUrl(path)    // get the public URL for the uploaded image so we can show a link
          newResults[f.name] = { status: 'done', path, url }
        }
      } catch (e) {
        newResults[f.name] = { status: 'error', error: e.message || String(e) }
      }
      setResults({ ...newResults })
    }

    setBusy(false)
  }

  return (
    <div style={{ position: 'fixed', left: 16, right: 16, top: 90, zIndex: 60 }}>
      <div style={{ margin: '0 auto', maxWidth: 800, padding: 12, borderRadius: 8, background: '#0f1720', border: '1px solid rgba(255,255,255,0.06)', color: 'white' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="file" multiple accept="image/png, image/jpeg" onChange={handleSelect} />
          <button onClick={handleUploadAll} disabled={busy || !files.length} className="bigBtn bigBtnPrimary">Upload All</button>
          <button onClick={onClose} className="bigBtn">Close</button>
        </div>

        {error && <div style={{ color: 'salmon', marginTop: 8 }}>{error}</div>}

        <div style={{ marginTop: 12 }}>
          {files.length === 0 && <div>No files selected.</div>}
          {files.map((f) => {
            const r = results[f.name]
            return (
              <div key={f.name} style={{ padding: 6, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <strong>{f.name}</strong> — {Math.round(f.size / 1024)} KB
                <div>
                  {r ? (
                    r.status === 'uploading' ? 'Uploading…' : r.status === 'done' ? (
                      <a href={r.url} target="_blank" rel="noreferrer">View</a>
                    ) : (
                      <span style={{ color: 'salmon' }}>{r.error}</span>
                    )
                  ) : (
                    'Not uploaded'
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}