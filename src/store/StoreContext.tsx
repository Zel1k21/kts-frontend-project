import React, { createContext, useContext } from 'react';
import { cartStore, UserStore } from 'store/global';
import { createProductPageStore, createProductsPageStore } from 'store/local';

type IStore = {
  // Создание локальных хранилищ
  createProductPageStore: typeof createProductPageStore;
  createProductsPageStore: typeof createProductsPageStore;

  // Глобальные хранилища
  user: typeof UserStore;
  cart: typeof cartStore;
};

export const StoreContext = createContext<IStore | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StoreContext.Provider
      value={{
        createProductPageStore,
        createProductsPageStore,
        user: UserStore,
        cart: cartStore,
      }}
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

export const useCartStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useCartStore must be used within StoreProvider');
  return store.cart;
};

export const useUserStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useCartStore must be used within StoreProvider');
  return store.user;
};
