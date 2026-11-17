import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import Img from './Img.jsx'
import Stars from './Stars.jsx'

export default function ProductCard({ p }) {
  const { add, wishlist, toggleWish } = useCart()
  const wished = wishlist.includes(p.id)
  return (
    <article className="card">
      <button
        className={`wish ${wished ? 'on' : ''}`}
        onClick={() => toggleWish(p.id)}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {wished ? '♥' : '♡'}
      </button>
      <Link to={`/product/${p.id}`} className="card-img">
        <Img src={p.image} alt={p.title} />
      </Link>
      <div className="card-body">
        <small className="cat">{p.brand ? <><b className="brand">{p.brand}</b> · </> : null}{p.category}</small>
        <Link to={`/product/${p.id}`} className="card-title">{p.title}</Link>
        <Stars rate={p.rating?.rate} count={p.rating?.count} />
        <div className="card-foot">
          <strong className="price">${p.price.toFixed(2)}</strong>
          <button className="btn small" onClick={() => add(p)}>Add to cart</button>
        </div>
      </div>
    </article>
  )
}
