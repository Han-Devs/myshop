import { Link } from 'react-router-dom'

function Wishlist({ wishlistItems, toggleWishlist, addToCart }) {
  return (
    <section className="wishlist-page">
      <div className="products-header">
        <p className="section-badge">Favorites</p>
        <h1>Your Wishlist</h1>
        <p className="section-subtitle">
          Save your favorite products for later.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-state">
          <h2>❤️ Your wishlist is empty</h2>
          <p>Browse products and add your favorites.</p>

          <Link to="/products">
            <button>Explore Products</button>
          </Link>
        </div>
      ) : (
        <div className="cards wishlist-grid">
          {wishlistItems.map((item) => (
            <div className="wishlist-card" key={item.id}>
              <div className="wishlist-image-box">
                <img
                  src={item.image}
                  alt={item.name}
                  className="product-image"
                />
              </div>

              <h3>{item.name}</h3>

              <p className="wishlist-category">
                {item.category}
              </p>

              <p className="wishlist-price">
                ${item.price}
              </p>

              <div className="wishlist-buttons">
                <button
                  className="cart-btn"
                  onClick={() => addToCart(item)}
                >
                  🛒 Add to Cart
                </button>

                <button
                  className="remove-btn"
                  onClick={() => toggleWishlist(item)}
                >
                  ❤️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Wishlist