import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { canPreview, faviconFor, getCachedImage, resolveImage, timeAgo } from '../data/api.js'
import { usePrefs } from '../context/PrefsContext.jsx'

// key on id so state resets when a slot shows a different story after a refresh
export function Thumb(props) {
  return <ThumbInner key={props.article.id} {...props} />
}

function ThumbInner({ article, className = '' }) {
  const isWeb = canPreview(article.url)
  const [src, setSrc] = useState(article.image || (isWeb ? getCachedImage(article.url) : null))
  const [imgFailed, setImgFailed] = useState(false)
  const [favFailed, setFavFailed] = useState(false)

  useEffect(() => {
    if (src || !isWeb) return
    let alive = true
    resolveImage(article.url).then((found) => alive && found && setSrc(found))
    return () => {
      alive = false
    }
  }, [src, isWeb, article.url])

  if (src && !imgFailed) {
    return (
      <img className={`thumb ${className}`} src={src} alt="" loading="lazy" referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)} />
    )
  }

  const fav = !favFailed ? faviconFor(article.site || article.url) : null
  return (
    <div className={`thumb fallback ${className}`} aria-hidden="true">
      {fav ? (
        <img className="fav" src={fav} alt="" onError={() => setFavFailed(true)} />
      ) : (
        <span>{article.source?.charAt(0).toUpperCase()}</span>
      )}
    </div>
  )
}

export function SaveButton({ article }) {
  const { isSaved, toggleSave } = usePrefs()
  const on = isSaved(article.id)
  return (
    <button
      className={`save ${on ? 'on' : ''}`}
      onClick={(e) => {
        e.preventDefault()
        toggleSave(article)
      }}
      aria-label={on ? 'Remove bookmark' : 'Bookmark story'}
      title={on ? 'Saved' : 'Save for later'}
    >
      {on ? '★' : '☆'}
    </button>
  )
}

export default function ArticleCard({ a }) {
  return (
    <article className="card">
      <Link to={`/article/${encodeURIComponent(a.id)}`} className="card-link">
        <Thumb article={a} />
        <div className="card-body">
          <div className="meta"><b>{a.source}</b> · {timeAgo(a.date)}</div>
          <h3>{a.title}</h3>
          <p>{a.summary}</p>
        </div>
      </Link>
      <SaveButton article={a} />
    </article>
  )
}
