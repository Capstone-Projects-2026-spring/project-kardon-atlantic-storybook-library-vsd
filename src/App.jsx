import { useState } from "react";
import "./App.css";
//testing supabase
import './lib/supabase'

import ImageUploader from "./components/ImageUploader";

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

      <div className="menuCard">
        <button className="menuButton primary" onClick={onOpen}>
          Open Book
        </button>

        <button className="menuButton disabled">
          Upload Storybook
        </button>

        <button className="menuButton disabled">
          Recent Books
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

      {/* Testing the image uploader*/}
      <h2>Image Upload Test</h2>
      <ImageUploader />
    </div>
  );
}

export default App;
