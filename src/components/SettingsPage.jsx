import { useState } from "react";
import { useAuth } from "../context/AuthContext";


function SettingsPage({ onBack }) {
  // keeps track of which section is currently open (speech, display, account)
  const { user, signOut } = useAuth();
  const [openSection, setOpenSection] = useState(null);

  const handleSignOut = async () => {
    await signOut();
    // App.jsx useEffect will detect user is null and redirect to login automatically
  };

  // toggles dropdown open/close
  function toggleSection(sectionName) {
    setOpenSection(openSection === sectionName ? null : sectionName);
  }


  return (
    <div className="content">
      {/* back button returns to previous page */}
      <button className="backBtn" onClick={onBack}>
        ← Back
      </button>


      {/* page title */}
      <h1 className="pageTitle" style={{ marginTop: "10px", marginBottom: "20px" }}>
        Settings
      </h1>


      {/* centered container for all settings sections */}
      <div
        className="editorRight"
        style={{
          maxWidth: "500px",
          width: "100%",
          margin: "0 auto",
        }}
      >


        {/* ---------------- SPEECH SECTION ---------------- */}
        <div
          className="toolSection"
          style={{ cursor: "pointer" }}
          onClick={() => toggleSection("speech")}
        >
          {/* header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span style={{ width: "24px" }} />


            {/* section title */}
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


            {/* arrow indicator */}
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


          {/* dropdown content */}
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


        {/* ---------------- DISPLAY SECTION ---------------- */}
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


        {/* ---------------- ACCOUNT SECTION ---------------- */}
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
                <button className="bigBtn" onClick={(e) => { e.stopPropagation(); handleSignOut(); }}>
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


