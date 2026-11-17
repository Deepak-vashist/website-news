import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const PrefsContext = createContext(null)

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v == null ? fallback : JSON.parse(v)
  } catch {
    return fallback
  }
}

export function PrefsProvider({ children }) {
  // The site always opens in dark mode; the header toggle only lasts for the current visit.
  const [theme, setTheme] = useState('dark')
  const [saved, setSaved] = useState(() => read('np-saved', []))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  useEffect(() => {
    localStorage.setItem('np-saved', JSON.stringify(saved))
  }, [saved])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
      saved,
      isSaved: (id) => saved.some((a) => a.id === id),
      toggleSave: (article) =>
        setSaved((s) => (s.some((a) => a.id === article.id) ? s.filter((a) => a.id !== article.id) : [article, ...s])),
    }),
    [theme, saved],
  )
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePrefs = () => useContext(PrefsContext)
