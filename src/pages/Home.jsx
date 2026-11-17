import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts.js'
import { useCart } from '../context/CartContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

const SORTS = {
  featured: ['Featured', null],
  low: ['Price: Low to High', (a, b) => a.price - b.price],
  high: ['Price: High to Low', (a, b) => b.price - a.price],
  rating: ['Top Rated', (a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0)],
}

export default function Home() {
  const { products, loading, offline } = useProducts()
  const { wishlist } = useCart()
  const [params] = useSearchParams()
  const q = (params.get('q') || '').toLowerCase()
  const onlyWish = params.get('wish') === '1'
  const [category, setCategory] = useState('all')
  const [brand, setBrand] = useState('all')
  const [sort, setSort] = useState('featured')
  const [maxPrice, setMaxPrice] = useState(1000)

  const categories = useMemo(() => ['all', ...new Set(products.map((p) => p.category))], [products])

  const brands = useMemo(() => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(), [products])

  const list = useMemo(() => {
    const r = products.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (brand === 'all' || p.brand === brand) &&
        p.price <= maxPrice &&
        (!q ||
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.brand || '').toLowerCase().includes(q)) &&
        (!onlyWish || wishlist.includes(p.id)),
    )
    const fn = SORTS[sort][1]
    return fn ? [...r].sort(fn) : r
  }, [products, category, brand, sort, maxPrice, q, onlyWish, wishlist])

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">New Season Sale</p>
            <h1>Up to 40% off on top picks</h1>
            <p>Fashion, jewelry, electronics, home, beauty and sports delivered to your door. Free shipping over $50.</p>
            <a href="#products" className="btn light">Shop now</a>
          </div>
        </div>
      </section>

      <div className="container" id="products">
        {offline && <p className="notice">Live catalog unavailable – showing sample products.</p>}
        <div className="toolbar">
          <div className="chips">
            {categories.map((c) => (
              <button key={c} className={`chip ${c === category ? 'active' : ''}`} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="controls">
            <label>
              Max ${maxPrice}
              <input type="range" min="10" max="1000" step="10" value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)} />
            </label>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Brand">
              <option value="all">All brands</option>
              {brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
              {Object.entries(SORTS).map(([k, [label]]) => (
                <option key={k} value={k}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="section-title">
          {onlyWish ? 'Your Wishlist' : q ? `Results for "${q}"` : 'All Products'}
          <small> ({list.length})</small>
        </h2>

        {loading ? (
          <div className="grid">
            {Array.from({ length: 8 }, (_, i) => <div key={i} className="card skeleton" />)}
          </div>
        ) : list.length ? (
          <div className="grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        ) : (
          <p className="empty">No products match your filters.</p>
        )}
      </div>
    </>
  )
}
