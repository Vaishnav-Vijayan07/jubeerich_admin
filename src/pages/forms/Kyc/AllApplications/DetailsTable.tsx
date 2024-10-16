import React from "react";
import { Link } from "react-router-dom";
import Table from "../../../../components/Table";
import { sizePerPageList } from "../../data";

type IconData = {
  id?: number;
  icon: string;
  color: string;
  link: (rowId: number) => string;
  isLink: boolean;
  tooltip: string;
};

interface Props {
  data: any;
  icons: IconData[];
}

const DetailsTable = ({ data, icons }: Props) => {
  const dynamicColumns = Object.keys(data[0] || {}).map((key) => ({
    Header: key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    accessor: key,
    sort: true,
  }));

  // Add the Action column manually
  const actionColumn = {
    Header: "Action",
    accessor: "",
    sort: false,
    Cell: ({ row }: any) => (
      <div className="d-flex justify-content-center align-items-center gap-2">
        {icons.map((action: IconData) =>
          action.isLink ? (
            <Link
              key={action.id}
              to={action.link(row?.original?.id)}
              className="action-icon"
              title={action.tooltip}
            >
              <i
                className={`mdi ${action.icon}`}
                style={{ color: action.color }}
              ></i>
            </Link>
          ) : (
            <span
              key={action.id}
              className="action-icon"
              title={action.tooltip}
              style={{ cursor: "pointer" }}
            >
              <i
                className={`mdi ${action.icon}`}
                style={{ color: action.color }}
              ></i>
            </span>
          )
        )}
      </div>
    ),
  };

  const columns = [...dynamicColumns, actionColumn];

  return (
    <Table
      columns={columns}
      data={data}
      pageSize={10}
      sizePerPageList={sizePerPageList}
      isSortable={true}
      pagination={true}
      isSearchable={true}
      tableClass="table-striped dt-responsive nowrap w-100"
    />
  );
};

export default DetailsTable;
