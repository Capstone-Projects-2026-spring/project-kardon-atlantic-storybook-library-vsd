import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function SettingsPage({ onBack }) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [openSection, setOpenSection] = useState(null);

  const handleSignOut = async () => {
    await signOut();
  };

  function toggleSection(sectionName) {
    setOpenSection(openSection === sectionName ? null : sectionName);
  }

  // reusable theme styles
  const arrowColor = theme === "dark" ? "rgba(255,255,255,0.65)" : "#2a4a6b";
  const textColor = theme === "dark" ? "rgba(255,255,255,0.55)" : "#2a4a6b";
  const boxBorder =
    theme === "dark"
      ? "1px solid rgba(255,255,255,0.12)"
      : "1px solid rgba(42,74,107,0.12)";
  const boxBg =
    theme === "dark"
      ? "rgba(255,255,255,0.04)"
      : "rgba(255,255,255,0.35)";

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
        style={{ maxWidth: "500px", width: "100%", margin: "0 auto" }}
      >

        {/* ---------------- SPEECH ---------------- */}
        <div className="toolSection" style={{ cursor: "pointer" }} onClick={() => toggleSection("speech")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ width: "24px" }} />
            <p className="toolLabel" style={{ marginBottom: 0, textAlign: "center", flex: 1 }}>
              Speech
            </p>
            <span
              style={{
                width: "24px",
                textAlign: "right",
                color: arrowColor,
                transform: openSection === "speech" ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
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
                  border: boxBorder,
                  background: boxBg,
                  padding: "12px",
                  color: textColor,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Speech settings will go here
              </div>
            </div>
          )}
        </div>

        {/* ---------------- DISPLAY ---------------- */}
        <div className="toolSection" style={{ cursor: "pointer" }} onClick={() => toggleSection("display")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ width: "24px" }} />
            <p className="toolLabel" style={{ marginBottom: 0, textAlign: "center", flex: 1 }}>
              Display
            </p>
            <span
              style={{
                width: "24px",
                textAlign: "right",
                color: arrowColor,
                transform: openSection === "display" ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              ›
            </span>
          </div>

          {openSection === "display" && (
            <div style={{ marginTop: "14px" }}>
              <div
                style={{
                  borderRadius: "10px",
                  border: boxBorder,
                  background: boxBg,
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#2a4a6b", fontWeight: 600 }}>
                  Dark Mode
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTheme();
                  }}
                  style={{
                    width: "48px",
                    height: "26px",
                    borderRadius: "999px",
                    background: theme === "dark" ? "#6d6af0" : "rgba(0,0,0,0.15)",
                    position: "relative",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: theme === "dark" ? "25px" : "3px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "white",
                    }}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ---------------- ACCOUNT ---------------- */}
        <div className="toolSection" style={{ cursor: "pointer" }} onClick={() => toggleSection("account")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ width: "24px" }} />
            <p className="toolLabel" style={{ marginBottom: 0, textAlign: "center", flex: 1 }}>
              Account
            </p>
            <span
              style={{
                width: "24px",
                textAlign: "right",
                color: arrowColor,
                transform: openSection === "account" ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
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
                  border: boxBorder,
                  background: boxBg,
                  padding: "12px",
                  color: textColor,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <button
                  className="bigBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSignOut();
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default SettingsPage;