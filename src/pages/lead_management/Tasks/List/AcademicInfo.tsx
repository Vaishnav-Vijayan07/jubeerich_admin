import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";
import * as yup from 'yup';


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

const AcademicInfo = ({ studentId }: any) => {
  const [formData, setformData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState(validationErrorsInitialState);

  const ValidationSchema = yup.object().shape({
    qualification: yup.string().nullable(),
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

      await ValidationSchema.validate(formData, { abortEarly: false})
      
      setLoading(true);
      
      axios
        .post("saveStudentAcademicInfo", {
          user_id: studentId,
          qualification: formData?.qualification,
          place: formData?.place,
          percentage: formData?.percentage,
          year_of_passing: formData?.year_of_passing,
          backlogs: formData?.backlogs,
          work_experience: formData?.work_experience,
          designation: formData?.designation,
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

  console.log("formData", formData);

  return (
    <>
      <>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-account-circle me-1"></i> Academic Info
        </h5>
        <Row>
          <Col xl={6} xxl={4}>
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

          <Col xl={6} xxl={4}>
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

          <Col xl={6} xxl={4}>
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

          <Col xl={6} xxl={4}>
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

          <Col xl={6} xxl={4}>
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

          <Col xl={6} xxl={4}>
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

          <Col xl={6} xxl={4}>
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

          <Col xl={6} xxl={4}>
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
};

export default AcademicInfo;
