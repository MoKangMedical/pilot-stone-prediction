import React, { createContext, useContext, useState } from "react"

interface ThemeContextType {
  theme: "light" | "dark"
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
})

export function ThemeProvider({ children, defaultTheme = "light" }: { children: React.ReactNode; defaultTheme?: "light" | "dark" }) {
  const [theme, setTheme] = useState<"light" | "dark">(defaultTheme)
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"))
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
