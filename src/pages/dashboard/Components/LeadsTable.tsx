import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import Table from "../../../components/Table";
import { Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
const initialCount = 2;
const sizePerPageList = [
  {
    text: "10",
    value: 2,
  },
];

function LeadsTable({ leadsData }: any) {
  const records = leadsData;
  const navigate = useNavigate()
  const rowsPerPage = 5; // Number of rows per page
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = records.slice(startIndex, startIndex + rowsPerPage);

  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewAllLeads = ()=>{
     navigate("/leads/manage")
  }

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
      minWidth: 150,
    },
    {
      Header: "Country",
      accessor: "preferredCountries",
      sort: true, // Enabled sorting
      minWidth: 150,
    },
    {
      Header: "Office",
      accessor: "office_type_name",
      sort: false,
      minWidth: 75,
    },
    {
      Header: "Source",
      accessor: "stage",
      sort: false,
      minWidth: 75,
    },
    {
      Header: "Status",
      accessor: "status",
      sort: false,
      minWidth: 75,
    },
  ];

  return (
    <Card className="bg-white">
      <Card.Body>
        <Table
          columns={columns}
          data={paginatedData}
          pageSize={2}
          sizePerPageList={sizePerPageList}
          isSortable={true}
          pagination={false}
          isSearchable={false}
          tableClass="table-striped dt-responsive nowrap w-100"
          initialLoading={false}
          isDashboard={true}
        />
        <div className="d-flex justify-content-end mt-3">
          <Button  type="button" className="btn-sm" onClick={handleViewAllLeads} >View All</Button>
        </div>
        {/* <div className="d-flex justify-content-center">
          <Pagination
            count={Math.ceil(records.length / rowsPerPage)}
            variant="outlined"
            color="primary"
            onChange={(e, page) => handlePagination(page)}
          />
        </div> */}
      </Card.Body>
    </Card>
  );
}

export default LeadsTable;
