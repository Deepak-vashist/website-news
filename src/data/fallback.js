// Used only when the live API (fakestoreapi.com) is unreachable.
const desc = 'A quality product picked for you by ShopVerse. Durable, stylish and great value.'
export const fallbackProducts = [
  ['Classic Backpack', 109.95, "men's clothing"],
  ['Slim Fit T-Shirt', 22.3, "men's clothing"],
  ['Cotton Jacket', 55.99, "men's clothing"],
  ['Gold Plated Bracelet', 695, 'jewelery'],
  ['Silver Dragon Ring', 168, 'jewelery'],
  ['1TB Portable SSD', 109, 'electronics'],
  ['27" Curved Monitor', 399, 'electronics'],
  ['Rain Jacket Women', 39.99, "women's clothing"],
  ['Casual Top Women', 12.99, "women's clothing"],
  ['Wireless Headphones', 79.5, 'electronics'],
].map(([title, price, category], i) => ({
  id: i + 1,
  title,
  price,
  category,
  description: desc,
  image: '',
  rating: { rate: 3.5 + ((i * 7) % 15) / 10, count: 50 + i * 37 },
}))
