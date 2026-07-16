import { useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config/api'

function Checkout({ cartItems, totalPrice, clearCart, refreshProducts, }) {
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    payment: 'Cash on Delivery',
  })

  function handleChange(e) {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [e.target.name]: e.target.value,
    }))
  }

  async function placeOrder() {
    setError('')

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      setError('Please fill in all fields')
      return
    }

    const emailPattern = /\S+@\S+\.\S+/

    if (!emailPattern.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (formData.phone.trim().length < 8) {
      setError('Please enter a valid phone number')
      return
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty')
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      setError('Please log in before placing an order')
      return
    }

    const orderItems = cartItems.map((item) => ({
      productId: item.productId || item._id || item.id,
      name: item.name,
      image: item.image || '',
      price: Number(item.price),
      quantity: Number(item.quantity),
    }))

    try {
      setIsSubmitting(true)

      const response = await fetch(
        `${API_BASE_URL}/api/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: orderItems,
            customer: {
              name: formData.name.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim(),
              address: formData.address.trim(),
              payment: formData.payment,
            },
            totalPrice: Number(totalPrice),
          }),
        }
      )

      const data = await response.json()
      if (!response.ok) {
        setError(data.message || 'Could not place order')
        return
      }

      await clearCart()

      if (refreshProducts) {
        await refreshProducts()
      }

      window.dispatchEvent(new Event('storage'))

      setOrderPlaced(true)

      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        payment: 'Cash on Delivery',
      })
    } catch (requestError) {
      console.error('Place order error:', requestError)
      setError('Server error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
          <p>
            Your order has been saved to your account.
          </p>

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

            {error && (
              <p className="checkout-error">
                {error}
              </p>
            )}

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            <textarea
              rows="4"
              name="address"
              placeholder="Shipping Address"
              value={formData.address}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            <select
              name="payment"
              value={formData.payment}
              onChange={handleChange}
              disabled={isSubmitting}
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

            <button
              type="button"
              onClick={placeOrder}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Placing Order...'
                : 'Place Order'}
            </button>
          </div>

          <div className="checkout-card checkout-summary">
            <h2>Order Summary</h2>

            {cartItems.map((item) => (
              <div
                className="checkout-item"
                key={item._id || item.productId || item.id}
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <strong>
                  ${item.price * item.quantity}
                </strong>
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