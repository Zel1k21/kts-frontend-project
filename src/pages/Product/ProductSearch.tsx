import { SearchInput } from 'components/SearchInput';
import React, { useState, useCallback } from 'react';

type ProductSearchPrpos = {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
  className?: string;
};

export const ProductSearch: React.FC<ProductSearchPrpos> = ({
  className,
  onSearch,
  initialValue = '',
  placeholder,
}) => {
  const [query, setQuery] = useState(initialValue);

  const handleDebouncedChange = useCallback(
    (debouncedValue: string) => {
      onSearch(debouncedValue);
    },
    [onSearch]
  );
  return (
    <SearchInput
      className={className}
      value={query}
      onChange={setQuery}
      onDebounceChange={handleDebouncedChange}
      placeholder={placeholder}
      debounceDelay={300}
    />
  );
};

export default ProductSearch;
