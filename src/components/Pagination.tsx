import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageNumbers(current: number, total: number): (number | string)[] {
  const delta = 2;
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l = 0;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (let i = 0; i < range.length; i++) {
    if (l) {
      if ((range[i] as number) - l === 2) {
        rangeWithDots.push(l + 1);
      } else if ((range[i] as number) - l > 2) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(range[i]);
    l = range[i] as number;
  }
  return rangeWithDots;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      className={`flex items-center justify-center gap-1 mt-4 select-none ${className || ''}`}
      aria-label="Pagination"
    >
      <button
        className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 font-semibold hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="First page"
      >
        «
      </button>
      <button
        className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 font-semibold hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ‹
      </button>
      {pageNumbers.map((num, idx) =>
        typeof num === 'number' ? (
          <button
            key={num}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              num === currentPage
                ? 'bg-amber-500 text-white shadow'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
            onClick={() => onPageChange(num)}
            aria-current={num === currentPage ? 'page' : undefined}
          >
            {num}
          </button>
        ) : (
          <span key={idx} className="px-2 py-1 text-amber-400 font-bold">
            …
          </span>
        )
      )}
      <button
        className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 font-semibold hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        ›
      </button>
      <button
        className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 font-semibold hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Last page"
      >
        »
      </button>
    </nav>
  );
};

export default Pagination;
