import React, { useRef, useEffect, forwardRef, useState } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useRowSelect,
  useGlobalFilter,
  useAsyncDebounce,
  useExpanded,
} from "react-table";
import classNames from "classnames";

// components
import Pagination from "./Pagination";

interface GlobalFilterProps {
  preGlobalFilteredRows: any;
  globalFilter: any;
  setGlobalFilter: any;
  searchBoxClass: any;
}

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  searchBoxClass,
}: GlobalFilterProps) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState<any>(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className={classNames(searchBoxClass)}>
      <span className="d-flex align-items-center">
        Search :{" "}
        <input
          type="search"
          value={value || ""}
          onChange={(e: any) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`${count} records...`}
          className="form-control w-auto ms-1"
        />
      </span>
    </div>
  );
};

interface IndeterminateCheckboxProps {
  indeterminate: any;
  children?: React.ReactNode;
}

const IndeterminateCheckbox = forwardRef<
  HTMLInputElement,
  IndeterminateCheckboxProps
>(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef: any = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          ref={resolvedRef}
          {...rest}
        />
        <label htmlFor="form-check-input" className="form-check-label"></label>
      </div>
    </>
  );
});

interface TableProps {
  isSearchable?: boolean;
  isSortable?: boolean;
  pagination?: boolean;
  isSelectable?: boolean;
  isExpandable?: boolean;
  sizePerPageList?: {
    text: string;
    value: number;
  }[];
  columns: {
    Header: string;
    accessor: string;
    sort?: boolean;
    Cell?: any;
    className?: string;
  }[];
  data: any[];
  pageSize?: any;
  searchBoxClass?: string;
  tableClass?: string;
  theadClass?: string;
  onSelect?: any;
}

const Table = (props: TableProps) => {
  const isSearchable = props["isSearchable"] || false;
  const isSortable = props["isSortable"] || false;
  const pagination = props["pagination"] || false;
  const isSelectable = props["isSelectable"] || false;
  const isExpandable = props["isExpandable"] || false;
  const sizePerPageList = props["sizePerPageList"] || [];

  let otherProps: any = {};

  if (isSearchable) {
    otherProps["useGlobalFilter"] = useGlobalFilter;
  }
  if (isSortable) {
    otherProps["useSortBy"] = useSortBy;
  }
  if (isExpandable) {
    otherProps["useExpanded"] = useExpanded;
  }
  if (pagination) {
    otherProps["usePagination"] = usePagination;
  }
  if (isSelectable) {
    otherProps["useRowSelect"] = useRowSelect;
  }

  const dataTable = useTable(
    {
      columns: props["columns"],
      data: props["data"],
      initialState: { pageSize: props["pageSize"] || 10 },
      globalFilter: (rows, columnIds, filterValue) => {
        return rows.filter((row) => {
          return columnIds.some((id) => {
            const columnValue = row.values[id];
            if (Array.isArray(columnValue)) {
              return columnValue.some((item: any) =>
                JSON.stringify(item)
                  .toLowerCase()
                  .includes(filterValue.toLowerCase())
              );
            }
            return String(columnValue)
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          });
        });
      },
    },
    otherProps.hasOwnProperty("useGlobalFilter") &&
    otherProps["useGlobalFilter"],
    otherProps.hasOwnProperty("useSortBy") && otherProps["useSortBy"],
    otherProps.hasOwnProperty("useExpanded") && otherProps["useExpanded"],
    otherProps.hasOwnProperty("usePagination") && otherProps["usePagination"],
    otherProps.hasOwnProperty("useRowSelect") && otherProps["useRowSelect"],
    (hooks) => {
      isSelectable &&
        hooks.visibleColumns.push((columns: any) => [
          {
            id: "selection",
            Header: ({ getToggleAllPageRowsSelectedProps }: any) => (
              <div>
                <IndeterminateCheckbox
                  {...getToggleAllPageRowsSelectedProps()}
                />
              </div>
            ),
            Cell: ({ row }: any) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);

      isExpandable &&
        hooks.visibleColumns.push((columns: any) => [
          {
            id: "expander",
            Header: ({
              getToggleAllRowsExpandedProps,
              isAllRowsExpanded,
            }: any) => (
              <span {...getToggleAllRowsExpandedProps()}>
                {isAllRowsExpanded ? "-" : "+"}
              </span>
            ),
            Cell: ({ row }) =>
              row.canExpand ? (
                <span
                  {...row.getToggleRowExpandedProps({
                    style: {
                      paddingLeft: `${row.depth * 2}rem`,
                    },
                  })}
                >
                  {row.isExpanded ? "-" : "+"}
                </span>
              ) : null,
          },
          ...columns,
        ]);
    }
  );

  let rows = pagination ? dataTable.page : dataTable.rows;

  const getSelectedValues = () => {
    return dataTable?.selectedFlatRows.map((d: any) => d.original.id);
  };

  useEffect(() => {
    if (props.onSelect) {
      props.onSelect(getSelectedValues());
    }
  }, [dataTable?.state?.selectedRowIds]);

  return (
    <>
      {isSearchable && (
        <GlobalFilter
          preGlobalFilteredRows={dataTable.preGlobalFilteredRows}
          globalFilter={dataTable.state.globalFilter}
          setGlobalFilter={dataTable.setGlobalFilter}
          searchBoxClass={props["searchBoxClass"]}
        />
      )}

      <div className="table-responsive">
        <table
          {...dataTable.getTableProps()}
          className={classNames(
            "table table-centered react-table custom-table",
            props["tableClass"]
          )}
        >
          <thead className={props["theadClass"]}>
            {(dataTable.headerGroups || []).map((headerGroup: any) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {(headerGroup.headers || []).map((column: any) => (

                  <th
                    {...column.getHeaderProps(
                      column.sort && column.getSortByToggleProps()
                    )}
                    style={{ ...(column.minWidth && { minWidth: column.minWidth }), ...(column.maxWidth && { maxWidth: column.maxWidth }) }}
                    className={classNames("text-secondary", {
                      sorting_desc: column.isSortedDesc === true,
                      sorting_asc: column.isSortedDesc === false,
                      sortable: column.sort === true,
                    })}
                  >
                    <span className="d-flex gap-1 align-items-center">
                      {column.render("Header")}
                      {column.sort && (
                        <span className="d-flex align-items-center">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <span style={{ fontSize: "8px" }}> ▼</span> // Descending
                            ) : (
                              <span style={{ fontSize: "8px" }}> ▲</span> // Ascending
                            )
                          ) : (
                            <span style={{ fontSize: "16px" }}> ↕</span> // Default unsorted state
                          )}
                        </span>
                      )}
                    </span>
                  </th>

                ))}
              </tr>
            ))}
          </thead>
          <tbody {...dataTable.getTableBodyProps()}>
            {(rows || []).map((row: any, i: number) => {
              dataTable.prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {(row.cells || []).map((cell: any) => {                    
                    return (
                      <td
                        {...cell.getCellProps([
                          {
                            // className: cell.column.className,
                            className: `${cell.column.className} cursor-pointer`,
                          },
                        ])}
                        style={{ ...(cell.minWidth && { minWidth: cell.minWidth }), ...(cell.maxWidth && { maxWidth: cell.maxWidth }) }}
                        title={cell.value}
                        data-bs-toggle="tooltip" 
                        data-bs-placement="top"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="text-center">
            <p>No data found...</p>
          </div>
        )}
      </div>
      {pagination && (
        <Pagination tableProps={dataTable} sizePerPageList={sizePerPageList} />
      )}
    </>
  );
};

export default Table;
