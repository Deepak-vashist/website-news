// Extra products merged on top of the live API catalog (ids start at 101 to avoid clashes).
// Images are generated inline (emoji on a gradient) so they never break or need a network.
export const art = (emoji, from, to, label = '') =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>` +
      `<rect width="400" height="400" fill="url(#g)"/>` +
      `<text x="200" y="${label ? 175 : 200}" font-size="170" text-anchor="middle" dominant-baseline="central">${emoji}</text>` +
      (label
        ? `<text x="200" y="352" font-size="40" font-weight="800" font-family="Arial, sans-serif" fill="#111" fill-opacity=".75" text-anchor="middle">${label.replace(/&/g, '&amp;')}</text>`
        : '') +
      `</svg>`,
  )

// [title, price, category, emoji, gradientFrom, gradientTo, description]
const rows = [
  // electronics
  ['Smart Watch Series X', 129.99, 'electronics', '⌚', '#dbeafe', '#93c5fd', 'Fitness tracking, heart-rate monitor, sleep insights and 7-day battery life.'],
  ['Bluetooth Speaker', 49.99, 'electronics', '🔊', '#ede9fe', '#c4b5fd', 'Waterproof portable speaker with deep bass and 12 hours of playtime.'],
  ['Mechanical Keyboard', 89, 'electronics', '⌨️', '#e0e7ff', '#a5b4fc', 'Hot-swappable RGB mechanical keyboard with tactile switches.'],
  ['Gaming Mouse', 34.5, 'electronics', '🖱️', '#fee2e2', '#fca5a5', 'Ergonomic wired mouse with 16000 DPI sensor and programmable buttons.'],
  ['Wireless Earbuds Pro', 99, 'electronics', '🎧', '#cffafe', '#67e8f9', 'Active noise cancellation, transparency mode and 24-hour case battery.'],
  ['Action Camera 4K', 189, 'electronics', '📷', '#fef3c7', '#fcd34d', 'Rugged 4K action camera with image stabilization, waterproof to 10m.'],
  // men's clothing
  ["Men's Denim Jacket", 64.9, "men's clothing", '🧥', '#dbeafe', '#60a5fa', 'Classic-fit denim jacket with a soft inner lining. A wardrobe essential.'],
  ["Men's Running Shoes", 74.99, "men's clothing", '👟', '#fee2e2', '#f87171', 'Lightweight breathable sneakers with cushioned sole for daily runs.'],
  ["Men's Formal Shirt", 29.99, "men's clothing", '👔', '#e0f2fe', '#7dd3fc', 'Wrinkle-resistant cotton formal shirt, perfect for office and events.'],
  // women's clothing
  ["Women's Summer Dress", 44.5, "women's clothing", '👗', '#fce7f3', '#f9a8d4', 'Flowy floral midi dress made from breathable fabric.'],
  ["Women's Handbag", 59, "women's clothing", '👜', '#ffedd5', '#fdba74', 'Vegan-leather tote with roomy compartments and a detachable strap.'],
  ["Women's Sneakers", 54.99, "women's clothing", '👠', '#fae8ff', '#e879f9', 'Stylish everyday sneakers with memory-foam insoles.'],
  // jewelery
  ['Pearl Necklace', 120, 'jewelery', '📿', '#fef9c3', '#fde047', 'Freshwater pearl necklace with sterling silver clasp.'],
  ['Diamond Stud Earrings', 349, 'jewelery', '💎', '#e0f2fe', '#a5f3fc', 'Brilliant-cut studs set in 14k white gold. Comes in a gift box.'],
  // home
  ['Ceramic Coffee Mug Set', 24.99, 'home', '☕', '#ffedd5', '#fb923c', 'Set of 4 handcrafted ceramic mugs, dishwasher and microwave safe.'],
  ['LED Desk Lamp', 27.5, 'home', '💡', '#fef9c3', '#facc15', 'Dimmable desk lamp with 5 colour modes and USB charging port.'],
  ['Cozy Throw Blanket', 31.99, 'home', '🛋️', '#fce7f3', '#f472b6', 'Ultra-soft fleece blanket, 150x200 cm. Machine washable.'],
  ['Indoor Plant Pot', 18.99, 'home', '🪴', '#dcfce7', '#86efac', 'Minimal matte planter with drainage tray, perfect for succulents.'],
  // beauty
  ['Vitamin C Face Serum', 19.99, 'beauty', '🧴', '#ffedd5', '#fdba74', 'Brightening serum with 15% vitamin C and hyaluronic acid.'],
  ['Luxury Perfume 50ml', 79, 'beauty', '🌸', '#fce7f3', '#f9a8d4', 'Long-lasting floral and amber fragrance in a glass bottle.'],
  // sports
  ['Yoga Mat Pro', 26.99, 'sports', '🧘', '#dcfce7', '#4ade80', 'Non-slip 6mm eco-friendly yoga mat with carrying strap.'],
  ['Adjustable Dumbbell Set', 149, 'sports', '🏋️', '#e5e7eb', '#9ca3af', 'Space-saving adjustable dumbbells, 2.5 – 24 kg per hand.'],
  ['Football Size 5', 22.99, 'sports', '⚽', '#dcfce7', '#86efac', 'Durable match-quality football, water-resistant stitched panels.'],
  // toys
  ['Building Blocks 500pcs', 35, 'toys', '🧩', '#fef3c7', '#fbbf24', 'Creative building block set compatible with major brands. Ages 6+.'],
]

export const extraProducts = rows.map(([title, price, category, emoji, from, to, description], i) => ({
  id: 101 + i,
  title,
  price,
  category,
  description,
  image: art(emoji, from, to),
  rating: { rate: +(3.6 + ((i * 7) % 14) / 10).toFixed(1), count: 40 + ((i * 53) % 400) },
}))
