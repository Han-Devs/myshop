import { Link, useParams } from 'react-router-dom'

function ProductDetails({ products, addToCart, toggleWishlist, wishlistItems }) {
  const { id } = useParams()

  const product = products.find((item) => String(item.id) === String(id))

  if (!product) {
    return <h2 className="not-found">Product Not Found</h2>
  }

  const isWishlisted = wishlistItems.some((item) => item.id === product.id)

  const relatedProducts = products.filter(
    (item) =>
      item.category === product.category &&
      String(item.id) !== String(product.id)
  )

  return (
    <section className="details-page">
      <div className="details-card">
        <div className="details-image-box">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="details-info">
          <p className="details-category">{product.category}</p>
          <h1>{product.name}</h1>

          <p className="details-rating">⭐⭐⭐⭐⭐ {product.rating || 4.8}</p>

          <h2>${product.price}</h2>

          <p className={product.stock > 0 ? 'details-stock in-stock' : 'details-stock out-stock'}>
            {product.stock > 0 ? `● In Stock (${product.stock})` : '● Out of Stock'}
          </p>

          <p className="details-description">
            {product.description ||
              `This is a premium ${product.name}. High quality, durable, and perfect for everyday use.`}
          </p>

          <div className="details-benefits">
            <span>🚚 Fast Delivery</span>
            <span>🔒 Secure Payment</span>
            <span>↩️ 30-Day Returns</span>
          </div>

          <div className="details-actions">
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              className="details-wishlist"
              onClick={() => toggleWishlist(product)}
            >
              {isWishlisted ? '❤️ Wishlisted' : '🤍 Wishlist'}
            </button>
          </div>
        </div>
      </div>

      <div className="related-section">
        <h2>Related Products</h2>

        <div className="related-products">
          {relatedProducts.slice(0, 3).map((item) => (
            <Link to={`/product/${item.id}`} key={item.id}>
              <div className="related-card">
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>${item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductDetails