// Главный индексный файл для хранилищ
// Экспорт глобальных и локальных хранилищ

// Глобальные хранилища (синглтоны)
export { cartStore, UserStore } from './global';
export type { CartStore, UserStoreType } from './global';

// Локальные хранилища (фабрики и типы)
export { createProductPageStore, createProductsPageStore } from './local';
export type { ProductPageStore, ProductsPageStore, ProductQueryParams } from './local';

// Утилиты для работы с хранилищами
export { StoreProvider, useStore } from './StoreContext';
