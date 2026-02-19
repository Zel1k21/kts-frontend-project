import * as React from 'react';
import Icon, { type IconProps } from '../Icon';

const SearchIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M4 11.6129L9.87755 18L20 7" stroke="currentColor" stroke-width="2" />
  </Icon>
);

export default SearchIcon;
