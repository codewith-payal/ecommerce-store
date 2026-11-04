import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container">
      <h1>My Store</h1>
      <div className="filters">
        <input
          className="search-box"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="product-grid">
        {filteredProducts.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      {filteredProducts.length === 0 && <p>No products found.</p>}
    </div>
  );
}

export default App;