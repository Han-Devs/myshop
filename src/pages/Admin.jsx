import { useState } from 'react'

function Admin({
  orders = [],
  products,
  setProducts,
  updateOrderStatus,
}) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Electronics')
  const [image, setImage] = useState('')
  const [stock, setStock] = useState('')
  const [editingId, setEditingId] = useState(null)

  const getProductId = (product) => product._id || product.id

  const getImageUrl = (image) => {
    return image?.startsWith('/uploads')
      ? `http://localhost:5000${image}`
      : image
  }

  const totalRevenue = orders.reduce((total, order) => {
    return total + (order.totalPrice || 0)
  }, 0)

  const totalProductsSold = orders.reduce((total, order) => {
    return total + (order.items || []).reduce((sum, item) => {
      return sum + item.quantity
    }, 0)
  }, 0)

  const productSales = products.map((product) => {
    const productId = String(getProductId(product))

    const sold = orders.reduce((total, order) => {
      const matchingItem = (order.items || []).find((item) => {
        const orderProductId = String(
          item.productId || item._id || item.id
        )

        return orderProductId === productId
      })

      return total + (matchingItem?.quantity || 0)
    }, 0)

    return {
      name: product.name,
      sold,
    }
  })

  const maxSold = Math.max(...productSales.map((item) => item.sold), 1)

  function resetForm() {
    setName('')
    setPrice('')
    setCategory('Electronics')
    setImage('')
    setStock('')
    setEditingId(null)
  }

  function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
  }

  async function addProduct() {
    if (!name || !price || !image || !stock) {
      alert('Please fill all fields')
      return
    }

    const formData = new FormData()

    formData.append('name', name)
    formData.append('price', price)
    formData.append('category', category)
    formData.append('stock', stock)
    formData.append('rating', '4.8')
    formData.append('featured', 'false')
    formData.append('description', `This is a high quality ${name}.`)
    formData.append('image', image)

    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    setProducts([...products, data.product])
    resetForm()
  }

  async function deleteProduct(id) {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
    })

    setProducts(products.filter((product) => getProductId(product) !== id))
  }

  async function toggleFeatured(id) {
    const product = products.find((product) => getProductId(product) === id)

    if (!product) return

    const response = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        featured: !product.featured,
      }),
    })

    const data = await response.json()

    setProducts(
      products.map((product) =>
        getProductId(product) === id ? data.product : product
      )
    )
  }

  function startEdit(product) {
    setEditingId(getProductId(product))
    setName(product.name)
    setPrice(product.price)
    setCategory(product.category)
    setImage(product.image)
    setStock(product.stock || 0)
  }

  async function updateProduct() {
    if (!name || !price || stock === '') {
      alert('Please fill all fields')
      return
    }

    const response = await fetch(`http://localhost:5000/api/products/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        price: Number(price),
        category,
        image,
        stock: Number(stock),
      }),
    })

    const data = await response.json()

    setProducts(
      products.map((product) =>
        getProductId(product) === editingId ? data.product : product
      )
    )

    resetForm()
  }

  function cancelEdit() {
    resetForm()
  }

  return (
    <section className="products">
      <h1>Admin Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h3>Total Orders</h3>
          <h2>{orders.length}</h2>
        </div>

        <div className="card">
          <h3>Total Revenue</h3>
          <h2>${totalRevenue}</h2>
        </div>

        <div className="card">
          <h3>Products Sold</h3>
          <h2>{totalProductsSold}</h2>
        </div>
      </div>

      <h2 style={{ marginTop: '50px' }}>Sales Chart</h2>

      <div className="sales-chart card">
        {productSales.map((item) => (
          <div className="chart-row" key={item.name}>
            <span className="chart-label">{item.name}</span>

            <div className="chart-bar-bg">
              <div
                className="chart-bar"
                style={{ width: `${(item.sold / maxSold) * 100}%` }}
              ></div>
            </div>

            <span className="chart-value">{item.sold}</span>
          </div>
        ))}
      </div>


      <div className="admin-orders-section">
        <h2>Customer Orders</h2>

        {orders.length === 0 ? (
          <div className="empty-state">
            <h3>No orders found</h3>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-header">
                  <div>
                    <h3>
                      Order #{order._id?.slice(-8)}
                    </h3>

                    <p>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : 'No date'}
                    </p>
                  </div>

                  <select
                    className={`status-select ${order.status.toLowerCase()}`}
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="order-info">
                  <p>
                    <strong>Customer:</strong>{' '}
                    {order.customer?.name || 'Unknown'}
                  </p>

                  <p>
                    <strong>Email:</strong>{' '}
                    {order.customer?.email || 'Unknown'}
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
            ))}
          </div>
        )}
      </div>

      <h2 style={{ marginTop: '50px' }}>Manage Products</h2>

      <div className="card admin-form">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />

        {image && (
          <img
            src={
              typeof image === 'string'
                ? getImageUrl(image)
                : URL.createObjectURL(image)
            }
            alt="Preview"
            className="image-preview"
          />
        )}

        <input
          type="number"
          placeholder="Stock Quantity"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Audio</option>
          <option>Gaming</option>
        </select>

        {editingId ? (
          <>
            <button onClick={updateProduct}>Save Product</button>

            <button className="remove-btn" onClick={cancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          <button onClick={addProduct}>Add Product</button>
        )}
      </div>

      <div className="cards">
        {products.map((product) => (
          <div className="card" key={getProductId(product)}>
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="product-image"
            />

            <h3>{product.name}</h3>
            <p>{product.category}</p>
            <p>${product.price}</p>
            <p>Stock: {product.stock ?? 0}</p>

            <label className="featured-toggle">
              <input
                type="checkbox"
                checked={product.featured || false}
                onChange={() => toggleFeatured(getProductId(product))}
              />
              Featured Product
            </label>

            <div className="admin-buttons">
              <button onClick={() => startEdit(product)}>
                Edit
              </button>

              <button
                className="remove-btn"
                onClick={() => deleteProduct(getProductId(product))}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Admin