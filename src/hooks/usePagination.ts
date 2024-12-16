import { useState, useCallback } from "react";

export const usePagination = (initialPage: number = 1, initialLimit: number = 20) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);

  const handlePageChange = useCallback((event: any, value: number) => {
    setCurrentPage(value);
  }, []);

  const handleLimitChange = useCallback((value: number) => {
    setCurrentLimit(value);
    setCurrentPage(1); // Reset to the first page when limit changes
  }, []);


  return {
    currentPage,
    currentLimit,
    setCurrentPage,
    setCurrentLimit,
    handlePageChange,
    handleLimitChange,
  };
};
