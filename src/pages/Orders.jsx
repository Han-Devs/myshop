function Orders({ orders, clearOrders }) {
  return (
    <section className="orders-page">
      <div className="products-header">
        <p className="section-badge">My Orders</p>
        <h1>Order History</h1>
        <p className="section-subtitle">
          Track your purchases and order status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h2>📦 No orders yet</h2>
          <p>Your completed orders will appear here.</p>
        </div>
      ) : (
        <>
          <div className="orders-actions">
            <button className="remove-btn" onClick={clearOrders}>
              Clear Order History
            </button>
          </div>

          <div className="orders-list">
            {orders.map((order) => {
              const status = order.status || 'Pending'

              return (
                <div className="order-card" key={order.id}>
                  <div className="order-header">
                    <div>
                      <h3>Order #{order.id}</h3>
                      <p>{order.date || 'No date'}</p>
                    </div>

                    <span className={`status ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </div>

                  <div className="order-info">
                    <p><strong>Customer:</strong> {order.customer?.name || 'Unknown'}</p>
                    <p><strong>Payment:</strong> {order.customer?.payment || 'Unknown'}</p>
                    <p><strong>Total:</strong> ${order.total || 0}</p>
                  </div>

                  <div className="order-items">
                    <h4>Items</h4>

                    {(order.items || []).map((item) => (
                      <div className="order-item" key={item.id}>
                        <span>{item.name} x {item.quantity}</span>
                        <strong>${item.price * item.quantity}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}

export default Orders