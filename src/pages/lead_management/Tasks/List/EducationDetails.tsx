import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button, Spinner, Modal } from "react-bootstrap";
import { withSwal } from "react-sweetalert2";
import PrimaryEducationDetails from "./PrimaryEducationDetails";
import GraduationInfo from "./GraduationInfo";
import axios from "axios";
import { showErrorAlert } from "../../../../constants";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import useSaveEducationDetails from "../../../../hooks/useSavePrimaryEducationDetails";
import useSaveSecondaryEducationDetails from "../../../../hooks/useSaveSecondaryEducationDetails";
import validateFields from "../../../../helpers/validateHelper";
import GapRow from "./gapRow";
import GapRows from "./gapRow";
import SkeletonComponent from "./StudyPreference/LoadingSkeleton";
import { regrexValidation } from "../../../../utils/regrexValidation";
import { allowedFileTypes } from "./data";
import { useHistoryModal } from "../../../../hooks/useHistoryModal";
import FieldHistoryTable from "../../../../components/FieldHistory";

const initialPrimaryState = {
  id: null,
  qualification: "10th",
  startDate: "",
  endDate: "",
  percentage: "",
  board_name: "",
  school_name: "",
  certificate: null,
  mark_sheet: null,
  admit_card: null,
  errors: {},
};

const initialSecondaryState = {
  id: null,
  qualification: "plustwo",
  startDate: "",
  endDate: "",
  percentage: "",
  board_name: "",
  school_name: "",
  certificate: null,
  mark_sheet: null,
  admit_card: null,
  errors: {},
};

const initialGraduationState = {
  qualification: "",
  university_name: "",
  college_name: "",
  startDate: "",
  endDate: "",
  percentage: "",
  conversion_formula: "",
  certificate: null,
  admit_card: null,
  registration_certificate: null,
  backlog_certificate: null,
  grading_scale_info: null,
  transcript: null,
  individual_marksheet: null,
  errors: {},
};

const initialGapState = {
  start_date: "",
  end_date: "",
  reason: "",
  supporting_document: null,
  errors: {},
};

