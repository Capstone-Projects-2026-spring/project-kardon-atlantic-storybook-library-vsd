import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function LoginPage({ onEnter }) {
  const { signIn, signUp } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEnter = async () => {
    setError(null);

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    if (isSignup) {
      const { error } = await signUp(email, password, username);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    onEnter();
  };

  return (
    <div
      className="content"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <div className="mainCard" style={{ textAlign: "center" }}>
        <h1 className="cardTitle">
          {isSignup ? "Create Account" : "Login"}
        </h1>

        {/* Email */}
        <input
          className="wordInput"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        {/* Username - only needed when creating account */}
        {isSignup && (
          <input
            className="wordInput"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: 10 }}
          />
        )}

        {/* Password */}
        <input
          className="wordInput"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        {/* Confirm Password - only for signup */}
        {isSignup && (
          <input
            className="wordInput"
            type={showPassword ? "text" : "password"}
            placeholder="Retype Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ marginBottom: 10 }}
          />
        )}

        {/* Show password toggle */}
        <div style={{ textAlign: "left", marginBottom: 16 }}>
          <label
            style={{
              fontSize: "0.9rem",
              color: "#2a4a6b",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              style={{ marginRight: 8 }}
            />
            Show Password
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <p style={{ color: "red", fontSize: "0.85rem", marginBottom: 16 }}>
            {error}
          </p>
        )}

        {/* Enter Button */}
        <button
          className="bigBtn bigBtnPrimary"
          onClick={handleEnter}
          disabled={loading}
        >
          {loading ? "..." : "Enter"}
        </button>

        {/* Toggle signup/login */}
        <div style={{ marginTop: 16 }}>
          {isSignup ? (
            <p style={{ fontSize: "0.9rem", color: "#2a4a6b" }}>
              Already have an account?{" "}
              <span
                style={{ color: "#6d6af0", cursor: "pointer" }}
                onClick={() => {
                  setIsSignup(false);
                  setError(null);
                  setConfirmPassword("");
                }}
              >
                Login
              </span>
            </p>
          ) : (
            <p style={{ fontSize: "0.9rem", color: "#2a4a6b" }}>
              Don't have an account?{" "}
              <span
                style={{ color: "#6d6af0", cursor: "pointer" }}
                onClick={() => {
                  setIsSignup(true);
                  setError(null);
                }}
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