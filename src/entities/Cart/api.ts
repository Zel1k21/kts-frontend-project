import { api } from 'shared/utils/api';

import type { CartItem } from './types';

export const getCart = async (): Promise<CartItem[]> => {
  const response = await api.get<CartItem[]>('/cart');
  return response.data;
};

export const addToCart = async (product: number, quantity: number): Promise<void> => {
  await api.post('/cart/add', { product, quantity: quantity });
  return;
};

export const removeFromCart = async (product: number, quantity: number): Promise<void> => {
  await api.post('/cart/remove', { product, quantity });
  return;
};
