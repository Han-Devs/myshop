import { Routes, Route } from 'react-router-dom'

import { useState, useEffect } from 'react'
import './App.css'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductCard from './components/ProductCard'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import Categories from './pages/Categories'
import ProductDetails from './pages/ProductDetails'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import AdminLogin from './pages/AdminLogin'

function App() {
  const [cartItems, setCartItems] = useState([])

  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    return savedWishlist ? JSON.parse(savedWishlist) : []
  })

  const [toast, setToast] = useState('')

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders')
    return savedOrders ? JSON.parse(savedOrders) : []
  })

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode')
    return savedTheme ? JSON.parse(savedTheme) : false
  })

  const [products, setProducts] = useState([])

  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem('currentUser'))
  })

  const [isAdmin, setIsAdmin] = useState(() => {
    return JSON.parse(localStorage.getItem('isAdmin')) || false
  })

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((response) => response.json())
      .then((data) => {
        console.log('Products from backend:', data)
        setProducts(data)
      })
      .catch((error) => {
        console.error('Backend fetch error:', error)
      })
  }, [])
  useEffect(() => {
    async function fetchUserCart() {
      const token = getToken()

      if (!currentUser || !token) {
        setCartItems([])
        return
      }

      try {
        const response = await fetch('http://localhost:5000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          console.error(data.message)
          setCartItems([])
          return
        }

        setCartItems(data.items || [])
      } catch (error) {
        console.error('Cart fetch error:', error)
        setCartItems([])
      }
    }

    fetchUserCart()
  }, [currentUser])



  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin))
  }, [isAdmin])
  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)


  function showToast(message) {
    setToast(message)

    setTimeout(() => {
      setToast('')
    }, 2000)
  }
  function getProductId(product) {
    return product.productId || product._id || product.id
  }
  function getToken() {
    return localStorage.getItem('token')
  }

  async function addToCart(product) {
    const token = getToken()

    if (!token || !currentUser) {
      showToast('Please login to add products to your cart')
      return
    }

    if (product.stock <= 0) {
      showToast(`${product.name} is out of stock`)
      return
    }

    const productId = getProductId(product)

    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: productId,
          name: product.name,
          image: product.image,
          price: product.price,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        showToast(data.message || 'Could not add product to cart')
        return
      }

      setCartItems(data.items || [])

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          getProductId(item) === productId
            ? { ...item, stock: item.stock - 1 }
            : item
        )
      )

      showToast(`${product.name} added to cart`)
    } catch (error) {
      console.error('Add to cart error:', error)
      showToast('Server error')
    }
  }
  async function removeFromCart(idToRemove) {
    const token = getToken()

    if (!token) {
      showToast('Please login first')
      return
    }

    const removedItem = cartItems.find(
      (item) => getProductId(item) === idToRemove
    )

    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${idToRemove}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        showToast(data.message || 'Could not remove product')
        return
      }

      setCartItems(data.items || [])

      if (removedItem) {
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            getProductId(product) === idToRemove
              ? {
                ...product,
                stock: product.stock + removedItem.quantity,
              }
              : product
          )
        )
      }

      showToast('Item removed from cart')
    } catch (error) {
      console.error('Remove cart error:', error)
      showToast('Server error')
    }
  }

  async function changeQuantity(id, amount) {
    const token = getToken()

    if (!token) {
      showToast('Please login first')
      return
    }

    const cartItem = cartItems.find(
      (item) => getProductId(item) === id
    )

    const product = products.find(
      (item) => getProductId(item) === id
    )

    if (!cartItem) return

    if (amount > 0 && product && product.stock <= 0) {
      showToast(`${product.name} is out of stock`)
      return
    }

    const newQuantity = cartItem.quantity + amount

    if (newQuantity <= 0) {
      await removeFromCart(id)
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: newQuantity,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        showToast(data.message || 'Could not update quantity')
        return
      }

      setCartItems(data.items || [])

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          getProductId(item) === id
            ? { ...item, stock: item.stock - amount }
            : item
        )
      )
    } catch (error) {
      console.error('Quantity update error:', error)
      showToast('Server error')
    }
  }
  function toggleWishlist(product) {
    const productId = getProductId(product)

    const existingItem = wishlistItems.find(
      (item) => getProductId(item) === productId
    )

    if (existingItem) {
      const updatedWishlist = wishlistItems.filter(
        (item) => getProductId(item) !== productId
      )

      setWishlistItems(updatedWishlist)
      showToast(`${product.name} removed from wishlist`)
    } else {
      setWishlistItems([...wishlistItems, product])
      showToast(`${product.name} added to wishlist`)
    }
  }

  async function clearCart() {
    const token = getToken()

    if (!token) {
      setCartItems([])
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        showToast(data.message || 'Could not clear cart')
        return
      }

      setCartItems(data.items || [])
      showToast('Order placed successfully')
    } catch (error) {
      console.error('Clear cart error:', error)
      showToast('Server error')
    }
  }
  function saveOrder(order) {
    setOrders([...orders, order])
  }

  function clearOrders() {
    setOrders([])
    showToast('Order history cleared')
  }
  function updateOrderStatus(orderId, newStatus) {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    )

    setOrders(updatedOrders)
    showToast('Order status updated')
  }

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <ScrollToTop />
      <Navbar
        cartCount={cartItems.length}
        wishlistCount={wishlistItems.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      {toast && <div className="toast">{toast}</div>}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />

              <section className="products featured-section">
                <p className="section-badge">Best Sellers</p>
                <h2>Featured Products</h2>
                <p className="section-subtitle">
                  Discover our most popular electronics and fashion picks.
                </p>

                <div className="cards">
                  {products
                    .filter((product) => product.featured)
                    .slice(0, 5)
                    .map((product) => (
                      <ProductCard
                        key={getProductId(product)}
                        id={getProductId(product)}
                        image={product.image}
                        name={product.name}
                        price={product.price}
                        category={product.category}
                        stock={product.stock}
                        addToCart={() => addToCart(product)}
                        toggleWishlist={() => toggleWishlist(product)}
                        isWishlisted={wishlistItems.some(
                          (item) => getProductId(item) === getProductId(product)
                        )}
                      />
                    ))}
                </div>
              </section>

              <section className="why-section">
                <p className="section-badge">Why Choose Us</p>
                <h2>Shopping Made Simple</h2>
                <p className="section-subtitle">
                  We make your online shopping experience fast, secure, and enjoyable.
                </p>

                <div className="why-cards">
                  <div className="why-card">
                    <div className="why-icon">🚚</div>
                    <h3>Fast Delivery</h3>
                    <p>Quick and reliable delivery for every order.</p>
                  </div>

                  <div className="why-card">
                    <div className="why-icon">🔒</div>
                    <h3>Secure Payment</h3>
                    <p>Your checkout information is always protected.</p>
                  </div>

                  <div className="why-card">
                    <div className="why-icon">💬</div>
                    <h3>24/7 Support</h3>
                    <p>Friendly support whenever you need help.</p>
                  </div>

                  <div className="why-card">
                    <div className="why-icon">↩️</div>
                    <h3>Easy Returns</h3>
                    <p>Simple returns and refunds within 30 days.</p>
                  </div>
                </div>
              </section>
              <section className="category-section">
                <p className="section-badge">Shop by Category</p>

                <h2>Popular Categories</h2>

                <p className="section-subtitle">
                  Explore products by your favorite categories.
                </p>

                <div className="category-cards">
                  <div className="category-card">
                    <div className="category-icon">📱</div>
                    <h3>Electronics</h3>
                    <p>120+ Products</p>
                  </div>

                  <div className="category-card">
                    <div className="category-icon">👟</div>
                    <h3>Fashion</h3>
                    <p>80+ Products</p>
                  </div>

                  <div className="category-card">
                    <div className="category-icon">🎧</div>
                    <h3>Audio</h3>
                    <p>45+ Products</p>
                  </div>

                  <div className="category-card">
                    <div className="category-icon">💻</div>
                    <h3>Gaming</h3>
                    <p>60+ Products</p>
                  </div>
                </div>
              </section>
            </>
          }
        />

        <Route path="/home" element={<Home />} />

        <Route
          path="/products"
          element={
            <Products
              products={products}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              wishlistItems={wishlistItems}
            />
          }
        />

        <Route path="/categories" element={<Categories />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart
                cartItems={cartItems}
                totalPrice={totalPrice}
                removeFromCart={removeFromCart}
                changeQuantity={changeQuantity}
              />
            </ProtectedRoute>
          }
        />

        <Route path="/contact" element={<Contact />} />

        <Route
          path="/product/:id"
          element={
            <ProductDetails
              products={products}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              wishlistItems={wishlistItems}
            />
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist
                wishlistItems={wishlistItems}
                toggleWishlist={toggleWishlist}
                addToCart={addToCart}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout
                cartItems={cartItems}
                totalPrice={totalPrice}
                clearCart={clearCart}
                saveOrder={saveOrder}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders
                orders={orders}
                clearOrders={clearOrders}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-login"
          element={
            <AdminLogin
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
            />
          }
        />
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <Admin
                orders={orders}
                updateOrderStatus={updateOrderStatus}
                products={products}
                setProducts={setProducts}
              />
            ) : (
              <AdminLogin isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
            )
          }
        />
        <Route
          path="/login"
          element={<Login setCurrentUser={setCurrentUser} />}
        />

        <Route
          path="/register"
          element={<Register setCurrentUser={setCurrentUser} />}
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </div>
  )
}

export default App