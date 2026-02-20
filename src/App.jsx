import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
//testing supabase
import './lib/supabase'

import ImageUploader from "./components/ImageUploader";
import HotspotEditor from "./pages/HotspotEditor";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/reader" element={<ReaderPage />} />
        <Route path="/hotspot-editor" element={<HotspotEditor />} />
      </Routes>
    </div>
  );
}

function MenuPage() {
  return (
    <div className="page">
      <h1 className="title">VSD Storybook Menu</h1>

      <div className="menuCard">
        <Link to="/reader">
          <button className="menuButton primary">
            Open Book
          </button>
        </Link>

        <button className="menuButton disabled">
          Upload Storybook
        </button>

        <button className="menuButton disabled">
          Recent Books
        </button>

        <Link to="/hotspot-editor">
          <button className="menuButton primary">
            Hotspot Editor
          </button>
        </Link>
      </div>
    </div>
  );
}

function ReaderPage() {
  return (
    <div className="page">
      <Link to="/">
        <button className="linkButton">
          ← Back to Menu
        </button>
      </Link>

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
