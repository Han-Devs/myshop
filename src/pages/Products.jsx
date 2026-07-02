import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

function Products({ products, addToCart, toggleWishlist, wishlistItems }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('default')

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory = category === 'All' || product.category === category

    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'price-low') return a.price - b.price
    if (sort === 'price-high') return b.price - a.price
    if (sort === 'name-az') return a.name.localeCompare(b.name)
    if (sort === 'name-za') return b.name.localeCompare(a.name)
    return 0
  })
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const selectedCategory = searchParams.get('category')

    if (selectedCategory) {
      setCategory(selectedCategory)
    }
  }, [searchParams])
  return (
    <section className="products products-page">
      <div className="products-header">
        <p className="section-badge">Shop Collection</p>
        <h1>All Products</h1>
        <p className="section-subtitle">
          Browse premium electronics and fashion products.
        </p>
      </div>

      <div className="products-toolbar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="sort-select"
        >
          <option value="default">Default Sorting</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name-az">Name: A to Z</option>
          <option value="name-za">Name: Z to A</option>
        </select>
      </div>

      <div className="filter-buttons">
        {['All', 'Electronics', 'Fashion', 'Audio', 'Gaming'].map((item) => (
          <button
            key={item}
            className={category === item ? 'active-filter' : ''}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="product-count">
        Showing {sortedProducts.length} product
        {sortedProducts.length !== 1 ? 's' : ''}
      </p>

      {sortedProducts.length === 0 ? (
        <div className="empty-state">
          <h2>No products found</h2>
          <p>Try another search or category.</p>
        </div>
      ) : (
        <div className="cards product-grid">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
              category={product.category}
              stock={product.stock}
              addToCart={() => addToCart(product)}
              toggleWishlist={() => toggleWishlist(product)}
              isWishlisted={wishlistItems.some((item) => item.id === product.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Products