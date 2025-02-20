import moment from "moment";
import React, { useEffect, useState } from "react";
import { getApplicationByUser } from "../../../../redux/KYC/actions";
import PageTitle from "../../../../components/PageTitle";
import { Button, Card, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../../redux/store";
import Table from "../../../../components/Table";
import { Form } from "react-bootstrap";
import Select from "react-select";
import { customStyles, showErrorAlert, showSuccessAlert } from "../../../../constants";
import { FormInput } from "../../../../components";
import axios from "axios";

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

const Submitted = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLetterModal, setShowLetterModal] = useState<any>(false);
  const [selectedOfferType, setSelectedOfferType] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>("");
  const [applicationCountryId, setApplicationCountryId] = useState<any>(null);

  const { records, initialloading } = useSelector((state: RootState) => ({
    records: state.KYC.KYCSPending.data,
    initialloading: state.KYC.initialloading,
  }));

  useEffect(() => {
    dispatch(getApplicationByUser(applicationsStatuses.submitted));
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
    // {
    //   Header: "Assigned Counselor",
    //   accessor: "", // You can fill in this accessor if needed for sorting, etc.
    //   sort: false,
    //   Cell: ({ row }: any) => {
    //     const assignedCounselor = row?.original?.studyPreferenceDetails?.studyPreference?.userPrimaryInfo?.counselors?.find(
    //       (counselor: any) => counselor?.country_id === row?.original?.studyPreferenceDetails?.studyPreference?.countryId
    //     );

    //     return <span>{assignedCounselor ? assignedCounselor.name : "No counselor assigned"}</span>;
    //   },
    //   minWidth: 150,
    // },
    {
      Header: "KYC Status",
      accessor: "kyc_status", // Corrected accessor for status
      sort: false,
      minWidth: 150,
    },
    {
      Header: "Application Status",
      accessor: "application_status", // Corrected accessor for status
      sort: false,
      minWidth: 150,
    },

    {
      Header: "Actions",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* Eye Icon */}
          <span
            className="action-icon"
            onClick={() =>
              navigate(
                `/kyc_details/${row.original.studyPreferenceDetails?.studyPreference?.userPrimaryInfoId}/${row.original.id}`
              )
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
              setApplicationCountryId(row?.original?.studyPreferenceDetails?.studyPreference?.countryId)
            ]}
          >
            <i className="fs-3 mdi mdi-cloud-upload-outline"></i>
          </span>
        </div>
      ),
      minWidth: 150,
    },
  ];

  const toggleLetterModal = () => {
    setShowLetterModal(!showLetterModal);
  };

  const handleOfferSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("offer_letter", selectedFile[0]);
      formData.append("offer_letter_type", selectedOfferType?.value);
      formData.append("application_country_id", applicationCountryId);

      const res = await axios.put(`/provide_offer/${selectedApplication}`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      if (res) {
        showSuccessAlert("Offer Submitted Successfully");
        handleReset();
        dispatch(getApplicationByUser(applicationsStatuses.submitted));
      }
    } catch (error) {
      showErrorAlert("Something went wrong");
    }
  };

  const handleFileUpload = (e: any) => {
    setSelectedFile(e?.target?.files);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedOfferType(null);
    setShowLetterModal(false);
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Application(Submitted)", path: "", active: true },
        ]}
        title={"Application(Submitted)"}
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
            initialLoading={initialloading}
          />
        </Card.Body>

        <Modal show={showLetterModal} onHide={toggleLetterModal} dialogClassName="modal-dialog-centered">
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
                <FormInput label="Offer Letter" type="file" accept="image/*,application/pdf" name="offer-Letter" onChange={(e) => handleFileUpload(e)} />
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
              Submit and Proceed to Visa
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </>
  );
};

export default Submitted;
