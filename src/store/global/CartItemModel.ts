import type { CartItem } from 'entities/Cart/types';
import type { Product } from 'entities/Product/types';
import { makeAutoObservable } from 'mobx';

export class CartItemModel {
  id: number;
  documentId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  originalProductId: number;
  product: Product;

  constructor(data: CartItem) {
    this.id = data.id;
    this.documentId = data.documentId;
    this.quantity = data.quantity;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.originalProductId = data.originalProductId;
    this.product = data.product;

    makeAutoObservable(this);
  }

  get totalPrice(): number {
    return this.product.price * this.quantity;
  }
}
