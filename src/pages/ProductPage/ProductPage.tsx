import Loader from 'components/Loader/Loader';
import { ProductList } from 'components/ProductList/ProductList';
import Text from 'components/Text';
import type { Product } from 'entities/Product/types';
import { observer } from 'mobx-react-lite';
import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from 'shared/hooks/StoreContext';

import styles from './productPage.module.scss';

export const ProductPage: React.FC = observer(() => {
  const store = useStore().product;
  const product = store.product;
  const cart = useStore().cart;
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (productId) {
      store.initialize(productId);
    }
  }, [productId, store]);

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
    store.fetchProduct(product.documentId);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    cart.addToCart(product.id, quantity);
  };

  const currentImage = store.product?.images?.[store.currentImageIndex];

  if (store.loading && product === null) {
    return (
      <div className={styles['product-loading']}>
        <Loader size="l" />
        <p>Loading product...</p>
      </div>
    );
  }

  if (store.error) {
    return (
      <div className={styles['store-error']}>
        <h2>Oops! Something went wrong</h2>
        <p>{store.error}</p>
        <button onClick={() => productId && store.initialize(productId)}>Try Again</button>
      </div>
    );
  }

  if (product === null) {
    return null;
  }

  return (
    <div className={styles['product-page']}>
      <button className={styles['product-page__back-btn']} onClick={handleBack}>
        ← Назад
      </button>

      <div className={styles['product-page__container']}>
        <div className={styles['product-page__gallery']}>
          <div className={styles['product-page__main-image']}>
            <img src={currentImage?.url} alt={product.title} />

            {product.images && product.images.length > 1 && (
              <>
                <button
                  className={styles['product-page__nav-btn product-page__nav-btn--prev']}
                  onClick={prevImage}
                  aria-label="Предыдущее изображение"
                >
                  ‹
                </button>
                <button
                  className={styles['product-page__nav-btn product-page__nav-btn--next']}
                  onClick={nextImage}
                  aria-label="Следующее изображение"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className={styles['product-page__thumbnails']}>
              {product.images.map((image, index) => (
                <button
                  key={image.id || index}
                  className={`${styles['product-page__thumbnail']} ${
                    index === store.currentImageIndex
                      ? styles['product-page__thumbnail_active']
                      : ''
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
        <div className={styles['product-page__info']}>
          <h1 className={styles['product-page__title']}>{product.title}</h1>

          <p className={styles['product-page__description']}>{product.description}</p>

          <div className={styles['product-page__price-block']}>
            <span className={styles['product-page__price']}>${product.price}</span>

            {product.discountPercent > 0 && (
              <span className={styles['product-page__discount']}>-{product.discountPercent}%</span>
            )}
          </div>

          {/* Рейтинг */}
          {product.rating > 0 && (
            <div className={styles['product-page__rating']}>
              <span className={styles['product-page__rating-stars']}>
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </span>
              <span className={styles['product-page__rating-value']}>{product.rating}</span>
            </div>
          )}

          {/* Категория */}
          {product.productCategory && (
            <div className={styles['product-page__category']}>
              Категория: <strong>{product.productCategory.title}</strong>
            </div>
          )}

          {/* Кнопки действий */}
          <div className={styles['product-page__actions']}>
            <button
              className={styles['product-page__btn'] + ' ' + styles['product-page__btn--buy']}
              // onClick={handleBuyNow}
              disabled={!product.isInStock}
            >
              Купить
            </button>
            <button
              className={styles['product-page__btn'] + ' ' + styles['product-page__btn--cart']}
              onClick={() => handleAddToCart(product, 1)}
              disabled={!product.isInStock}
            >
              В корзину
            </button>
          </div>
        </div>
      </div>
      <div className={styles['product-page__related-products']}>
        <Text tag="h2" weight="bold" className={styles['product-page__related-products-title']}>
          Вам также могут понравиться:{' '}
        </Text>
        <ProductList
          isWidget={true}
          products={store.relatedProducts}
          onProductClick={(product) => handleProductClick(product)}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
});

export default ProductPage;
