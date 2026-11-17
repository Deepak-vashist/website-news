import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts.js'
import { useCart } from '../context/CartContext.jsx'
import Img from '../components/Img.jsx'
import Stars from '../components/Stars.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const { products, loading } = useProducts()
  const { add } = useCart()
  const [qty, setQty] = useState(1)

  if (loading) return <div className="container"><p className="empty">Loading…</p></div>
  const p = products.find((x) => String(x.id) === id)
  if (!p)
    return (
      <div className="container">
        <p className="empty">Product not found. <Link to="/">Back to shop</Link></p>
      </div>
    )

  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4)

  return (
    <div className="container">
      <p className="crumbs"><Link to="/">Shop</Link> / {p.category}</p>
      <div className="detail">
        <div className="detail-img"><Img src={p.image} alt={p.title} /></div>
        <div className="detail-info">
          <small className="cat">{p.brand ? <><b className="brand">{p.brand}</b> · </> : null}{p.category}</small>
          <h1>{p.title}</h1>
          <Stars rate={p.rating?.rate} count={p.rating?.count} />
          <p className="price big">${p.price.toFixed(2)}</p>
          <p className="muted">{p.description}</p>
          <div className="qty big">
            <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>
          <button className="btn" onClick={() => add(p, qty)}>Add to cart</button>
          <ul className="perks">
            <li>🚚 Free delivery over $50</li>
            <li>↩️ 30-day easy returns</li>
            <li>🔒 Secure checkout</li>
          </ul>
        </div>
      </div>
      {related.length > 0 && (
        <>
          <h2 className="section-title">You may also like</h2>
          <div className="grid">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </>
      )}
    </div>
  )
}
