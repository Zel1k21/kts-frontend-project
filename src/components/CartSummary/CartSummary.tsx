import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'shared/hooks/StoreContext';

import styles from './CartSummary.module.scss';

export const CartSummary = observer(() => {
  const navigate = useNavigate();
  const user = useStore().user;
  const cart = useStore().cart;

  const handleCheckout = () => {
    if (!user.isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const subtotal = cart.getTotalPrice();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className={styles['cart-summary']}>
      <h2>Order Summary</h2>

      <div className={styles['cart-summary__row']}>
        <span>Subtotal ({cart.getCartSize()} items)</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className={styles['cart-summary__row']}>
        <span>Shipping</span>
        <span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
      </div>

      {shipping === 0 && (
        <p className={styles['free-shipping-message']}>🎉 You qualify for free shipping!</p>
      )}

      <div className={styles['cart-summary__divider']} />

      <div className={styles['cart-summary__row cart-summary__total']}>
        <span>Total</span>
        <span>${total}</span>
      </div>

      <button onClick={handleCheckout} className={styles['checkout-btn']} disabled={cart.isLoading}>
        {cart.isLoading ? 'Processing...' : 'Proceed to Checkout'}
      </button>

      <div className={styles['trust-badges']}>
        <p>🔒 Secure Checkout</p>
        <p>✓ 30-day returns</p>
      </div>
    </div>
  );
});
