import { useState } from "react";

function SettingsPage({ onBack }) {
  const [openSection, setOpenSection] = useState(null);

  function toggleSection(sectionName) {
    setOpenSection(openSection === sectionName ? null : sectionName);
  }

  return (
    <div className="content">
      <button className="backBtn" onClick={onBack}>
        ← Back
      </button>

      <h1 className="pageTitle" style={{ marginTop: "10px", marginBottom: "20px" }}>
        Settings
      </h1>

      <div
        className="editorRight"
        style={{
          maxWidth: "500px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <div
          className="toolSection"
          style={{ cursor: "pointer" }}
          onClick={() => toggleSection("speech")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span style={{ width: "24px" }} />
            <p
              className="toolLabel"
              style={{
                marginBottom: 0,
                textAlign: "center",
                flex: 1,
              }}
            >
              Speech
            </p>
            <span
              style={{
                width: "24px",
                textAlign: "right",
                color: "rgba(255,255,255,0.65)",
                transform: openSection === "speech" ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                display: "inline-block",
              }}
            >
              ›
            </span>
          </div>

          {openSection === "speech" && (
            <div style={{ marginTop: "14px" }}>
              <div
                style={{
                  minHeight: "60px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  padding: "12px",
                  color: "rgba(255,255,255,0.55)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Speech settings will go here
              </div>
            </div>
          )}
        </div>

        <div
          className="toolSection"
          style={{ cursor: "pointer" }}
          onClick={() => toggleSection("display")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span style={{ width: "24px" }} />
            <p
              className="toolLabel"
              style={{
                marginBottom: 0,
                textAlign: "center",
                flex: 1,
              }}
            >
              Display
            </p>
            <span
              style={{
                width: "24px",
                textAlign: "right",
                color: "rgba(255,255,255,0.65)",
                transform: openSection === "display" ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                display: "inline-block",
              }}
            >
              ›
            </span>
          </div>

          {openSection === "display" && (
            <div style={{ marginTop: "14px" }}>
              <div
                style={{
                  minHeight: "60px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  padding: "12px",
                  color: "rgba(255,255,255,0.55)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Display settings will go here
              </div>
            </div>
          )}
        </div>

        <div
          className="toolSection"
          style={{ cursor: "pointer" }}
          onClick={() => toggleSection("account")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span style={{ width: "24px" }} />
            <p
              className="toolLabel"
              style={{
                marginBottom: 0,
                textAlign: "center",
                flex: 1,
              }}
            >
              Account
            </p>
            <span
              style={{
                width: "24px",
                textAlign: "right",
                color: "rgba(255,255,255,0.65)",
                transform: openSection === "account" ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                display: "inline-block",
              }}
            >
              ›
            </span>
          </div>

          {openSection === "account" && (
            <div style={{ marginTop: "14px" }}>
              <div
                style={{
                  minHeight: "60px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  padding: "12px",
                  color: "rgba(255,255,255,0.55)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Account settings will go here
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;