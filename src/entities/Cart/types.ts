import type { Product } from 'entities/Product/types';

export type CartItem = {
  id: number;
  documentId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  originalProductId: number;
  product: Product;
};

export type Cart = {
  size: number;
  items: CartItem[];
  totalPrice: number;
};

export type CartRequest = {
  authToken: string;
};

export type ItemAmountChange = {
  authToken: string;
  productId: number;
  quantity: number;
  reduce?: boolean;
};
