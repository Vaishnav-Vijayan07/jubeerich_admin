import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
const sizePerPageList = [
  {
    text: "10",
    value: 2,
  },
];

function LeadsTable({ leadsData, showOffice }: any) {
  const records = leadsData;
  const navigate = useNavigate();

  const handleViewAllLeads = () => {
    navigate("/leads/manage");
  };

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
      accessor: "",
      sort: true, // Enabled sorting
      minWidth: 150,
      Cell: ({ row }: any) => (
        <ul style={{ listStyle: "none", margin: "0" }}>
          {row.original.preferredCountries.map((item: any) => (
            <li>{item?.country_name}</li>
          ))}
        </ul>
      ),
    },
    ...(showOffice
      ? [
          {
            Header: "Office",
            accessor: "office_type_name.office_type_name",
            sort: false,
            minWidth: 75,
          },
        ]
      : []),

    {
      Header: "Department",
      accessor: "stage",
      sort: false,
      minWidth: 75,
    },
    {
      Header: "Status",
      accessor: "status",
      sort: false,
      minWidth: 75,
      Cell: ({ row }: any) => {
        const { preferredStatus } = row.original;
        return (
          <ul style={{ listStyle: "none", margin: "0" }}>
            {preferredStatus.map((item: any) => (
              <li>{item?.status_name}</li>
            ))}
          </ul>
        );
      },
    },
  ];

  return (
    <Card className="bg-white">
      <Card.Body>
        <Table
          columns={columns}
          data={leadsData ? leadsData : []}
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
          <Button type="button" className="btn-sm" onClick={handleViewAllLeads}>
            View All
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default LeadsTable;
