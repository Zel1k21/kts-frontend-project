import ArrowLeft from 'assets/arrowLeft.svg?react';
import ArrowRight from 'assets/arrowRight.svg?react';
import cn from 'classnames';
import React from 'react';

import styles from '../Pagination.module.scss';

export type OffsetButtonProps = {
  page: number;
  isActive?: boolean;
  handlePageClick: (page: number) => void;
  direction: 'left' | 'right';
  totalPages: number;
};

const BackButton: React.FC<OffsetButtonProps> = ({
  page,
  isActive,
  handlePageClick,
  direction,
  totalPages,
}) => {
  return (
    <button
      key={page}
      className={cn(styles['pagination-btn'], { [styles['pagination-btn_active']]: isActive })}
      onClick={() => handlePageClick(page)}
      disabled={
        (page === 1 && direction === 'left') || (page === totalPages && direction === 'right')
      }
      aria-label={`Страница ${page}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {direction === 'left' ? <ArrowLeft /> : <ArrowRight />}
    </button>
  );
};

export default BackButton;
