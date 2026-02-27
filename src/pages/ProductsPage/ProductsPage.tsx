import { useNavigate } from 'react-router-dom';
import { runInAction } from 'mobx';

import { observer } from 'mobx-react-lite';
import { useStore } from 'shared/hooks/StoreContext';
import type { Product } from 'entities/Product/types';
import ProductSearch from './ProductSearch';
import CategoryFilter from 'components/CategoryFilter';
import ProductList from 'components/ProductList';
import Pagination from 'components/Pagination';
import Text from 'components/Text';
import { useEffect } from 'react';
import { useQueryParams, withDefault, NumberParam, StringParam } from 'use-query-params';

import './ProductsPage.scss';

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
  }, []);

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
  }, [query.page, query.search, query.category, query.sort]);

  // Обработка сброса страницы при пустом ответе
  useEffect(() => {
    if (products.pageWasReset) {
      setQuery({ page: 1 }, 'replaceIn'); // Заменяем номер страницы на 1
      runInAction(() => {
        products.pageWasReset = false;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [products.pageWasReset]);

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

  // Плейсхолдер загрузки
  if (products.loading && !products.hasProducts) {
    return <div className="products-page-loader">Загрузка товаров...</div>;
  }

  // Обработчик ошибки
  if (products.error && !products.hasProducts) {
    return (
      <div className="products-page-error">
        <p>{products.error}</p>
        <button onClick={() => products.fetchProducts()}>Повторить</button>
      </div>
    );
  }

  return (
    <div className="products-page">
      <header className="products-page-header">
        <h1>Каталог товаров</h1>
      </header>

      <div className="products-page-filters">
        <ProductSearch
          className="product-page-search"
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
      <Text view="p-20" weight="bold" className="products-count">
        Всего товаров: {products.productsCount}
      </Text>

      <ProductList
        products={products.productsList}
        onProductClick={handleProductClick}
        // onAddToCart={handleAddToCart}
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
