export default function Stars({ rate = 0, count }) {
  const full = Math.round(rate)
  return (
    <span className="stars" aria-label={`${rate} out of 5`}>
      {'★'.repeat(full)}
      <span className="dim">{'★'.repeat(5 - full)}</span>
      {count != null && <small> ({count})</small>}
    </span>
  )
}
