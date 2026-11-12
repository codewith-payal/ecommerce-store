import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function CheckoutPage() {
  const { cartItems, totalPrice } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return <Navigate to="/login" />;
  if (cartItems.length === 0) return <Navigate to="/cart" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/orders/checkout',
        {
          items: cartItems.map((i) => ({ product: i._id, qty: i.qty })),
          shippingAddress: { address, city, postalCode },
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      window.location.href = data.url;
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Shipping details</h2>
        {error && <p className="form-error">{error}</p>}

        <label htmlFor="address">Address</label>
        <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />

        <label htmlFor="city">City</label>
        <input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />

        <label htmlFor="postal">Postal code</label>
        <input id="postal" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />

        <p style={{ marginTop: '12px', fontWeight: 700 }}>Total: ₹{totalPrice}</p>

        <button type="submit" disabled={loading}>
          {loading ? 'Redirecting to payment...' : 'Pay with Stripe'}
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;