import { useState } from 'react'
import { Link } from 'react-router-dom'

function Checkout({ cartItems, totalPrice, clearCart, saveOrder }) {
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    payment: 'Cash on Delivery',
  })

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  function placeOrder() {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError('Please fill in all fields')
      return
    }

    const emailPattern = /\S+@\S+\.\S+/

    if (!emailPattern.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (formData.phone.length < 8) {
      setError('Please enter a valid phone number')
      return
    }

    const order = {
      id: Date.now(),
      customer: formData,
      items: cartItems,
      total: totalPrice,
      date: new Date().toLocaleString(),
      status: 'Pending',
    }

    saveOrder(order)
    setOrderPlaced(true)
    clearCart()
    setError('')

    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      payment: 'Cash on Delivery',
    })
  }

  return (
    <section className="checkout-page">
      <div className="products-header">
        <p className="section-badge">Secure Checkout</p>
        <h1>Checkout</h1>
        <p className="section-subtitle">
          Complete your order safely and quickly.
        </p>
      </div>

      {orderPlaced ? (
        <div className="checkout-success">
          <h2>Order Placed Successfully ✅</h2>
          <p>Thank you for shopping with MyShop.</p>

          <Link to="/orders">
            <button>View Orders</button>
          </Link>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Add products to your cart before checkout.</p>

          <Link to="/products">
            <button>Shop Products</button>
          </Link>
        </div>
      ) : (
        <div className="checkout-layout">
          <div className="checkout-card">
            <h2>Shipping Information</h2>

            {error && <p className="checkout-error">{error}</p>}

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <textarea
              rows="4"
              name="address"
              placeholder="Shipping Address"
              value={formData.address}
              onChange={handleChange}
            ></textarea>

            <select
              name="payment"
              value={formData.payment}
              onChange={handleChange}
            >
              <option>Cash on Delivery</option>
              <option>Credit Card</option>
              <option>PayPal</option>
            </select>

            <div className="checkout-benefits">
              <span>🚚 Free Shipping</span>
              <span>🔒 Secure Payment</span>
              <span>↩️ Easy Returns</span>
            </div>

            <button onClick={placeOrder}>Place Order</button>
          </div>

          <div className="checkout-card checkout-summary">
            <h2>Order Summary</h2>

            {cartItems.map((item) => (
              <div className="checkout-item" key={item._id || item.id}>
                <span>{item.name} x {item.quantity}</span>
                <strong>${item.price * item.quantity}</strong>
              </div>
            ))}

            <div className="summary-row">
              <span>Shipping</span>
              <strong>Free</strong>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>${totalPrice}</strong>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Checkout