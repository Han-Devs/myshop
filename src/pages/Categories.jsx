import { Link } from 'react-router-dom'

function Categories() {
  const categories = [
    {
      name: 'Electronics',
      icon: '📱',
      description: 'Phones, tablets and everyday tech products.',
    },
    {
      name: 'Fashion',
      icon: '👟',
      description: 'Shoes, hoodies, hats and lifestyle products.',
    },
    {
      name: 'Audio',
      icon: '🎧',
      description: 'Headphones, speakers and audio accessories.',
    },
    {
      name: 'Gaming',
      icon: '💻',
      description: 'Gaming laptops, headsets and gaming gear.',
    },
  ]

  return (
    <section className="categories-page">
      <div className="products-header">
        <p className="section-badge">Browse Collections</p>

        <h1>Shop by Category</h1>

        <p className="section-subtitle">
          Find products by your favorite category.
        </p>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <div className="category-card-premium" key={category.name}>
            <div className="category-icon-big">
              {category.icon}
            </div>

            <h2>{category.name}</h2>

            <p>{category.description}</p>

            <Link to={`/products?category=${category.name}`}>
              <button>Explore Products</button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Categories