import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { cartItems, removeFromCart, updateQty, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <h2>Your cart is empty</h2>
        <p style={{ margin: '12px 0' }}>Add some products to get started.</p>
        <Link to="/" className="back-link">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Your Cart</h2>
      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
            </div>
            <div className="cart-qty">
              <button onClick={() => updateQty(item._id, item.qty - 1)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
            </div>
            <p className="cart-item-total">₹{item.price * item.qty}</p>
            <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total: ₹{totalPrice}</h3>
        <button className="checkout-btn" onClick={() => navigate('/checkout')}>
        Proceed to checkout
        </button>
      </div>
    </div>
  );
}

export default CartPage;