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

export default HeaderBar;