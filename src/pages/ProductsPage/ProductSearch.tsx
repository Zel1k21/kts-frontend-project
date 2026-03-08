import { SearchInput } from 'components/SearchInput';
import React, { useCallback } from 'react';

type ProductSearchPrpos = {
  onSearch: (query: string) => void;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  className?: string;
};

export const ProductSearch: React.FC<ProductSearchPrpos> = ({
  className,
  onSearch,
  value,
  onChange,
  placeholder,
}) => {
  const handleDebouncedChange = useCallback(
    (debouncedValue: string) => {
      onSearch(debouncedValue);
    },
    [onSearch]
  );

  return (
    <SearchInput
      className={className}
      value={value}
      onChange={onChange}
      onDebounceChange={handleDebouncedChange}
      placeholder={placeholder}
    />
  );
};

export default ProductSearch;
