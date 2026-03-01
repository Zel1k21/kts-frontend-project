import React, { createContext, useContext } from 'react';
import { cartStore } from 'store/CartStore';
import { ProductStore } from 'store/ProductPageStore';
import { ProductsStore } from 'store/ProductsPageStore';
import { UserStore } from 'store/UserStore';

type IStore = {
  products: typeof ProductsStore;
  product: typeof ProductStore;
  user: typeof UserStore;
  cart: typeof cartStore;
};

export const StoreContext = createContext<IStore | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StoreContext.Provider
      value={{ products: ProductsStore, product: ProductStore, user: UserStore, cart: cartStore }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used within StoreProvider');
  return store;
};
