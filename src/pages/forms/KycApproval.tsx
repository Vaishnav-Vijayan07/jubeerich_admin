import moment from "moment";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import PageTitle from "../../components/PageTitle";
import { Card } from "react-bootstrap";

const sizePerPageList = [
  {
    text: "25",
    value: 25,
  },
  {
    text: "50",
    value: 50,
  },
  {
    text: "100",
    value: 100,
  },
];

interface TableRecords {
  id: string;
  full_name: string;
  preferredCountries: {
    country_name: string;
    country_code: string;
    isd: string;
  }[];
  university_name: string;
  course_name: string;
  office_type_name: string;
  source_name: string;
  lead_received_date: string;
  assigned_counsellor: string;
  status: string;
}

const data = [
  {
    id: 1,
    full_name: "John Doe",
    preferredCountries: [{ country_name: "United States" }, { country_name: "Canada" }],
    university_name: "Harvard University",
    course_name: "Computer Science",
    office_type_name: "Main Office",
    source_name: "Website",
    lead_received_date: "2023-07-25",
    assigned_counsellor: "Jane Smith",
    status: "Pending",
  },
  {
    id: 2,
    full_name: "Alice Brown",
    preferredCountries: [{ country_name: "United Kingdom" }, { country_name: "Australia" }],
    university_name: "University of Cambridge",
    course_name: "Engineering",
    office_type_name: "Branch Office",
    source_name: "Referral",
    lead_received_date: "2023-08-15",
    assigned_counsellor: "Robert Johnson",
    status: "Accepted",
  },
  {
    id: 3,
    full_name: "Michael Green",
    preferredCountries: [{ country_name: "Germany" }],
    university_name: "Technical University of Munich",
    course_name: "Mechanical Engineering",
    office_type_name: "Main Office",
    source_name: "Social Media",
    lead_received_date: "2023-09-10",
    assigned_counsellor: "Emily Davis",
    status: "In Progress",
  },
  {
    id: 4,
    full_name: "Sara White",
    preferredCountries: [{ country_name: "New Zealand" }],
    university_name: "University of Auckland",
    course_name: "Biology",
    office_type_name: "Branch Office",
    source_name: "Event",
    lead_received_date: "2023-07-30",
    assigned_counsellor: "Mark Lee",
    status: "Rejected",
  },
];

const KycApproval = ({ state }: any) => {
  const records: any = data;
  const columns = [
    {
      Header: "No",
      accessor: "id",
      sort: true,
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
    },
    {
      Header: "Name",
      accessor: "full_name",
      sort: true,
    },
    {
      Header: "Country",
      accessor: "preferredCountries",
      sort: false,
      Cell: ({ row }: any) => (
        <ul style={{ listStyle: "none" }}>
          {row.original.preferredCountries.map((item: any) => (
            <li>{item?.country_name}</li>
          ))}
        </ul>
      ),
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
      Header: "Lead Received Date",
      accessor: "lead_received_date",
      sort: false,
      Cell: ({ row }: any) => (
        <span>{row.original.lead_received_date && moment(row.original.lead_received_date).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      Header: "Assigned Counselor",
      accessor: "assigned_counsellor",
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
          {/* Comment Icon */}
          <Link to="#" className="action-icon">
            {/* <i className="mdi mdi-delete"></i> */}
            <i className="mdi mdi-comment-processing-outline"></i>
          </Link>

          {/* View Icon */}
          <Link to={`/kyc_details/${row.original.id}`} className="action-icon">
            <i className="mdi mdi-eye-settings-outline"></i>
          </Link>
        </div>
      ),
    },
  ];
  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Master", path: "/master/university" },
          { label: "Assigned Leads", path: "/master/university", active: true },
        ]}
        title={"Kyc Approval"}
      />
      <Card className="bg-white">
        <Card.Body>
          <Table
            columns={columns}
            data={records ? records : []}
            pageSize={25}
            sizePerPageList={sizePerPageList}
            isSortable={true}
            pagination={true}
            isSearchable={true}
            tableClass="table-striped dt-responsive nowrap w-100"
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default KycApproval;
