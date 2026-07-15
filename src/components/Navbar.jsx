import { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar({
  cartCount,
  wishlistCount,
  darkMode,
  setDarkMode,
  currentUser,
  setCurrentUser,
  isAdmin,
  setIsAdmin,
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleLogout() {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')

    setCurrentUser(null)
    setIsAdmin(false)

    closeMenu()
  }



  return (
    <>
      {menuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}

      <nav className="navbar">
        <h2 className="logo">MyShop</h2>

        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={menuOpen ? 'nav-links active' : 'nav-links'}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/products" onClick={closeMenu}>Products</Link></li>
          <li><Link to="/categories" onClick={closeMenu}>Categories</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>

          {currentUser && (
            <li><Link to="/orders" onClick={closeMenu}>Orders</Link></li>
          )}

          <li>
            <Link to="/wishlist" onClick={closeMenu}>
              ❤️ Wishlist: {wishlistCount}
            </Link>
          </li>

          <li>
            <Link to="/cart" onClick={closeMenu}>
              🛒 Cart: {cartCount}
            </Link>
          </li>

          {currentUser?.role === 'admin' ? (
            <li>
              <Link to="/admin" onClick={closeMenu}>
                🛠 Dashboard
              </Link>
            </li>
          ) : (
            <li>
              <Link to="/admin-login" onClick={closeMenu}>
                Admin Login
              </Link>
            </li>
          )}
          {currentUser ? (
            <>
              <li>
                <Link to="/profile" onClick={closeMenu}>
                  👋 {currentUser.name}
                </Link>
              </li>

              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
              <li><Link to="/register" onClick={closeMenu}>Register</Link></li>
            </>
          )}

          
          <li>
            <button
              onClick={() => {
                setDarkMode(!darkMode)
                closeMenu()
              }}
              className="theme-btn"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Navbar