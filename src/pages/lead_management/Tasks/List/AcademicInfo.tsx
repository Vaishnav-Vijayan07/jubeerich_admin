import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { FormInput } from "../../../../components";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";
import * as yup from "yup";
import { withSwal } from "react-sweetalert2";
import { examtypes } from "../../../forms/data";
import moment from "moment";
import AcademicInfoRow from "./AcademicInfoRow";
import WorkExpRow from "./WorkExpRow";
import { isAllItemsPresent } from "../../../../utils/fieldsChecker";

const validationErrorsInitialState = {
  qualification: "",
  place: "",
  percentage: "",
  year_of_passing: "",
  backlogs: "",
  years: "",
  company: "",
  designation: "",
  from: "",
  to: "",
};

const initialState = {
  qualification: "",
  place: "",
  percentage: "",
  year_of_passing: "",
  backlogs: 0,
  years: 0,
  designation: "",
  company: "",
  from: "",
  to: "",
};

const initialStateAcademic = {
  id: 0,
  qualification: "",
  place: "",
  percentage: "",
  year_of_passing: "",
  backlogs: 0,
};

const initialStateWork = {
  id: 0,
  years: 0,
  designation: "",
  company: "",
  from: "",
  to: "",
};

const initialLanguageState = {
  exam_name: "",
  marks: "",
};

