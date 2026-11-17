import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Checkout() {
  const { items, total, clear } = useCart()
  const [done, setDone] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', zip: '', pay: 'cod' })
  const shipping = total > 50 || total === 0 ? 0 : 5
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    setDone({ id: 'SV' + Date.now().toString().slice(-7), name: form.name, amount: total + shipping })
    clear()
  }

  if (done)
    return (
      <div className="container narrow center">
        <div className="success">✓</div>
        <h1>Thank you, {done.name}!</h1>
        <p>Order <strong>{done.id}</strong> placed. Total: ${done.amount.toFixed(2)}</p>
        <Link to="/" className="btn">Continue shopping</Link>
      </div>
    )

  if (!items.length)
    return (
      <div className="container">
        <p className="empty">Your cart is empty. <Link to="/">Go shopping</Link></p>
      </div>
    )

  return (
    <div className="container">
      <h1 className="section-title">Checkout</h1>
      <div className="checkout">
        <form onSubmit={submit} className="form">
          <label>Full name<input required value={form.name} onChange={set('name')} /></label>
          <div className="two">
            <label>Email<input required type="email" value={form.email} onChange={set('email')} /></label>
            <label>Phone<input required type="tel" pattern="[0-9+ ]{7,15}" value={form.phone} onChange={set('phone')} /></label>
          </div>
          <label>Address<input required value={form.address} onChange={set('address')} /></label>
          <div className="two">
            <label>City<input required value={form.city} onChange={set('city')} /></label>
            <label>ZIP / PIN<input required value={form.zip} onChange={set('zip')} /></label>
          </div>
          <label>Payment
            <select value={form.pay} onChange={set('pay')}>
              <option value="cod">Cash on delivery</option>
              <option value="upi">UPI</option>
              <option value="card">Credit / Debit card</option>
            </select>
          </label>
          <button className="btn block" type="submit">Place order – ${(total + shipping).toFixed(2)}</button>
        </form>
        <aside className="summary">
          <h2>Order summary</h2>
          {items.map((i) => (
            <div className="row" key={i.id}>
              <span>{i.title} × {i.qty}</span>
              <span>${(i.price * i.qty).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div className="row"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          <div className="row"><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Free'}</span></div>
          <div className="row total"><span>Total</span><strong>${(total + shipping).toFixed(2)}</strong></div>
        </aside>
      </div>
    </div>
  )
}
