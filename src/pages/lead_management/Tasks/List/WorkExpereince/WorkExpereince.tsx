import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import WorkExpRow from ".././WorkExpereince/WorkExpRow";
import useRemoveFromApi from "../../../../../hooks/useRemoveFromApi";

import { RootState } from "../../../../../redux/store";
import validateFields from "../../../../../helpers/validateHelper";
import useSaveWorkInfo from "../../../../../hooks/useSaveWorkInfo";
import GapRows from ".././gapRow";
import EmploymentHistory from ".././EmploymentHistory";
import { useSelector } from "react-redux";
import SkeletonComponent from "../StudyPreference/LoadingSkeleton";
import { regrexValidation } from "../../../../../utils/regrexValidation";
import { showErrorAlert } from "../../../../../constants";
import { allowedFileTypes } from "../data";

const initialStateWork = {
  years: 0,
  designation: "",
  company: "",
  from: "",
  to: "",
  bank_statement: null,
  job_offer_document: null,
  appointment_document: null,
  payslip_document: null,
  experience_certificate: null,
  errors: {},
};

const initialGapState = {
  start_date: "",
  end_date: "",
  reason: "",
  supporting_document: null,
  errors: {},
};

const WorkExpereince = withSwal((props: any) => {
  const { swal, studentId } = props;
  const [initialLoading, setInitialLoading] = useState(false);
  // const [hasGap, setHasGap] = useState("no");
  const [hasGap, setHasGap] = useState<boolean>(false);
  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);
  const [workExperienceFromApi, setWorkExperienceFromApi] = useState<any>(null);
  const [gap, setGap] = useState<any>(initialGapState);
  const { saveLoading: workSaveLoading, saveWorkDetails } = useSaveWorkInfo(studentId);
  const [hasWorkExp, setHasWorkExp] = useState<boolean>(false)

  const { removeFromApi, loading: deleteLoading } = useRemoveFromApi();

  const getAcademicInfo = useCallback(async () => {
    setInitialLoading(true);
    try {
      // Fetch both API calls concurrently
      const [workResponse, gapResponse] = await Promise.all([
        axios.get(`studentWorkInfo/${studentId}`),
        axios.get(`gapReason/${studentId}/work`),
      ]);

      const workData = workResponse.data?.data;
      const gapData = gapResponse.data?.data;

      // Use helper functions to check the data and set state
      setWorkExperienceFromApi(workData.length > 0 ? workData : [initialStateWork]);
      setGap(gapData.length > 0 ? gapData : [initialGapState]);
      // setHasGap(gapData.length > 0 ? "yes" : "no");
      setHasGap(gapData.length > 0 ? true : false);
      setHasWorkExp(workData.length > 0 ? true : false)
    } catch (error) {
      console.error("Error fetching academic info:", error);
    } finally {
      setInitialLoading(false);
    }
  }, [studentId]);

  // useEffect to fetch academic info when studentId or refresh changes
  useEffect(() => {
    if (studentId) {
      getAcademicInfo();
    }
  }, [studentId, refresh, getAcademicInfo]);

  const saveWorkData = useCallback(async () => {
    const validationRules = {
      years: { required: true, message: "Please enter the number of years" },
      designation: { required: true, message: "Please enter a designation" },
      company: { required: true, message: "Please enter a company name" },
      from: { required: true, message: "Please select a start date" },
      to: { required: true, message: "Please select an end date" },
      bank_statement: { required: true, message: "Please upload a bank statement" },
      job_offer_document: { required: true, message: "Please upload a job offer document" },
      appointment_document: { required: true, message: "Please upload an appointment document" },
      payslip_document: { required: true, message: "Please upload a payslip document" },
      experience_certificate: { required: true, message: "Please upload an experience certificate" },
    };

    const { isValid, errors } = validateFields(workExperienceFromApi, validationRules);

    if (!isValid) {
      setWorkExperienceFromApi((prevState: any) =>
        prevState.map((exp: any, index: any) => ({
          ...exp,
          errors: errors[index] || {},
        }))
      );
      return;
    }

    saveWorkDetails(workExperienceFromApi, hasWorkExp);
  }, [workExperienceFromApi]);

  const handleWorkExperienceChange = (name: string, value: any, index: number) => {

    if (typeof value == 'object' && !allowedFileTypes.includes(value.type)) {
      showErrorAlert("Only PDF and image files are allowed.");
      return;
    }

    if (!regrexValidation(name, value)) {
      console.error(`Invalid ${name}: ${value}`);
      return; // Stop updating if validation fails
    }

    setWorkExperienceFromApi((prevState: any) =>
      prevState.map((item: any, i: number) => (i === index ? { ...item, [name]: value } : item))
    );
  };

  const addMoreWorkExperience = () => {
    setWorkExperienceFromApi((prevState: any) => [...prevState, { ...initialStateWork }]);
  };

  const removeWorkExperience = (index: number, itemId: number) => {
    if (itemId === 0) {
      setWorkExperienceFromApi((prevState: any) => prevState.filter((_: any, i: number) => i !== index));
    } else {
      removeFromApi(itemId, "work");
    }
  };

  return (
    <>
      {initialLoading ? (
        <SkeletonComponent />
      ) : (
        <>
            <Row className="mt-3">
              <Col>
                <Form.Group className="mb-3" controlId="source_id">
                  <Form.Label>Do you have any work experience?</Form.Label>
                  <div className="d-flex justify-content-start align-items-center mt-1">
                    <Form.Check
                      type="radio"
                      name="hasExams"
                      checked={hasWorkExp}
                      onChange={() => setHasWorkExp(true)}
                      label={<span className="ps-1 fw-bold">Yes</span>}
                    />
                    <Form.Check
                      type="radio"
                      name="hasExams"
                      checked={!hasWorkExp}
                      onChange={() => setHasWorkExp(false)}
                      label={<span className="ps-1 fw-bold">No</span>}
                      className="ms-3"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

          {hasWorkExp &&
            <>
              <Row className={deleteLoading || workSaveLoading ? "opacity-25 pe-0" : ""}>
                <WorkExpRow
                  workExperienceData={workExperienceFromApi}
                  handleWorkExperienceChange={handleWorkExperienceChange}
                  addMoreWorkExperience={addMoreWorkExperience}
                  removeWorkExperience={removeWorkExperience}
                />
              </Row>
              <Row>
                <Button variant="primary" className="mt-4" type="submit" onClick={saveWorkData} disabled={workSaveLoading}>
                  {workSaveLoading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      {" Saving..."}
                    </>
                  ) : (
                    "Save Work Experience Details"
                  )}
                </Button>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Label className="mt-3">Has Gap in Work?</Form.Label>
                </Col>

                <Col className="d-flex gap-2">
                  <Form.Check
                    type="radio"
                    id="hasGapYes"
                    label="Yes"
                    // checked={hasGap === "yes"}
                    checked={hasGap}
                    // onChange={() => setHasGap("yes")}
                    onChange={() => setHasGap(true)}
                    name="hasGap"
                  />

                  <Form.Check
                    type="radio"
                    id="hasGapNo"
                    label="No"
                    // checked={hasGap === "no"}
                    checked={!hasGap}
                    // onChange={() => setHasGap("no")}
                    onChange={() => setHasGap(false)}
                    name="hasGap"
                  />
                </Col>
              </Row>
            </>
          }
          {/* {hasGap === "yes" && ( */}
          {hasGap && (
            <>
              <Row className="mt-4">
                <GapRows gapData={gap} studentId={studentId} type="work" hasGap={hasGap} />
              </Row>
            </>
          )}
          <Row>
            <EmploymentHistory studentId={studentId} />
          </Row>
        </>
      )}
    </>
  );
});

export default WorkExpereince;
