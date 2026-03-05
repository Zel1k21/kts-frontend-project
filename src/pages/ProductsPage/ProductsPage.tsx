import CategoryFilter from 'components/CategoryFilter';
import Loader from 'components/Loader';
import Pagination from 'components/Pagination';
import ProductList from 'components/ProductList';
import Text from 'components/Text';
import type { Product } from 'entities/Product/types';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'shared/hooks/StoreContext';
import type { ProductsPageStore } from 'store/local';
import { useQueryParams, withDefault, NumberParam, StringParam } from 'use-query-params';

import ProductSearch from './ProductSearch';
import styles from './productsPage.module.scss';

// Конфигурация параметров запроса
const queryConfig = {
  page: withDefault(NumberParam, 1),
  search: withDefault(StringParam, ''),
  category: withDefault(StringParam, null),
  sort: withDefault(StringParam, 'createdAt:desc'),
};

export const ProductsPage: React.FC = observer(() => {
  const storeContext = useStore();
  const [productsStore, setProductsStore] = useState<ProductsPageStore | null>(null);
  const cart = storeContext.cart;
  const navigate = useNavigate();

  const [query, setQuery] = useQueryParams(queryConfig);

  // Локальное хранилище при монтировании компонента
  useEffect(() => {
    const newStore = storeContext.createProductsPageStore();
    setProductsStore(newStore);

    return () => {
      newStore.dispose();
    };
  }, [storeContext]);

  useEffect(() => {
    if (productsStore) {
      productsStore.applyUrlParams({
        page: query.page,
        search: query.search,
        category: query.category,
        sort: query.sort,
      });

      productsStore.initialize();
    }
  }, [productsStore, query.page, query.search, query.category, query.sort]);

  // Реакция на изменение параметров запроса
  useEffect(() => {
    if (productsStore?.isInitialized) {
      productsStore.applyUrlParams({
        page: query.page,
        search: query.search,
        category: query.category,
        sort: query.sort,
      });
      productsStore.fetchProducts();
    }
  }, [query.page, query.search, query.category, query.sort, productsStore]);

  // Обработка сброса страницы при пустом ответе
  useEffect(() => {
    if (productsStore?.pageWasReset) {
      setQuery({ page: 1 }, 'replaceIn'); // Заменяем номер страницы на 1
      runInAction(() => {
        productsStore.pageWasReset = false;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [productsStore, productsStore?.pageWasReset, setQuery]);

  // Обработчик поиска
  const handleSearch = (query: string) => {
    if (productsStore) {
      productsStore.setSearchQuery(query);
      setQuery({ search: query || undefined }, 'replaceIn');
    }
  };

  // Обработчик смены страницы
  const handlePageChange = (page: number) => {
    if (productsStore) {
      productsStore.setCurrentPage(page);
      setQuery({ page }, 'replaceIn');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Обработчик выбора категории
  const handleCategorySelect = (categoryTitle: string | null) => {
    if (productsStore) {
      productsStore.setSelectedCategoryTitle(categoryTitle);
      setQuery({ category: categoryTitle || undefined }, 'replaceIn');
    }
  };

  // Обработчик нажатия на карточку
  const handleProductClick = (product: Product) => {
    navigate(`/products/${product.documentId}`);
  };

  // Обработчик добавления в корзину
  const handleAddToCart = (product: Product, quantity: number) => {
    cart.addToCart(product.id, quantity);
  };

  if (!productsStore) {
    return (
      <div className={styles['products-loading']}>
        <Loader size="l" />
        <p>Initializing...</p>
      </div>
    );
  }

  if (productsStore.loading) {
    return (
      <div className={styles['products-loading']}>
        <Loader size="l" />
        <p>Loading products...</p>
      </div>
    );
  }

  if (productsStore.error) {
    return (
      <div className={styles['products-error']}>
        <h2>Oops! Something went wrong</h2>
        <p>{productsStore.error}</p>
        <button onClick={() => productsStore.fetchProducts()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className={styles['products-page']}>
      <header className={styles['products-page__header']}>
        <h1>Каталог товаров</h1>
      </header>

      <div className={styles['products-page__filters']}>
        <ProductSearch
          className={styles['products-page__search']}
          onSearch={handleSearch}
          initialValue={productsStore.searchQuery}
          placeholder="Найти товары..."
        />

        {productsStore.categories.length > 0 && (
          <CategoryFilter
            categories={productsStore.categories}
            selectedCategory={productsStore.selectedCategoryTitle}
            onSelectCategory={handleCategorySelect}
          />
        )}
      </div>
      <Text view="p-20" weight="bold" className={styles['products-page__products-count']}>
        Всего товаров: {productsStore.productsCount}
      </Text>

      <ProductList
        products={productsStore.productsList}
        onProductClick={handleProductClick}
        onAddToCart={handleAddToCart}
      />

      {productsStore.totalPages > 1 && (
        <Pagination
          currentPage={productsStore.currentPage}
          totalPages={productsStore.totalPages}
          pageSize={productsStore.pageSize}
          onPageChange={handlePageChange}
          delta={2}
        />
      )}
    </div>
  );
});

export default ProductsPage;
