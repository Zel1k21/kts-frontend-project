import React, { useMemo } from 'react';
import cn from 'classnames';

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
  const leftSiblingIndex = Math.max(currentPage - delta, 1);
  const rightSiblingIndex = Math.min(currentPage + delta, totalPages);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

  const pages = useMemo(() => {
    var result = [];

    result.push(1);

    if (shouldShowLeftEllipsis) {
      result.push('...');
    } else if (leftSiblingIndex > 2) {
      for (let i = 2; i < leftSiblingIndex; i++) {
        result.push(i);
      }
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i === 1) continue;
      result.push(i);
    }

    if (shouldShowRightEllipsis) {
      result.push('...');
    } else if (rightSiblingIndex < totalPages - 1) {
      for (let i = rightSiblingIndex + 1; i < totalPages; i++) {
        result.push(i);
      }
    }

    if (totalPages > 1) {
      if (result[result.length - 1] !== totalPages) {
        result.push(totalPages);
      }
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

  const handlePageClick = (page: number | string) => {
    if (page !== currentPage && typeof page === 'number') {
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </button>
      {pages.map((page) => {
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
