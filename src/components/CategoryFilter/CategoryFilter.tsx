import { type ProductCategory } from 'entities/Product/types';
import './categoryFilter.scss';

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
    <div className="category-filter">
      <button
        className={`category-filter__chip ${selectedCategory === null ? 'category-filter__chip--active' : ''}`}
        onClick={() => onSelectCategory(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.title}
          className={`category-filter__chip ${selectedCategory === cat.title ? 'category-filter__chip--active' : ''}`}
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
