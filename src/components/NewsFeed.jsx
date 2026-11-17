import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNews } from '../hooks/useNews.js'
import { timeAgo } from '../data/api.js'
import ArticleCard, { SaveButton, Thumb } from './ArticleCard.jsx'

function Ticker({ items }) {
  if (!items.length) return null
  return (
    <div className="ticker" aria-label="Breaking headlines">
      <span className="ticker-label">BREAKING</span>
      <div className="ticker-track">
        <div className="ticker-move">
          {[...items, ...items].map((a, i) => (
            <Link key={i} to={`/article/${encodeURIComponent(a.id)}`}>{a.title}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function NewsFeed({ category, search, title }) {
  const { articles, loading, error, updatedAt, refresh, loadMore, limit } = useNews(category, search)
  const [, force] = useState(0)

  // keep "x min ago" labels fresh
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 30_000)
    return () => clearInterval(id)
  }, [])

  const withImg = articles.filter((a) => a.image)
  const lead = withImg[0] || articles[0]
  const rest = articles.filter((a) => a !== lead)
  const trending = articles.slice(0, 6)

  return (
    <>
      <Ticker items={articles.slice(0, 8)} />
      <div className="container">
        <div className="page-head">
          <h1>{title}</h1>
          <div className="status">
            {updatedAt && <span>Updated {timeAgo(updatedAt)}</span>}
            <button className="btn ghost" onClick={refresh} disabled={loading}>
              {loading ? 'Loading…' : '↻ Refresh'}
            </button>
          </div>
        </div>
        {error && <p className="notice">Couldn’t reach some news sources. Retrying automatically…</p>}

        {loading && !articles.length ? (
          <div className="grid">{Array.from({ length: 6 }, (_, i) => <div key={i} className="card skeleton" />)}</div>
        ) : !articles.length ? (
          <p className="empty">No stories found.</p>
        ) : (
          <div className="layout">
            <section>
              {lead && (
                <article className="lead">
                  <Link to={`/article/${encodeURIComponent(lead.id)}`}>
                    <Thumb article={lead} className="lead-img" />
                    <div className="lead-body">
                      <div className="meta"><b>{lead.source}</b> · {timeAgo(lead.date)}</div>
                      <h2>{lead.title}</h2>
                      <p>{lead.summary}</p>
                    </div>
                  </Link>
                  <SaveButton article={lead} />
                </article>
              )}
              <div className="grid">{rest.map((a) => <ArticleCard key={a.id} a={a} />)}</div>
              {articles.length >= limit && (
                <div className="center">
                  <button className="btn" onClick={loadMore}>Load more stories</button>
                </div>
              )}
            </section>
            <aside className="side">
              <h3>🔥 Trending now</h3>
              <ol>
                {trending.map((a) => (
                  <li key={a.id}>
                    <Link to={`/article/${encodeURIComponent(a.id)}`}>{a.title}</Link>
                    <small>{a.source} · {timeAgo(a.date)}</small>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        )}
      </div>
    </>
  )
}
