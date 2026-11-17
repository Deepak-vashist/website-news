import { useEffect, useState } from 'react'
import { fallbackProducts } from '../data/fallback.js'
import { extraProducts } from '../data/extra.js'
import { brandProducts } from '../data/brands.js'

const extras = [...extraProducts, ...brandProducts]

const API = 'https://fakestoreapi.com/products'
let cache = null

export function useProducts() {
  const [products, setProducts] = useState(cache || [])
  const [loading, setLoading] = useState(!cache)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    if (cache) return
    const ctrl = new AbortController()
    fetch(API, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error('bad response')
        return r.json()
      })
      .then((data) => {
        cache = [...data, ...extras]
        setProducts(cache)
      })
      .catch((e) => {
        if (e.name === 'AbortError') return
        setProducts([...fallbackProducts, ...extras])
        setOffline(true)
      })
      .finally(() => setLoading(false))
    return () => ctrl.abort()
  }, [])

  return { products, loading, offline }
}
