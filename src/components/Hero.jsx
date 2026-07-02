import { Link } from 'react-router-dom'

import phone from '../assets/hero/phone.png'
import laptop from '../assets/hero/laptop.png'
import shoes from '../assets/hero/shoe.png'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-badge">🔥 Limited Time Offer</p>

        <h1>Shop Smarter. Look Better.</h1>

        <p>
          Discover premium electronics and fashion products with fast checkout,
          wishlist, stock tracking, and order history.
        </p>

        <div className="hero-buttons">
          <Link to="/products">
            <button>Shop Now</button>
          </Link>

          <Link to="/categories">
            <button className="secondary-btn">Browse Categories</button>
          </Link>
        </div>
      </div>

      <div className="hero-showcase">
        <div className="hero-glow"></div>

        <img src={phone} alt="Phone" className="hero-phone" />
        <img src={laptop} alt="Laptop" className="hero-laptop" />
        <img src={shoes} alt="Shoes" className="hero-shoes" />
      </div>
    </section>
  )
}

export default Hero