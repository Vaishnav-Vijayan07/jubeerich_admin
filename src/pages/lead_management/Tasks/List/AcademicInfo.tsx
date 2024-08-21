import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";
import * as yup from 'yup';
import { withSwal } from 'react-sweetalert2';
import { examtypes } from "../../../forms/data";


const validationErrorsInitialState = {
  qualification: "",
  place: "",
  percentage: "",
  year_of_passing: "",
  backlogs: "",
  work_experience: "",
  company: "",
  designation: "",
}

const initialState = {
  qualification: "",
  place: "",
  percentage: "",
  year_of_passing: "",
  backlogs: 0,
  work_experience: 0,
  designation: "",
  company: "",
  years: 0
};

// const AcademicInfo = ({ studentId }: any) => {
const AcademicInfo = withSwal((props: any) => {
  const { swal, studentId } = props;
  const [formData, setformData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState(validationErrorsInitialState);
  const [selectExam, setSelectExam] = useState<boolean>(false);
  const [languageForm, setLanguageForm] = useState<any[]>([{ exam_name: '', marks: '' }]);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const fileInputRef = useRef<any>(null);

  const ValidationSchema = yup.object().shape({
    qualification: yup.string().required("Qualification cannot be empty"),
    place: yup.string().required("Place cannot be empty"),
    percentage: yup.string().required("Percentage cannot be empty"),
    year_of_passing: yup.string().required("Year of passing cannot be empty"),
    backlogs: yup.string().nullable(),
    work_experience: yup.string().nullable(),
    company: yup.string().nullable(),
    designation: yup.string().nullable(),
  })

  // apis
  const getAcademicInfo = () => {
    setformData(initialState)
    axios
      .get(`getStudentAcademicInfo/${studentId}`)
      .then((res) => {
        console.log("res =>", res.data);
        setformData(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

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

  const saveStudentAcademicInfo = async() => {
    try {

      console.log('Language Form', languageForm);
      console.log('selectedFile', selectedFile);
      

      let exam_details = languageForm.length ? languageForm : [];
      console.log('exam_details',exam_details);
      
      const newFormData = new FormData();

      newFormData.append('user_id', studentId.toString());
      newFormData.append('qualification', formData?.qualification);
      newFormData.append('place', formData?.place);
      newFormData.append('percentage', formData?.percentage);
      newFormData.append('year_of_passing', formData?.year_of_passing);
      // newFormData.append('backlogs', JSON.stringify(formData?.backlogs));
      newFormData.append('backlogs', '0');
      newFormData.append('work_experience', JSON.stringify(formData?.work_experience));
      newFormData.append('designation', formData?.designation);
      newFormData.append('exam_details', JSON.stringify(exam_details));

      selectedFile.forEach((file: any) => {
        newFormData.append(`exam_documents`, file)
      });

      // await ValidationSchema.validate(formData, { abortEarly: false})
      
      console.log('Entered');
      
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
            //   work_experience: formData?.work_experience,
            //   designation: formData?.designation,
            //   exam_details: JSON.stringify(exam_details)
            // },{
            //   headers: {
            //     "Content-Type": "multipart/form-data",
            //   }
            // })
            .post("saveStudentAcademicInfo", newFormData,{
              headers: {
                "Content-Type": "multipart/form-data",
              }
            })
            .then((res) => {
              console.log("res: =>", res);
              setLoading(false);
              showSuccessAlert(res.data.message);
              setValidationErrors(validationErrorsInitialState);
    
              // getBasicInfoApi()
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
              showErrorAlert("Error occured");
            });
        }
      }).catch((err: any)=>{
        console.log(err);
      })
      
      // setLoading(true);
      
      // axios
      //   .post("saveStudentAcademicInfo", {
      //     user_id: studentId,
      //     qualification: formData?.qualification,
      //     place: formData?.place,
      //     percentage: formData?.percentage,
      //     year_of_passing: formData?.year_of_passing,
      //     backlogs: formData?.backlogs,
      //     work_experience: formData?.work_experience,
      //     designation: formData?.designation,
      //   })
      //   .then((res) => {
      //     console.log("res: =>", res);
      //     setLoading(false);
      //     showSuccessAlert(res.data.message);
      //     setValidationErrors(validationErrorsInitialState);

      //     // getBasicInfoApi()
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     setLoading(false);
      //     showErrorAlert("Error occured");
      //   });

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
  
  const handleLanguageInputChange = (index: number, e: any) => {
    const { name, value } = e.target;

    const newFields = [...languageForm];
    newFields[index][name] = value;
    setLanguageForm(newFields);
  }

  const handleRemoveLanguageForm = (index: number, e: any) => {
    const removeFields = languageForm.filter((data: any, i: number) => i !== index);
    const removeFiles = selectedFile.filter((data: any, i: number) => i !== index);
    setLanguageForm(removeFields);
    setSelectedFile(removeFiles);
  }

  const handleFileChange = (index: number, e: any) => {
    console.log('File', e.target.files);
    console.log('File', fileInputRef?.current?.files[0]);

    const file = fileInputRef?.current?.files[0]

    if (selectedFile.length) {
      const filteredFile = selectedFile.filter((data: any, i: any) => i != index);
      setSelectedFile(filteredFile);
    }

    setSelectedFile((prevData: any) => ([...prevData, fileInputRef?.current?.files[0]]))
  }

  const handleAddLanguageForm = () => {
    setLanguageForm((prevData) => ([...prevData, { exam_name: '', marks: '' }]))
  }

  console.log("formData", formData);

  return (
    <>
      <>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-account-circle me-1"></i> Academic Info
        </h5>
        <Row>
          {/* <Col xl={6} xxl={4}> */}
          <Col md={4} lg={4} xl={4} xxl={4}>
            <Form.Group className="mb-3" controlId="qualification">
              <Form.Label><span className="text-danger">* </span>Qualification</Form.Label>
              <FormInput
                type="text"
                name="qualification"
                placeholder="Enter qualification"
                key="qualification"
                defaultValue={formData?.qualification}
                value={formData?.qualification}
                onChange={handleInputChange}
              />
              {validationErrors.qualification && <Form.Text className="text-danger">{validationErrors.qualification}</Form.Text>}
            </Form.Group>
          </Col>

          {/* <Col xl={6} xxl={4}> */}
          <Col md={4} lg={4} xl={4} xxl={4}>
            <Form.Group className="mb-3" controlId="place">
              <Form.Label><span className="text-danger">* </span>Place</Form.Label>
              <FormInput
                type="text"
                name="place"
                placeholder="Enter place"
                key="place"
                value={formData.place}
                onChange={handleInputChange}
              />
              {validationErrors.place && <Form.Text className="text-danger">{validationErrors.place}</Form.Text>}
            </Form.Group>
          </Col>

          {/* <Col xl={6} xxl={4}> */}
          <Col md={4} lg={4} xl={4} xxl={4}>
            <Form.Group className="mb-3" controlId="percentage">
              <Form.Label><span className="text-danger">* </span>Percentage</Form.Label>
              <FormInput
                type="number"
                name="percentage"
                placeholder="Enter percentage"
                key="percentage"
                value={formData?.percentage}
                onChange={handleInputChange}
                min={0}
              />
              {validationErrors.percentage && (
              <Form.Text className="text-danger">{validationErrors.percentage}</Form.Text>
            )}
            </Form.Group>
          </Col>

          {/* <Col xl={6} xxl={4}> */}
          <Col md={4} lg={4} xl={4} xxl={4}>
            <Form.Group className="mb-3" controlId="year_of_passing">
              <Form.Label><span className="text-danger">* </span>Year of passing</Form.Label>
              <FormInput
                type="number"
                name="year_of_passing"
                placeholder="Enter year of passing"
                key="year_of_passing"
                value={formData?.year_of_passing}
                onChange={handleInputChange}
                min={0}
              />
              {validationErrors.year_of_passing && (
              <Form.Text className="text-danger">{validationErrors.year_of_passing}</Form.Text>
            )}
            </Form.Group>
          </Col>

          {/* <Col xl={6} xxl={4}> */}
          <Col md={4} lg={4} xl={4} xxl={4}>
            <Form.Group className="mb-3" controlId="backlogs">
              <Form.Label>Backlogs</Form.Label>
              <FormInput
                type="number"
                name="backlogs"
                placeholder="Enter backlogs"
                key="backlogs"
                value={formData.backlogs}
                onChange={handleInputChange}
              />
              {validationErrors.backlogs && (
              <Form.Text className="text-danger">{validationErrors.backlogs}</Form.Text>
            )}
            </Form.Group>
          </Col>

          <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-account-circle me-1"></i> Work Experience
        </h5>

          {/* <Col xl={6} xxl={4}> */}
          <Col md={4} lg={4} xl={4} xxl={4}>
            <Form.Group className="mb-3" controlId="work_experience">
              <Form.Label>Work Experience</Form.Label>
              <FormInput
                type="number"
                name="work_experience"
                placeholder="Enter work experience"
                key="work_experience"
                value={formData?.work_experience}
                onChange={handleInputChange}
                min={0}
              />
              {validationErrors.work_experience && (
              <Form.Text className="text-danger">{validationErrors.work_experience}</Form.Text>
            )}
            </Form.Group>
          </Col>

          {/* <Col xl={6} xxl={4}> */}
          <Col md={4} lg={4} xl={4} xxl={4}>
            <Form.Group className="mb-3" controlId="company">
              <Form.Label>Company</Form.Label>
              <FormInput
                type="text"
                name="company"
                placeholder="Enter company"
                key="company"
                value={formData?.company}
                onChange={handleInputChange}
              />
              {validationErrors.company && (
              <Form.Text className="text-danger">{validationErrors.company}</Form.Text>
            )}
            </Form.Group>
          </Col>

          {/* <Col xl={4} xxl={4}> */}
          <Col md={4} lg={4} xl={4} xxl={4}>
            <Form.Group className="mb-3" controlId="designation">
              <Form.Label>Designation</Form.Label>
              <FormInput
                type="text"
                name="designation"
                placeholder="Enter designation"
                key="designation"
                value={formData?.designation}
                onChange={handleInputChange}
              />
              {validationErrors.designation && (
              <Form.Text className="text-danger">{validationErrors.designation}</Form.Text>
            )}
            </Form.Group>
          </Col>

          <Col md={4} lg={4} xl={4} xxl={4}>
            <Form.Group className="mb-3" controlId="source_id">
              <Form.Label>Have you ever participated in any language exams ?</Form.Label>
              <div className="d-flex justify-content-start align-items-center mt-1">
                <div className="d-flex justify-content-start align-items-start me-2">
                  <Form.Check
                    type="radio"
                    id="active-switch"
                    name="ielts"
                    onClick={() => setSelectExam(true)}
                  // checked={formData.ielts}
                  />
                  <span className="ps-1 fw-bold">Yes</span>
                </div>
                <div className="d-flex justify-content-start align-items-start">
                  <Form.Check
                    type="radio"
                    id="active-switch"
                    name="ielts"
                    onClick={() => setSelectExam(false)}
                  // checked={!formData.ielts}
                  />
                  <span className="ps-1 fw-bold">No</span>
                </div>
              </div>
            </Form.Group>
          </Col>

          <Row>
            {selectExam && languageForm.map((data, index) => (
              <Row key={index}>
                <Col md={4} lg={4}>
                  <Form.Group className="mb-3" controlId="exam_name">
                    <Form.Label>Exam Type</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      name="exam_name"
                      value={data.exam_name}
                      onChange={(e) => handleLanguageInputChange(index, e)}
                    >
                      <option value="" disabled>
                        Choose..
                      </option>
                      {examtypes?.map((item: any) => (
                        <option
                          value={item?.name}
                          key={item?.name}
                          onClick={(e) => handleLanguageInputChange(index, e)}
                          // defaultValue={item.name === formData.exam ? item.name : undefined}
                        >
                          {item.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} lg={4}>
                  <Form.Group className="mb-3" controlId="marks">
                    <Form.Label>Exam Score</Form.Label>
                    <Form.Control
                      type="text"
                      name="marks"
                      value={data.marks}
                      onChange={(e) => {
                        handleLanguageInputChange(index, e)
                      }}
                    />
                  </Form.Group>
                </Col>

                <Col className="d-flex justify-content-between">
                  <Form name="exam_documents" encType="multipart/form-data">
                    <Form.Group className="mb-3" controlId="profileImage">
                      <Form.Label>Upload File</Form.Label>
                      <Form.Control name="exam_documents" type="file" onChange={(event) => handleFileChange(index, event)} ref={fileInputRef} />
                    </Form.Group>
                  </Form>
                  <i className="mdi mdi-delete-outline mt-3 pt-1 fs-3 ps-1" onClick={(e) => handleRemoveLanguageForm(index, e)}></i>
                  {selectExam && <i className="mdi mdi-plus-circle-outline mt-3 pt-1 fs-3 ps-1" onClick={handleAddLanguageForm}></i>}
                </Col>
              </Row>
            ))}
          </Row>

          {/* <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="years">
              <Form.Label>Years</Form.Label>
              <FormInput
                type="text"
                name="years"
                placeholder="Enter years"
                key="years"
                value={formData?.years}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col> */}

          <Button variant="primary" className="mt-4" type="submit" onClick={saveStudentAcademicInfo} disabled={loading}>
            Save Details
          </Button>
        </Row>
      </>
    </>
  );
});

export default AcademicInfo;
