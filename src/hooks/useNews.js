import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchNews, rememberArticles, SAMPLE } from '../data/api.js'

const REFRESH_MS = 60_000

// Fetches news for a category/search, auto-refreshes every minute and supports "load more".
export function useNews(category, search) {
  const [articles, setArticles] = useState([])
  const [limit, setLimit] = useState(16)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [tick, setTick] = useState(0)
  const first = useRef(true)

  // reset paging when the query changes
  useEffect(() => {
    setLimit(16)
    setLoading(true)
    first.current = true
  }, [category, search])

  useEffect(() => {
    const ctrl = new AbortController()
    fetchNews(category, search, limit, ctrl.signal)
      .then((data) => {
        rememberArticles(data)
        setArticles(data)
        setError(false)
        setUpdatedAt(new Date())
      })
      .catch((e) => {
        if (e.name === 'AbortError') return
        setError(true)
        setArticles((prev) => (prev.length ? prev : SAMPLE))
      })
      .finally(() => !ctrl.signal.aborted && setLoading(false))
    return () => ctrl.abort()
  }, [category, search, limit, tick])

  // auto refresh
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  const refresh = useCallback(() => setTick((t) => t + 1), [])
  const loadMore = useCallback(() => setLimit((l) => l + 12), [])

  return { articles, loading, error, updatedAt, refresh, loadMore, limit }
}
