import * as React from 'react';

import './icon.scss';

export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
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
  const colorClass = color ? `icon-color-${color}` : '';
  const fullClassName = [className, 'icon', colorClass].join(' ');

  return (
    <svg
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        color: 'inherit', // mb fix
      }}
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
