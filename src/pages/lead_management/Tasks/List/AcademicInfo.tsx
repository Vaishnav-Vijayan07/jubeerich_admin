import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";

const initialState = {
  qualification: "",
  place: "",
  percentage: "",
  year_of_passing: "",
  backlogs: 0,
  work_experience: 0,
  designation: "",
};

const AcademicInfo = ({ studentId }: any) => {
  const [formData, setformData] = useState(initialState);
  const [loading, setLoading] = useState(false);

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

  const saveStudentAcademicInfo = () => {
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
        // getBasicInfoApi()
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        showErrorAlert("Error occured");
      });
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
              <Form.Label>Qualification</Form.Label>
              <FormInput
                type="text"
                name="qualification"
                placeholder="qualification"
                key="qualification"
                defaultValue={formData?.qualification}
                value={formData?.qualification}
                onChange={handleInputChange}
              />
              {/* {validationErrors.name && <Form.Text className="text-danger">{validationErrors.name}</Form.Text>} */}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="place">
              <Form.Label>Place</Form.Label>
              <FormInput
                type="text"
                name="place"
                placeholder="Enter place"
                key="place"
                value={formData.place}
                onChange={handleInputChange}
              />
              {/* {validationErrors.email && <Form.Text className="text-danger">{validationErrors.email}</Form.Text>} */}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="percentage">
              <Form.Label>Percentage</Form.Label>
              <FormInput
                type="number"
                name="percentage"
                placeholder="Enter percentage"
                key="percentage"
                value={formData?.percentage}
                onChange={handleInputChange}
              />
              {/* {validationErrors.whatsapp_number && (
              <Form.Text className="text-danger">{validationErrors.whatsapp_number}</Form.Text>
            )} */}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="year_of_passing">
              <Form.Label>Year of passing</Form.Label>
              <FormInput
                type="number"
                name="year_of_passing"
                placeholder="Enter year of passing"
                key="year_of_passing"
                value={formData?.year_of_passing}
                onChange={handleInputChange}
              />
              {/* {validationErrors.whatsapp_number && (
              <Form.Text className="text-danger">{validationErrors.whatsapp_number}</Form.Text>
            )} */}
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
              {/* {validationErrors.whatsapp_number && (
              <Form.Text className="text-danger">{validationErrors.whatsapp_number}</Form.Text>
            )} */}
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
              {/* {validationErrors.whatsapp_number && (
              <Form.Text className="text-danger">{validationErrors.whatsapp_number}</Form.Text>
            )} */}
            </Form.Group>
          </Col>

          <Button variant="primary" className="mt-4" type="submit" onClick={saveStudentAcademicInfo} disabled={loading}>
            Save Details
          </Button>
        </Row>
      </>
    </>
  );
};

export default AcademicInfo;
