import * as React from 'react';

import './text.scss';

export type TextProps = {
  /** Дополнительный класс */
  className?: string;
  /** Стиль отображения */
  view?: 'title' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
  /** Html-тег */
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
  /** Начертание шрифта */
  weight?: 'normal' | 'medium' | 'bold';
  /** Контент */
  children: React.ReactNode;
  /** Цвет */
  color?: 'primary' | 'secondary' | 'accent';
  /** Максимальное кол-во строк */
  maxLines?: number;
};

const Text: React.FC<TextProps> = ({
  className,
  view,
  tag,
  weight,
  children,
  color = 'inherit',
  maxLines,
}) => {
  const Tag = tag || 'p';
  className = `${className} ${view} ${weight} ${color}`;

  // Стили для обрезания текста
  const clampStyles = maxLines
    ? ({
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: maxLines,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        gap: '10px',
      } as React.CSSProperties)
    : undefined;

  return (
    <Tag className={className} style={clampStyles}>
      {children}
    </Tag>
  );
};

export default Text;
