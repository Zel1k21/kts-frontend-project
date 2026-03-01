import CategoryFilter from 'components/CategoryFilter';
import Pagination from 'components/Pagination';
import ProductList from 'components/ProductList';
import Text from 'components/Text';
import type { Product } from 'entities/Product/types';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'shared/hooks/StoreContext';
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
  const store = useStore();
  const products = store.products;
  const cart = store.cart;
  const navigate = useNavigate();

  const [query, setQuery] = useQueryParams(queryConfig);

  // Инициализация при первом рендере
  useEffect(() => {
    products.applyUrlParams({
      // Синхронизируем параметры запроса с сохраненным состоянием
      page: query.page,
      search: query.search,
      category: query.category,
      sort: query.sort,
    });

    products.initialize();
  });

  // Реакция на изменение параметров запроса
  useEffect(() => {
    if (products.isInitialized) {
      products.applyUrlParams({
        page: query.page,
        search: query.search,
        category: query.category,
        sort: query.sort,
      });
      products.fetchProducts();
    }
  }, [query.page, query.search, query.category, query.sort, products]);

  // Обработка сброса страницы при пустом ответе
  useEffect(() => {
    if (products.pageWasReset) {
      setQuery({ page: 1 }, 'replaceIn'); // Заменяем номер страницы на 1
      runInAction(() => {
        products.pageWasReset = false;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [products.pageWasReset, products, setQuery]);

  // Обработчик поиска
  const handleSearch = (query: string) => {
    products.setSearchQuery(query);
    setQuery({ search: query || undefined }, 'replaceIn');
  };

  // Обработчик смены страницы
  const handlePageChange = (page: number) => {
    products.setCurrentPage(page);
    setQuery({ page }, 'replaceIn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Обработчик выбора категории
  const handleCategorySelect = (categoryTitle: string | null) => {
    products.setSelectedCategoryTitle(categoryTitle);
    setQuery({ category: categoryTitle || undefined }, 'replaceIn');
  };

  // Обработчик нажатия на карточку
  const handleProductClick = (product: Product) => {
    navigate(`/products/${product.documentId}`);
  };

  // Обработчик добавления в корзину
  const handleAddToCart = (product: Product, quantity: number) => {
    cart.addToCart(product.id, quantity);
  };

  // Плейсхолдер загрузки
  if (products.loading && !products.hasProducts) {
    return <div className={styles['products-page__loader']}>Загрузка товаров...</div>;
  }

  // Обработчик ошибки
  if (products.error && !products.hasProducts) {
    return (
      <div className={styles['products-page__error']}>
        <p>{products.error}</p>
        <button onClick={() => products.fetchProducts()}>Повторить</button>
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
          initialValue={products.searchQuery}
          placeholder="Найти товары..."
        />

        {products.categories.length > 0 && (
          <CategoryFilter
            categories={products.categories}
            selectedCategory={products.selectedCategoryTitle}
            onSelectCategory={handleCategorySelect}
          />
        )}
      </div>
      <Text view="p-20" weight="bold" className={styles['products-page__products-count']}>
        Всего товаров: {products.productsCount}
      </Text>

      <ProductList
        products={products.productsList}
        onProductClick={handleProductClick}
        onAddToCart={handleAddToCart}
      />

      {products.totalPages > 1 && (
        <Pagination
          currentPage={products.currentPage}
          totalPages={products.totalPages}
          pageSize={products.pageSize}
          onPageChange={handlePageChange}
          delta={2}
        />
      )}
    </div>
  );
});

export default ProductsPage;
