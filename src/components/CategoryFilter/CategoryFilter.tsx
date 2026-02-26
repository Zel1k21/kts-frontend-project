import cn from 'classnames';
import { type ProductCategory } from 'entities/Product/types';

import styles from './categoryFilter.module.scss';

type CategoryFilterProps = {
  categories: ProductCategory[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className={styles['category-filter']}>
      <button
        className={cn(styles['category-filter__chip'], {
          [styles['category-filter__chip_selected']]: selectedCategory === null,
        })}
        onClick={() => onSelectCategory(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.title}
          className={cn(styles['category-filter__chip'], {
            [styles['category-filter__chip_selected']]: selectedCategory === cat.title,
          })}
          onClick={() => onSelectCategory(cat.title)}
          type="button"
        >
          {cat.title}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
