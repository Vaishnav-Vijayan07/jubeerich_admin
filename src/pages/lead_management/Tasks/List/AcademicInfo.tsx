import React, { useEffect, useState, useCallback } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";
import { withSwal } from "react-sweetalert2";
import AcademicInfoRow from "./AcademicInfoRow";
import ExamData from "./ExamRows";
import useSaveStudentAcademicInfo from "../../../../hooks/useSaveStudentAcademicInfo";
import useRemoveFromApi from "../../../../hooks/useRemoveFromApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import validateFields from "../../../../helpers/validateHelper";
import SkeletonComponent from "./StudyPreference/LoadingSkeleton";
import { regrexValidation } from "../../../../utils/regrexValidation";
import { allowedFileTypes } from "./data";

const initialStateAcademic = {
  qualification: "",
  place: "",
  percentage: "",
  year_of_passing: "",
  backlogs: 0,
  errors: {},
};

const initialStateExam = {
  exam_type: "",
  listening_score: "",
  speaking_score: "",
  reading_score: "",
  writing_score: "",
  overall_score: "",
  exam_date: "",
  exam_reamrks: "",
  score_card: null,
  errors: {},
};

const AcademicInfo = withSwal((props: any) => {
  const { swal, studentId } = props;
  const [loading, setLoading] = useState(false);
  const [hasExams, setHasExams] = useState(false);

  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);

  const [academicInfoFromApi, setAcademicInfoFromApi] = useState<any[]>([initialStateAcademic]);
  const [examForm, setExamForm] = useState<any[]>([initialStateExam]);
  const [selectExam, setSelectExam] = useState<boolean>(true);

  const fetchAcademicInfo = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch both API calls concurrently
      const [_, examResponse] = await Promise.all([
        axios.get(`studentAcademicInfo/${studentId}`),
        axios.get(`studentExamInfo/${studentId}`),
      ]);

      const examData = examResponse.data?.data;

      console.log(examData);

      // Use helper functions to check the data and set state
      setExamForm(examData.length > 0 ? examData : [initialStateExam]);
      // setHasExams(examData.length > 0 ? "yes" : "no");
      setHasExams(examData.length > 0 ? true : false);
    } catch (error) {
      console.error("Error fetching academic info:", error);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  const {
    saveStudentAcademicInfo,
    saveStudentExamInfo,
    loading: saveLoading,
  } = useSaveStudentAcademicInfo(studentId, fetchAcademicInfo);
  const { removeFromApi, loading: deleteLoading } = useRemoveFromApi();

  // Fetch academic info using useCallback to memoize the function

  console.log(academicInfoFromApi);
  console.log(examForm);

  useEffect(() => {
    if (studentId) {
      fetchAcademicInfo();
    }
  }, [studentId, refresh]);

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<any[]>>,
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    if (!regrexValidation(name, value)) {
      console.error(`Invalid ${name}: ${value}`);
      return; // Stop updating if validation fails
    }
    
    setter((prevData) => {
      const newData = [...prevData];
      newData[index][name] = value;
      return newData;
    });
  };

  const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {

      if (file && !allowedFileTypes.includes(file.type)) {
        showErrorAlert("Only PDF and image files are allowed.");
        return;
      }
  
      setExamForm((prevData) => {
        const newData = [...prevData];
        newData[index].score_card = file;
        return newData;
      });
    }
  };

  const addFormField = (setter: React.Dispatch<React.SetStateAction<any[]>>, initialState: any) => {
    setter((prevData) => {
      const updatedData = [...prevData, initialState];
      return updatedData;
    });
  };

  const removeFormField = (
    setter: React.Dispatch<React.SetStateAction<any[]>>,
    index: number,
    itemId: number | string,
    type: string
  ) => {
    if (itemId === 0) {
      setter((prevData) => prevData.filter((_, i) => i !== index));
    } else {
      removeFromApi(itemId, type);
    }
  };

  // const handleSaveAcademicInfo = () => {
  //   console.log(academicInfoFromApi);

  //   const validationRules = {
  //     qualification: { required: true, message: "Please choose a qualification" },
  //     place: { required: true, message: "Please choose a place" },
  //     percentage: { required: true, message: "Please choose a percentage" },
  //     year_of_passing: { required: true, message: "Please choose a year of passing" },
  //     backlogs: { required: true, message: "Please choose the number of backlogs" },
  //   };

  //   const { isValid, errors } = validateFields(academicInfoFromApi, validationRules);

  //   console.log(errors);

  //   if (!isValid) {
  //     setAcademicInfoFromApi((prevState: any) =>
  //       prevState.map((exp: any, index: any) => ({
  //         ...exp,
  //         errors: errors[index] || {},
  //       }))
  //     );
  //     return;
  //   }
  //   saveStudentAcademicInfo(academicInfoFromApi);
  // };

  const handleSaveExamInfo = () => {
    const validationRules = {
      exam_type: { required: true, message: "Please choose an exam type" },
      listening_score: { required: false, message: "Please enter a listening score" },
      speaking_score: { required: false, message: "Please enter a speaking score" },
      reading_score: { required: false, message: "Please enter a reading score" },
      writing_score: { required: false, message: "Please enter a writing score" },
      overall_score: { required: false, message: "Please enter an overall score" },
      exam_date: { required: true, message: "Please select an exam date" },
      score_card: { required: false, message: "Please upload a score card" },
      exam_remarks: { required: false, message: "Please choose a exam remarks" },
    };

    const { isValid, errors } = validateFields(examForm, validationRules);
    if (!isValid) {
      setExamForm((prevState: any) =>
        prevState.map((exp: any, index: any) => ({
          ...exp,
          errors: errors[index] || {},
        }))
      );
      return;
    }
    saveStudentExamInfo(examForm, hasExams);
  };

  // if (loading) {
  //   return <Spinner animation="border" style={{ position: "absolute", top: "100%", left: "45%" }} />;
  // }

  return (
    <>
      {loading ? (
        <SkeletonComponent />
      ) : (
        <Row className={deleteLoading || saveLoading ? "opacity-25 pe-0" : ""}>
          <>
            {/* <AcademicInfoRow
            academicInfo={academicInfoFromApi}
            handleAcademicInfoChange={(index, event) =>
              handleInputChange(setAcademicInfoFromApi, index, event)
            }
            addMoreAcademicInfo={() =>
              addFormField(setAcademicInfoFromApi, {
                qualification: "",
                place: "",
                percentage: "",
                year_of_passing: "",
                backlogs: 0,
                errors: {},
              })
            }
            removeAcademicInfo={(index, item) =>
              removeFormField(setAcademicInfoFromApi, index, item, "academic")
            }
          /> */}

            {/*     <Row>
            <Button
              variant="primary"
              className="mt-4"
              type="submit"
              onClick={handleSaveAcademicInfo}
              disabled={saveLoading || deleteLoading}
            >
              {saveLoading || deleteLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  {" Loading..."} 
                </>
              ) : (
                "Save Academic Info" // Normal button text when not loading
              )}
            </Button>
          </Row> */}
            <h5 className="mb-2 text-uppercase">
              <i className="mdi mdi-file-document-outline me-1"></i> Exam Details
            </h5>

            <Row className="mt-3">
              <Col>
                <Form.Group className="mb-3" controlId="source_id">
                  <Form.Label>Have you ever participated in any language exams?</Form.Label>
                  <div className="d-flex justify-content-start align-items-center mt-1">
                    <Form.Check
                      type="radio"
                      name="hasExams"
                      // checked={hasExams === "yes"}
                      checked={hasExams}
                      onChange={() => setHasExams(true)}
                      label={<span className="ps-1 fw-bold">Yes</span>}
                    />
                    <Form.Check
                      type="radio"
                      name="hasExams"
                      // checked={hasExams === "no"}
                      checked={!hasExams}
                      onChange={() => setHasExams(false)}
                      label={<span className="ps-1 fw-bold">No</span>}
                      className="ms-3"
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {/* {hasExams == "yes" && ( */}
            {hasExams && (
              <>
                <Row>
                  <ExamData
                    examForm={examForm}
                    addMoreExamForm={() =>
                      addFormField(setExamForm, {
                        exam_type: "",
                        listening_score: "",
                        speaking_score: "",
                        reading_score: "",
                        writing_score: "",
                        overall_score: "",
                        exam_date: "",
                        exam_remarks: "",
                        score_card: null,
                      })
                    }
                    removeExamForm={(index, itemId) => removeFormField(setExamForm, index, itemId, "exam")}
                    handleExamInputChange={(index, event: any) => handleInputChange(setExamForm, index, event)}
                    handleExamFileChange={handleFileChange}
                  />
                </Row>
                <Row>
                  <Button
                    variant="primary"
                    className="mt-4"
                    type="submit"
                    onClick={handleSaveExamInfo}
                    disabled={saveLoading || deleteLoading}
                  >
                    {saveLoading || deleteLoading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        {" Loading..."} {/* Show spinner and text */}
                      </>
                    ) : (
                      "Save Exam Info" // Normal button text when not loading
                    )}
                  </Button>
                </Row>
              </>
            )}
          </>
        </Row>
      )}
    </>
  );
});

export default AcademicInfo;
