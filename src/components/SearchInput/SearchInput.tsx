import cn from 'classnames';
import Input, { type InputProps } from 'components/Input';
import React, { useEffect } from 'react';
import { useDebounce } from 'shared/useDebounce';

export type SearchInputProps = {
  //callback с значение для useDebounce
  onDebounceChange: (value: string) => void;
  //Задержка перед поиском (по умолчанию 300 мс)
  debounceDelay?: number;
  placeholder?: string;
  searchIcon?: React.ReactNode;
} & Omit<InputProps, 'afterslot'>;

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onDebounceChange,
  debounceDelay = 300,
  placeholder,
  className,
  disabled,
  ...inputProps
}) => {
  const debouncedValue = useDebounce(value, debounceDelay);

  useEffect(() => {
    onDebounceChange(debouncedValue);
  }, [debouncedValue, onDebounceChange]);
  return (
    <div className={cn('search-input', className)}>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        {...inputProps}
      />
    </div>
  );
};

export default SearchInput;
