import { CategoryFilter } from 'components/CategoryFilter';
import Pagination from 'components/Pagination';
import { ProductList } from 'components/ProductList/ProductList';
import Text from 'components/Text';
import { getProductCategories, getProducts } from 'entities/Product/api';
import type { Product, ProductsResponse, ProductCategory } from 'entities/Product/types';
import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { ProductSearch } from './ProductSearch';

import './productsPage.scss';

const PAGE_SIZE = 4;

export const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [productsCount, setProductsCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const fetchCategories = useCallback(async () => {
    const uniqueCategories: ProductCategory[] = await getProductCategories({
      populate: ['productCategory', 'images'],
    });

    uniqueCategories.sort((a, b) => a.title.localeCompare(b.title));
    setCategories(uniqueCategories);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filters: Record<string, unknown> = {};

      if (selectedCategoryId) {
        filters.productCategory = {
          title: {
            $eq: selectedCategoryId,
          },
        };
      }

      if (searchQuery) {
        filters.title = { $containsi: searchQuery };
      }

      const response: ProductsResponse = await getProducts({
        page: currentPage,
        pageSize: PAGE_SIZE,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        populate: ['productCategory', 'images'],
        sort: 'createdAt:desc',
      });

      setProducts(response.data);
      setTotalPages(response.meta.pagination.pageCount);
      setProductsCount(response.meta.pagination.total);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategoryId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Поиск сбрасывает пагинацию
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Плавный скролл к началу списка
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  }, []);

  const handleProductClick = useCallback(
    (product: Product) => {
      navigate(`/products/${product.documentId}`);
    },
    [navigate]
  );

  const handleAddToCart = useCallback(() => {
    // console.log('Added to cart:', product); change
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

        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategoryId}
            onSelectCategory={handleCategorySelect}
          />
        )}
      </div>
      <Text view="p-20" weight="bold" className="products-count">
        Всего товаров: {productsCount}
      </Text>

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
