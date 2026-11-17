// Branded clothing & footwear (ids start at 201). Demo catalog – prices are sample values.
import { art } from './extra.js'

const M = "men's clothing"
const W = "women's clothing"
const K = "kids' clothing"

// brand -> image gradient
const colors = {
  Nike: ['#fee2e2', '#f87171'],
  Adidas: ['#e0e7ff', '#818cf8'],
  Puma: ['#fef3c7', '#fbbf24'],
  "Levi's": ['#dbeafe', '#60a5fa'],
  'H&M': ['#fce7f3', '#f472b6'],
  Zara: ['#e5e7eb', '#9ca3af'],
  Uniqlo: ['#fee2e2', '#fca5a5'],
  'Under Armour': ['#e2e8f0', '#94a3b8'],
  'Tommy Hilfiger': ['#dbeafe', '#93c5fd'],
  'Calvin Klein': ['#f1f5f9', '#cbd5e1'],
  'Ralph Lauren': ['#ede9fe', '#a78bfa'],
  Gap: ['#e0f2fe', '#38bdf8'],
  Reebok: ['#ffedd5', '#fb923c'],
  'The North Face': ['#dcfce7', '#4ade80'],
  'Allen Solly': ['#fef9c3', '#facc15'],
  'Peter England': ['#cffafe', '#22d3ee'],
  'Van Heusen': ['#e0e7ff', '#a5b4fc'],
  Fabindia: ['#ffedd5', '#fdba74'],
  Biba: ['#fae8ff', '#e879f9'],
  Manyavar: ['#fef3c7', '#f59e0b'],
}

