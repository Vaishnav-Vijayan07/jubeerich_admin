import React, { useEffect, useState } from "react";
import { Button, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";
import { withSwal } from "react-sweetalert2";
import WorkExpRow from "./WorkExpRow";
import useRemoveFromApi from "../../../../hooks/useRemoveFromApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import validateFields from "../../../../helpers/validateHelper";
import useSaveWorkInfo from "../../../../hooks/useSaveWorkInfo";

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

const WorkExpereince = withSwal((props: any) => {
  const { swal, studentId } = props;
  const [initialLoading, setInitialLoading] = useState(false);

  const refresh = useSelector(
    (state: RootState) => state.refreshReducer.refreshing
  );

  const [workExperienceFromApi, setWorkExperienceFromApi] = useState<any>(null);
  const getAcademicInfo = () => {
    setInitialLoading(true);
    axios
      .get(`studentWorkInfo/${studentId}`)
      .then((res) => {
        setWorkExperienceFromApi(
          res.data.data?.length > 0 ? res.data.data : [initialStateWork]
        );
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setInitialLoading(false);
      });
  };
  const { removeFromApi, loading: deleteLoading } = useRemoveFromApi();
  const { saveLoading, saveWorkDetails } = useSaveWorkInfo(studentId);

  // apis

  useEffect(() => {
    if (studentId) {
      getAcademicInfo();
    }
  }, [studentId, refresh]);

  const saveWorkData = async () => {
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

    console.log(errors);
    if (!isValid) {
      // Ensure validation errors are displayed
      setWorkExperienceFromApi((prevState: any) =>
        prevState.map((exp: any, index: any) => ({
          ...exp,
          errors: errors[index] || {}, // Attach errors to specific fields
        }))
      );
      return;
    }

    console.log(workExperienceFromApi);
    saveWorkDetails(workExperienceFromApi);
  };

  const handleWorkExperienceChange = (name: any, value: any, index: any) => {
    const newWorkExperience = [...workExperienceFromApi];
    newWorkExperience[index][name] = value;
    setWorkExperienceFromApi(newWorkExperience);
  };

  const addMoreWorkExperience = () => {
    setWorkExperienceFromApi([
      ...workExperienceFromApi,
      {
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
      },
    ]);
  };

  const removeWorkExperience = (index: any, itemId: any) => {
    if (itemId == 0) {
      console.log("FROM STATE");
      const newWorkExperience = [...workExperienceFromApi];
      newWorkExperience.splice(index, 1);
      setWorkExperienceFromApi(newWorkExperience);
    } else {
      console.log("FROM API");
      removeFromApi(itemId, "work");
    }
  };

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
      <Row className={deleteLoading || saveLoading ? "opacity-25" : ""}>
        <WorkExpRow
          workExperience={workExperienceFromApi}
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
          disabled={deleteLoading || saveLoading}
        >
          {deleteLoading || saveLoading ? (
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
            "Save Details" // Normal button text when not loading
          )}
        </Button>
      </Row>
    </>
  );
});

export default WorkExpereince;
