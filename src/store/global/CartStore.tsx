import { getCart, addToCart, removeFromCart } from 'entities/Cart/api';
import type { CartItem } from 'entities/Cart/types';
import { makeAutoObservable, runInAction } from 'mobx';

class CartStore {
  cart: CartItem[] = [];
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

  getTotalPrice(): number {
    let totalPrise = 0;
    for (const item of this.cart) {
      totalPrise += item.product.price * item.quantity;
    }
    return totalPrise;
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
        this.cart = cart;
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
