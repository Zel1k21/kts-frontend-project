import React, { useCallback, useState, useEffect } from 'react';
import { ProductSearch } from './ProductSearch';
import { getProducts } from 'entities/Product/api';
import type { Product, ProductsResponse } from 'entities/Product/types';
import { ProductList } from './ProductList';
import Pagination from 'components/Pagination';
import './productPage.scss';

const PAGE_SIZE = 3;

export const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: ProductsResponse = await getProducts({
        page: currentPage,
        pageSize: PAGE_SIZE,
        // Добавляем поиск по названию, если есть query
        ...(searchQuery && {
          filters: {
            title: { $containsi: searchQuery },
          },
        }),
        sort: 'createdAt:desc',
      });

      setProducts(response.data);
      setTotalPages(response.meta.pagination.pageCount);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Не удалось загрузить товары. Попробуйте позже.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Поиск сбрасывает пагинацию
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Плавный скролл к началу списка
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleProductClick = useCallback((product: Product) => {
    console.log('Clicked product:', product); // change
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    console.log('Added to cart:', product); // change
  }, []);

  if (loading && currentPage === 1 && products.length === 0) {
    return <div className="products-page-loader">Загрузка...</div>;
  }

  if (error && products.length === 0) {
    return (
      <div className="products-page-error">
        <p>{error}</p>
        <button onClick={() => fetchProducts()}>Повторить</button>
      </div>
    );
  }

  return (
    <div className="products-page">
      <header className="products-page-header">
        <h1>Каталог товаров</h1>
      </header>

      <div className="product-page-filters">
        <ProductSearch
          className="product-page-search"
          onSearch={handleSearch}
          initialValue={searchQuery}
          placeholder="Найти товары..."
        />
      </div>

      <ProductList
        products={products}
        onProductClick={handleProductClick}
        onAddToCart={handleAddToCart}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
          delta={2}
        />
      )}
    </div>
  );
};

export default ProductsPage;
