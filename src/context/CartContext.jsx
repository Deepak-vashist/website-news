import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'shopverse-cart'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function reducer(items, action) {
  switch (action.type) {
    case 'add': {
      const found = items.find((i) => i.id === action.product.id)
      if (found) {
        return items.map((i) => (i.id === found.id ? { ...i, qty: i.qty + (action.qty || 1) } : i))
      }
      const { id, title, price, image } = action.product
      return [...items, { id, title, price, image, qty: action.qty || 1 }]
    }
    case 'setQty':
      return items.map((i) => (i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i))
    case 'remove':
      return items.filter((i) => i.id !== action.id)
    case 'clear':
      return []
    default:
      return items
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, load)
  const [open, setOpen] = useState(false)
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shopverse-wishlist')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])
  useEffect(() => {
    localStorage.setItem('shopverse-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.price, 0),
      open,
      setOpen,
      add: (product, qty) => {
        dispatch({ type: 'add', product, qty })
        setOpen(true)
      },
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
      wishlist,
      toggleWish: (id) =>
        setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
    }),
    [items, open, wishlist],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
