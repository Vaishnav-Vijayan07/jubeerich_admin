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

const initialStateAcademic = {
  id: 0,
  qualification: "",
  place: "",
  percentage: "",
  year_of_passing: "",
  backlogs: 0,
};

const initialStateExam = {
  exam_name: "",
  marks: "",
  exam_documents: null,
  document: null,
};

const AcademicInfo = withSwal((props: any) => {
  const { swal, studentId } = props;
  const [loading, setLoading] = useState(false);

  const refresh = useSelector(
    (state: RootState) => state.refreshReducer.refreshing
  );

  const [academicInfoFromApi, setAcademicInfoFromApi] = useState<any[]>([
    initialStateAcademic,
  ]);
  const [examForm, setExamForm] = useState<any[]>([initialStateExam]);
  const [selectExam, setSelectExam] = useState<boolean>(true);
  const fetchAcademicInfo = useCallback(async () => {
    setLoading(true);
    try {
      console.log("here");

      const res = await axios.get(`getStudentAcademicInfo/${studentId}`);
      const { academicValues = [], exam_info = {} } = res.data.data || {};

      setAcademicInfoFromApi(
        academicValues.length > 0 ? academicValues : [initialStateAcademic]
      );
      setExamForm(
        exam_info.exam_details ? exam_info.exam_details : [initialStateExam]
      );
    } catch (error) {
      console.error("Error fetching academic info:", error);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  const { saveStudentAcademicInfo, loading: saveLoading } =
    useSaveStudentAcademicInfo(studentId, fetchAcademicInfo);
  const { removeFromApi, loading: deleteLoading } = useRemoveFromApi();

  // Fetch academic info using useCallback to memoize the function

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
    setter((prevData) => {
      const newData = [...prevData];
      newData[index][name] = value;
      return newData;
    });
  };

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setExamForm((prevData) => {
        const newData = [...prevData];
        newData[index].exam_documents = file;
        newData[index].document = file.name;
        return newData;
      });
    }
  };

  const addFormField = (
    setter: React.Dispatch<React.SetStateAction<any[]>>,
    initialState: any
  ) => {
    setter((prevData) => {
      console.log("Previous Data:", prevData); // Log previous data
      console.log("Initial State:", initialState); // Log initial state
      const updatedData = [...prevData, initialState];
      console.log("Updated Data:", updatedData); // Log updated data
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

  const handleSave = () => {
    saveStudentAcademicInfo(academicInfoFromApi, examForm);
  };

  if (loading) {
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
        <>
          <AcademicInfoRow
            academicInfo={academicInfoFromApi}
            handleAcademicInfoChange={(index, event) =>
              handleInputChange(setAcademicInfoFromApi, index, event)
            }
            addMoreAcademicInfo={() =>
              addFormField(setAcademicInfoFromApi, {
                id: 0,
                qualification: "",
                place: "",
                percentage: "",
                year_of_passing: "",
                backlogs: 0,
              })
            }
            removeAcademicInfo={(index, item) =>
              removeFormField(setAcademicInfoFromApi, index, item, "academic")
            }
          />

          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="source_id">
                <Form.Label>
                  Have you ever participated in any language exams?
                </Form.Label>
                <div className="d-flex justify-content-start align-items-center mt-1">
                  <Form.Check
                    type="radio"
                    name="ielts"
                    checked={selectExam}
                    onChange={() => setSelectExam(true)}
                    label={<span className="ps-1 fw-bold">Yes</span>}
                  />
                  <Form.Check
                    type="radio"
                    name="ielts"
                    checked={!selectExam}
                    onChange={() => setSelectExam(false)}
                    label={<span className="ps-1 fw-bold">No</span>}
                    className="ms-3"
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {selectExam && (
            <Row>
              <ExamData
                examForm={examForm}
                addMoreExamForm={() =>
                  addFormField(setExamForm, {
                    exam_name: "",
                    marks: "",
                    exam_documents: null,
                    document: null,
                  })
                }
                removeExamForm={(index, itemId) =>
                  removeFormField(setExamForm, index, itemId, "exam")
                }
                handleExamInputChange={(index, event: any) =>
                  handleInputChange(setExamForm, index, event)
                }
                handleExamFileChange={handleFileChange}
              />
            </Row>
          )}
        </>
      </Row>

      <Row>
        <Button
          variant="primary"
          className="mt-4"
          type="submit"
          onClick={handleSave}
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
              {" Loading..."} {/* Show spinner and text */}
            </>
          ) : (
            "Save Details" // Normal button text when not loading
          )}
        </Button>
      </Row>
    </>
  );
});

export default AcademicInfo;
