import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>MyShop</h2>
          <p>
            Premium electronics and fashion products with fast checkout,
            wishlist, stock tracking, and order history.
          </p>
        </div>

        <div className="footer-column">
          <h3>Shop</h3>
          <Link to="/products">Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="footer-column">
          <h3>Support</h3>
          <Link to="/orders">Orders</Link>
          <Link to="/contact">Contact</Link>
          <a href="#">Returns</a>
          <a href="#">FAQ</a>
        </div>

        <div className="footer-column">
          <h3>Follow Us</h3>
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">TikTok</a>
          <a href="#">YouTube</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 MyShop. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer