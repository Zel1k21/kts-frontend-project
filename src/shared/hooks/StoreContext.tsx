import React, { createContext, useContext } from 'react';
import { productStore } from 'store/ProductStore';

type IStore = {
  products: typeof productStore;
};

export const StoreContext = createContext<IStore | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StoreContext.Provider value={{ products: productStore }}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used within StoreProvider');
  return store;
};
