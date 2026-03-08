import { getCart, addToCart, removeFromCart } from 'entities/Cart/api';
import { makeAutoObservable, runInAction } from 'mobx';

import { CartItemModel } from './CartItemModel';

class CartStore {
  cart: CartItemModel[] = [];
  isLoading = true;
  error: string | null = null;

  isInitialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  getCartSize(): number {
    let totalCount = 0;
    for (const item of this.cart) {
      totalCount += item.quantity;
    }
    return totalCount;
  }

  getShippingPrice(): number {
    const shipping = this.getTotalPrice() > 100 ? 0 : 9.99;
    return shipping;
  }

  getTotalPrice(): number {
    let totalPrice = 0;
    for (const item of this.cart) {
      totalPrice += item.totalPrice;
    }
    return totalPrice;
  }

  getPriceWithShipping(): number {
    const finalCost = this.getTotalPrice() + this.getShippingPrice();
    return finalCost;
  }

  get items() {
    return this.cart;
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  async getCart() {
    try {
      const cart = await getCart();
      runInAction(() => {
        this.cart = cart.map((item) => new CartItemModel(item));
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : String(error);
      });
      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async addToCart(productId: number, quantity: number) {
    try {
      await addToCart(productId, quantity);
      await this.getCart();
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : String(error);
      });
      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async removeFromCart(productId: number, quantity: number) {
    try {
      await removeFromCart(productId, quantity);
      await this.getCart();
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : String(error);
      });
      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async initialize() {
    if (this.isInitialized) return;
    await Promise.all([this.getCart()]);
    this.isInitialized = true;
  }
}

export const cartStore = new CartStore();

export { CartStore };
