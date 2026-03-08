import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useCartStore, useUserStore } from 'store/StoreContext';

import styles from './CartSummary.module.scss';

export const CartSummary = observer(() => {
  const navigate = useNavigate();
  const user = useUserStore();
  const cart = useCartStore();

  const handleCheckout = () => {
    if (!user.isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className={styles['cart-summary']}>
      <h2>Order Summary</h2>

      <div className={styles['cart-summary__row']}>
        <span>Subtotal ({cart.getCartSize()} items)</span>
        <span>${cart.getTotalPrice().toFixed(2)}</span>
      </div>

      <div className={styles['cart-summary__row']}>
        <span>Shipping</span>
        <span>{cart.getShippingPrice() === 0 ? 'FREE' : `$${cart.getShippingPrice()}`}</span>
      </div>

      {cart.getShippingPrice() === 0 && (
        <p className={styles['free-shipping-message']}>🎉 You qualify for free shipping!</p>
      )}

      <div className={styles['cart-summary__divider']} />

      <div className={styles['cart-summary__row']}>
        <span className={styles['total-label']}>Total:</span>
        <span>${cart.getPriceWithShipping()}</span>
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
