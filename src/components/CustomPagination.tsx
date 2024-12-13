import { Pagination } from "@mui/material";
import React from "react";

function CustomPagination({ handleLimitChange, handlePageChange, totalPages, currentLimit }: any) {
  return (
    <>
      <div className="d-flex align-items-center justify-content-between text-center gap-2 pb-1">
        <div className="flex-1">
          <div className="d-inline-block me-3">
            <label className="me-1">Display :</label>
            <select value={currentLimit} className="form-select d-inline-block w-auto" onChange={(e) => handleLimitChange(Number(e.target.value))}>
              {[20,50,100].map((limit) => (
                <option key={limit} value={limit}>
                  {limit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="float-end">
          <Pagination count={Math.ceil(totalPages)} variant="outlined" color="primary" onChange={handlePageChange} />
        </div>
      </div>
    </>
  );
}

export default CustomPagination;