const AcademicInfo = withSwal((props: any) => {
  const { swal, studentId } = props;
  const [formData, setformData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [academicInfo, setAcademicInfo] = useState<any>([initialStateAcademic]);
  const [workExperience, setWorkExperience] = useState<any>([initialStateWork]);

  const [academicInfoFromApi, setAcademicInfoFromApi] = useState<any>(null);
  const [workExperienceFromApi, setWorkExperienceFromApi] = useState<any>(null);

  const [validationErrors, setValidationErrors] = useState(
    validationErrorsInitialState
  );
  const [selectExam, setSelectExam] = useState<boolean>(false);
  const [languageForm, setLanguageForm] = useState<any[]>([
    initialLanguageState,
  ]);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [selectedFileName, setSelectedFileName] = useState<any>([]);
  const fileInputRef = useRef<any>(null);

  const ValidationSchema = yup.object().shape({
    qualification: yup.string().required("Qualification cannot be empty"),
    place: yup.string().required("Place cannot be empty"),
    percentage: yup.string().required("Percentage cannot be empty"),
    year_of_passing: yup.string().required("Year of passing cannot be empty"),
    backlogs: yup.string().nullable(),
    years: yup.string().nullable(),
    company: yup.string().nullable(),
    designation: yup.string().nullable(),
  });

  // apis
  const getAcademicInfo = () => {
    setformData(initialState);
    axios
      .get(`getStudentAcademicInfo/${studentId}`)
      .then((res) => {
        setAcademicInfoFromApi(
          res.data.data?.academicValues.length > 0
            ? res.data.data.academicValues
            : [initialStateAcademic]
        );
        setWorkExperienceFromApi(
          res.data.data?.workValues.length > 0
            ? res.data.data.workValues
            : [initialStateWork]
        );
        setLanguageForm(
          res.data?.data?.exam_info?.exam_details
            ? res.data?.data?.exam_info?.exam_details
            : [initialLanguageState]
        );
        // setSelectedFile(res.data?.data?.exam_documents)
        setSelectedFileName(res.data?.data?.exam_documents);

        const emptyFile = new File([], "empty.txt", {
          type: "text/plain",
        });

        if (Array.isArray(res.data?.data?.exam_details)) {
          for (let i = 0; i < res.data?.data?.exam_documents.length; i++) {
            setSelectedFile((prevFile: any) => [...prevFile, emptyFile]);
          }
        }

        console.log(res.data.data?.exam_info);

        if (res.data.data?.exam_info?.exam_details?.length) {
          setSelectExam(true);
        } else {
          setSelectExam(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  console.log(languageForm);

  useEffect(() => {
    if (studentId) {
      getAcademicInfo();
    }
  }, [studentId]);

  // handling input data
  const handleInputChange = (e: any) => {
    setformData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveStudentAcademicInfo = async () => {
    try {
      console.log(academicInfo);
      console.log(workExperience);

      console.log("Language Form", languageForm);
      console.log("selectedFile", selectedFile);

      let exam_details = languageForm.length ? languageForm : [];
      console.log("exam_details", exam_details);

      const newFormData = new FormData();

      if (
        academicInfoFromApi.length > 0 &&
        isAllItemsPresent("academic", academicInfoFromApi)
      ) {
        academicInfoFromApi.forEach((record: any, index: any) => {
          const itemId = record.id ?? "0";

          newFormData.append(`academicRecords[${index}][id]`, itemId);
          newFormData.append(
            `academicRecords[${index}][qualification]`,
            record.qualification
          );
          newFormData.append(`academicRecords[${index}][place]`, record.place);
          newFormData.append(
            `academicRecords[${index}][percentage]`,
            record.percentage
          );
          newFormData.append(
            `academicRecords[${index}][year_of_passing]`,
            record.year_of_passing
          );
          newFormData.append(
            `academicRecords[${index}][backlogs]`,
            record.backlogs
          );
        });
      }

      if (workExperienceFromApi.length > 0 && isAllItemsPresent("work",workExperienceFromApi)) {
        workExperienceFromApi.forEach((work: any, index: any) => {
          const itemId = work.id ?? "0";

          newFormData.append(`workExperience[${index}][id]`, itemId);
          newFormData.append(`workExperience[${index}][years]`, work.years);
          newFormData.append(
            `workExperience[${index}][designation]`,
            work.designation
          );
          newFormData.append(`workExperience[${index}][company]`, work.company);
          newFormData.append(`workExperience[${index}][from]`, work.from);
          newFormData.append(`workExperience[${index}][to]`, work.to);
        });
      }

      newFormData.append("user_id", studentId.toString());
      // newFormData.append("qualification", formData?.qualification);
      // newFormData.append("place", formData?.place);
      // newFormData.append("percentage", formData?.percentage);
      // newFormData.append("company", formData?.company);
      // newFormData.append("year_of_passing", formData?.year_of_passing);
      // newFormData.append(
      //   "backlogs",
      //   JSON.stringify(formData?.backlogs == null ? 0 : formData.backlogs)
      // );
      // newFormData.append('backlogs', '0');
      // newFormData.append(
      //   "years",
      //   formData?.years.toString()
      // );
      // newFormData.append("designation", formData?.designation);
      newFormData.append(
        "exam_details",
        exam_details[0].exam_name ? JSON.stringify(exam_details) : ""
      );

      selectedFile.forEach((file: any) => {
        newFormData.append(`exam_documents`, file);
      });

      // await ValidationSchema.validate(formData, { abortEarly: false });

      console.log("Entered");

      swal
        .fire({
          title: "Are you sure?",
          text: "This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Save",
        })
        .then((result: any) => {
          if (result.isConfirmed) {
            setLoading(true);
            axios
              // .post("saveStudentAcademicInfo", {
              //   user_id: studentId.toString(),
              //   qualification: formData?.qualification,
              //   place: formData?.place,
              //   percentage: formData?.percentage,
              //   year_of_passing: formData?.year_of_passing,
              //   backlogs: formData?.backlogs,
              //   years: formData?.years,
              //   designation: formData?.designation,
              //   exam_details: JSON.stringify(exam_details)
              // },{
              //   headers: {
              //     "Content-Type": "multipart/form-data",
              //   }
              // })
              .post("saveStudentAcademicInfo", newFormData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((res) => {
                console.log("res: =>", res);
                setLoading(false);
                showSuccessAlert(res.data.message);
                setValidationErrors(validationErrorsInitialState);
                getAcademicInfo();
              })
              .catch((err) => {
                console.log(err);
                setLoading(false);
                showErrorAlert("Error occured");
              });
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        const errors: any = {};
        validationError.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        setValidationErrors(errors);
      }
    }
  };

  const removeFromApi = (id: any, type: string) => {
    swal
      .fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete",
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios
            .delete(`saveStudentAcademicInfo/${type}/${id}`, {
              headers: {
                "Content-Type": "application/json", // Assuming no file data is sent
              },
            })
            .then((res) => {
              console.log("Response: =>", res);
              setLoading(false);
              showSuccessAlert(res.data.message);
              getAcademicInfo();
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
              showErrorAlert("Error occurred");
            });
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handleLanguageInputChange = (index: number, e: any) => {
    const { name, value } = e.target;

    const newFields = [...languageForm];
    newFields[index][name] = value;
    setLanguageForm(newFields);
  };

  const handleRemoveLanguageForm = (
    index: number,
    e: any,
    exam_name: string
  ) => {
    const payload = {
      id: studentId,
      exam_name: exam_name,
    };

    try {
      swal
        .fire({
          title: "Are you sure?",
          text: "This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Delete",
        })
        .then((result: any) => {
          if (result.isConfirmed) {
            axios
              .delete("/exams", { data: payload })
              .then((res: any) => {
                const removeFields = languageForm.filter(
                  (data: any, i: number) => i !== index
                );
                const removeFiles = selectedFile.filter(
                  (data: any, i: number) => i !== index
                );
                setLanguageForm(removeFields);
                setSelectedFile(removeFiles);
                showSuccessAlert(res.data.message);
              })
              .catch((err: any) => {
                showErrorAlert("Error occured");
              });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (index: number, e: any) => {
    // console.log('File', e.target.files);
    // console.log('File', fileInputRef?.current?.files[0]);

    // const file = fileInputRef?.current?.files[0]

    // if (selectedFile.length) {
    //   const filteredFile = selectedFile.filter((data: any, i: any) => i != index);
    //   setSelectedFile(filteredFile);
    // }

    // setSelectedFile((prevData: any) => ([...prevData, fileInputRef?.current?.files[0]]))

    let file = e.target.files[0];

    if (Array.isArray(languageForm) && selectedFile.length) {
      selectedFile.splice(index, 1, file);

      setSelectedFile([...selectedFile]);
    } else {
      setSelectedFile((prevData: any) => [...prevData, file]);
    }
  };

  const handleAddLanguageForm = () => {
    setLanguageForm((prevData) => [...prevData, { exam_name: "", marks: "" }]);
  };

  const handleAcademicInfoChange = (index: any, e: any) => {
    const { name, value } = e.target;
    const newAcademicInfo = [...academicInfoFromApi];
    newAcademicInfo[index][name] = value;
    setAcademicInfoFromApi(newAcademicInfo);
  };

  const addMoreAcademicInfo = () => {
    setAcademicInfoFromApi([
      ...academicInfoFromApi,
      {
        qualification: "",
        place: "",
        percentage: "",
        year_of_passing: "",
        backlogs: 0,
      },
    ]);
  };

  const removeAcademicInfo = (index: any, item: any) => {
    if (item == 0) {
      const newAcademicInfo = [...academicInfoFromApi];
      newAcademicInfo.splice(index, 1);
      setAcademicInfoFromApi(newAcademicInfo);
    } else {
      removeFromApi(item, "academic");
    }
  };

  const handleWorkExperienceChange = (index: any, e: any) => {
    const { name, value } = e.target;
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
      <>
        <AcademicInfoRow
          academicInfo={academicInfoFromApi}
          handleAcademicInfoChange={handleAcademicInfoChange}
          validationErrors={validationErrors}
          addMoreAcademicInfo={addMoreAcademicInfo}
          removeAcademicInfo={removeAcademicInfo}
        />

        <WorkExpRow
          workExperience={workExperienceFromApi}
          handleWorkExperienceChange={handleWorkExperienceChange}
          validationErrors={validationErrors}
          addMoreWorkExperience={addMoreWorkExperience}
          removeWorkExperience={removeWorkExperience}
        />
        <Row>
          {selectExam &&
            languageForm?.map((data, index) => (
              <Row key={index}>
                <Col md={3} lg={3}>
                  <Form.Group className="mb-3" controlId="exam_name">
                    <Form.Label>Exam Type</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      name="exam_name"
                      value={data?.exam_name}
                      onChange={(e) => handleLanguageInputChange(index, e)}
                    >
                      <option value="">Choose..</option>
                      {examtypes?.map((item: any) => (
                        <option
                          value={item?.name}
                          key={item?.name}
                          onClick={(e) => handleLanguageInputChange(index, e)}
                        >
                          {item?.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} lg={3}>
                  <Form.Group className="mb-3" controlId="marks">
                    <Form.Label>Exam Score</Form.Label>
                    <Form.Control
                      type="text"
                      name="marks"
                      value={data?.marks}
                      onChange={(e) => {
                        handleLanguageInputChange(index, e);
                      }}
                    />
                  </Form.Group>
                </Col>

                {/* <Col md={6} lg={6} className="d-flex justify-content-between">
                  <Form name="exam_documents" encType="multipart/form-data">
                    <Form.Group className="mb-3" controlId="profileImage">
                      <Form.Label>Upload File</Form.Label>
                      <Form.Control
                        name="exam_documents"
                        type="file"
                        onChange={(event) => handleFileChange(index, event)}
                        ref={fileInputRef}
                      />
                      {selectedFileName?.length
                        ? selectedFileName[index]?.exam_documents && (
                            <p style={{ padding: "0%" }} className="mt-2">
                              {selectedFileName[index].exam_documents}
                            </p>
                          )
                        : ""}
                    </Form.Group>
                  </Form>
                </Col> */}
              </Row>
            ))}
        </Row>
        <Row>
          <Button
            variant="primary"
            className="mt-4"
            type="submit"
            onClick={saveStudentAcademicInfo}
            disabled={loading}
          >
            Save Details
          </Button>
        </Row>
      </>
    </>
  );
});

export default AcademicInfo;

{
  /* 
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="source_id">
              <Form.Label>
                Have you ever participated in any language exams ?
              </Form.Label>
              <div className="d-flex justify-content-start align-items-center mt-1">
                <div className="d-flex justify-content-start align-items-start me-2">
                  <Form.Check
                    type="radio"
                    id="active-switch"
                    name="ielts"
                    onClick={() => setSelectExam(true)}
                    checked={selectExam}
                    // checked={formData.ielts}
                  />
                  <span className="ps-1 fw-bold">Yes</span>
                </div>
                <div className="d-flex justify-content-start align-items-start">
                  <Form.Check
                    type="radio"
                    id="active-switch"
                    name="ielts"
                    checked={!selectExam}
                    onClick={() => setSelectExam(false)}
                    // checked={!formData.ielts}
                  />
                  <span className="ps-1 fw-bold">No</span>
                </div>
              </div>
            </Form.Group>
          </Col>
        </Row> */
}
