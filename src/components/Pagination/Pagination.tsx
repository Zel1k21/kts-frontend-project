import React, { useMemo } from 'react';
import cn from 'classnames';
import ArrowIcon from 'components/icons/ArrowIcon';

export interface PaginationProps {
  currentPage: number; // Текущая страница
  totalPages: number; // Общее количество страниц
  delta: number; // Количество страниц с двух сторон от текущей
  pageSize: number; // Количесво карточек на страниц
  onPageChange: (page: number) => void; //Callback при смене страницы
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  delta = 2,
  onPageChange,
  className,
}) => {
  const rangeStart = currentPage - delta;
  const rangeEnd = currentPage + delta;

  const pages = useMemo(() => {
    const result: (number | 'ellipsis')[] = [];

    result.push(1);

    if (currentPage > delta) {
      result.push('ellipsis');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      if (i > 1 && i <= totalPages) {
        result.push(i);
      }
    }

    if (currentPage + delta < totalPages) {
      result.push('ellipsis');
    }

    if (totalPages > 1 && !result.includes(totalPages)) {
      result.push(totalPages);
    }

    return result;
  }, [currentPage, totalPages]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | 'ellipsis') => {
    if (page !== currentPage && page !== 'ellipsis') {
      onPageChange(page);
    }
  };

  return (
    <div className={cn('pagination', className)}>
      <button
        className={cn('pagination-btn', 'pagination-btn--arrow', {
          'pagination-btn--disabled': currentPage === 1,
        })}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
        aria-disabled={currentPage === 1}
      >
        <ArrowIcon direction="left" />
      </button>
      {pages.map((page, index) => {
        if (page === `ellipsis-${index}`) {
          return (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis" aria-hidden="true">
              ...
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            className={cn('pagination-btn', { 'pagination-btn--active': isActive })}
            onClick={() => handlePageClick(page)}
            aria-label={`Страница ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}
      <button
        className={cn('pagination-btn', 'pagination-btn--arrow', {
          'pagination-btn--disabled': currentPage === totalPages,
        })}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Следующая страница"
        aria-disabled={currentPage === totalPages}
      >
        <ArrowIcon direction="right" />
      </button>
    </div>
  );
};

export default Pagination;
