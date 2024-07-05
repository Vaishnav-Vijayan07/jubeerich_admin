import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";
import axios from "axios";
import moment from "moment";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";

const initialState = {
  full_name: "",
  email: "",
  phone: "",
  city: "",
  preferred_country: "",
  office_type: "",
  remarks: "",
  lead_received_date: "",
  passport_no: "",
  dob: "",
  gender: "",
  marital_status: "",
};

const BasicInfo = ({ studentId, Countries, OfficeTypes, MaritalStatus, basicData, getBasicInfoApi }: any) => {
  const [formData, setformData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // apis
  const getBasicInfo = () => {
    setformData(initialState);
    axios
      .get(`getStudentBasicInfo/${studentId}`)
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
      getBasicInfo();
    }
  }, []);

  // handling input data
  const handleInputChange = (e: any) => {
    setformData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // save details api
  const saveStudentBasicInfo = () => {
    setLoading(true);
    axios
      .post("saveStudentBasicInfo", {
        passport_no: formData?.passport_no,
        dob: formData?.dob,
        gender: formData?.gender,
        marital_status: formData?.marital_status,
        user_id: studentId,
        full_name: formData?.full_name,
        email: formData?.email,
        phone: formData?.phone,
        preferred_country: formData?.preferred_country,
        office_type: formData?.office_type,
        remarks: formData?.remarks,
        // counsiler_id: null,
        // branch_id: formData?.,
      })
      .then((res) => {
        console.log("res: =>", res);
        setLoading(false);
        showSuccessAlert(res.data.message);
        getBasicInfoApi();
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
          <i className="mdi mdi-account-circle me-1"></i> Primary Info
        </h5>
        <Row>
          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="full_name">
              <Form.Label>Full Name</Form.Label>
              <FormInput
                type="text"
                name="full_name"
                placeholder="Enter full name"
                key="full_name"
                defaultValue={formData?.full_name}
                value={formData?.full_name}
                onChange={handleInputChange}
              />
              {/* {validationErrors.name && <Form.Text className="text-danger">{validationErrors.name}</Form.Text>} */}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Id</Form.Label>
              <FormInput
                type="email"
                name="email"
                placeholder="Enter email id"
                value={formData.email}
                key="email"
                onChange={handleInputChange}
              />
              {/* {validationErrors.email && <Form.Text className="text-danger">{validationErrors.email}</Form.Text>} */}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <FormInput
                type="phone"
                name="phone"
                placeholder="Enter phone number"
                key="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              {/* {validationErrors.whatsapp_number && (
                <Form.Text className="text-danger">{validationErrors.whatsapp_number}</Form.Text>
              )} */}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <FormInput
                type="text"
                name="city"
                placeholder="Enter city"
                key="city"
                value={formData.city}
                onChange={handleInputChange}
              />
              {/* {validationErrors.destination_country && (
                <Form.Text className="text-danger">{validationErrors.destination_country}</Form.Text>
              )} */}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="preferred_country">
              <Form.Label>Preferred Country</Form.Label>
              <Form.Select
                className="mb-3"
                name="preferred_country"
                aria-label="Default select example"
                value={formData.preferred_country}
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
            <Form.Group className="mb-3" controlId="office_type">
              Office Type <Form.Label></Form.Label>
              <Form.Select
                name="office_type"
                className="mb-3"
                aria-label="Default select example"
                value={formData?.office_type}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Open this select menu
                </option>
                {OfficeTypes?.map((officeType: any) => (
                  <option value={officeType?.id}>{officeType?.office_type_name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          {/* </Row>
            <Row> */}
        </Row>

        <Row>
          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="passport_no">
              <Form.Label>Passport No</Form.Label>
              <FormInput
                type="text"
                name="passport_no"
                placeholder="Enter passport number"
                key="passport_no"
                value={formData?.passport_no}
                defaultValue={formData?.passport_no}
                onChange={handleInputChange}
              />
              {/* {validationErrors.name && <Form.Text className="text-danger">{validationErrors.name}</Form.Text>} */}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="gender">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                className="mb-3"
                aria-label="Default select example"
                value={formData?.gender}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Open this select menu
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Others</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="marital_status">
              <Form.Label>Marital Status</Form.Label>
              <Form.Select
                name="marital_status"
                className="mb-3"
                aria-label="Default select example"
                value={formData?.marital_status}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Open this select menu
                </option>
                {MaritalStatus?.map((marital_status: any) => (
                  <option value={marital_status?.id}>{marital_status?.marital_status_name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="dob">
              <Form.Label>Date of Birth</Form.Label>
              <FormInput
                type="date"
                name="dob"
                placeholder="Select date of birth"
                key="dob"
                defaultValue={moment(formData?.dob).format("YYYY-MM-DD")}
                value={moment(formData?.dob).format("YYYY-MM-DD")}
                onChange={handleInputChange}
              />
              {/* {validationErrors.date_of_birth && <Form.Text className="text-danger">{validationErrors.date_of_birth}</Form.Text>} */}
            </Form.Group>
          </Col>

          <Form.Group className="mb-3" controlId="remarks">
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              as="textarea"
              name="remarks"
              placeholder="Enter remarks"
              key="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
            />
            {/* {validationErrors.remarks && (
    <Form.Text className="text-danger">{validationErrors.remarks}</Form.Text>
  )} */}
          </Form.Group>

          <Button variant="primary" className="mt-4" type="submit" onClick={saveStudentBasicInfo} disabled={loading}>
            Save Details
          </Button>
        </Row>
      </>
    </>
  );
};

export default BasicInfo;
