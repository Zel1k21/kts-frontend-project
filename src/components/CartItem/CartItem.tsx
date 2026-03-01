import Cross from 'assets/cross.svg?react';
import type { CartItem as CartItemType } from 'entities/Cart/types';
import { observer } from 'mobx-react-lite';
import { useStore } from 'shared/hooks/StoreContext';

import styles from './CartItem.module.scss';

type CartItemProps = {
  item: CartItemType;
};

export const CartItem = observer(({ item }: CartItemProps) => {
  const cart = useStore().cart;

  const handleAddToCart = (product: number, quantity: number) => {
    cart.addToCart(product, quantity);
  };

  const handleDecreaseAmount = (product: number, quantity: number) => {
    cart.removeFromCart(product, quantity);
  };

  const handleRemove = () => {
    if (confirm('Remove this item from cart?')) {
      cart.removeFromCart(item.originalProductId, item.quantity);
    }
  };

  return (
    <div className={styles['cart-item']}>
      <div className={styles['cart-item__image']}>
        <img src={item.product.images?.[0]?.url || '/placeholder.png'} />
      </div>

      <div className={styles['cart-item__details']}>
        <h3 className={styles['cart-item__name']}>{item.product.title}</h3>
        <p className={styles['cart-item__price']}>${item.product.price}</p>
      </div>

      <div className={styles['cart-item__quantity']}>
        <div className={styles['cart-item__quantity-controls']}>
          <button
            onClick={() => handleDecreaseAmount(item.originalProductId, 1)}
            disabled={item.quantity <= 1}
            className={styles['cart-item__quantity-controls__btn']}
          >
            −
          </button>
          <div className={styles['cart-item__quantity-controls__input']}>{item.quantity} </div>
          <button
            onClick={() => handleAddToCart(item.originalProductId, 1)}
            className={styles['cart-item__quantity-controls__btn']}
          >
            +
          </button>
        </div>
      </div>

      <div className={styles['cart-item__total']}>
        <p>${item.product.price * item.quantity}</p>
      </div>

      <button onClick={handleRemove} className={styles['cart-item__remove']}>
        <Cross />
      </button>
    </div>
  );
});

export default CartItem;
