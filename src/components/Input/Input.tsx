import cn from 'classnames';
import React from 'react';

import styles from './input.module.scss';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  /** Значение поля */
  value: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, value, onChange, afterSlot = undefined, onClick, ...inputProps }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    };
    const wrapperClassName = cn(
      styles.input__wrapper,
      className,
      afterSlot ? styles['input-wrapper__with-slot'] : ''
    );

    return (
      <div className={wrapperClassName} onClick={onClick}>
        <input
          ref={ref}
          className={styles.input}
          value={value}
          onChange={handleChange}
          type="text"
          {...inputProps}
        />
        {afterSlot && <div className={styles['input__after-slot']}>{afterSlot}</div>}
      </div>
    );
  }
);

export default Input;
