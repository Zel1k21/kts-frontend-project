import Text from 'components/Text';
import './navbar.scss';
import { Link } from 'react-router';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="shop-logo">
        <img className="logo" />
        <Text>KTS</Text>
      </div>
      <div className="navigation-links">
        <Link to="/products">Products</Link>
        <Text>Categories</Text>
        <Text>About</Text>
      </div>
      <div className="profile-links">
        <Text>Cart</Text>
        <Text>Profile</Text>
      </div>
    </div>
  );
};

export default Navbar;
