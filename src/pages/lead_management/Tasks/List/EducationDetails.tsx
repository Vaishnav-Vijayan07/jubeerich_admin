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

const initialPrimaryState = {
  id: null,
  qualification: "10th",
  startDate: "",
  endDate: "",
  percentage: "",
  certificate: null,
  mark_sheet: null,
  admit_card: null,
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
};

const initialGraduationState = {
  qualification: "",
  start_date: "",
  end_date: "",
  percentage: "",
  conversion_formula: "",
  certificate: null,
  admit_card: null,
  registration_certificate: null,
  backlog_certificate: null,
  grading_scale_info: null,
};

const EducationDetails = withSwal((props: any) => {
  const { swal, studentId } = props;
  const [hasGraduation, setHasGraduation] = useState("no");
  const [initialLoading, setInitialLoading] = useState(false);

  const refresh = useSelector(
    (state: RootState) => state.refreshReducer.refreshing
  );

  const [primaryDetails, setPrimaryDetails] = useState(initialPrimaryState);
  const [secondaryDetails, setSecondaryDetails] = useState(
    initialSecondaryState
  );

  const [graduationDetails, setGraduationDetails] = useState(
    initialGraduationState
  );

  const primarySchema = Yup.object().shape({
    startDate: Yup.string().required("Start date is required."),
    endDate: Yup.string().required("End date is required."),
    percentage: Yup.string().required("Percentage is required."),
  });

  const secondarySchema = Yup.object().shape({
    startDate: Yup.string().required("Start date is required."),
    endDate: Yup.string().required("End date is required."),
    percentage: Yup.string().required("Percentage is required."),
  });

  const { formErrors: primaryErrors, validateForm: validatePrimary } =
    useFormState(primaryDetails, primarySchema);

  const { formErrors: secondaryErrors, validateForm: validateSecondary } =
    useFormState(secondaryDetails, secondarySchema);

  const { loading, saveEducationDetails } = useSaveEducationDetails(studentId);

  const fetchEducationDetails = async (studentId: string) => {
    setInitialLoading(true);
    try {
      const { data } = await axios.get(`/studentPrimaryEducation/${studentId}`);
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
    setPrimaryDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  // Handlers for secondary education state update
  const handleSecondaryChange = (name: string, value: any) => {
    setSecondaryDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSavePrimary = async () => {
    const isValid = await validatePrimary();
    if (isValid) {
      const formData = new FormData();
      formData.append("student_id", studentId);
      formData.append("operation", primaryDetails.id ? "update" : "add");
      formData.append("primary[qualification]", primaryDetails.qualification);
      formData.append("primary[startDate]", primaryDetails.startDate);
      formData.append("primary[endDate]", primaryDetails.endDate);
      formData.append("primary[percentage]", primaryDetails.percentage);
      if (primaryDetails.mark_sheet) {
        formData.append("primary_mark_sheet", primaryDetails.mark_sheet);
      }
      if (primaryDetails.certificate) {
        formData.append("primary_certificate", primaryDetails.certificate);
      }
      if (primaryDetails.admit_card) {
        formData.append("primary_admit_card", primaryDetails.admit_card);
      }
      await saveEducationDetails(formData, "primary", studentId);
    }
  };

  const handleSaveSecondary = async () => {
    const isValid = await validateSecondary();
    if (isValid) {
      const formData = new FormData();
      formData.append("student_id", studentId);
      formData.append("operation", secondaryDetails.id ? "update" : "add");
      formData.append(
        "secondary[qualification]",
        secondaryDetails.qualification
      );
      formData.append("secondary[startDate]", secondaryDetails.startDate);
      formData.append("secondary[endDate]", secondaryDetails.endDate);
      formData.append("secondary[percentage]", secondaryDetails.percentage);
      if (secondaryDetails.mark_sheet) {
        formData.append("secondary_mark_sheet", secondaryDetails.mark_sheet);
      }
      if (secondaryDetails.certificate) {
        formData.append("secondary_certificate", secondaryDetails.certificate);
      }
      if (secondaryDetails.admit_card) {
        formData.append("secondary_admit_card", secondaryDetails.admit_card);
      }
      await saveEducationDetails(formData, "secondary", studentId);
    }
  };

  if (loading || initialLoading) {
    return (
      <Spinner
        animation="border"
        style={{ position: "absolute", top: "100%", left: "45%" }}
      />
    );
  }

  return (
    <>
      {/* Primary Education Section */}
      <Row>
        <PrimaryEducationDetails
          title="Primary Education Details"
          details={primaryDetails}
          onChange={handlePrimaryChange}
          errors={primaryErrors}
        />
      </Row>
      <Row className="mb-2">
        <Button variant="primary" className="mt-4" onClick={handleSavePrimary}>
          Save Primary Info
        </Button>
      </Row>

      <>
        <Row>
          <PrimaryEducationDetails
            title="Secondary Education Details"
            details={secondaryDetails}
            onChange={handleSecondaryChange}
            errors={secondaryErrors}
          />
        </Row>

        {/* Move Save Button below Secondary Education Section */}
        <Row className="mb-2">
          <Button
            variant="primary"
            className="mt-4"
            onClick={handleSaveSecondary}
          >
            Save Secondary Info
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
