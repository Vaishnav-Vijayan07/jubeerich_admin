import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";

const initialState = {
  intersted_country: "",
  intrested_institution: "",
  intake_year: "",
  intake_month: "",
  estimated_budget: "",
  course_field_of_intrest: "",
};

const StudyPreference = ({ studentId, Countries }: any) => {
  const [formData, setformData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // apis
  const getStudyPreferenceInfo = () => {
    setformData(initialState)
    axios
      .get(`getStudentStudyPrferenceInfo/${studentId}`)
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
      getStudyPreferenceInfo();
    }
  }, [studentId]);

  // handling input data
  const handleInputChange = (e: any) => {
    setformData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // save details api
  const saveStudentStudyPreferenceInfo = () => {
    setLoading(true);
    axios
      .post("saveStudentStudyPreferenceInfo", {
        intersted_country: formData?.intersted_country,
        intrested_institution: formData?.intrested_institution,
        intake_year: formData?.intake_year,
        intake_month: formData?.intake_month,
        estimated_budget: formData?.estimated_budget,
        course_field_of_intrest: formData?.course_field_of_intrest,
        user_id: studentId,
      })
      .then((res) => {
        console.log("res: =>", res);
        setLoading(false);
        showSuccessAlert(res.data.message);
        // getBasicInfoApi();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        showErrorAlert("Error occured");
      });
  };
  return (
    <>
      <>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-account-circle me-1"></i> Study Preference Info
        </h5>
        <Row>
          {/* <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="intersted_country">
              <Form.Label>Intersted country</Form.Label>
              <FormInput
                type="text"
                name="intersted_country"
                placeholder="Enter interested country"
                key="intersted_country"
                defaultValue={formData?.intersted_country}
                value={formData?.intersted_country}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col> */}

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="intersted_country">
              <Form.Label>Preferred Country</Form.Label>
              <Form.Select
                className="mb-3"
                name="intersted_country"
                aria-label="Default select example"
                value={formData.intersted_country}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Open this select menu
                </option>
                {Countries?.map((country: any) => (
                  <option value={country.id}>{country.country_name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="intrested_institution">
              <Form.Label>Intrested institution</Form.Label>
              <FormInput
                type="text"
                name="intrested_institution"
                placeholder="Enter intrested institution"
                key="intrested_institution"
                value={formData.intrested_institution}
                onChange={handleInputChange}
              />
              {/* {validationErrors.email && <Form.Text className="text-danger">{validationErrors.email}</Form.Text>} */}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="intake_year">
              <Form.Label>Intake year</Form.Label>
              <FormInput
                type="number"
                name="intake_year"
                placeholder="Enter intake year"
                key="intake_year"
                value={formData.intake_year}
                onChange={handleInputChange}
              />
              {/* {validationErrors.whatsapp_number && (
            <Form.Text className="text-danger">{validationErrors.whatsapp_number}</Form.Text>
          )} */}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="intake_month">
              <Form.Label>intake Month</Form.Label>
              <Form.Select
                name="intake_month"
                className="mb-3"
                aria-label="Default select example"
                value={formData?.intake_month}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Open this select menu
                </option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="estimated_budget">
              <Form.Label>Estimated budget</Form.Label>
              <FormInput
                type="number"
                name="estimated_budget"
                placeholder="Enter estimated budget"
                key="estimated_budget"
                value={formData.estimated_budget}
                onChange={handleInputChange}
              />
              {/* {validationErrors.whatsapp_number && (
            <Form.Text className="text-danger">{validationErrors.whatsapp_number}</Form.Text>
          )} */}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="course_field_of_intrest">
              <Form.Label>Course field of intrest</Form.Label>
              <FormInput
                type="text"
                name="course_field_of_intrest"
                placeholder="Enter interested course field"
                key="course_field_of_intrest"
                value={formData.course_field_of_intrest}
                onChange={handleInputChange}
              />
              {/* {validationErrors.whatsapp_number && (
            <Form.Text className="text-danger">{validationErrors.whatsapp_number}</Form.Text>
          )} */}
            </Form.Group>
          </Col>

          <Button
            variant="primary"
            className="mt-4"
            type="submit"
            onClick={saveStudentStudyPreferenceInfo}
            disabled={loading}
          >
            Save Details
          </Button>
        </Row>
      </>
    </>
  );
};

export default StudyPreference;
