function HeaderBar({ onOpenSettings }) {
  return (
    <div className="headerBar">
      <div className="headerLeft">
        <div className="appIcon" aria-hidden="true">
          <svg
            className="appLogoSvg"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 16c8 0 14 2 20 7v29c-6-5-12-7-20-7V16z"
              fill="white"
              opacity="0.95"
            />
            <path
              d="M52 16c-8 0-14 2-20 7v29c6-5 12-7 20-7V16z"
              fill="white"
              opacity="0.8"
            />
            <path
              d="M32 23v29"
              stroke="#5b6ef5"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="22" cy="30" r="4" fill="#34d3ff" />
            <circle cx="42" cy="36" r="4" fill="#7c5cff" />
          </svg>
        </div>

        <div className="appTitle">Storybook</div>
      </div>

      <div className="headerRight">
        <button
          className="iconBtn"
          title="Settings"
          aria-label="Settings"
          onClick={onOpenSettings}
        >
          <span className="iconSymbol">⚙️</span>
        </button>
      </div>
    </div>
  );
}

export default HeaderBar;