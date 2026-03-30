import { useState, useEffect } from "react";

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

export default ReaderPage;