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

function ApplicationsTable({ leadsData }: any) {
  const navigate = useNavigate();

  const handleViewAllLeads = () => {
    navigate("kyc_details/applications/pending");
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
      accessor: "studyPreferenceDetails.studyPreference.userPrimaryInfo.full_name",
      sort: true,
      minWidth: 150,
    },
    {
      Header: "Country",
      accessor: "studyPreferenceDetails.studyPreference.country.country_name",
      sort: true, // Enabled sorting
      minWidth: 150,
    },

    {
      Header: "Office",
      accessor: "studyPreferenceDetails.studyPreference.userPrimaryInfo.office_type_name.office_type_name",
      sort: false,
      minWidth: 75,
    },
    {
      Header: "University",
      accessor: "studyPreferenceDetails.preferred_university.university_name",
      sort: true, // Enabled sorting
      minWidth: 150,
    },
    {
      Header: "Campus",
      accessor: "studyPreferenceDetails.preferred_campus.campus_name",
      sort: true, // Enabled sorting
      minWidth: 150,
    },
    {
      Header: "Course",
      accessor: "studyPreferenceDetails.preferred_courses.course_name",
      sort: true, // Enabled sorting
      minWidth: 150,
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

export default ApplicationsTable;
