import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Header() {
  const { totalItems } = useCart();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          My Store
        </Link>
        <Link to="/cart" className="cart-link">
          Cart ({totalItems})
        </Link>
      </div>
    </header>
  );
}

export default Header;