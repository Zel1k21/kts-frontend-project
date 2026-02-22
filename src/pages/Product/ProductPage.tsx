import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import type { Product, ProductsResponse } from 'entities/Product/types';
import { getRandomProducts, getProduct } from 'entities/Product/api';
import { ProductList } from 'components/ProductList/ProductList';
import './productPage.scss';
import Text from 'components/Text';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      const response: ProductsResponse = await getRandomProducts(12, id);
      setRelatedProducts(response.data);
    } catch (err) {
      setRelatedProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getProduct(id);
        const productData = Array.isArray(response.data) ? response.data[0] : response.data;
        setProduct(productData);
        setError(null);
      } catch (error) {
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const nextImage = useCallback(() => {
    const images = product?.images;
    if (!images || images.length === 0) return;

    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [product?.images]);

  const prevImage = useCallback(() => {
    const images = product?.images;
    if (!images || images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [product?.images]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleBuyNow = () => {
    console.log('Buy now:', product);
  };

  const handleProductClick = useCallback((product: Product) => {
    navigate(`/products/${product.documentId}`);
  }, []);

  const handleAddToCart = () => {
    console.log('Add to cart:', product);
  };

  const currentImage = product?.images?.[currentImageIndex];

  if (loading) {
    return (
      <div className="product-page loading">
        <div className="product-page-loader">Загрузка...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-page error">
        <button className="product-page__back-btn" onClick={handleBack}>
          ← Назад
        </button>
        <div className="product-page-error">
          <h2>Ошибка</h2>
          <p>{error || 'Товар не найден'}</p>
          <button onClick={() => navigate('/products')}>Вернуться в каталог</button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <button className="product-page__back-btn" onClick={handleBack}>
        ← Назад
      </button>

      <div className="product-page__container">
        <div className="product-page__gallery">
          <div className="product-page__main-image">
            <img
              src={currentImage?.url}
              alt={product.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.jpg';
              }}
            />

            {product.images && product.images.length > 1 && (
              <>
                <button
                  className="product-page__nav-btn product-page__nav-btn--prev"
                  onClick={prevImage}
                  aria-label="Предыдущее изображение"
                >
                  ‹
                </button>
                <button
                  className="product-page__nav-btn product-page__nav-btn--next"
                  onClick={nextImage}
                  aria-label="Следующее изображение"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="product-page__thumbnails">
              {product.images.map((image, index) => (
                <button
                  key={image.id || index}
                  className={`product-page__thumbnail ${
                    index === currentImageIndex ? 'active' : ''
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`Изображение ${index + 1}`}
                >
                  <img
                    src={`${image.url}`}
                    alt={`${product.title} ${index + 1}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Информация о товаре */}
        <div className="product-page__info">
          <h1 className="product-page__title">{product.title}</h1>

          <p className="product-page__description">{product.description}</p>

          <div className="product-page__price-block">
            <span className="product-page__price">${product.price}</span>

            {product.discountPercent > 0 && (
              <span className="product-page__discount">-{product.discountPercent}%</span>
            )}
          </div>

          {/* Рейтинг */}
          {product.rating > 0 && (
            <div className="product-page__rating">
              <span className="product-page__rating-stars">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </span>
              <span className="product-page__rating-value">{product.rating}</span>
            </div>
          )}

          {/* Категория */}
          {product.productCategory && (
            <div className="product-page__category">
              Категория: <strong>{product.productCategory.title}</strong>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="product-page__actions">
            <button
              className="product-page__btn product-page__btn--buy"
              onClick={handleBuyNow}
              disabled={!product.isInStock}
            >
              Купить
            </button>
            <button
              className="product-page__btn product-page__btn--cart"
              onClick={handleAddToCart}
              disabled={!product.isInStock}
            >
              В корзину
            </button>
          </div>
        </div>
      </div>
      <div className="product-page__related-products">
        <Text tag="h2" weight="bold" className="product-page__related-products-title">
          Вам также могут понравиться:{' '}
        </Text>
        <ProductList
          isWidget={true}
          products={relatedProducts}
          onProductClick={(product) => handleProductClick(product)}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default ProductPage;
