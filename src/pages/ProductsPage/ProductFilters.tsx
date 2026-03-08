import CategoryFilter from 'components/CategoryFilter';
import { observer } from 'mobx-react-lite';
import type { ProductsPageStore } from 'store/local/ProductsPageStore';

import ProductSearch from './ProductSearch';

const ProductFilters = observer(
  ({
    store,
    onSearch,
    onCategorySelect,
    className,
  }: {
    store: ProductsPageStore;
    onSearch: (query: string) => void;
    onCategorySelect: (categoryId: string | null) => void;
    className?: string;
  }) => (
    <div className={className}>
      <ProductSearch
        value={store.searchQuery}
        onChange={(v) => store.setSearchQuery(v)}
        onSearch={onSearch}
        placeholder="Найти товары..."
      />
      {store.categories.length > 0 && (
        <CategoryFilter
          categories={store.categories}
          selectedCategory={store.selectedCategoryTitle}
          onSelectCategory={onCategorySelect}
        />
      )}
    </div>
  )
);

export default ProductFilters;
