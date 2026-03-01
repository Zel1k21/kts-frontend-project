import Button from 'components/Button';
import Card, { type CardProps } from 'components/Card';
import { type Product } from 'entities/Product/types';
import React, { useCallback, useRef } from 'react';

import styles from './productList.module.scss';

type ProductListProps = {
  products: Product[];
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  isWidget?: boolean;
  className?: string;
};

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductClick,
  onAddToCart,
  isWidget = false,
  className,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const quantity = 1;

  const mapProductToCartProps = (product: Product): CardProps => {
    const imageUrl = product.images?.[0]?.url || '/placeholder-product.jpg';
    const category = product.productCategory?.title;

    return {
      image: imageUrl,
      title: product.title,
      subtitle: product.description,
      captionSlot: category,
      contentSlot: '$' + product.price,
      actionSlot: onAddToCart && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product, quantity);
          }}
        >
          В корзину
        </Button>
      ),
      onClick: onProductClick ? () => onProductClick(product) : undefined,
      className: styles['product-card'],
    };
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isWidget || !scrollContainerRef.current) return;
      isDragging.current = true;
      startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
      scrollLeft.current = scrollContainerRef.current.scrollLeft;
      scrollContainerRef.current.style.cursor = 'grabbing';
    },
    [isWidget]
  );

  const handleMouseLeave = useCallback(() => {
    if (!isWidget || !scrollContainerRef.current) return;
    isDragging.current = false;
    scrollContainerRef.current.style.cursor = 'grab';
  }, [isWidget]);

  const handleMouseUp = useCallback(() => {
    if (!isWidget || !scrollContainerRef.current) return;
    isDragging.current = false;
    scrollContainerRef.current.style.cursor = 'grab';
  }, [isWidget]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current || !isWidget || !scrollContainerRef.current) return;
      e.preventDefault();
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX.current) * 2; // Скорость скролла
      scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
    },
    [isWidget]
  );

  if (!products.length) {
    return null;
  }

  return (
    <div
      ref={scrollContainerRef}
      className={`${styles['products-list']} ${className || ''} ${isWidget ? styles['products-list__widget'] : ''}`}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {products.map((product) => (
        <Card key={product.documentId || product.id} {...mapProductToCartProps(product)} />
      ))}
    </div>
  );
};

export default ProductList;
