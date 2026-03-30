function MenuPage({ onOpenLibrary, onEditStorybooks }) {
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

export default MenuPage;