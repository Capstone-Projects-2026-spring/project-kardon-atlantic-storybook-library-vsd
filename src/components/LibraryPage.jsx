import { useState } from "react";
import { supabase } from "../supabaseClient";
import ImportFiles from "./ImportFiles";

function LibraryPage({ mode, books, onBack, onOpenBook, onBookUploaded, onBooksChanged }) {
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
            //key={i}
            key={book.id}
            bookId={book.id}
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
            onBooksChanged={onBooksChanged}
          />
        ))}
      </div>
    </div>
  );
}

function BookCard({
  bookId,
  title,
  coverUrl,
  onOpen,
  showMenuButton,
  isMenuOpen,
  onMenuToggle,
  onCloseMenu,
  onBooksChanged,
}) {
  
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(title);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleRenameConfirm(e) {
    e.stopPropagation();
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === title) {
      setIsRenaming(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { error } = await supabase
      .from("books")
      .update({ title: trimmed, updated_at: new Date().toISOString() })
      .eq("id", bookId);

    setIsLoading(false);

    if (error) {
      setError("Failed to rename. Please try again.");
    } else {
      setIsRenaming(false);
      onBooksChanged?.();
      onCloseMenu(e);
    }
  }

  async function handleDeleteConfirm(e) {
    e.stopPropagation();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", bookId);

    setIsLoading(false);

    if (error) {
      setError("Failed to delete. Please try again.");
    } else {
      onBooksChanged?.();
      onCloseMenu(e);
    }
  }

  function handleRenameClick(e) {
    e.stopPropagation();
    setRenameValue(title);
    setIsRenaming(true);
    setIsConfirmingDelete(false);
    setError(null);
  }

  function handleDeleteClick(e) {
    e.stopPropagation();
    setIsConfirmingDelete(true);
    setIsRenaming(false);
    setError(null);
  }

  function handleCancel(e) {
    e.stopPropagation();
    setIsRenaming(false);
    setIsConfirmingDelete(false);
    setError(null);
  }

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
              //onClick={onCloseMenu}
              onClick={(e) => {
                handleCancel(e);
                onCloseMenu(e);
              }}
              aria-label="Close menu"
            >
              ✕
            </button>

            <div className="bookMenuTitle">{title}</div>

            {error && (
              <div className="bookMenuError">{error}</div>
            )}

            {/* Rename flow */}
            {isRenaming ? (
              <div className="bookMenuRenameRow" onClick={(e) => e.stopPropagation()}>
                <input
                  className="bookMenuRenameInput"
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameConfirm(e);
                    if (e.key === "Escape") handleCancel(e);
                  }}
                  autoFocus
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="bookMenuAction bookMenuActionConfirm"
                  onClick={handleRenameConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  className="bookMenuAction"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>

            /* Delete confirmation flow */
            ) : isConfirmingDelete ? (
              <div onClick={(e) => e.stopPropagation()}>
                <div className="bookMenuConfirmText">Delete "{title}"? This cannot be undone.</div>
                <button
                  type="button"
                  className="bookMenuAction bookMenuActionDanger"
                  onClick={handleDeleteConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting…" : "Yes, Delete"}
                </button>
                <button
                  type="button"
                  className="bookMenuAction"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>

            /* Default menu buttons */
            ) : (
              <>
                <button
                  type="button"
                  className="bookMenuAction"
                  onClick={handleRenameClick}
                >
                  Rename
                </button>
                <button
                  type="button"
                  className="bookMenuAction"
                  onClick={handleDeleteClick}
                >
                  Delete
                </button>
              </>
            )}
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