const EducationDetails = withSwal((props: any) => {
  const { swal, studentId } = props;
  // const [hasGraduation, setHasGraduation] = useState("no");
  const { historyModal, toggleHistoryModal } = useHistoryModal();
  const [hasGraduation, setHasGraduation] = useState(false);
  // const [hasGap, setHasGap] = useState("no");
  const [hasGap, setHasGap] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [gap, setGap] = useState<any>(initialGapState);

  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);

  const [primaryDetails, setPrimaryDetails] = useState<any>(initialPrimaryState);
  const [secondaryDetails, setSecondaryDetails] = useState<any>(initialSecondaryState);

  const [graduationDetails, setGraduationDetails] = useState<any>(initialGraduationState);

  const { primaryLoading, savePrimaryEducationDetails } = useSaveEducationDetails();

  const { saveSecondaryEducationDetails, secondaryLoading } = useSaveSecondaryEducationDetails();

  const fetchEducationDetails = async (studentId: string) => {
    setInitialLoading(true);
    try {
      const [educationResponse, gapResponse] = await Promise.all([
        axios.get(`/studentPrimaryEducation/${studentId}`),
        axios.get(`gapReason/${studentId}/education`),
      ]);

      const educationData = educationResponse.data;
      const gapData = gapResponse.data.data;

      setPrimaryDetails(educationData.primary || initialPrimaryState);
      setSecondaryDetails(educationData.secondary || initialSecondaryState);

      // educationData.graduation.length > 0 ? setHasGraduation("yes") : setHasGraduation("no");
      educationData.graduation.length > 0 ? setHasGraduation(true) : setHasGraduation(false);
      setGraduationDetails(educationData.graduation.length > 0 ? educationData.graduation : [initialGraduationState]);
      setGap(gapData.length > 0 ? gapData : [initialGapState]);
      // setHasGap(gapData.length > 0 ? "yes" : "no");
      setHasGap(gapData.length > 0 ? true : false);
    } catch (error) {
      console.error("Error fetching student education details:", error);
      showErrorAlert("Failed to fetch education details");
    } finally {
      setInitialLoading(false);
    }
  };
  

  useEffect(() => {
    if (studentId) {
      fetchEducationDetails(studentId);
    }
  }, [refresh]);

  // const handleGraduationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setHasGraduation(e.target.value);
  // };

  const handleGraduationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasGraduation(e.target.value === "true");
  };

  // const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setHasGap(e.target.value);
  // };

  const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasGap(e.target.value === "true");
  };

  // Handlers for primary education state update
  const handlePrimaryChange = (name: string, value: any) => {
    if (typeof value == "object" && !allowedFileTypes.includes(value.type)) {
      showErrorAlert("Only PDF and image files are allowed.");
      return;
    }

    if (!regrexValidation(name, value)) {
      console.error(`Invalid ${name}: ${value}`);
      return; // Stop updating if validation fails
    }

    setPrimaryDetails((prevDetails: any) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handlers for secondary education state update
  const handleSecondaryChange = (name: string, value: any) => {
    if (typeof value == "object" && !allowedFileTypes.includes(value.type)) {
      showErrorAlert("Only PDF and image files are allowed.");
      return;
    }

    if (!regrexValidation(name, value)) {
      console.error(`Invalid ${name}: ${value}`);
      return; // Stop updating if validation fails
    }

    setSecondaryDetails((prevDetails: any) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSavePrimary = async () => {
    const validationRules = {
      startDate: { required: false, message: "Please select a start date" },
      endDate: { required: false, message: "Please select an end date" },
      percentage: { required: false, message: "Please enter a percentage" },
      mark_sheet: { required: false, message: "Please upload a mark sheet" },
      certificate: { required: false, message: "Please upload a certificate" },
      admit_card: { required: false, message: "Please upload an admit card" },
      board_name: { required: false, message: "Please enter a board name" },
      school_name: { required: true, message: "Please enter a school name" },
    };

    const { isValid, errors } = validateFields([primaryDetails], validationRules);

    console.log(errors);

    if (!isValid) {
      setPrimaryDetails((prevState: any) => ({
        ...prevState,
        errors: errors[0] || {}, // Attach errors to specific fields
      }));
      return;
    }
    await savePrimaryEducationDetails(primaryDetails, "primary", studentId);
  };

  const handleSaveSecondary = async () => {
    const validationRules = {
      startDate: { required: false, message: "Please select a start date" },
      endDate: { required: false, message: "Please select an end date" },
      percentage: { required: false, message: "Please enter a percentage" },
      mark_sheet: { required: false, message: "Please upload a mark sheet" },
      certificate: { required: false, message: "Please upload a certificate" },
      admit_card: { required: false, message: "Please upload an admit card" },
      board_name: { required: false, message: "Please enter a board name" },
      school_name: { required: true, message: "Please enter a school name" },
    };

    const { isValid, errors } = validateFields([secondaryDetails], validationRules);

    if (!isValid) {
      setSecondaryDetails((prevState: any) => ({
        ...prevState,
        errors: errors[0] || {}, // Attach errors to specific fields
      }));
      return;
    }

    await saveSecondaryEducationDetails(secondaryDetails, "secondary", studentId);
  };

  return (
    <>
      {initialLoading ? (
        <SkeletonComponent />
      ) : (
        <>
          <Modal show={historyModal} onHide={toggleHistoryModal} centered dialogClassName={"modal-full-width"} scrollable>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body style={{ margin: "0 !important", padding: "0 !important" }}>
              <FieldHistoryTable apiUrl={"educationDetails"} studentId={studentId} />
            </Modal.Body>
          </Modal>
          {/* Primary Education Section */}
          <Row className="mb-2">
            <div className="d-flex justify-content-between">
              <h5 className="mb-4 text-uppercase">
                <i className="mdi mdi-school me-1"></i>Education Details
              </h5>

              <Button
                className="btn-sm btn-secondary waves-effect waves-light float-end me-2"
                onClick={toggleHistoryModal}
                style={{ height: "fit-content" }}
              >
                <i className="mdi mdi-history"></i> View History
              </Button>
            </div>
          </Row>
          <Row className="bg-light py-4 mb-3 ps-3">
            <PrimaryEducationDetails title="Primary Education Details" details={primaryDetails} onChange={handlePrimaryChange} />
            <Button variant="primary" className="mt-0 mx-2" style={{ width: "fit-content" }} onClick={handleSavePrimary} disabled={primaryLoading}>
              {primaryLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  {" Saving..."} {/* Show spinner and text */}
                </>
              ) : (
                "Save Primary Info" // Normal button text when not loading
              )}
            </Button>
          </Row>

          <>
            <Row className="bg-light py-4 mb-3 ps-3">
              <PrimaryEducationDetails title="Secondary Education Details" details={secondaryDetails} onChange={handleSecondaryChange} />

              <Button variant="primary" className="ms-2 w-auto" onClick={handleSaveSecondary} disabled={secondaryLoading}>
                {secondaryLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    {" Saving..."}
                  </>
                ) : (
                  "Save Secondary Info"
                )}
              </Button>
            </Row>

            {/* Move Save Button below Secondary Education Section */}
            {/* <Row className="mb-2">
              <Button variant="primary" className="mt-4" onClick={handleSaveSecondary} disabled={secondaryLoading}>
                {secondaryLoading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    {" Saving..."} 
                  </>
                ) : (
                  "Save Secondary Info"
                )}
              </Button>
            </Row> */}

            {/* Radio button for Graduation */}
            <Row className="mt-4">
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Are you a Graduate?</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Yes"
                      type="radio"
                      name="hasGraduation"
                      // value="yes"
                      value="true"
                      // checked={hasGraduation === "yes"}
                      checked={hasGraduation}
                      onChange={handleGraduationChange}
                    />
                    <Form.Check
                      inline
                      label="No"
                      type="radio"
                      name="hasGraduation"
                      // value="no"
                      value="false"
                      // checked={hasGraduation === "no"}
                      checked={!hasGraduation}
                      onChange={handleGraduationChange}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </>

          {/* Graduation Details Section */}
          {/* {hasGraduation === "yes" && ( */}
          {hasGraduation && (
            <>
              <Row className="bg-light py-4 mb-3 ps-3">
                <GraduationInfo title="Graduation Details" details={graduationDetails} student_id={studentId} hasGraduation={hasGraduation} />
              </Row>
            </>
          )}

          {/* Radio button for Graduation */}
          <Row className="mt-4">
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Education Gap?</Form.Label>
                <div>
                  {/* <Form.Check inline label="Yes" type="radio" name="hasGap" value="yes" checked={hasGap === "yes"} onChange={handleGapChange} /> */}
                  <Form.Check inline label="Yes" type="radio" name="hasGap" value="true" checked={hasGap} onChange={handleGapChange} />
                  {/* <Form.Check inline label="No" type="radio" name="hasGap" value="no" checked={hasGap === "no"} onChange={handleGapChange} /> */}
                  <Form.Check inline label="No" type="radio" name="hasGap" value="false" checked={!hasGap} onChange={handleGapChange} />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Gap Details Section */}

          {/* {hasGap === "yes" && ( */}
          {hasGap && (
            <>
              <Row className="bg-light py-4 mb-3 ps-3">
                <GapRows gapData={gap} studentId={studentId} type="education" hasGap={hasGap} />
              </Row>
            </>
          )}
        </>
      )}
    </>
  );
});

export default EducationDetails;
