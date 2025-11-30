'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
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

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-between h-12 w-xl gap-2 items-center font-bold">
      {/*Anterior */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`rounded-md px-4 py-2 cursor-pointer transition-colors ${
          currentPage === 1
            ? 'bg-[#990052]/50 text-neutral-400 cursor-not-allowed'
            : 'bg-[#990052] text-neutral-50 hover:bg-[#990052]/90'
        }`}
      >
        Anterior
      </button>
      
      {/*Paginas */}
      <div className="flex justify-between gap-2">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <div key={`ellipsis-${index}`} className="px-4 py-2 text-neutral-50/40">
                <span>...</span>
              </div>
            );
          }
          const pageNum = page as number;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              className={`rounded-md px-6 py-2 cursor-pointer transition-colors ${
                isActive
                  ? 'bg-[#990052] text-neutral-50'
                  : 'bg-[#222222] text-neutral-50/75 hover:bg-[#333333]'
              }`}
            >
              <span>{pageNum}</span>
            </button>
          );
        })}
      </div>
      {/*Siguiente */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`rounded-md px-4 py-2 cursor-pointer transition-colors ${
          currentPage === totalPages
            ? 'bg-[#990052]/50 text-neutral-400 cursor-not-allowed'
            : 'bg-[#990052] text-neutral-50 hover:bg-[#990052]/90'
        }`}
      >
        Siguiente
      </button>
    </div>
  );
}