import cn from 'classnames';
import React from 'react';

import styles from '../Pagination.module.scss';

export type PageButtonProps = {
  page: number | string;
  isActive?: boolean;
  onClick: (page: number | string) => void;
};

const PageButton: React.FC<PageButtonProps> = ({ page, isActive = false, onClick }) => (
  <button
    key={page}
    className={cn(
      styles['pagination-btn'],
      { [styles['pagination-btn_active']]: isActive },
      page === '...' ? styles['pagination-btn__ellipsis'] : ''
    )}
    onClick={() => onClick(page)}
    aria-label={`Страница ${page}`}
    aria-current={isActive ? 'page' : undefined}
  >
    {page}
  </button>
);

export default PageButton;
