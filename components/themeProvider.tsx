"use client"
import { type ReactNode, createContext, useContext, useEffect } from 'react'
import { useLocalstorageState } from 'rooks'
interface ThemeProviderCtx {
    onToggleTheme: () => void,
    theme: "dark" | "light"
}
const ThemeProviderCtx = createContext<any>(undefined)
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useLocalstorageState<"dark" | "light">("theme", "dark")
    const onToggleTheme = () => {
        if (theme === "dark") {
            setTheme("light")
            document.querySelector("html")?.classList.remove("dark")
        } else {
            setTheme("dark")
            document.querySelector("html")?.classList.add("dark")
        }
    }
    useEffect(() => {
        theme === "dark" ? document.querySelector("html")?.classList.add("dark") : document.querySelector("html")?.classList.remove("dark")
    }, [theme])
    return (
        <ThemeProviderCtx.Provider value={{ onToggleTheme, theme }}>
            {children}
        </ThemeProviderCtx.Provider>
    )
}
export const useTheme = () => useContext<ThemeProviderCtx>(ThemeProviderCtx)