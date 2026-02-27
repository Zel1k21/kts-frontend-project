import { ProductList } from 'components/ProductList/ProductList';
import Text from 'components/Text';
import type { Product } from 'entities/Product/types';
import { observer } from 'mobx-react-lite';
import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from 'shared/hooks/StoreContext';

import './productPage.scss';

export const ProductPage: React.FC = observer(() => {
  const store = useStore().product;
  const product = store.product;
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    store.setProductId(productId);
    store.initialize();
    store.setProductImages(product?.images || []);
  }, [productId, store, product?.images]);

  const nextImage = useCallback(() => {
    store.setCurrentImageIndex((store.currentImageIndex + 1) % store.productImages.length);
  }, [store]);

  const prevImage = useCallback(() => {
    store.setCurrentImageIndex(
      (store.currentImageIndex - 1 + store.productImages.length) % store.productImages.length
    );
  }, [store]);

  const handleBack = () => {
    window.history.back();
  };

  const handleProductClick = (product: Product) => {
    navigate(`/products/${product.documentId}`);
  };

  const currentImage = store.product?.images?.[store.currentImageIndex];

  if (product === null) {
    return null;
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
                    index === store.currentImageIndex ? 'active' : ''
                  }`}
                  onClick={() => store.setCurrentImageIndex(index)}
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
              // onClick={handleBuyNow}
              disabled={!product.isInStock}
            >
              Купить
            </button>
            <button
              className="product-page__btn product-page__btn--cart"
              // onClick={handleAddToCart}
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
          products={store.relatedProducts}
          onProductClick={(product) => handleProductClick(product)}
          // onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
});

export default ProductPage;
