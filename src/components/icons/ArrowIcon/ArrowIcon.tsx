import * as React from 'react';

import Icon, { type IconProps } from '../Icon';

const ArrowIcon: React.FC<IconProps> = (props, direction?: 'left' | 'right' | '') => (
  <Icon {...props}>
    <path
      fillRule="evenodd"
      className={'arrow-icon ' + direction}
      clipRule="evenodd"
      d="M2.33563 8.74741L3.66436 7.25259L12 14.662L20.3356 7.25259L21.6644 8.74741L12 17.338L2.33563 8.74741Z"
      fill="currentColor"
    />
  </Icon>
);

export default ArrowIcon;
