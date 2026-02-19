import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("menu");

  return (
    <div className="app">
      {page === "menu" ? (
        <MenuPage onOpen={() => setPage("reader")} />
      ) : (
        <ReaderPage onBack={() => setPage("menu")} />
      )}
    </div>
  );
}

function MenuPage({ onOpen }) {
  return (
    <div className="page">
      <h1 className="title">VSD Storybook Menu</h1>

      <div className="center">
        <button className="menuButton" onClick={onOpen}>
          Open Book
        </button>
      </div>
    </div>
  );
}

function ReaderPage({ onBack }) {
  return (
    <div className="page">
      <button className="linkButton" onClick={onBack}>
        ← Back to Menu
      </button>

      <div className="readerBox">
        Storybook will show here later.
      </div>
    </div>
  );
}

export default App;
