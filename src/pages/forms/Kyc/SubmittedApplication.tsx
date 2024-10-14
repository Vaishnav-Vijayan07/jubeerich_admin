import React from "react";
import FiltersSection from "./AllApplications/FiltersSection";
import { Row } from "react-bootstrap";
import DetailsTable from "./AllApplications/DetailsTable";
import { useLocation } from "react-router-dom";

type Props = {};

function SubmittedApplication({}: Props) {
  let location = useLocation();

  const path = location.pathname;
  

  const dummyData = [
    {
      id: 1,
      name: "John Doe",
      country: "India",
      office: "Mumbai",
      source: "Walkin",
      leadReceivedDate: "2021-01-10 18:30:00",
      assignedBy: "Counsellor",
      assignedType: "Assigned",
      assignedEmployee: "John Smith",
      status: "In Progress",
    },
    {
      id: 2,
      name: "Jane Doe",
      country: "India",
      office: "Delhi",
      source: "Online",
      leadReceivedDate: "2021-01-11 15:20:00",
      assignedBy: "Manager",
      assignedType: "Assigned",
      assignedEmployee: "Alice Brown",
      status: "Completed",
    },
    {
      id: 3,
      name: "Robert Smith",
      country: "USA",
      office: "New York",
      source: "Referral",
      leadReceivedDate: "2021-01-09 12:00:00",
      assignedBy: "HR",
      assignedType: "Transferred",
      assignedEmployee: "Michael White",
      status: "Pending",
    },
    {
      id: 4,
      name: "Emily Johnson",
      country: "Canada",
      office: "Toronto",
      source: "Social Media",
      leadReceivedDate: "2021-01-12 09:45:00",
      assignedBy: "Manager",
      assignedType: "Assigned",
      assignedEmployee: "Sarah Lee",
      status: "In Progress",
    },
    {
      id: 5,
      name: "David Brown",
      country: "UK",
      office: "London",
      source: "Event",
      leadReceivedDate: "2021-01-14 17:10:00",
      assignedBy: "Counsellor",
      assignedType: "Reassigned",
      assignedEmployee: "John Smith",
      status: "Completed",
    },
  ];

  const icons = [
    {
      id: 1,
      icon: "mdi-eye-outline",
      color: "#758dc8",
      link: (id: any) => `/kyc_details/pending/${id}`, // Dynamic link generation
      isLink: true,
      tooltip: "View Details",
    },
    {
      id: 2,
      icon: "mdi-square-edit-outline",
      color: "#6c757d",
      link: (id: any) => `/edit/${id}`, // Another dynamic link
      isLink: true,
      tooltip: "Edit",
    },
    {
      id: 3,
      icon:
        path == "/kyc_details/applications/offer_accepted"
          ? "mdi-delete-outline"
          : "mdi-file-pdf-box",
      color: "#dc3545",
      link: (id: any) => `/delete/${id}`, // Another dynamic link
      isLink: true,
      tooltip: "Delete",
    },
  ];

  return (
    <>
      <Row className="mt-3 mb-2">
        <FiltersSection />
      </Row>

      <Row>
        <DetailsTable data={dummyData} icons={icons} />
      </Row>
    </>
  );
}

export default SubmittedApplication;
