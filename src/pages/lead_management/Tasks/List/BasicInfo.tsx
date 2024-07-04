import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";

const BasicInfo = () => {
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
                // register={register}
                // errors={errors}
                // value={formData.name}
                // onChange={handleInputChange}
                // control={control}
                // defaultValue={preliminaryDetails?.name}
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
                // register={register}
                // key="email"
                // value={formData.email}
                // onChange={handleInputChange}
                // errors={errors}
                // control={control}
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
                // register={register}
                // value={formData.whatsapp_number}
                // onChange={handleInputChange}
                // errors={errors}
                // control={control}
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
                // register={register}
                // value={formData.destination_country}
                // onChange={handleInputChange}
                // errors={errors}
                // control={control}
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
                // value={applicationStatus}
                // onChange={(e: any) => setApplicationStatus(e.target.value)}
              >
                <option value="" disabled>
                  Open this select menu
                </option>
                <option value="Not Yet Decided">Canada</option>
                <option value="Started Applying">Germany</option>
                <option value="Received Offer Letter">Italy</option>
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
                // value={programType}
                // onChange={(e: any) => setProgramType(e.target.value)}
              >
                <option value="" disabled>
                  Open this select menu
                </option>
                <option value="PG">Main Branch</option>
                <option value="UG">Head Office</option>
              </Form.Select>
            </Form.Group>
          </Col>
          {/* </Row>
            <Row> */}
        </Row>
        {/* <h5 className="mb-3 text-uppercase bg-light p-2 mt-3">
          <i className="mdi mdi-office-building me-1"></i> Basic Info
        </h5> */}
        <Row>
          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="passport_no">
              <Form.Label>Passport No</Form.Label>
              <FormInput
                type="text"
                name="passport_no"
                placeholder="Enter passport number"
                key="passport_no"
                // register={register}
                // errors={errors}
                // value={formData.name}
                // onChange={handleInputChange}
                // control={control}
                // defaultValue={preliminaryDetails?.name}
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
                // value={programType}
                // onChange={(e: any) => setProgramType(e.target.value)}
              >
                <option value="" disabled>
                  Open this select menu
                </option>
                <option value="PG">Male</option>
                <option value="UG">Female</option>
                <option value="UG">Others</option>
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
                // value={programType}
                // onChange={(e: any) => setProgramType(e.target.value)}
              >
                <option value="" disabled>
                  Open this select menu
                </option>
                <option value="PG">Single</option>
                <option value="UG">Married</option>
                <option value="UG">Others</option>
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
                // register={register}
                // errors={errors}
                // value={formData.date_of_birth}
                // onChange={handleInputChange}
                // control={control}
                // defaultValue={preliminaryDetails?.date_of_birth}
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
              // register={register}
              // value={formData.remarks}
              // onChange={handleInputChange}
              // errors={errors}
              // control={control}
            />
            {/* {validationErrors.remarks && (
    <Form.Text className="text-danger">{validationErrors.remarks}</Form.Text>
  )} */}
          </Form.Group>

          <Button variant="primary" className="mt-4" type="submit">
            Save Details
          </Button>
        </Row>
      </>
    </>
  );
};

export default BasicInfo;
