import { useState } from 'react'

export default function Img({ src, alt, ...rest }) {
  const [failed, setFailed] = useState(!src)
  if (failed) {
    return (
      <div className="img-fallback" role="img" aria-label={alt}>
        {(alt || '?').charAt(0)}
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} {...rest} />
}
