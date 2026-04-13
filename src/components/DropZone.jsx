import { useState, useRef } from "react";

function DropZone({ onFiles, accept = "image/png, image/jpeg, application/pdf", disabled = false }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  function handleDragOver(e) {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  }

  function handleClick() {
    if (!disabled) inputRef.current?.click();
  }

  function handleInputChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length) onFiles(files);
    e.target.value = "";
  }

  return (
    <div
      className={`dropZone ${dragOver ? "dropZoneActive" : ""} ${disabled ? "dropZoneDisabled" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleInputChange}
        style={{ display: "none" }}
      />
      <div className="dropZoneIcon">
        {dragOver ? "\u{1F4E5}" : "\u{1F4C4}"}
      </div>
      <div className="dropZoneLabel">
        {dragOver ? "Drop files here" : "Drag & drop files here"}
      </div>
      <div className="dropZoneHint">
        or click to browse &middot; PNG, JPEG, PDF
      </div>
    </div>
  );
}

export default DropZone;
