import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Most Indian news sites don't allow browsers to read their RSS feeds directly (CORS),
// so the dev/preview server fetches them on the page's behalf: GET /api/rss?url=<feed>
// Only the hosts below are allowed, so this can't be used as an open proxy.
const ALLOWED_HOSTS = new Set([
  'news.google.com',
  'timesofindia.indiatimes.com',
  'www.thehindu.com',
  'indianexpress.com',
  'feeds.feedburner.com',
  'www.hindustantimes.com',
  'www.bhaskar.com',
  'hindi.news18.com',
])

function rssProxy() {
  const cache = new Map()
  const handler = async (req, res, next) => {
    if (!req.url.startsWith('/api/rss')) return next()
    try {
      const target = new URL(new URL(req.url, 'http://local').searchParams.get('url'))
      if (target.protocol !== 'https:' || !ALLOWED_HOSTS.has(target.hostname)) {
        res.statusCode = 403
        return res.end('host not allowed')
      }
      let hit = cache.get(target.href)
      if (!hit || Date.now() - hit.t > 60_000) {
        const r = await fetch(target, {
          headers: { 'User-Agent': 'Mozilla/5.0 NewsPulse', Accept: 'application/rss+xml, application/xml, text/xml, */*' },
          signal: AbortSignal.timeout(15_000),
        })
        if (!r.ok) {
          res.statusCode = 502
          return res.end(`upstream ${r.status}`)
        }
        hit = { t: Date.now(), body: await r.text() }
        cache.set(target.href, hit)
      }
      res.setHeader('Content-Type', 'application/xml; charset=utf-8')
      res.end(hit.body)
    } catch {
      res.statusCode = 502
      res.end('proxy error')
    }
  }
  return {
    name: 'rss-proxy',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}

export default defineConfig({ plugins: [react(), rssProxy()], base: './' })
