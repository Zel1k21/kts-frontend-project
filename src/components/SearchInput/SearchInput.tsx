import CrossIcon from 'assets/cross.svg?react';
import cn from 'classnames';
import Input, { type InputProps } from 'components/Input';
import React, { useCallback, useEffect } from 'react';
import { useDebounce } from 'shared/hooks/useDebounce';

import styles from './SearchInput.module.scss';

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
  debounceDelay = 700,
  placeholder,
  className,
  disabled,
  ...inputProps
}) => {
  const debouncedValue = useDebounce(value, debounceDelay);

  useEffect(() => {
    onDebounceChange(debouncedValue);
  }, [debouncedValue, onDebounceChange]);

  const handleClear = useCallback(() => {
    onChange('');
    onDebounceChange('');
  }, [onChange, onDebounceChange]);

  const clearIcon =
    value && !disabled ? (
      <button
        type="button"
        onClick={handleClear}
        className={styles['search-input__clear-btn']}
        disabled={disabled}
        aria-label="Очистить поиск"
      >
        <CrossIcon />
      </button>
    ) : null;

  return (
    <div className={cn('search-input', className)} style={{ marginBottom: '1rem' }}>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        afterSlot={clearIcon}
        {...inputProps}
      />
    </div>
  );
};

export default SearchInput;