// [brand, title, price, category, emoji, description]
const rows = [
  // Sportswear
  ['Nike', 'Air Zoom Running Shoes', 129.99, M, '👟', 'Responsive cushioning and breathable mesh upper for everyday runs.'],
  ['Nike', 'Dri-FIT Training T-Shirt', 32, M, '👕', 'Sweat-wicking Dri-FIT fabric that keeps you dry and comfortable.'],
  ['Nike', 'Sportswear Club Hoodie', 59.99, M, '🧥', 'Soft fleece pullover hoodie with a roomy fit.'],
  ['Nike', "Women's Pro Leggings", 49, W, '🩳', 'High-waist compression leggings with stretch and support.'],
  ['Adidas', 'Ultraboost Sneakers', 139, M, '👟', 'Energy-returning Boost midsole with a sock-like Primeknit fit.'],
  ['Adidas', '3-Stripes Track Jacket', 64.95, M, '🧥', 'Classic full-zip track jacket with the iconic three stripes.'],
  ['Adidas', "Women's Training Tights", 42, W, '🩱', 'Soft stretch tights with AEROREADY moisture control.'],
  ['Adidas', 'Kids Classic Tracksuit', 44.5, K, '🎽', 'Comfortable tracksuit set for school and play.'],
  ['Puma', 'Suede Classic Sneakers', 74.99, M, '👟', 'Iconic suede low-top sneakers with a rubber outsole.'],
  ['Puma', 'Essentials Logo Tee', 22, M, '👕', 'Soft cotton jersey tee with printed Puma logo.'],
  ['Puma', "Women's Cropped Hoodie", 46.5, W, '🧥', 'Relaxed cropped hoodie in cozy fleece.'],
  ['Reebok', 'Club C 85 Vintage', 79.5, M, '👟', 'Timeless court sneakers with soft leather upper.'],
  ['Reebok', "Women's Workout Tank", 24, W, '🎽', 'Breathable lightweight tank built for the gym.'],
  ['Under Armour', 'HeatGear Compression Shirt', 35, M, '👕', 'Second-skin fit that wicks sweat and dries fast.'],
  ['Under Armour', 'Tech 2.0 Shorts', 26, M, '🩳', 'Ultra-light, quick-drying training shorts.'],
  // Denim & casual
  ["Levi's", '501 Original Fit Jeans', 69.5, M, '👖', 'The original straight-leg jean with button fly. Iconic since 1873.'],
  ["Levi's", 'Trucker Denim Jacket', 89.5, M, '🧥', 'Timeless denim trucker jacket with classic pockets.'],
  ["Levi's", "Women's High-Rise Skinny Jeans", 64, W, '👖', 'Flattering high-rise skinny jeans with stretch comfort.'],
  ['Gap', 'Classic Logo Hoodie', 49.95, M, '🧥', 'Cozy fleece hoodie with embroidered Gap logo.'],
  ['Gap', 'Kids Denim Overalls', 38, K, '👖', 'Durable stretch-denim overalls built for playtime.'],
  ['Uniqlo', 'Ultra Light Down Jacket', 79.9, M, '🧥', 'Packable down jacket that is feather-light and warm.'],
  ['Uniqlo', "Women's AIRism Tee", 19.9, W, '👚', 'Smooth, breathable and quick-drying everyday tee.'],
  ['Uniqlo', 'Supima Cotton Crew Neck', 14.9, M, '👕', 'Premium Supima cotton tee that stays soft wash after wash.'],
  ['H&M', "Women's Floral Wrap Dress", 34.99, W, '👗', 'Lightweight viscose wrap dress with a flattering V-neck.'],
  ['H&M', 'Regular Fit Oxford Shirt', 24.99, M, '👔', 'Easy-iron cotton Oxford shirt with button-down collar.'],
  ['H&M', 'Kids Printed Sweatshirt', 17.99, K, '👕', 'Soft cotton-blend sweatshirt with fun print.'],
  ['Zara', "Women's Tailored Blazer", 89.9, W, '🥼', 'Structured blazer with padded shoulders and a modern cut.'],
  ['Zara', 'Slim Fit Chino Trousers', 45.9, M, '👖', 'Slim chinos in stretch cotton twill.'],
  ['Zara', "Women's Pleated Midi Skirt", 39.9, W, '👗', 'Flowy pleated midi skirt with elastic waist.'],
  // Premium
  ['Tommy Hilfiger', 'Classic Polo Shirt', 59.5, M, '👕', 'Slim-fit polo in breathable piqué cotton with flag logo.'],
  ['Tommy Hilfiger', "Women's Striped Sweater", 79, W, '🧶', 'Soft knit sweater with signature red, white and blue stripe.'],
  ['Calvin Klein', 'Modern Cotton Briefs 3-Pack', 36, M, '🩲', 'Stretch cotton briefs with the iconic waistband.'],
  ['Calvin Klein', "Women's Slim Fit Dress", 98, W, '👗', 'Elegant sheath dress, perfect for office and evenings.'],
  ['Ralph Lauren', 'Custom Slim Fit Polo', 98.5, M, '👕', 'Signature mesh polo with embroidered pony.'],
  ['Ralph Lauren', 'Cable-Knit Cotton Sweater', 148, M, '🧶', 'Classic cable-knit crewneck in pure cotton.'],
  ['The North Face', 'Resolve Waterproof Jacket', 89.95, M, '🧥', 'Lightweight waterproof shell for rainy days and trails.'],
  ['The North Face', "Women's Thermoball Jacket", 199, W, '🧥', 'Packable insulated jacket that stays warm even when wet.'],
  // Indian brands
  ['Allen Solly', 'Slim Fit Formal Shirt', 29.5, M, '👔', 'Smart wrinkle-free formal shirt for the modern professional.'],
  ['Peter England', 'Cotton Casual Trousers', 32, M, '👖', 'Comfort-fit casual trousers in soft cotton.'],
  ['Van Heusen', 'Executive Suit Blazer', 119, M, '🥼', 'Tailored blazer with notch lapel, ideal for business wear.'],
  ['Fabindia', 'Handloom Cotton Kurta', 34, M, '👘', 'Breathable handloom cotton kurta with traditional detailing.'],
  ['Fabindia', "Women's Block Print Kurti", 36.5, W, '👘', 'Hand block printed cotton kurti, soft and lightweight.'],
  ['Biba', "Women's Anarkali Suit Set", 74, W, '👗', 'Festive anarkali with dupatta and embroidered neckline.'],
  ['Biba', "Women's Straight Kurta Set", 52, W, '👘', 'Straight-fit kurta with palazzo pants, ready for any occasion.'],
  ['Manyavar', 'Embroidered Sherwani', 189, M, '🤵', 'Rich festive sherwani with fine embroidery. Wedding ready.'],
  ['Manyavar', 'Silk Blend Kurta Pajama', 82, M, '👘', 'Elegant silk-blend kurta pajama set for festive occasions.'],
]

