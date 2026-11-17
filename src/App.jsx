import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import NewsFeed from './components/NewsFeed.jsx'
import ArticleCard from './components/ArticleCard.jsx'
import ArticleDetail from './components/ArticleDetail.jsx'
import { CATEGORIES } from './data/api.js'
import { usePrefs } from './context/PrefsContext.jsx'

function Category() {
  const { cat } = useParams()
  const found = CATEGORIES.find((c) => c.key === cat)
  if (!found) return <div className="container"><p className="empty">Category not found. <Link to="/">Home</Link></p></div>
  return <NewsFeed key={cat} category={cat} title={found.label} />
}

function Search() {
  const { term } = useParams()
  return <NewsFeed key={term} category="top" search={term} title={`Results for “${term}”`} />
}

function Saved() {
  const { saved } = usePrefs()
  return (
    <div className="container">
      <div className="page-head"><h1>Saved stories</h1></div>
      {saved.length ? (
        <div className="grid">{saved.map((a) => <ArticleCard key={a.id} a={a} />)}</div>
      ) : (
        <p className="empty">No saved stories yet. Tap ☆ on any story to save it.</p>
      )}
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<NewsFeed key="top" category="top" title="Top Stories" />} />
          <Route path="/c/:cat" element={<Category />} />
          <Route path="/search/:term" element={<Search />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="*" element={<div className="container"><p className="empty">Page not found. <Link to="/">Home</Link></p></div>} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} NewsPulse · Sources: Times of India, The Hindu, Indian Express, NDTV, Hindustan Times, Dainik Bhaskar, News18, Google News, Spaceflight News &amp; Hacker News · Auto-updates every minute
        </div>
      </footer>
    </>
  )
}
