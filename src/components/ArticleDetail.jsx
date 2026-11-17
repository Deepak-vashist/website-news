import { Link, useNavigate, useParams } from 'react-router-dom'
import { getArticle, getMoreStories, timeAgo } from '../data/api.js'
import { usePrefs } from '../context/PrefsContext.jsx'
import { SaveButton, Thumb } from './ArticleCard.jsx'

export default function ArticleDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { saved } = usePrefs()
  const article = getArticle(id) || saved.find((a) => a.id === id)

  const back = () => (window.history.length > 1 ? nav(-1) : nav('/'))

  if (!article) {
    return (
      <div className="container">
        <p className="empty">
          This story is no longer available. <Link to="/">Go to home</Link>
        </p>
      </div>
    )
  }

  const more = getMoreStories(article.id, 6)
  const date = new Date(article.date)

  return (
    <div className="container">
      <button className="btn ghost back" onClick={back}>← Back</button>
      <div className="layout">
        <article className="article">
          <div className="meta"><b>{article.source}</b> · {timeAgo(article.date)}</div>
          <h1>{article.title}</h1>
          <p className="byline">
            {date.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}
          </p>
          {article.image && <Thumb article={article} className="article-img" />}
          <p className="article-text">{article.summary}</p>
          <div className="article-actions">
            <a className="btn" href={article.url} target="_blank" rel="noopener noreferrer">
              Read full story at {article.source} ↗
            </a>
            <span className="save-wrap"><SaveButton article={article} /></span>
          </div>
        </article>

        <aside className="side">
          <h3>More stories</h3>
          <ol>
            {more.map((a) => (
              <li key={a.id}>
                <Link to={`/article/${encodeURIComponent(a.id)}`}>{a.title}</Link>
                <small>{a.source} · {timeAgo(a.date)}</small>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  )
}
