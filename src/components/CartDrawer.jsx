import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import Img from './Img.jsx'

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, total } = useCart()
  return (
    <>
      <div className={`overlay ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="drawer-head">
          <h2>Your Cart</h2>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close cart">✕</button>
        </div>
        <div className="drawer-body">
          {items.length === 0 && <p className="empty">Your cart is empty.</p>}
          {items.map((i) => (
            <div className="line" key={i.id}>
              <div className="line-img"><Img src={i.image} alt={i.title} /></div>
              <div className="line-info">
                <p>{i.title}</p>
                <strong>${(i.price * i.qty).toFixed(2)}</strong>
                <div className="qty">
                  <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease">−</button>
                  <span>{i.qty}</span>
                  <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase">+</button>
                  <button className="link danger" onClick={() => remove(i.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="drawer-foot">
            <div className="row"><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div>
            <Link to="/checkout" className="btn block" onClick={() => setOpen(false)}>
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
