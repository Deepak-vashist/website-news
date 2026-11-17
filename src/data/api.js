// Free, key-less public news sources (CORS enabled):
//  - Spaceflight News API  -> articles with images (space / science)
//  - Hacker News (Algolia) -> technology, AI, business/startup stories
const SPACE = 'https://api.spaceflightnewsapi.net/v4/articles/'
const HN = 'https://hn.algolia.com/api/v1/'

export const CATEGORIES = [
  { key: 'top', label: 'Top Stories' },
  { key: 'india', label: 'India' },
  { key: 'haryana', label: 'Haryana' },
  { key: 'haryana-hi', label: 'हरियाणा' },
  { key: 'tech', label: 'Technology' },
  { key: 'ai', label: 'AI' },
  { key: 'space', label: 'Space' },
  { key: 'science', label: 'Science' },
  { key: 'business', label: 'Business' },
]

const host = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'news'
  }
}

const fromSpace = (a) => ({
  id: `sp-${a.id}`,
  title: a.title,
  url: a.url,
  image: a.image_url,
  source: a.news_site,
  summary: a.summary,
  date: a.published_at,
})

const fromHN = (h) => ({
  id: `hn-${h.objectID}`,
  title: h.title || h.story_title,
  url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
  image: null,
  source: h.url ? host(h.url) : 'Hacker News',
  summary: `${h.points ?? 0} points · ${h.num_comments ?? 0} comments · by ${h.author}`,
  date: h.created_at,
})

