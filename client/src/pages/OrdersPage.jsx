import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    axios
      .get('/api/orders/mine', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container">
      <h2 className="page-title">My Orders</h2>
      {loading && <p>Loading...</p>}
      {!loading && orders.length === 0 && (
        <>
          <p style={{ margin: '12px 0' }}>You have no orders yet.</p>
          <Link to="/" className="back-link">Start shopping</Link>
        </>
      )}
      <div className="cart-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-head">
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              <strong>₹{order.totalPrice}</strong>
            </div>
            {order.items.map((item) => (
              <div key={item._id} className="order-item">
                <img src={item.image} alt={item.name} />
                <span>{item.name} × {item.qty}</span>
              </div>
            ))}
            <p className="order-status">Paid</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersPage;