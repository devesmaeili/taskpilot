import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Theme = 'system' | 'light' | 'dark'
type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'taskpilot-theme'

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function readStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.dataset.theme = resolved
  document.documentElement.style.colorScheme = resolved
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() =>
    typeof window === 'undefined' ? 'system' : readStoredTheme(),
  )
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    typeof window === 'undefined' ? 'light' : getSystemTheme(),
  )

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? systemTheme : theme

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemTheme(getSystemTheme())

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
