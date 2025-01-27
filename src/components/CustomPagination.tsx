import { Pagination } from "@mui/material";
import React, { memo, useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";

type Props = {
  handleLimitChange: any;
  handlePageChange: any;
  totalPages: number;
  currentLimit: number;
  currentPage: number;
};

function CustomPagination({ handleLimitChange, handlePageChange, totalPages, currentLimit, currentPage }: Props) {
  const [page, setPage] = useState<string>("");

  const handleGoToPage = (value: string) => {
    setPage(value);
    const numberRegex = /^(0|[1-9][0-9]*)$/; // Prevents leading zeros
    const isValidNumber = numberRegex.test(value);

    if (isValidNumber) {
      const parsedValue = Math.min(parseInt(value), totalPages);
      debouncedChange(parsedValue);
    }
  };

  const debouncedChange = useCallback(
    debounce((value: number) => {
      handlePageChange(value);
    }, 500),
    [handlePageChange] // Correct dependency
  );

  useEffect(() => {
    return () => {
      debouncedChange.cancel(); // Cleanup on unmount
    };
  }, [debouncedChange]);

  return (
    <>
      <div className="d-flex align-items-center justify-content-between text-center gap-2 pb-1">
        <div className="flex-1">
          <div className="d-inline-block me-3">
            <label className="me-1">Display :</label>
            <select
              value={currentLimit}
              className="form-select d-inline-block w-auto"
              onChange={(e) => handleLimitChange(Number(e.target.value))}
            >
              {[10, 20, 50, 100].map((limit) => (
                <option key={limit} value={limit}>
                  {limit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <span className="d-inline-block align-items-center text-sm-start text-center my-sm-0 my-2">
            <label className="form-label">Go to page : </label>
            {/* <input
              type="number"
              value={page}
              onChange={(e: any) => {
                handleGoToPage(e.target.value);
              }}
              className="form-control w-25 ms-1 d-inline-block"
            /> */}
            <input
              type="number"
              min="0" // Prevent negative numbers
              value={page}
              onChange={(e: any) => {
                const value = e.target.value;

                // Allow only non-negative numbers
                if (!value || /^\d+$/.test(value)) {
                  handleGoToPage(value);
                }
              }}
              className="form-control w-25 ms-1 d-inline-block"
            />
          </span>
        </div>

        <div className="float-end">
          <Pagination
            count={Math.ceil(totalPages)}
            page={currentPage}
            variant="outlined"
            color="primary"
            onChange={(_, value) => handlePageChange(value)}
          />
        </div>
      </div>
    </>
  );
}

export default memo(CustomPagination);
