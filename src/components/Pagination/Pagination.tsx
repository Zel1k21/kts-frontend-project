import React, { useMemo } from 'react';

import OffsetButton from './OffsetButtons';
import PageButton from './PageButton';
import styles from './Pagination.module.scss';

export type PaginationProps = {
  currentPage: number; // Текущая страница
  totalPages: number; // Общее количество страниц
  delta: number; // Количество страниц с двух сторон от текущей
  pageSize: number; // Количесво карточек на страниц
  onPageChange: (page: number) => void; //Callback при смене страницы
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  delta = 2,
  onPageChange,
}) => {
  const pages = useMemo(() => {
    const result = [];

    const leftSiblingIndex = Math.max(currentPage - delta, 1);
    const rightSiblingIndex = Math.min(currentPage + delta, totalPages);

    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

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
  }, [currentPage, totalPages, delta]);

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
    <div className={styles.pagination}>
      <OffsetButton
        handlePageClick={handlePrevious}
        page={currentPage}
        direction="left"
        totalPages={totalPages}
      />
      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <PageButton
            key={page}
            page={page}
            isActive={isActive}
            onClick={() => handlePageClick(page)}
          />
        );
      })}
      <OffsetButton
        handlePageClick={handleNext}
        page={currentPage}
        direction="right"
        totalPages={totalPages}
      />
    </div>
  );
};

export default Pagination;
