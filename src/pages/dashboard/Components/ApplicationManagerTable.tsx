import React, { memo, useEffect, useState } from "react";
import { Card, Button, Row, Dropdown, Form, Col, Modal } from "react-bootstrap";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getTableDataForApplicationManager } from "../../../redux/actions";
import { RootState } from "../../../redux/store";
import SkeletonTable from "../Application/TableSkeleton";
import { formatString } from "../../../utils/formatData";
import axios from "axios";
import { getApplicationByUser } from "../../../redux/KYC/actions";
import { baseUrl, customStyles, showErrorAlert, showSuccessAlert } from "../../../constants";
import { FormInput } from "../../../components";
const sizePerPageList = [
  {
    text: "10",
    value: 2,
  },
];

export const applicationsStatuses = {
  pending: "pending",
  submitted: "submitted",
  offer_accepted: "offer_accepted",
  rejected: "rejected",
};

export const offerLetterTypes = [
  { label: "Conditional", value: "conditional" },
  { label: "Unconditional", value: "unconditional" },
];

const filterOptions = [
  { value: "pending", label: "Pending" },
  { value: "offer_accepted", label: "Offer accepted" },
  { value: "submitted", label: "Submitted" },
];

const ApplicationsManagerTable = React.memo(() => {
  console.count("COUNT");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterValue, setFilterValue] = useState("all");

  const [showLetterModal, setShowLetterModal] = useState<any>(false);
  const [selectedOfferType, setSelectedOfferType] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>("");

  const { applications, error, loading } = useSelector((state: RootState) => ({
    applications: state.ApplicationManagerData?.applications.data,
    error: state.ApplicationManagerData?.error,
    loading: state.ApplicationManagerData?.loading,
  }));

  const handleViewAllLeads = () => {
    navigate("kyc_details/applications/pending");
  };

  const handleOfferSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("offer_letter", selectedFile[0]);
      formData.append("offer_letter_type", selectedOfferType?.value);

      const res = await axios.put(`/provide_offer/${selectedApplication}`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      if (res) {
        showSuccessAlert("Offer Submitted Successfully");
        handleReset();
        dispatch(getApplicationByUser(applicationsStatuses.submitted));
        dispatch(getTableDataForApplicationManager())
      }
    } catch (error) {
      showErrorAlert("Something went wrong");
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedOfferType(null);
    setShowLetterModal(false);
  };

  const toggleLetterModal = () => {
    setShowLetterModal(!showLetterModal);
  };

  const handleFileUpload = (e: any) => {
    setSelectedFile(e?.target?.files);
  };

  const handleDownload = (event: any, file_path: any) => {
    event.preventDefault();

    const fileUrl = `${baseUrl}${file_path}`;

    const link = document.createElement("a");
    link.setAttribute("target", "_blank");

    link.href = fileUrl;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    dispatch(getApplicationByUser(applicationsStatuses.offer_accepted));
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
      Header: "Application Status",
      accessor: "application_status", // Corrected accessor for status
      sort: false,
      minWidth: 150,
      Cell: ({ row }: any) => <span>{formatString(row.original.application_status)}</span>,
    },

    {
      Header: "Actions",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => {
        const isChecksPassed = row.original?.is_application_checks_passed;
        const universityId = row.original?.studyPreferenceDetails?.preferred_university?.id;
        const applicationId = row.original?.id;
        const comments = row.original?.comments;
        const reference_id = row.original?.reference_id;
        const application_status = row.original?.application_status;

        const navigateTo = (type: string) => {
          switch (type) {
            case "checks":
              navigate(`/kyc_details/pending/${row.original.id}`);
              break;
            case "portal":
              navigate("/kyc_details/pending/portal_details", {
                state: { universityId: universityId, applicationId: applicationId, comments, reference_id },
              });
              break;
            default:
              navigate(`/kyc_details/pending/${row.original.id}`);
              break;
          }
        };

        return (
          <>
            {application_status == "pending" && (
              <div className="d-flex justify-content-center align-items-center gap-2">
                {/* View Icon */}
                <span className="action-icon" onClick={() => navigateTo(isChecksPassed ? "portal" : "checks")}>
                  <i className="fs-3 mdi mdi-arrow-right-drop-circle-outline"></i>
                </span>

                {/* Eye Icon */}
                <span
                  className="action-icon"
                  onClick={() =>
                    navigate(`/kyc_details/${row.original.studyPreferenceDetails?.studyPreference?.userPrimaryInfoId}/${row.original.id}`)
                  }
                >
                  <i className="fs-3 mdi mdi-eye-outline"></i>
                </span>
              </div>
            )}

            {application_status == "submitted" && (
              <div className="d-flex justify-content-center align-items-center gap-2">
                {/* Eye Icon */}
                <span
                  className="action-icon"
                  onClick={() =>
                    navigate(`/kyc_details/${row.original.studyPreferenceDetails?.studyPreference?.userPrimaryInfoId}/${row.original.id}`)
                  }
                >
                  <i className="fs-3 mdi mdi-eye-outline"></i>
                </span>

                {/* Cloud Icon */}
                <span
                  className="action-icon"
                  onClick={() => [
                    setSelectedApplication(row.original.id),
                    setShowLetterModal(true),
                    setSelectedFile(null),
                    setSelectedOfferType(null),
                  ]}
                >
                  <i className="fs-3 mdi mdi-cloud-upload-outline"></i>
                </span>
              </div>
            )}

            {application_status == "offer_accepted" && (
              <div className="d-flex justify-content-center align-items-center gap-2">
                {/* Eye Icon */}
                <span
                  className="action-icon"
                  onClick={() =>
                    navigate(`/kyc_details/${row.original.studyPreferenceDetails?.studyPreference?.userPrimaryInfoId}/${row.original.id}`)
                  }
                >
                  <i className="fs-3 mdi mdi-eye-outline"></i>
                </span>

                {/* File Icon */}
                <span className="action-icon" onClick={(e) => handleDownload(e, row.original?.offer_letter)}>
                  <i className="fs-3 mdi mdi-file-document-outline"></i>
                </span>
              </div>
            )}
          </>
        );
      },

      minWidth: 150,
    },
  ];

  useEffect(() => {
    dispatch(getTableDataForApplicationManager());
  }, []);

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    dispatch(getTableDataForApplicationManager(value == "all" ? undefined : value));
  };

  if (loading) return <SkeletonTable />;

  return (
    <>
      <Modal show={showLetterModal} onHide={toggleLetterModal} size="lg" dialogClassName="modal-dialog-centered">
        <Modal.Header closeButton>
          <h3>Offer Letter</h3>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Row className="mb-4">
              <Form.Label>Offer Letter Type</Form.Label>
              <Select
                styles={customStyles}
                className="react-select react-select-container"
                classNamePrefix="react-select"
                name="offer_letter_type"
                options={offerLetterTypes}
                value={selectedOfferType}
                onChange={(selected: any) => setSelectedOfferType(selected)}
              />
            </Row>
            <Row>
              <FormInput
                label="Offer Letter"
                type="file"
                accept="image/*,application/pdf"
                name="offer-Letter"
                onChange={(e) => handleFileUpload(e)}
              />
            </Row>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-danger waves-effect waves-light"
            onClick={() => [toggleLetterModal(), setSelectedFile(null), setSelectedOfferType(null)]}
          >
            Close
          </Button>
          <Button
            className="btn-success waves-effect waves-light"
            disabled={selectedFile == null || selectedOfferType == null}
            onClick={handleOfferSubmit}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        <Col md={12}>
          <Card className="bg-white">
            <Card.Body>
              <Row className="mb-2">
                <div className="d-flex flex-column align-items-end">
                  <Form.Group>
                    <Form.Label className="text-muted fw-semibold small mb-0">Status</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        id="country-dropdown"
                        className="btn-sm btn-outline-secondary text-truncate"
                        style={{
                          minWidth: "150px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {filterOptions.find((option) => option.value === filterValue)?.label || "All"}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {[{ value: "all", label: "All" }, ...filterOptions].map((option) => (
                          <Dropdown.Item key={option.value} onClick={() => handleFilterChange(option.value)}>
                            {option.label}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                </div>
              </Row>
              <Row>
                <Table
                  columns={columns}
                  data={applications ? applications : []}
                  pageSize={2}
                  sizePerPageList={sizePerPageList}
                  isSortable={true}
                  pagination={false}
                  isSearchable={false}
                  tableClass="table-striped dt-responsive nowrap w-100"
                  initialLoading={false}
                  isDashboard={true}
                />
                {/* <div className="d-flex justify-content-end mt-3">
            <Button type="button" className="btn-sm" onClick={handleViewAllLeads}>
              View All
            </Button>
          </div> */}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

export default memo(ApplicationsManagerTable);
