import { useState, useEffect, useRef } from "react";
import { uploadImage, getImageUrl } from "../lib/storage";
import { pdfToImages } from "../lib/pdfToImages";
import { useAuth } from "../context/AuthContext";
import DropZone from "./DropZone";

function ImportFiles({ onClose, onBookUploaded }) {
  const { user } = useAuth();
  const [bookTitle, setBookTitle] = useState("");
  const [error, setError] = useState(null);

  // Steps: "select" → "preview" → "uploading"
  const [step, setStep] = useState("select");

  // Each page: { id, file, previewUrl, sourceName, status }
  // status: "ready" | "uploading" | "done" | "error"
  const [pages, setPages] = useState([]);
  const [converting, setConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState({ current: 0, total: 0, fileName: "" });
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const nextIdRef = useRef(1);
  const previewUrls = useRef(new Set());
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.current.clear();
    };
  }, []);

  useEffect(() => {
    if (step === "preview" && pages.length === 0) {
      setStep("select");
    }
  }, [pages.length, step]);

  function addPageEntry(file, sourceName) {
    const url = URL.createObjectURL(file);
    previewUrls.current.add(url);
    return {
      id: nextIdRef.current++,
      file,
      previewUrl: url,
      sourceName,
      status: "ready",
      error: null,
      uploadPath: null,
      uploadedUrl: null,
    };
  }

  function revokePreviewUrl(url) {
    if (!url || !previewUrls.current.has(url)) return;
    URL.revokeObjectURL(url);
    previewUrls.current.delete(url);
  }

  async function handleFiles(fileList) {
    setError(null);

    const accepted = [];
    const errorMessages = [];

    for (const f of fileList) {
      if (/image\/(png|jpeg|jpg)/.test(f.type) || f.type === "application/pdf") {
        accepted.push(f);
      } else {
        errorMessages.push(`Unsupported: ${f.name}. Use PNG, JPEG, or PDF.`);
      }
    }

    if (!accepted.length) {
      if (errorMessages.length) setError(errorMessages.join(" "));
      return;
    }

    setConverting(true);

    try {
      for (const f of accepted) {
        try {
          let createdPages = [];

          if (f.type === "application/pdf") {
            setConversionProgress({ current: 0, total: 0, fileName: f.name });
            const images = await pdfToImages(f, {
              onProgress: (current, total) => {
                if (!isMountedRef.current) return;
                setConversionProgress({ current, total, fileName: f.name });
              },
            });
            if (!isMountedRef.current) return;
            createdPages = images.map((img) => addPageEntry(img, f.name));
          } else {
            if (!isMountedRef.current) return;
            createdPages = [addPageEntry(f, f.name)];
          }

          if (createdPages.length > 0) {
            setPages((prev) => [...prev, ...createdPages]);
          }
        } catch (e) {
          errorMessages.push(`${f.name}: ${e.message || "Failed to process file."}`);
        }
      }
    } finally {
      if (!isMountedRef.current) return;
      setConverting(false);
      setConversionProgress({ current: 0, total: 0, fileName: "" });
    }

    if (errorMessages.length) {
      setError(errorMessages.join(" "));
    }
  }

  function removePage(id) {
    setPages((prev) => {
      const page = prev.find((p) => p.id === id);
      if (page?.previewUrl) revokePreviewUrl(page.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  function movePage(index, direction) {
    setPages((prev) => {
      const arr = [...prev];
      const target = index + direction;
      if (target < 0 || target >= arr.length) return arr;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  }

  function goToPreview() {
    if (!pages.length) {
      setError("Add at least one page.");
      return;
    }
    setError(null);
    setStep("preview");
  }

  async function handleUpload() {
    if (!user) {
      setError("You need to be signed in before uploading.");
      return;
    }
    if (!pages.length) return;

    setError(null);
    setStep("uploading");
    setUploadProgress({ current: 0, total: pages.length });

    const updated = pages.map((page) => ({
      ...page,
      status: page.uploadedUrl ? "done" : "ready",
      error: null,
    }));
    setPages(updated);

    try {
      for (let i = 0; i < updated.length; i++) {
        if (updated[i].uploadedUrl) {
          setUploadProgress({ current: i + 1, total: updated.length });
          continue;
        }

        updated[i] = { ...updated[i], status: "uploading", error: null };
        setPages([...updated]);

        try {
          const path = await uploadImage(updated[i].file, user.id, updated[i].file.type);
          if (!path) throw new Error("Upload returned no path");
          const url = getImageUrl(path);
          updated[i] = {
            ...updated[i],
            status: "done",
            uploadPath: path,
            uploadedUrl: url,
            error: null,
          };
        } catch (e) {
          updated[i] = {
            ...updated[i],
            status: "error",
            error: e.message || "Upload failed",
          };
          console.error(`Failed to upload page ${i + 1}:`, e.message);
        }

        if (!isMountedRef.current) return;
        setPages([...updated]);
        setUploadProgress({ current: i + 1, total: updated.length });
      }

      const failedPages = updated.filter((page) => !page.uploadedUrl);
      if (failedPages.length > 0) {
        setPages([...updated]);
        setError(`Failed to upload ${failedPages.length} page${failedPages.length !== 1 ? "s" : ""}. Retry or remove the problem page${failedPages.length !== 1 ? "s" : ""}.`);
        setStep("preview");
        return;
      }

      const title = bookTitle.trim() || `Storybook ${Date.now()}`;
      await onBookUploaded(title, updated.map((page) => page.uploadedUrl));
      onClose();
    } catch (e) {
      if (!isMountedRef.current) return;
      setPages([...updated]);
      setError(e.message || "Failed to save book. Please try again.");
      setStep("preview");
    }
  }

  // ── Render ──

  const canClose = step !== "uploading";

  return (
    <div className="modalOverlay" onClick={(e) => e.target === e.currentTarget && canClose && onClose()}>
      <div className="modalBox" style={{ maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 className="modalTitle">Upload a Storybook</h2>
          <StepIndicator current={step} />
        </div>
        <p className="modalSubtitle">
          {step === "select" && "Add images or PDFs — each page becomes a storybook page"}
          {step === "preview" && `${pages.length} page${pages.length !== 1 ? "s" : ""} ready — reorder or remove, then upload`}
          {step === "uploading" && `Uploading ${uploadProgress.current} of ${uploadProgress.total}...`}
        </p>

        {/* Book title (always visible) */}
        <div className="modalField">
          <label className="modalLabel">Book Title</label>
          <input
            type="text"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            className="modalInput"
            placeholder="My Storybook"
            disabled={step === "uploading"}
          />
        </div>

        {/* Step: Select */}
        {step === "select" && (
          <>
            <DropZone onFiles={handleFiles} disabled={converting} />

            {converting && (
              <div className="conversionBar">
                <div className="conversionText">
                  Converting {conversionProgress.fileName}... {conversionProgress.current}/{conversionProgress.total} pages
                </div>
                <div className="progressBar">
                  <div
                    className="progressFill"
                    style={{ width: conversionProgress.total ? `${(conversionProgress.current / conversionProgress.total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            )}

            {pages.length > 0 && (
              <div className="pageChips">
                {pages.map((p) => (
                  <span key={p.id} className="pageChip">
                    <img src={p.previewUrl} alt="" className="pageChipThumb" />
                    <button type="button" className="pageChipRemove" onClick={() => removePage(p.id)} title="Remove">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        {/* Step: Preview */}
        {step === "preview" && (
          <div className="thumbGrid" style={{ flex: 1, overflowY: "auto" }}>
            {pages.map((p, i) => (
              <div key={p.id} className={`thumbCard ${p.status === "error" ? "thumbCardError" : ""}`}>
                <img src={p.previewUrl} alt={`Page ${i + 1}`} className="thumbImg" />
                <div className="thumbInfo">
                  <span className="thumbNumber">{i + 1}</span>
                </div>
                <div className="thumbActions">
                  <button
                    type="button"
                    className="thumbBtn"
                    onClick={() => movePage(i, -1)}
                    disabled={i === 0}
                    title="Move up"
                  >
                    &uarr;
                  </button>
                  <button
                    type="button"
                    className="thumbBtn"
                    onClick={() => movePage(i, 1)}
                    disabled={i === pages.length - 1}
                    title="Move down"
                  >
                    &darr;
                  </button>
                  <button type="button" className="thumbBtn thumbBtnRemove" onClick={() => removePage(p.id)} title="Remove">
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step: Uploading */}
        {step === "uploading" && (
          <>
            <div className="progressBar" style={{ height: 8 }}>
              <div
                className="progressFill"
                style={{ width: uploadProgress.total ? `${(uploadProgress.current / uploadProgress.total) * 100}%` : "0%" }}
              />
            </div>
            <div className="thumbGrid" style={{ flex: 1, overflowY: "auto" }}>
              {pages.map((p, i) => (
                <div key={p.id} className={`thumbCard ${p.status === "done" ? "thumbCardDone" : ""} ${p.status === "error" ? "thumbCardError" : ""}`}>
                  <img src={p.previewUrl} alt={`Page ${i + 1}`} className="thumbImg" />
                  <div className="thumbInfo">
                    <span className="thumbNumber">{i + 1}</span>
                    {p.status === "uploading" && <span className="thumbStatus">...</span>}
                    {p.status === "done" && <span className="thumbStatus thumbStatusDone">&#10003;</span>}
                    {p.status === "error" && <span className="thumbStatus thumbStatusError">!</span>}
                  </div>
                  {p.error && (
                    <div className="thumbInfo" style={{ paddingTop: 0 }}>
                      <span className="thumbStatus thumbStatusError">{p.error}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Error */}
        {error && <p className="modalError">{error}</p>}

        {/* Actions */}
        <div className="modalActions">
          {step === "select" && (
            <>
              <button type="button" className="modalBtnPrimary" onClick={goToPreview} disabled={!pages.length || converting}>
                Next: Preview
              </button>
              <button type="button" className="modalBtnSecondary" onClick={onClose} disabled={!canClose}>Cancel</button>
            </>
          )}
          {step === "preview" && (
            <>
              <button type="button" className="modalBtnPrimary" onClick={handleUpload} disabled={!pages.length}>
                Upload {pages.length} Page{pages.length !== 1 ? "s" : ""}
              </button>
              <button type="button" className="modalBtnSecondary" onClick={() => setStep("select")}>Back</button>
            </>
          )}
          {step === "uploading" && (
            <button type="button" className="modalBtnSecondary" disabled>
              Uploading...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ current }) {
  const steps = ["select", "preview", "uploading"];
  const idx = steps.indexOf(current);
  return (
    <div className="stepIndicator">
      {steps.map((s, i) => (
        <div key={s} className={`stepDot ${i <= idx ? "stepDotActive" : ""}`} />
      ))}
    </div>
  );
}

export default ImportFiles;