async function getJSON(url, signal) {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

const space = async (q, limit, signal) =>
  (await getJSON(`${SPACE}?limit=${limit}${q ? `&search=${encodeURIComponent(q)}` : ''}`, signal)).results.map(fromSpace)

const hn = async (path, limit, signal) =>
  (await getJSON(`${HN}${path}&hitsPerPage=${limit}`, signal)).hits.filter((h) => h.title || h.story_title).map(fromHN)

const hnSearch = (q, limit, signal) =>
  hn(`search_by_date?tags=story&numericFilters=points>5&query=${encodeURIComponent(q)}`, limit, signal)

// ---- RSS (India / Haryana) via the dev-server proxy defined in vite.config.js ----
const hash = (s) => {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

const textOf = (el, tag) => el.getElementsByTagName(tag)[0]?.textContent?.trim() || ''
const plain = (html) => new DOMParser().parseFromString(html || '', 'text/html').body.textContent.replace(/\s+/g, ' ').trim()

function imageOf(item) {
  const attr = (tag, name = 'url') => item.getElementsByTagName(tag)[0]?.getAttribute(name)
  const enclosure = item.getElementsByTagName('enclosure')[0]
  const fromHtml = /<img[^>]+src=["']([^"']+)/i.exec(
    textOf(item, 'description') + textOf(item, 'content:encoded'),
  )?.[1]
  const media = item.getElementsByTagName('media:content')[0]
  const mediaOk = media && !(media.getAttribute('type') || '').startsWith('video') ? media.getAttribute('url') : null
  const enc = enclosure && (enclosure.getAttribute('type') || 'image').startsWith('image') ? enclosure.getAttribute('url') : null
  const img = mediaOk || attr('media:thumbnail') || enc || fromHtml || null
  return img ? img.replace(/^http:/, 'https:') : null
}

async function rss(feedUrl, { source, google = false, keep } = {}, signal) {
  const res = await fetch(`/api/rss?url=${encodeURIComponent(feedUrl)}`, { signal })
  if (!res.ok) throw new Error(`RSS ${res.status}`)
  const doc = new DOMParser().parseFromString(await res.text(), 'text/xml')
  const items = [...doc.getElementsByTagName('item')].map((item) => {
    let title = plain(textOf(item, 'title'))
    const link = textOf(item, 'link')
    const src = item.getElementsByTagName('source')[0]
    let name = source || host(link)
    let summary = plain(textOf(item, 'description'))
    let site = null
    if (google) {
      // Google News titles look like "Headline - Publisher"
      const cut = title.lastIndexOf(' - ')
      if (cut > 0) {
        name = title.slice(cut + 3)
        title = title.slice(0, cut)
      }
      name = src?.textContent?.trim() || name
      site = src?.getAttribute('url') || null
      summary = '' // Google's description only repeats the headline
    }
    const when = new Date(textOf(item, 'pubDate') || textOf(item, 'dc:date') || Date.now())
    return {
      id: `rss-${hash(link || title)}`,
      title,
      url: link,
      image: imageOf(item),
      source: name,
      site,
      summary: summary && summary !== title ? summary : `Latest update from ${name}. Open the full story at the source.`,
      date: Number.isNaN(+when) ? new Date().toISOString() : when.toISOString(),
    }
  })
  return keep ? items.filter((a) => keep.test(`${a.title} ${a.summary}`)) : items
}

const gnews = (q, lang = 'en') =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=${lang === 'hi' ? 'hi' : 'en-IN'}&gl=IN&ceid=IN:${lang}`

// Chandigarh/regional feeds mix Punjab, HP and J&K; keep only Haryana stories.
const HARYANA = /haryana|gurugram|gurgaon|faridabad|rohtak|hisar|karnal|panipat|ambala|sonipat|sonepat|yamunanagar|panchkula|sirsa|bhiwani|jind\b|kaithal|rewari|nuh\b|mewat|fatehabad|jhajjar|mahendragarh|palwal|kurukshetra|charkhi|saini|hooda|chautala|हरियाणा|गुरुग्राम|फरीदाबाद|रोहतक|हिसार|करनाल|पानीपत|अंबाला|सोनीपत|पंचकूला|सिरसा|भिवानी|जींद|कैथल|रेवाड़ी|कुरुक्षेत्र/i

const INDIA_FEEDS = [
  ['https://timesofindia.indiatimes.com/rssfeedstopstories.cms', 'Times of India'],
  ['https://www.thehindu.com/news/national/feeder/default.rss', 'The Hindu'],
  ['https://indianexpress.com/section/india/feed/', 'Indian Express'],
  ['https://feeds.feedburner.com/ndtvnews-india-news', 'NDTV'],
  ['https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml', 'Hindustan Times'],
]

const HARYANA_FEEDS = [
  [gnews('Haryana'), { google: true }],
  ['https://www.hindustantimes.com/feeds/rss/cities/chandigarh-news/rssfeed.xml', { source: 'Hindustan Times', keep: HARYANA }],
  ['https://timesofindia.indiatimes.com/rssfeeds/-2128816011.cms', { source: 'Times of India', keep: HARYANA }],
]

const HARYANA_HI_FEEDS = [
  [gnews('हरियाणा', 'hi'), { google: true }],
  ['https://www.bhaskar.com/rss-v1--category-1061.xml', { source: 'Dainik Bhaskar', keep: HARYANA }],
  ['https://hindi.news18.com/rss/khabar/haryana/haryana.xml', { source: 'News18 हिंदी' }],
]

const rssMany = async (feeds, limit, signal) => {
  const results = await Promise.allSettled(
    feeds.map(([url, opts]) => rss(url, typeof opts === 'string' ? { source: opts } : opts, signal)),
  )
  const seen = new Set()
  return merge(results)
    .filter((a) => a.title && !seen.has(a.title.toLowerCase()) && seen.add(a.title.toLowerCase()))
    .slice(0, limit)
}

export async function fetchNews(category, search, limit, signal) {
  if (search) {
    const [a, b, c] = await Promise.allSettled([
      space(search, limit, signal),
      hnSearch(search, limit, signal),
      rss(gnews(search), { google: true }, signal),
    ])
    return merge([a, b, c]).slice(0, limit * 2)
  }
  switch (category) {
    case 'india':
      return rssMany(INDIA_FEEDS, limit, signal)
    case 'haryana':
      return rssMany(HARYANA_FEEDS, limit, signal)
    case 'haryana-hi':
      return rssMany(HARYANA_HI_FEEDS, limit, signal)
    case 'tech':
      return hn('search?tags=front_page', limit, signal)
    case 'ai':
      return hnSearch('AI', limit, signal)
    case 'space':
      return space('', limit, signal)
    case 'science':
      return space('science', limit, signal)
    case 'business':
      return hnSearch('startup', limit, signal)
    default: {
      const [a, b] = await Promise.allSettled([space('', limit, signal), hn('search?tags=front_page', limit, signal)])
      return merge([a, b])
    }
  }
}

function merge(results) {
  const ok = results.filter((r) => r.status === 'fulfilled').flatMap((r) => r.value)
  if (!ok.length) throw new Error('All sources failed')
  return ok.sort((x, y) => new Date(y.date) - new Date(x.date))
}

// ---- article cache: lets the in-app article page find a story even after a refresh ----
const CACHE_KEY = 'np-cache'
const memory = new Map()

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || []
  } catch {
    return []
  }
}

export function rememberArticles(list) {
  const real = list.filter((a) => !a.id.startsWith('sample-'))
  real.forEach((a) => memory.set(a.id, a))
  try {
    const merged = [...real, ...readCache().filter((a) => !real.some((r) => r.id === a.id))].slice(0, 200)
    localStorage.setItem(CACHE_KEY, JSON.stringify(merged))
  } catch {
    /* storage full or blocked – memory cache still works */
  }
}

export function getArticle(id) {
  return memory.get(id) || readCache().find((a) => a.id === id) || null
}

export function getMoreStories(excludeId, n = 6) {
  const all = [...memory.values(), ...readCache()]
  const seen = new Set([excludeId])
  return all.filter((a) => !seen.has(a.id) && seen.add(a.id)).slice(0, n)
}

// ---- story images ----
// Hacker News stories have no picture, so we use a preview screenshot of the story page
// (WordPress mShots, free, no key). Ready previews are cached in localStorage; until one is
// ready (or if it fails) the card shows the site's logo.
const IMG_KEY = 'np-img2'
let imgCache = null
const inflight = new Map()
const queue = []
let active = 0

function imgStore() {
  if (!imgCache) {
    try {
      imgCache = JSON.parse(localStorage.getItem(IMG_KEY)) || {}
    } catch {
      imgCache = {}
    }
  }
  return imgCache
}

function saveImg(url, image) {
  const store = imgStore()
  store[url] = image || ''
  const keys = Object.keys(store)
  if (keys.length > 400) keys.slice(0, keys.length - 400).forEach((k) => delete store[k])
  try {
    localStorage.setItem(IMG_KEY, JSON.stringify(store))
  } catch {
    /* ignore */
  }
}

export const getCachedImage = (url) => imgStore()[url] || null

function pump() {
  while (active < 8 && queue.length) {
    active++
    queue.shift()()
  }
}

export function resolveImage(url) {
  const store = imgStore()
  if (url in store) return Promise.resolve(store[url] || null)
  if (inflight.has(url)) return inflight.get(url)

  const p = new Promise((resolve) => {
    queue.push(async () => {
      try {
        // mShots answers the first request with a "generating" GIF placeholder, then a real JPEG.
        const shot = `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=640&h=360`
        let found = null
        for (let i = 0; i < 6 && !found; i++) {
          const res = await fetch(shot)
          const type = res.headers.get('content-type') || ''
          res.body?.cancel()
          if (res.ok && type.startsWith('image/') && !type.includes('gif')) found = shot
          else await new Promise((r) => setTimeout(r, 3000))
        }
        if (found) saveImg(url, found) // a miss is not cached, so it is retried on a later visit
        resolve(found)
      } catch {
        resolve(null)
      } finally {
        active--
        inflight.delete(url)
        pump()
      }
    })
    pump()
  })
  inflight.set(url, p)
  return p
}

// Google News links are redirect pages – a screenshot of them is useless.
export const canPreview = (url) => !!url && url.startsWith('http') && !url.includes('news.google.com')

export const faviconFor = (url) => {
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`
  } catch {
    return null
  }
}

export function timeAgo(date) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(date)) / 1000))
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// Shown only if every live source is unreachable.
export const SAMPLE = Array.from({ length: 8 }, (_, i) => ({
  id: `sample-${i}`,
  title: [
    'Live news is temporarily unavailable',
    'Check your internet connection and refresh',
    'NewsPulse auto-retries every minute',
    'Your saved stories are still available offline',
    'Switch categories using the top navigation',
    'Use the search bar to look up any topic',
    'Toggle dark mode from the header',
    'Bookmark stories to read them later',
  ][i],
  url: '#',
  image: null,
  source: 'NewsPulse',
  summary: 'Sample placeholder story shown while offline.',
  date: new Date(Date.now() - i * 600000).toISOString(),
}))
