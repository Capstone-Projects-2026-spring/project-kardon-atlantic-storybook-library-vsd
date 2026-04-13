import { useState } from "react";
import ImportFiles from "./ImportFiles";

function LibraryPage({ mode, books, onBack, onOpenBook, onBookUploaded }) {
  const [showImport, setShowImport] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const modeLabel = mode === "read" ? "Reader Mode" : "Edit Mode";

  function closeMenu() {
    setOpenMenuIndex(null);
  }

  return (
    <div className="content" onClick={closeMenu}>
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

        {/* Upload is only available while editing storybooks. */}
        {mode === "edit" && (
          <button
            className="uploadBtn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowImport(true);
            }}
          >
            Upload Book
          </button>
        )}
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
            {mode === "edit"
              ? 'No books yet. Click "Upload Book" to add one.'
              : "No books yet."}
          </div>
        )}

        {books.map((book, i) => (
          <BookCard
            key={i}
            title={book.title}
            coverUrl={book.cover_image_url || book.pages?.[0]?.image_url || ""}
            onOpen={() => onOpenBook(i)}
            showMenuButton={mode === "edit"}
            isMenuOpen={openMenuIndex === i}
            onMenuToggle={(e) => {
              e.stopPropagation();
              setOpenMenuIndex(openMenuIndex === i ? null : i);
            }}
            onCloseMenu={(e) => {
              e.stopPropagation();
              setOpenMenuIndex(null);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function BookCard({
  title,
  coverUrl,
  onOpen,
  showMenuButton,
  isMenuOpen,
  onMenuToggle,
  onCloseMenu,
}) {
  return (
    <button type="button" className="bookCard" onClick={onOpen}>
      <div className="bookCoverWrap">
        {coverUrl ? (
          <img className="bookCover" src={coverUrl} alt={`${title} cover`} />
        ) : (
          <div className="bookCover" aria-hidden="true" />
        )}

        {showMenuButton && isMenuOpen && (
          <div
            className="bookMenuPopup"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="bookMenuClose"
              onClick={onCloseMenu}
              aria-label="Close menu"
            >
              ✕
            </button>

            <div className="bookMenuTitle">{title}</div>

            <button type="button" className="bookMenuAction">
              Rename
            </button>

            <button type="button" className="bookMenuAction">
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="bookTitle">{title}</div>

      {showMenuButton && (
        <button
          type="button"
          className="bookMenuBtn"
          onClick={onMenuToggle}
          aria-label={`Open menu for ${title}`}
        >
          ⋯
        </button>
      )}
    </button>
  );
}

export default LibraryPage;