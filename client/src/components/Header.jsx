import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          My Store
        </Link>
        <nav className="nav-links">
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">
              Log in
            </Link>
          )}
          <Link to="/cart" className="cart-link">
            Cart ({totalItems})
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;