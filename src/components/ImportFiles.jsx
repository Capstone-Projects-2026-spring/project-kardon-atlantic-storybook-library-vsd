import { useState } from "react";
import { uploadImage, getImageUrl } from "../lib/storage";
import { useAuth } from "../context/AuthContext";

function ImportFiles({ onClose, onBookUploaded }) {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [bookTitle, setBookTitle] = useState("");
  const [results, setResults] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  function handleSelect(e) {
    setError(null);
    const list = Array.from(e.target.files || []);
    const allowed = list.filter((f) =>
      /image\/(png|jpeg|jpg)/.test(f.type)
    );
    const rejected = list.filter(
      (f) => !/image\/(png|jpeg|jpg)/.test(f.type)
    );

    if (rejected.length)
      setError(`Rejected: ${rejected.map((r) => r.name).join(", ")}`);

    setFiles(allowed);
    setResults({});
  }

  async function handleUploadAll() {
    if (!files.length || !user) {
      if (!user) setError("You need to be signed in before uploading a book.");
      return;
    }

    setError(null);
    setBusy(true);

    const newResults = {};
    const pageUrls = [];

    try {
      for (const f of files) {
        newResults[f.name] = { status: "uploading" };
        setResults({ ...newResults });

        try {
          const path = await uploadImage(f, user.id);

          if (!path) {
            newResults[f.name] = {
              status: "error",
              error: "Upload failed",
            };
          } else {
            const url = getImageUrl(path);
            newResults[f.name] = { status: "done", path, url };
            pageUrls.push(url);
          }
        } catch (e) {
          newResults[f.name] = {
            status: "error",
            error: e.message || String(e),
          };
        }

        setResults({ ...newResults });
      }

      if (pageUrls.length === 0) {
        setError("All uploads failed. Check your Supabase Storage bucket permissions.");
        return;
      }

      const title = bookTitle.trim() || `Storybook ${Date.now()}`;
      await onBookUploaded(title, pageUrls);
      onClose();
    } catch (e) {
      setError(e.message || "We couldn't finish saving that book. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modalOverlay">
      <div className="modalBox">
        <h2 className="modalTitle">📚 Upload a Storybook</h2>
        <p className="modalSubtitle">
          Select multiple images — they become pages in order
        </p>

        <div className="modalField">
          <label className="modalLabel">Book Title</label>
          <input
            type="text"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            className="modalInput"
          />
        </div>

        <div className="modalField">
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg"
            onChange={handleSelect}
          />
        </div>

        {error && <p className="modalError">{error}</p>}

        <div className="modalActions">
          <button
            onClick={handleUploadAll}
            disabled={busy || !files.length}
          >
            Upload All
          </button>

          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default ImportFiles;
