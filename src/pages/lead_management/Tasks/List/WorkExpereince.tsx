import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import WorkExpRow from "./WorkExpRow";
import useRemoveFromApi from "../../../../hooks/useRemoveFromApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import validateFields from "../../../../helpers/validateHelper";
import useSaveWorkInfo from "../../../../hooks/useSaveWorkInfo";
import GapRows from "./gapRow";
import useSaveGapData from "../../../../hooks/useSaveGapData";

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
  errors: {},
};

const initialFundPlanState = {
  start_date: "",
  end_date: "",
  reason: "",
  supporting_document: null,
  errors: {},
};

const WorkExpereince = withSwal((props: any) => {
  const { swal, studentId } = props;
  const [initialLoading, setInitialLoading] = useState(false);
  const [hasGap, setHasGap] = useState("no");
  const refresh = useSelector(
    (state: RootState) => state.refreshReducer.refreshing
  );
  const [workExperienceFromApi, setWorkExperienceFromApi] = useState<any>(null);
  const [gap, setGap] = useState<any>([initialFundPlanState]);
  const { removeFromApi, loading: deleteLoading } = useRemoveFromApi();
  const { saveLoading: workSaveLoading, saveWorkDetails } =
    useSaveWorkInfo(studentId);

  const { saveLoading: gapSaveLoading, saveGapData } =
    useSaveGapData(studentId);

  const getAcademicInfo = useCallback(async () => {
    setInitialLoading(true);
    try {
      // Fetch both API calls concurrently
      const [workResponse, gapResponse] = await Promise.all([
        axios.get(`studentWorkInfo/${studentId}`),
        axios.get(`gapReason/${studentId}`),
      ]);

      const workData = workResponse.data?.data;
      const gapData = gapResponse.data?.data;

      // Use helper functions to check the data and set state
      setWorkExperienceFromApi(
        workData.length > 0 ? workData : [initialStateWork]
      );
      setGap(gapData.length > 0 ? gapData : [initialFundPlanState]);
      setHasGap(gapData.length > 0 ? "yes" : "no");
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
      years: { required: true },
      designation: { required: true },
      company: { required: true },
      from: { required: true },
      to: { required: true },
      bank_statement: { required: true },
      job_offer_document: { required: true },
      appointment_document: { required: true },
      payslip_document: { required: true },
    };

    const { isValid, errors } = validateFields(
      workExperienceFromApi,
      validationRules
    );

    if (!isValid) {
      setWorkExperienceFromApi((prevState: any) =>
        prevState.map((exp: any, index: any) => ({
          ...exp,
          errors: errors[index] || {},
        }))
      );
      return;
    }

    saveWorkDetails(workExperienceFromApi);
  }, [workExperienceFromApi]);

  const saveGap = useCallback(async () => {
    
    const validationRules = {
      start_date: { required: true },
      end_date: { required: true },
      reason: { required: true },
      supporting_document: { required: true },
    };

    const { isValid, errors } = validateFields(gap, validationRules);

    if (!isValid) {
      setGap((prevState: any) =>
        prevState.map((exp: any, index: any) => ({
          ...exp,
          errors: errors[index] || {},
        }))
      );
      return;
    }

    saveGapData(gap);
  }, [gap]);

  const handleWorkExperienceChange = useCallback(
    (name: string, value: any, index: number) => {
      setWorkExperienceFromApi((prevState: any) =>
        prevState.map((item: any, i: number) =>
          i === index ? { ...item, [name]: value } : item
        )
      );
    },
    []
  );

  const handleGapChange = useCallback(
    (index: number, name: string, value: any) => {
      setGap((prevGap: any) =>
        prevGap.map((item: any, i: number) =>
          i === index ? { ...item, [name]: value } : item
        )
      );
    },
    []
  );

  const addMoreWorkExperience = useCallback(() => {
    setWorkExperienceFromApi((prevState: any) => [
      ...prevState,
      { ...initialStateWork },
    ]);
  }, []);

  const addMoreGap = useCallback(() => {
    setGap((prevState: any) => [...prevState, { ...initialFundPlanState }]);
  }, []);

  const removeWorkExperience = useCallback(
    (index: number, itemId: number) => {
      if (itemId === 0) {
        setWorkExperienceFromApi((prevState: any) =>
          prevState.filter((_: any, i: number) => i !== index)
        );
      } else {
        removeFromApi(itemId, "work");
      }
    },
    [removeFromApi]
  );

  const removeGap = useCallback(
    (index: number, itemId: number) => {
      if (itemId === 0) {
        setGap((prevState: any) =>
          prevState.filter((_: any, i: number) => i !== index)
        );
      } else {
        removeFromApi(itemId, "gap");
      }
    },
    [removeFromApi]
  );

  if (initialLoading) {
    return (
      <Spinner
        animation="border"
        style={{ position: "absolute", top: "100%", left: "45%" }}
      />
    );
  }

  return (
    <>
      <Row
        className={
          deleteLoading || workSaveLoading || gapSaveLoading ? "opacity-25" : ""
        }
      >
        <WorkExpRow
          workExperienceData={workExperienceFromApi}
          handleWorkExperienceChange={handleWorkExperienceChange}
          addMoreWorkExperience={addMoreWorkExperience}
          removeWorkExperience={removeWorkExperience}
        />
      </Row>
      <Row>
        <Button
          variant="primary"
          className="mt-4"
          type="submit"
          onClick={saveWorkData}
          disabled={deleteLoading || workSaveLoading}
        >
          {deleteLoading || workSaveLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
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
            checked={hasGap === "yes"}
            onChange={() => setHasGap("yes")}
            name="hasGap"
          />

          <Form.Check
            type="radio"
            id="hasGapNo"
            label="No"
            checked={hasGap === "no"}
            onChange={() => setHasGap("no")}
            name="hasGap"
          />
        </Col>
      </Row>
      {hasGap === "yes" && (
        <>
          <Row className="mt-4">
            <GapRows
              gapData={gap}
              handleGapChange={handleGapChange}
              addMoreGap={addMoreGap}
              removeGap={removeGap}
            />
          </Row>
          <Row>
            <Button
              variant="primary"
              className="mt-4"
              type="submit"
              onClick={saveGap}
              disabled={deleteLoading || gapSaveLoading}
            >
              {deleteLoading || gapSaveLoading ? ( // Corrected this line
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  {" Saving..."}
                </>
              ) : (
                "Save Gap Details"
              )}
            </Button>
          </Row>
        </>
      )}
    </>
  );
});

export default WorkExpereince;
