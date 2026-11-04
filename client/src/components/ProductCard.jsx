function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
        <button disabled={product.countInStock === 0}>
          {product.countInStock === 0 ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;