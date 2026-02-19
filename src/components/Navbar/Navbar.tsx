import Text from 'components/Text';
import './navbar.scss';

const Navbar: React.FC<{}> = () => {
  return (
    <div className="navbar">
      <div className="shop-logo">
        <img className="logo"></img>
        <Text>KTS</Text>
      </div>
      <div className="navigation-links">
        <Text>Products</Text>
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
