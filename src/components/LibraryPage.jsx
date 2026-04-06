import { useState } from "react";
import ImportFiles from "./ImportFiles";

function LibraryPage({ mode, books, onBack, onOpenBook, onBookUploaded }) {
  const [showImport, setShowImport] = useState(false);
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
          style={{ cursor: "pointer", opacity: 1 }}
        >
          Upload Book
        </button>
      </div>

      {showImport && (
        <ImportFiles
          onClose={() => setShowImport(false)}
          onBookUploaded={onBookUploaded}
        />
      )}

      <div className="libraryGrid">
        {books.length === 0 && (
          <div
            style={{
              color: "rgba(255,255,255,0.5)",
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: 40,
            }}
          >
            No books yet. Click "Upload Book" to add one.
          </div>
        )}

        {books.map((book, i) => (
          <BookCard
            key={i}
            title={book.title}
            coverUrl={book.pages[0]?.image_url}
            onOpen={() => onOpenBook(i)}
          />
        ))}
      </div>
    </div>
  );
}

function BookCard({ title, coverUrl, onOpen }) {
  return (
    <button className="bookCard" onClick={onOpen} type="button">
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={title}
          className="bookCover"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      ) : (
        <div className="bookCover" aria-hidden="true" />
      )}
      <div className="bookTitle">{title}</div>
    </button>
  );
}

export default LibraryPage;