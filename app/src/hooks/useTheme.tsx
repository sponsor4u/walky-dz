import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface ThemeContextType {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  setColors: (primary: string, accent: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  primaryColor: "#2563EB",
  accentColor: "#F97316",
  fontFamily: "Cairo",
  setColors: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [primaryColor, setPrimaryColor] = useState("#2563EB");
  const [accentColor, setAccentColor] = useState("#F97316");
  const [fontFamily] = useState("Cairo");

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", primaryColor);
    document.documentElement.style.setProperty("--accent", accentColor);
    document.body.style.fontFamily = `${fontFamily}, system-ui, sans-serif`;
  }, [primaryColor, accentColor, fontFamily]);

  const setColors = (primary: string, accent: string) => {
    setPrimaryColor(primary);
    setAccentColor(accent);
  };

  return (
    <ThemeContext.Provider value={{ primaryColor, accentColor, fontFamily, setColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
