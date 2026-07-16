import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config/api'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchOrders() {
      const token = localStorage.getItem('token')

      if (!token) {
        setOrders([])
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || 'Could not load orders')
          setOrders([])
          return
        }

        setOrders(data)
      } catch (requestError) {
        console.error('Orders fetch error:', requestError)
        setError('Server error. Please try again.')
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <section className="orders-page">
        <div className="empty-state">
          <h2>Loading orders...</h2>
        </div>
      </section>
    )
  }

  return (
    <section className="orders-page">
      <div className="products-header">
        <p className="section-badge">My Orders</p>
        <h1>Order History</h1>
        <p className="section-subtitle">
          Track your purchases and order status.
        </p>
      </div>

      {error && (
        <div className="empty-state">
          <h2>Could not load orders</h2>
          <p>{error}</p>
        </div>
      )}

      {!error && orders.length === 0 ? (
        <div className="empty-state">
          <h2>📦 No orders yet</h2>
          <p>Your completed orders will appear here.</p>
        </div>
      ) : (
        !error && (
          <div className="orders-list">
            {orders.map((order) => {
              const status = order.status || 'Pending'

              return (
                <div className="order-card" key={order._id}>
                  <div className="order-header">
                    <div>
                      <h3>Order #{order._id}</h3>

                      <p>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : 'No date'}
                      </p>
                    </div>

                    <span
                      className={`status ${status.toLowerCase()}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="order-info">
                    <p>
                      <strong>Customer:</strong>{' '}
                      {order.customer?.name || 'Unknown'}
                    </p>

                    <p>
                      <strong>Payment:</strong>{' '}
                      {order.customer?.payment || 'Unknown'}
                    </p>

                    <p>
                      <strong>Total:</strong> $
                      {order.totalPrice || 0}
                    </p>
                  </div>

                  <div className="order-items">
                    <h4>Items</h4>

                    {(order.items || []).map((item) => (
                      <div
                        className="order-item"
                        key={item._id || item.productId}
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>

                        <strong>
                          ${item.price * item.quantity}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}
    </section>
  )
}

export default Orders