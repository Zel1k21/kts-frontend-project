import Text from 'components/Text';
import routes from 'config/routes';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from 'store/StoreContext';

import styles from './navbar.module.scss';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useStore().user;

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogin = () => {
    user.login('email.my@gmail.com', 'Password123');
  };

  const handleLogout = () => {
    user.logout();
  };

  return (
    <div className={styles.navbar}>
      <div className={styles['shop-logo']}>
        <img className={styles.logo} />
        <Text>KTS</Text>
      </div>

      <div className={styles['navigation-links']}>
        <Link to={routes.products.mask}>Products</Link>
        <Text>Categories</Text>
        <Text>About</Text>
      </div>

      <div className={styles['profile-links']}>
        <Link to={routes.cart.mask}>Cart</Link>
        <button onClick={user.getIsAuthenticated() ? handleLogin : handleLogout}>Profile</button>
      </div>

      <button className={styles['burger-btn']} onClick={toggleMenu} aria-label="Toggle menu">
        <span className={styles['burger-line']} />
        <span className={styles['burger-line']} />
        <span className={styles['burger-line']} />
      </button>

      <div
        className={`${styles['mobile-menu']} ${isMobileMenuOpen ? styles['mobile-menu-open'] : ''}`}
      >
        <div className={styles['mobile-links']}>
          <Link className={styles['mobile-link']} to={routes.products.mask} onClick={toggleMenu}>
            Products
          </Link>
          <Text className={styles['mobile-link']}>Categories</Text>
          <Text className={styles['mobile-link']}>About</Text>
          <Text className={styles['mobile-link']}>Cart</Text>
          <Text className={styles['mobile-link']}>Profile</Text>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
