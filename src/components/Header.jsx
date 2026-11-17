import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Header() {
  const { count, setOpen, wishlist } = useCart()
  const [menu, setMenu] = useState(false)
  const [q, setQ] = useState('')
  const nav = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    nav(q ? `/?q=${encodeURIComponent(q)}` : '/')
    setMenu(false)
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <button className="icon-btn burger" onClick={() => setMenu(!menu)} aria-label="Menu">
          ☰
        </button>
        <Link to="/" className="logo">
          Shop<span>Verse</span>
        </Link>
        <form className={`search ${menu ? 'show' : ''}`} onSubmit={submit}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>
        <nav className={`nav ${menu ? 'show' : ''}`} onClick={() => setMenu(false)}>
          <NavLink to="/" end>Shop</NavLink>
          <NavLink to="/?wish=1">Wishlist ({wishlist.length})</NavLink>
        </nav>
        <button className="icon-btn cart-btn" onClick={() => setOpen(true)} aria-label="Open cart">
          🛒
          {count > 0 && <span className="badge">{count}</span>}
        </button>
      </div>
    </header>
  )
}
