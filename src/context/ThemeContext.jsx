import { createContext, useContext, useState } from "react";

// this context makes the theme available to every page in the app
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // "light" is the default, can be switched to "dark"
  const [theme, setTheme] = useState("light");

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* apply theme class to a wrapper div so CSS can target it */}
      <div className={theme === "dark" ? "darkMode" : ""} style={{ width: "100%", height: "100%" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// custom hook so any page can access theme easily
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}