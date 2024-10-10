import React from "react";
import { Link } from "react-router-dom";
import Table from "../../../../components/Table";
import { sizePerPageList } from "../../data";

interface Props {}

const DetailsTable = (props: Props) => {
  const columns = [
    {
      Header: "No",
      accessor: "id",
      sort: true,
    },
    {
      Header: "Name",
      accessor: "full_name",
      sort: true,
    },
    {
      Header: "Country",
      accessor: "country_name",
      sort: true,
    },
    {
      Header: "University",
      accessor: "university_name",
      sort: true,
    },
    {
      Header: "Course",
      accessor: "course_name",
      sort: true,
    },
    {
      Header: "Office",
      accessor: "office_type_name",
      sort: true,
    },
    {
      Header: "Source",
      accessor: "source_name",
      sort: true,
    },
    {
      Header: "Lead Received",
      accessor: "lead_received_date",
      sort: true,
    },
    {
      Header: "Assigned by",
      accessor: "assigned_by",
      sort: true,
    },
    {
      Header: "Assigned type",
      accessor: "assign_type",
      sort: true,
    },
    {
      Header: "Assigned",
      accessor: "assigned_to",
      sort: true,
    },
    {
      Header: "Employee",
      accessor: "employee_name",
      sort: true,
    },
    {
      Header: "Status",
      accessor: "status",
      sort: true,
    },
    {
      Header: "Action",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* Edit Icon */}
          <Link to={`/kyc_details/pending/1`} className="action-icon">
            <i className="mdi mdi-eye-outline" style={{ color: "#758dc8" }}></i>
          </Link>

          <Link to="#" className="action-icon">
            <i className="mdi mdi-square-edit-outline"></i>
          </Link>

          {/* Delete Icon */}
          <Link to="#" className="action-icon">
            {/* <i className="mdi mdi-delete"></i> */}
            <i className="mdi mdi-delete-outline"></i>
          </Link>
        </div>
      ),
    },
  ];

  const dummyData = [
    {
      id: 1,
      full_name: "John Doe",
      country_name: "India",
      university_name: "University of Mumbai",
      course_name: "B.Tech",
      office_type_name: "Mumbai",
      source_name: "Walkin",
      lead_received_date: "2021-01-10 18:30:00",
      date: "2021-01-12 18:30:00",
      assigned_by: "Counsellor",
      assign_type: "Assigned",
      assigned_to: "John Smith",
      employee_name: "John Doe",
      status: "In Progress",
    },
    {
      id: 2,
      full_name: "John Doe",
      country_name: "India",
      university_name: "University of Mumbai",
      course_name: "B.Tech",
      office_type_name: "Mumbai",
      source_name: "Walkin",
      lead_received_date: "2021-01-10 18:30:00",
      date: "2021-01-12 18:30:00",
      assigned_by: "Counsellor",
      assign_type: "Assigned",
      assigned_to: "John Smith",
      employee_name: "John Doe",
      status: "In Progress",
    },
    {
      id: 3,
      full_name: "John Doe",
      country_name: "India",
      university_name: "University of Mumbai",
      course_name: "B.Tech",
      office_type_name: "Mumbai",
      source_name: "Walkin",
      lead_received_date: "2021-01-10 18:30:00",
      date: "2021-01-12 18:30:00",
      assigned_by: "Counsellor",
      assign_type: "Assigned",
      assigned_to: "John Smith",
      employee_name: "John Doe",
      status: "In Progress",
    },
    {
      id: 4,
      full_name: "John Doe",
      country_name: "India",
      university_name: "University of Mumbai",
      course_name: "B.Tech",
      office_type_name: "Mumbai",
      source_name: "Walkin",
      lead_received_date: "2021-01-10 18:30:00",
      date: "2021-01-12 18:30:00",
      assigned_by: "Counsellor",
      assign_type: "Assigned",
      assigned_to: "John Smith",
      employee_name: "John Doe",
      status: "In Progress",
    },
    {
      id: 5,
      full_name: "John Doe",
      country_name: "India",
      university_name: "University of Mumbai",
      course_name: "B.Tech",
      office_type_name: "Mumbai",
      source_name: "Walkin",
      lead_received_date: "2021-01-10 18:30:00",
      date: "2021-01-12 18:30:00",
      assigned_by: "Counsellor",
      assign_type: "Assigned",
      assigned_to: "John Smith",
      employee_name: "John Doe",
      status: "In Progress",
    },
  ];

  return (
    <Table
      columns={columns}
      data={dummyData}
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
