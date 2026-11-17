import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../data/api.js'
import { usePrefs } from '../context/PrefsContext.jsx'

export default function Header() {
  const { theme, toggleTheme, saved } = usePrefs()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const nav = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    const term = q.trim()
    nav(term ? `/search/${encodeURIComponent(term)}` : '/')
    setOpen(false)
  }

  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <header className="header">
      <div className="container top">
        <span className="date">{today}</span>
        <span className="live"><i /> LIVE</span>
      </div>
      <div className="container bar">
        <button className="icon-btn burger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? '✕' : '☰'}
        </button>
        <Link to="/" className="logo">News<span>Pulse</span></Link>
        <form className="search" onSubmit={submit}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search news…" aria-label="Search news" />
          <button type="submit" aria-label="Search">🔍</button>
        </form>
        <div className="actions">
          <Link to="/saved" className="icon-btn" aria-label="Saved stories" title="Saved">
            🔖{saved.length > 0 && <sup>{saved.length}</sup>}
          </Link>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode" title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
      <nav className={`cats ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        <div className="container cats-inner">
          {CATEGORIES.map((c) => (
            <NavLink key={c.key} to={c.key === 'top' ? '/' : `/c/${c.key}`} end>
              {c.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