// Real photos (free-to-use Unsplash + dummyjson CDN), one per row above, same order.
// They show the garment type, not the exact branded product.
const U = (id) => `https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop&q=80`
const D = (path) => encodeURI(`https://cdn.dummyjson.com/product-images/${path}/thumbnail.webp`)
const jeans = U('1542272604-787c3835535d')
const jeansShop = U('1560243563-062bfc001d68')
const hoodie = U('1556821840-3a63f95609a7')
const whiteSweat = U('1620799140408-edc6dcb6d633')
const whiteTee = U('1521572163474-6864f9cf17ab')
const whiteTeeMan = U('1571945153237-4929e783af4a')
const blackTee = U('1618354691373-d851c5c3a990')
const blackTeeWoman = U('1583744946564-b52ac1c389c8')
const printTee = U('1576566588028-4147f3842f27')
const cropTee = U('1503342394128-c104d54dba01')
const teeRack = U('1576871337622-98d48d1cf531')
const bomber = U('1591047139829-d91aecb6caea')
const oliveJacket = U('1544022613-e87ca75a784a')
const shearling = U('1559551409-dadc959f76b8')
const coats = U('1604644401890-0bd678c83788')
const chambray = U('1596755094514-f87e34085b2c')
const flatlay = U('1544441893-675973e31985')
const kids = U('1519238263530-99bdd11df2ea')
const shorts = U('1591195853828-11db59a44f6b')
const pants = U('1506629082955-511b1aa562c8')
const orangeSweat = U('1578587018452-892bacefd3f2')
const knit = U('1434389677669-e08b4cac3105')
const whiteDress = U('1515372039744-b8f02a3ae446')
const suit = U('1507679799987-c73779587ccf')
const blazer = U('1617137984095-74e4e5e3613f')
const shirtTie = U('1598033129183-c4f50c736f10')
const ethnic = U('1583391733956-3750e0ff4e8b')
const redShoe = U('1542291026-7eec264c27ff')
const sneakerWR = D('mens-shoes/sports-sneakers-off-white-red')
const sneakerJordan = D('mens-shoes/nike-air-jordan-1-red-and-black')
const sneakerPuma = D('mens-shoes/puma-future-rider-trainers')
const checkShirt = D('mens-shirts/men-check-shirt')
const bbCheck = D('mens-shirts/blue-&-black-check-shirt')
const shortSleeve = D('mens-shirts/man-short-sleeve-shirt')
const plaid = D('mens-shirts/man-plaid-shirt')
const tartan = D('tops/tartan-dress')
const dressPea = D('womens-dresses/dress-pea')
const suitWomen = D('womens-dresses/marni-red-&-black-suit')

const photos = [
  redShoe, whiteTeeMan, hoodie, pants, sneakerWR, bomber, cropTee, kids, sneakerPuma, blackTee,
  orangeSweat, sneakerJordan, blackTeeWoman, teeRack, shorts,
  jeans, chambray, jeansShop, whiteSweat, kids, coats, whiteTee, printTee,
  whiteDress, checkShirt, kids, suitWomen, flatlay, tartan,
  shortSleeve, knit, flatlay, dressPea, bbCheck, whiteSweat, oliveJacket, shearling,
  shirtTie, flatlay, suit, plaid, ethnic, ethnic, ethnic, blazer, checkShirt,
]

export const brandProducts = rows.map(([brand, title, price, category, emoji, description], i) => {
  const [from, to] = colors[brand]
  return {
    id: 201 + i,
    brand,
    title: `${brand} ${title}`,
    price,
    category,
    description,
    image: photos[i] || art(emoji, from, to, brand),
    rating: { rate: +(3.7 + ((i * 5) % 13) / 10).toFixed(1), count: 60 + ((i * 71) % 900) },
  }
})
