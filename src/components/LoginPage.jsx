import { useState } from "react";

function LoginPage({ onEnter }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="content" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <div className="mainCard" style={{ textAlign: "center" }}>
        <h1 className="cardTitle">
          {isSignup ? "Create Account" : "Login"}
        </h1>

        {/* Email (only for signup) */}
        {isSignup && (
          <input
            className="wordInput"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: 10 }}
          />
        )}

        {/* Username */}
        <input
          className="wordInput"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        {/* Password */}
        <input
          className="wordInput"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        {/* Enter Button */}
        <button className="bigBtn bigBtnPrimary" onClick={onEnter}>
          Enter
        </button>

        {/* Toggle signup/login */}
        <div style={{ marginTop: 16 }}>
          {isSignup ? (
            <p style={{ fontSize: "0.9rem" }}>
              Already have an account?{" "}
              <span
                style={{ color: "#6d6af0", cursor: "pointer" }}
                onClick={() => setIsSignup(false)}
              >
                Login
              </span>
            </p>
          ) : (
            <p style={{ fontSize: "0.9rem" }}>
              Don’t have an account?{" "}
              <span
                style={{ color: "#6d6af0", cursor: "pointer" }}
                onClick={() => setIsSignup(true)}
              >
                Sign up
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;