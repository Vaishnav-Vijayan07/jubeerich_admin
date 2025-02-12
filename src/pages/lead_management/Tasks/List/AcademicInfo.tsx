import React, { useEffect, useState, useCallback } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";
import { withSwal } from "react-sweetalert2";
import ExamData from "./ExamRows";
import useSaveStudentAcademicInfo from "../../../../hooks/useSaveStudentAcademicInfo";
import useRemoveFromApi from "../../../../hooks/useRemoveFromApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import validateFields from "../../../../helpers/validateHelper";
import SkeletonComponent from "./StudyPreference/LoadingSkeleton";
import { regrexValidation } from "../../../../utils/regrexValidation";
import { allowedFileTypes } from "./data";
import FieldHistoryTable from "../../../../components/FieldHistory";
import { useHistoryModal } from "../../../../hooks/useHistoryModal";
import { showConfirmation } from "../../../../utils/showConfirmation";
import { refreshData } from "../../../../redux/countryReducer";

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
};

const AcademicInfo = withSwal((props: any) => {
  const { swal, studentId } = props;

  const dispatch = useDispatch();
  const { removeFromApi } = useRemoveFromApi();
  const { historyModal, toggleHistoryModal } = useHistoryModal();
  const [loading, setLoading] = useState(false);
  const [hasExams, setHasExams] = useState(false);

  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);

  const [examForm, setExamForm] = useState<any[]>([initialStateExam]);

  const fetchAcademicInfo = async () => {
    setLoading(true);
    try {
      // Fetch both API calls concurrently
      const examResponse = await axios.get(`studentExamInfo/${studentId}`);

      const examData = examResponse.data?.data;
      const ielts = examResponse.data?.ielts;

      // Use helper functions to check the data and set state
      setExamForm(
        examData.length > 0
          ? examData
          : [
              {
                exam_type: "",
                listening_score: "",
                speaking_score: "",
                reading_score: "",
                writing_score: "",
                overall_score: "",
                exam_date: "",
                exam_reamrks: "",
                score_card: null,
              },
            ]
      );
      setHasExams(ielts);
    } catch (error) {
      console.error("Error fetching academic info:", error);
    } finally {
      setLoading(false);
    }
  };

  const { saveStudentExamInfo, loading: saveLoading } = useSaveStudentAcademicInfo(studentId, fetchAcademicInfo);

  // Fetch academic info using useCallback to memoize the function

  useEffect(() => {
    fetchAcademicInfo();
  }, [refresh]);

  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (!regrexValidation(name, value)) {
      console.error(`Invalid ${name}: ${value}`);
      return; // Stop updating if validation fails
    }

    setExamForm((prevData) => {
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

  const saveWorkData = async () => {
    const validationRules = {
      exam_type: { required: true, message: "Please choose an exam type" },
      listening_score: { required: false, message: "Please enter a listening score" },
      speaking_score: { required: false, message: "Please enter a speaking score" },
      reading_score: { required: false, message: "Please enter a reading score" },
      writing_score: { required: false, message: "Please enter a writing score" },
      overall_score: { required: false, message: "Please enter an overall score" },
      exam_date: { required: false, message: "Please select an exam date" },
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
    await saveStudentExamInfo(examForm);
    saveCheck();
  };

  const addMoreExam = () => {
    setExamForm((prevState: any) => [...prevState, { ...initialStateExam }]);
  };

  const removeExamData = async (index: number, itemId: number | string, type: string) => {
    if (itemId === 0) {
      if (examForm.length == 1) {
        return;
      }
      setExamForm((prevState: any) => prevState.filter((_: any, i: number) => i !== index));
    } else {
      const result = await showConfirmation("Are you sure you want to remove this item?");
      if (!result.isConfirmed) {
        return;
      }

      if (examForm.length == 1) {
        setExamForm([initialStateExam]);
      }

      removeFromApi(itemId, "exam", studentId, examForm.length == 1);
    }
  };

  const decisionWiseSave = async () => {
    if (hasExams) {
      await saveWorkData();
    } else {
      const result = await showConfirmation("Do you want to proceed?");
      if (!result.isConfirmed) return;
      saveCheck();
    }
  };

  console.log(examForm);

  const saveCheck = async () => {
    try {
      await axios.patch(`update_info_checks/${studentId}`, { ielts: hasExams });
      dispatch(refreshData());
    } catch (error) {
      console.log(error);
      showErrorAlert("Something went wrong");
    }
  };

  return (
    <>
      {loading ? (
        <SkeletonComponent />
      ) : (
        <Row className={saveLoading ? "opacity-25 pe-0" : "bg-light py-4 mb-3 ps-3"}>
          <>
            <Modal show={historyModal} onHide={toggleHistoryModal} centered dialogClassName={"modal-full-width"} scrollable>
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body style={{ margin: "0 !important", padding: "0 !important" }}>
                <FieldHistoryTable apiUrl={"user_exams"} studentId={studentId} />
              </Modal.Body>
            </Modal>
            <div className="d-flex justify-content-between">
              <h5 className="mb-2 text-uppercase">
                <i className="mdi mdi-file-document-outline me-1"></i> Exam Details
              </h5>

              <Button
                className="btn-sm btn-secondary waves-effect waves-light float-end me-2"
                onClick={toggleHistoryModal}
                style={{ height: "fit-content" }}
              >
                <i className="mdi mdi-history"></i> View History
              </Button>
            </div>

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
              <Row>
                <ExamData
                  examForm={examForm}
                  addMoreExamForm={addMoreExam}
                  removeExamForm={removeExamData}
                  handleExamInputChange={handleInputChange}
                  handleExamFileChange={handleFileChange}
                />
              </Row>
            )}
            <Row>
              <Button variant="primary" className="w-auto ms-2" type="submit" onClick={decisionWiseSave} disabled={saveLoading}>
                {saveLoading ? (
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
        </Row>
      )}
    </>
  );
});

export default AcademicInfo;
