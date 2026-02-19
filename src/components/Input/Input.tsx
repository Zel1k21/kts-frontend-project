import React from 'react';
import cn from 'classnames';
import './input.scss';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  /** Значение поля */
  value: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, value, onChange, afterSlot = undefined, disabled = false, onClick, ...inputProps },
    ref
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    };

    const wrapperClassName = cn(
      'input-wrapper',
      {
        'input-wrapper--disabled': disabled,
        'input-wrapper--with-slot': afterSlot,
      },
      className
    );

    const inputClassName = cn('input', className);

    return (
      <div className={wrapperClassName} onClick={onClick}>
        <input
          ref={ref}
          className={inputClassName}
          value={value}
          onChange={handleChange}
          type="text"
          disabled={disabled}
          {...inputProps}
        />
        {afterSlot && <div className="input-after-slot">{afterSlot}</div>}
      </div>
    );
  }
);

export default Input;
