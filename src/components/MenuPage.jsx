function MenuPage({ onOpenLibrary, onEditStorybooks, recentBooks = [], onOpenRecentBook }) {
  return (
    <div className="menuPage">

      <div className="menuTop">
        <h1 className="menuTitle">VSD Storybook</h1>
        <span className="menuEmoji">📖</span>
        <p className="menuSubtitle">Choose how you want to get started</p>
      </div>

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

      <div className="recentBar">
        <p className="recentBarTitle">Recently Viewed</p>
        <div className="recentBarBooks">
          {recentBooks.length > 0 ? (
            recentBooks.map((book) => (
              <button
                key={book.id}
                className="recentBookSlot"
                onClick={() => onOpenRecentBook?.(book.id)}
                type="button"
                style={{ cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}
              >
                <div 
                  className="recentBookCover" 
                  style={book.cover_image_url ? { backgroundImage: `url(${book.cover_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                />
                <p className="recentBookName">{book.title}</p>
              </button>
            ))
          ) : (
            <>
              <div className="recentBookSlot">
                <div className="recentBookCover" />
                <p className="recentBookName">No books yet</p>
              </div>
              <div className="recentBookSlot">
                <div className="recentBookCover" />
                <p className="recentBookName">No books yet</p>
              </div>
              <div className="recentBookSlot">
                <div className="recentBookCover" />
                <p className="recentBookName">No books yet</p>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}

export default MenuPage;