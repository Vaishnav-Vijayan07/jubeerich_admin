import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { withSwal } from "react-sweetalert2";
import PrimaryEducationDetails from "./PrimaryEducationDetails";
import GraduationInfo from "./GraduationInfo";
import * as Yup from "yup";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useFormState } from "../../../../hooks/useFormState";
import useSaveEducationDetails from "../../../../hooks/useSavePrimaryEducationDetails";
import useSaveSecondaryEducationDetails from "../../../../hooks/useSaveSecondaryEducationDetails";
import validateFields from "../../../../helpers/validateHelper";

const initialPrimaryState = {
  id: null,
  qualification: "10th",
  startDate: "",
  endDate: "",
  percentage: "",
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
  certificate: null,
  mark_sheet: null,
  admit_card: null,
  errors: {},
};

const initialGraduationState = {
  qualification: "",
  startDate: "",
  endDate: "",
  percentage: "",
  conversion_formula: "",
  certificate: null,
  admit_card: null,
  registration_certificate: null,
  backlog_certificate: null,
  grading_scale_info: null,
  errors: {},
};

const EducationDetails = withSwal((props: any) => {
  const { swal, studentId } = props;
  const [hasGraduation, setHasGraduation] = useState("no");
  const [initialLoading, setInitialLoading] = useState(false);

  const refresh = useSelector(
    (state: RootState) => state.refreshReducer.refreshing
  );

  const [primaryDetails, setPrimaryDetails] =
    useState<any>(initialPrimaryState);
  const [secondaryDetails, setSecondaryDetails] = useState<any>(
    initialSecondaryState
  );

  const [graduationDetails, setGraduationDetails] = useState<any>(
    initialGraduationState
  );

  const { primaryLoading, savePrimaryEducationDetails } =
    useSaveEducationDetails();

  const { saveSecondaryEducationDetails, secondaryLoading } =
    useSaveSecondaryEducationDetails();

  const fetchEducationDetails = async (studentId: string) => {
    setInitialLoading(true);
    try {
      const { data } = await axios.get(`/studentPrimaryEducation/${studentId}`);
      console.log(data);

      setPrimaryDetails(data.primary || initialPrimaryState);
      setSecondaryDetails(data.secondary || initialSecondaryState);

      data.graduation.length > 0
        ? setHasGraduation("yes")
        : setHasGraduation("no");
      setGraduationDetails(
        data.graduation.length > 0 ? data.graduation : [initialGraduationState]
      );
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

  const handleGraduationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasGraduation(e.target.value);
  };

  // Handlers for primary education state update
  const handlePrimaryChange = (name: string, value: any) => {
    setPrimaryDetails((prevDetails: any) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handlers for secondary education state update
  const handleSecondaryChange = (name: string, value: any) => {
    setSecondaryDetails((prevDetails: any) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSavePrimary = async () => {
    const validationRules = {
      startDate: { required: true },
      endDate: { required: true },
      percentage: { required: true },
      mark_sheet: { required: true },
      certificate: { required: true },
      admit_card: { required: true },
    };

    const { isValid, errors } = validateFields(
      [primaryDetails],
      validationRules
    );

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
      startDate: { required: true },
      endDate: { required: true },
      percentage: { required: true },
      mark_sheet: { required: true },
      certificate: { required: true },
      admit_card: { required: true },
    };

    const { isValid, errors } = validateFields(
      [secondaryDetails],
      validationRules
    );

    if (!isValid) {
      setSecondaryDetails((prevState: any) => ({
        ...prevState,
        errors: errors[0] || {}, // Attach errors to specific fields
      }));
      return;
    }

    await saveSecondaryEducationDetails(
      secondaryDetails,
      "secondary",
      studentId
    );
  };

  if (primaryLoading || secondaryLoading || initialLoading) {
    return (
      <Spinner
        animation="border"
        style={{ position: "absolute", top: "100%", left: "45%" }}
      />
    );
  }

  console.log(primaryDetails);

  return (
    <>
      {/* Primary Education Section */}
      <Row>
        <PrimaryEducationDetails
          title="Primary Education Details"
          details={primaryDetails}
          onChange={handlePrimaryChange}
        />
      </Row>
      <Row className="mb-2">
        <Button
          variant="primary"
          className="mt-4"
          onClick={handleSavePrimary}
          disabled={primaryLoading}
        >
          {primaryLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              {" Saving..."} {/* Show spinner and text */}
            </>
          ) : (
            "Save Primary Info" // Normal button text when not loading
          )}
        </Button>
      </Row>

      <>
        <Row>
          <PrimaryEducationDetails
            title="Secondary Education Details"
            details={secondaryDetails}
            onChange={handleSecondaryChange}
          />
        </Row>

        {/* Move Save Button below Secondary Education Section */}
        <Row className="mb-2">
          <Button
            variant="primary"
            className="mt-4"
            onClick={handleSaveSecondary}
            disabled={secondaryLoading}
          >
            {secondaryLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                {" Saving..."} {/* Show spinner and text */}
              </>
            ) : (
              "Save Secondary Info" // Normal button text when not loading
            )}
          </Button>
        </Row>

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
                  value="yes"
                  checked={hasGraduation === "yes"}
                  onChange={handleGraduationChange}
                />
                <Form.Check
                  inline
                  label="No"
                  type="radio"
                  name="hasGraduation"
                  value="no"
                  checked={hasGraduation === "no"}
                  onChange={handleGraduationChange}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </>

      {/* Graduation Details Section */}
      {hasGraduation === "yes" && (
        <>
          <Row>
            <GraduationInfo
              title="Graduation Details"
              details={graduationDetails}
              student_id={studentId}
            />
          </Row>
        </>
      )}
    </>
  );
});

export default EducationDetails;
