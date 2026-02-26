import cn from 'classnames';
import * as React from 'react';

import styles from './icon.module.scss';

export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color: 'primary' | 'secondary' | 'accent';
  width?: number;
  height?: number;
};

const Icon: React.FC<React.PropsWithChildren<IconProps>> = ({
  className,
  children,
  color,
  width,
  height,
  ...svgProps
}) => {
  const colorClass = cn(
    color === 'primary' && styles['icon-color_primary'],
    color === 'secondary' && styles['icon-color_secondary'],
    color === 'accent' && styles['icon-color_accent']
  );
  const fullClassName = [className, 'icon', colorClass].join(' ');

  return (
    <svg
      width={width || 24}
      height={height || 24}
      className={fullClassName}
      viewBox="0 0 24 24"
      fill="none"
      {...svgProps}
    >
      {children}
    </svg>
  );
};

export default Icon;
