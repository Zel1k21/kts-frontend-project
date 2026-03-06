import CartItem from 'components/CartItem';
import { CartSummary } from 'components/CartSummary/CartSummary';
import Loader from 'components/Loader';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from 'shared/hooks/StoreContext';

import styles from './CartPage.module.scss';

export const CartPage = observer(() => {
  const { cart } = useStore();

  useEffect(() => {
    cart.initialize();
  }, [cart]);

  if (cart.isLoading) {
    return (
      <div className={styles['cart-loading']}>
        <Loader size="l" />
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (cart.error) {
    return (
      <div className={styles['cart-error']}>
        <h2>Oops! Something went wrong</h2>
        <p>{cart.error}</p>
        <button onClick={() => cart.getCart()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className={styles['cart-page']}>
      <div className={styles['cart-page__container']}>
        <h1 className={styles['cart-title']}>Shopping Cart ({cart.getCartSize()})</h1>

        <div className={styles['cart-page__content']}>
          <div className={styles['cart-page__items']}>
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className={styles['cart-page__sidebar']}>
            <CartSummary />

            <Link to="/products" className={styles['continue-shopping']}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});
