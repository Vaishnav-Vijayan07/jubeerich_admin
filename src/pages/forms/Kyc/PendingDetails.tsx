import React from "react";
import { Row } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle";
import DetailsTable from "./AllApplications/DetailsTable";

interface Props {}

const PendingDetails = (props: Props) => {
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

  const icons = [
    {
      id: 1,
      icon: "mdi-eye-outline",
      color: "#758dc8",
      link: (id: number) => `/kyc_details/pending/${id}`, // Dynamic link generation
      isLink: true,
      tooltip: "View Details",
    },
    {
      id: 2,
      icon: "mdi-square-edit-outline",
      color: "#6c757d",
      link: (id: number) => `/edit/${id}`, // Another dynamic link
      isLink: true,
      tooltip: "Edit",
    },
    {
      id: 3,
      icon: "mdi-file-pdf-box",
      color: "#dc3545",
      link: (id: number) => `/delete/${id}`, // Another dynamic link
      isLink: true,
      tooltip: "Delete",
    },
  ];

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Applications", path: "" },
          { label: "Pending", path: "", active: true },
        ]}
        title={"Applications-Pending"}
      />

      <Row>
        <DetailsTable data={dummyData} icons={icons} />
      </Row>
    </>
  );
};

export default PendingDetails;
