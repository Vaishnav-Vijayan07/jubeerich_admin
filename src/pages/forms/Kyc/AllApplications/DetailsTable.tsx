import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../../../components/Table";
import { sizePerPageList } from "../../data";
import { baseUrl } from "../../../../constants";

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

const response = [
  { id: '52', name: "Test One" },
  { id: '53', name: "Test Two" }
]

const mapData = new Map();

response.forEach((data: any, index: any) => {
  mapData.set(index, data?.id)
})

const mapArray = Array.from(mapData.entries());

console.log('mapData',mapData);
console.log('mapArray',mapArray);

const DetailsTable = ({ data, icons }: Props) => {
  const navigate = useNavigate();

  const columns = [
    {
      Header: "No",
      accessor: "id",
      sort: false,
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
    },
    {
      Header: "Name",
      accessor: "full_name",
      sort: true,
    },
    {
      Header: "Country",
      accessor: "country_name",
      sort: false,
    },
    {
      Header: "University",
      accessor: "university_name",
      sort: false,
    },
    {
      Header: "Course",
      accessor: "course_name",
      sort: false,
    },
    {
      Header: "Office",
      accessor: "office_type_name",
      sort: false,
    },
    {
      Header: "Source",
      accessor: "source_name",
      sort: false,
    },
    {
      Header: "lead Received Date",
      accessor: "lead_received_date",
      sort: false,
    },
    {
      Header: "Assigned by",
      accessor: "assigned_by",
      sort: false,
    },
    {
      Header: "Assign Type",
      accessor: "assign_type",
      sort: false,
    },
    {
      Header: "Assign Type",
      accessor: "assign_to",
      sort: false,
    },
    {
      Header: "Assigned Employee",
      accessor: "employee_name",
      sort: false,
    },
    {
      Header: "Status",
      accessor: "status",
      sort: false,
    },
    {
      Header: " ",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* View Icon */}
          <span
            className="action-icon"
            onClick={() => navigate(`/kyc_details/pending/${row.original.id}`, { state: { mapData: mapArray } })}
          >
            <i className="mdi mdi-arrow-right-drop-circle-outline"></i>
          </span>

          {/* Eye Icon */}
          <span
            className="action-icon"
            onClick={() => navigate(`/kyc_details/pending/${row.original.id}`)}
          >
            <i className="mdi mdi-eye-outline"></i>
          </span>
        </div>
      ),
    },
  ];  

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
