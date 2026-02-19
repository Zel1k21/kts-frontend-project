import React from 'react';
import Card, { type CardProps } from 'components/Card';
import { type Product } from 'entities/Product/types';
import Button from 'components/Button';

interface ProductListProps {
  products?: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  className?: string;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductClick,
  onAddToCart,
  className,
}) => {
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
            onAddToCart(product);
          }}
        >
          В корзину
        </Button>
      ),
      onClick: onProductClick ? () => onProductClick(product) : undefined,
      className: 'product-card',
    };
  };

  return (
    <div className={`products-list ${className || ''}`}>
      {products?.map((product) => (
        <Card key={product.documentId || product.id} {...mapProductToCartProps(product)} />
      )) || undefined}
    </div>
  );
};

export default ProductList;
