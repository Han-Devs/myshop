import { Link } from 'react-router-dom'
import { getImageUrl } from '../config/api'
function ProductCard(props) {
  const inStock = props.stock > 0

  return (
    <div className="product-card">
      <button className="wishlist-btn" onClick={props.toggleWishlist}>
        {props.isWishlisted ? '❤️' : '🤍'}
      </button>

      <Link to={`/product/${props.id}`} className="product-card-link">
        <div className="product-image-box">
          <img
            src={getImageUrl(props.image)}
            alt={props.name}
            className="product-image"
          />
        </div>

        <h3>{props.name}</h3>
      </Link>

      <div className="product-rating">
        ⭐⭐⭐⭐⭐ <span>4.8</span>
      </div>

      <p className="product-category">{props.category}</p>

      <p className="product-price">${props.price}</p>

      <p className={inStock ? 'product-stock in-stock' : 'product-stock out-stock'}>
        {inStock ? `● Stock: ${props.stock}` : '● Out of Stock'}
      </p>

      <button className="product-btn" onClick={props.addToCart} disabled={!inStock}>
        {inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  )
}

export default ProductCard