import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function OrderSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('loading');
  const confirmed = useRef(false);

  useEffect(() => {
    if (!sessionId || !user || confirmed.current) return;
    confirmed.current = true;

    axios
      .post(
        'http://localhost:5000/api/orders/confirm',
        { sessionId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then(() => {
        clearCart();
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [sessionId, user, clearCart]);

  return (
    <div className="container">
      {status === 'loading' && <h2>Confirming your payment...</h2>}
      {status === 'success' && (
        <>
          <h2>Thank you! Your order is confirmed.</h2>
          <p style={{ margin: '12px 0' }}>Your payment was successful.</p>
          <Link to="/" className="back-link">Continue shopping</Link>
        </>
      )}
      {status === 'error' && (
        <>
          <h2>Something went wrong</h2>
          <p style={{ margin: '12px 0' }}>We could not confirm your payment.</p>
          <Link to="/cart" className="back-link">Back to cart</Link>
        </>
      )}
    </div>
  );
}

export default OrderSuccessPage;