import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Card, Spinner, Modal, Dropdown, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { assignToApplicationMember, autoAssignToApplicationMember, getPendingKYC, getPendingKYCByUser } from "../../../../redux/KYC/actions";
import { RootState } from "../../../../redux/store";
import PageTitle from "../../../../components/PageTitle";
import Table from "../../../../components/Table";
import { getAdminUsers } from "../../../../redux/actions";

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

const Pending = () => {
  const dispatch = useDispatch();

  const { records } = useSelector((state: RootState) => ({
    records: state.KYC.KYCSPending.data,
  }));

  useEffect(() => {
    dispatch(getPendingKYCByUser())
  }, []);

  const columns = [
    {
      Header: "No",
      accessor: "id",
      sort: true,
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
    },
    {
      Header: "Name",
      accessor: "studyPreferenceDetails.studyPreference.userPrimaryInfo.full_name",
      sort: true,
      minWidth: 100,
    },
    {
      Header: "Country",
      accessor: "studyPreferenceDetails.studyPreference.country.country_name", // Corrected for nested structure
      sort: false,
      minWidth: 150,
    },
    {
      Header: "University",
      accessor: "studyPreferenceDetails.preferred_university.university_name", // Corrected accessor
      sort: false,
      minWidth: 150,
    },
    {
      Header: "Course",
      accessor: "studyPreferenceDetails.preferred_courses.course_name", // Corrected accessor
      sort: false,
      minWidth: 150,
    },
    {
      Header: "Office",
      accessor: "studyPreferenceDetails.studyPreference.userPrimaryInfo.office_type_name.office_type_name", // Corrected accessor
      sort: false,
      minWidth: 150,
    },
    {
      Header: "Source",
      accessor: "studyPreferenceDetails.studyPreference.userPrimaryInfo.source_name.source_name", // Corrected accessor
      sort: false,
      minWidth: 150,
    },
    {
      Header: "Lead Received Date",
      accessor: "studyPreferenceDetails.studyPreference.userPrimaryInfo.lead_received_date",
      sort: false,
      Cell: ({ row }: any) => (
        <span>
          {row.original.studyPreferenceDetails.studyPreference.userPrimaryInfo.lead_received_date &&
            moment(row.original.studyPreferenceDetails.studyPreference.userPrimaryInfo.lead_received_date).format("DD/MM/YYYY")}
        </span>
      ),
      minWidth: 150,
    },
    {
      Header: "Assigned Type",
      accessor: "studyPreferenceDetails.studyPreference.userPrimaryInfo.assign_type", // Corrected accessor for assigned counselor
      sort: false,
      minWidth: 150,
    },
    {
      Header: "Assigned Counselor",
      accessor: "", // You can fill in this accessor if needed for sorting, etc.
      sort: false,
      Cell: ({ row }: any) => {
        // Safely access the properties and find the assigned counselor
        const assignedCounselor = row?.original?.studyPreferenceDetails?.studyPreference?.userPrimaryInfo?.counselors?.find(
          (counselor: any) => counselor?.country_id === row?.original?.studyPreferenceDetails?.studyPreference?.countryId
        );

        return <span>{assignedCounselor ? assignedCounselor.name : "No counselor assigned"}</span>;
      },
      minWidth: 150,
    },
    {
      Header: "Status",
      accessor: "studyPreferenceDetails.kyc_status", // Corrected accessor for status
      sort: false,
      minWidth: 150,
    },

    {
      Header: "Actions",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* View Icon */}
          {/* <Link to={`/kyc_details/${row.original.id}`} className="action-icon"> */}
          <Link
            to={`/kyc_details/${row.original.studyPreferenceDetails.studyPreference.userPrimaryInfoId}/${row.original?.id}`}
            className="action-icon"
          >
            <i className="mdi mdi-eye-settings-outline"></i>
          </Link>
        </div>
      ),
      minWidth: 150,
    },
  ];

  console.log(records);

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Master", path: "/master/university" },
          { label: "Assigned Leads", path: "/master/university", active: true },
        ]}
        title={"KYC Approval"}
      />
      <Card className="bg-white">
        <Card.Body>
          <Table
            columns={columns}
            data={records || []}
            pageSize={10}
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

export default Pending;
