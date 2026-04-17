function MenuPage({ onOpenLibrary, onEditStorybooks, recentBooks = [], onOpenRecent }) {
  // always 3 slots so the layout doesnt shift around
  const slots = [0, 1, 2].map((i) => recentBooks[i] || null);

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
          {slots.map((book, i) => {
            // pick a cover: explicit cover_image_url first, then fall back to page 1
            const cover = book
              ? book.cover_image_url || book.pages?.[0]?.image_url || null
              : null;

            // only filled tiles are clickable — clicking opens the book in reader mode
            const clickable = !!book && typeof onOpenRecent === "function";

            return (
              <div
                key={book ? book.id : `empty-${i}`}
                className="recentBookSlot"
                onClick={clickable ? () => onOpenRecent(book.id) : undefined}
                onKeyDown={
                  clickable
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onOpenRecent(book.id);
                        }
                      }
                    : undefined
                }
                role={clickable ? "button" : undefined}
                tabIndex={clickable ? 0 : undefined}
                style={clickable ? { cursor: "pointer" } : undefined}
              >
                <div
                  className="recentBookCover"
                  style={
                    cover
                      ? {
                          backgroundImage: `url(${cover})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                />
                <p className="recentBookName">{book ? book.title : ""}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default MenuPage;
