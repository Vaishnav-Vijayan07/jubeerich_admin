import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import PageTitle from "../../components/PageTitle";
import { Button, Card, Spinner, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { getPendingKYC } from "../../redux/KYC/actions";
import UserImage from "../../assets/images/users/user_circle_icon.png";

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

const KycApproval = () => {
  const dispatch = useDispatch();

  const [uploadModal, setUploadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remarkData, setRemarkData] = useState<any>([])

  // Function to toggle the upload modal visibility
  const toggleUploadModal = () => {
    setUploadModal((prevState) => !prevState);
  };

  const { records, user, initialloading } = useSelector((state: RootState) => ({
    user: state.Auth.user,
    records: state.KYC.KYCSPending.data,
    initialloading: state.KYC.initialloading,
  }));

  useEffect(() => {
    dispatch(getPendingKYC("country_manager"));
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
      minWidth: 200,
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
      Header: "Application Status",
      accessor: "application_status", // Corrected accessor for status
      sort: false,
      minWidth: 150,
    },
    {
      Header: "KYC Status",
      accessor: "kyc_status", // Corrected accessor for status
      sort: false,
      minWidth: 150,
    },
    {
      Header: "Actions",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* Comment Icon */}
          <Link to="#" className="action-icon" onClick={() => setUploadModal(true)}>
            {/* <i className="mdi mdi-delete"></i> */}
            <i className="mdi mdi-comment-processing-outline" onClick={() => setRemarkData(row.original?.remarks)}></i>
          </Link>

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

  // if (initialloading) {
  //   return <Spinner animation="border" style={{ position: "absolute", top: "50%", left: "50%" }} />;
  // }

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          // { label: "KYC Approval", path: "/kyc_details" },
          { label: "KYC Approval", path: "/kyc_details", active: true },
        ]}
        title={"KYC Approval"}
      />
      <Card className="bg-white">
        <Card.Body>
          <Table
            columns={columns}
            data={records ?? []}
            pageSize={25}
            sizePerPageList={sizePerPageList}
            isSortable={true}
            pagination={true}
            isSearchable={true}
            tableClass="table-striped dt-responsive nowrap w-100"
            initialLoading={initialloading}
          />
        </Card.Body>
      </Card>

      <Modal show={uploadModal} onHide={toggleUploadModal} size="lg" dialogClassName="modal-dialog-centered">
        <Modal.Header closeButton>
          <h3>Remarks</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div style={{ minHeight: "150px", maxHeight: "250px", overflowY: "auto", scrollbarWidth: "none" }} className="col">
              {remarkData?.[0]?.remark ? (
                remarkData?.map((remark: any, idx: any) => (
                  <React.Fragment key={idx}>
                    <div key={idx} className="d-flex align-items-start p-1">
                      <img src={UserImage} className="me-2 rounded-circle" height="36" width="36" alt={remark.created_by} />
                      <div className="w-100">
                        <h5 className="mt-0 mb-0 font-size-14">
                          <span className="text-muted fs-12">{remark?.created_by}</span>
                          <div className="mt-1">{remark?.remark}</div>
                        </h5>
                      </div>
                    </div>
                    <hr style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }} />
                  </React.Fragment>
                ))
              ) : (
                <div className="d-flex justify-content-center align-items-center">
                  <h3 className="text-muted">No Remarks Available</h3>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-sm btn-danger waves-effect waves-light" onClick={toggleUploadModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default KycApproval;
