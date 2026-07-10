import { Link } from 'react-router-dom'

function Cart(props) {
  const getProductId = (item) =>
    item.productId || item._id || item.id

  return (
    <section className="cart-page">
      <div className="products-header">
        <p className="section-badge">Shopping Cart</p>
        <h1>Your Cart</h1>
        <p className="section-subtitle">
          Review your items before checkout.
        </p>
      </div>

      {props.cartItems.length === 0 ? (
        <div className="empty-state">
          <h2>🛒 Your cart is empty</h2>
          <p>Start shopping and add products to your cart.</p>

          <Link to="/products">
            <button>Shop Products</button>
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-list">
            {props.cartItems.map((item) => {
              const productId = getProductId(item)

              return (
                <div
                  className="cart-product"
                  key={item._id || productId}
                >
                  <img
                    src={
                      item.image?.startsWith('/uploads')
                        ? `http://localhost:5000${item.image}`
                        : item.image
                    }
                    alt={item.name}
                  />

                  <div className="cart-product-info">
                    <h3>{item.name}</h3>
                    <p>${item.price} each</p>

                    <div className="cart-quantity">
                      <button
                        onClick={() =>
                          props.changeQuantity(productId, -1)
                        }
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          props.changeQuantity(productId, 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-product-actions">
                    <h3>${item.price * item.quantity}</h3>

                    <button
                      className="remove-btn"
                      onClick={() =>
                        props.removeFromCart(productId)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>${props.totalPrice}</strong>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <strong>Free</strong>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>${props.totalPrice}</strong>
            </div>

            <Link to="/checkout">
              <button>Proceed to Checkout</button>
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}

export default Cart