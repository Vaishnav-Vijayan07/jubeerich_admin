import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";

const StudyPreference = () => {
  return (
    <>
      <>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-account-circle me-1"></i> Study Preference Info
        </h5>
        <Row>
          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="intersted_country">
              <Form.Label>Intersted country</Form.Label>
              <FormInput
                type="text"
                name="intersted_country"
                placeholder="Enter interested country"
                key="intersted_country"
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
            <Form.Group className="mb-3" controlId="intrested_institution">
              <Form.Label>Intrested institution</Form.Label>
              <FormInput
                type="text"
                name="intrested_institution"
                placeholder="Enter intrested institution"
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
            <Form.Group className="mb-3" controlId="intake_year">
              <Form.Label>Intake year</Form.Label>
              <FormInput
                type="number"
                name="intake_year"
                placeholder="Enter intake year"
                key="intake_year"
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
            <Form.Group className="mb-3" controlId="intake_month">
              <Form.Label>Intake month</Form.Label>
              <FormInput
                type="number"
                name="intake_month"
                placeholder="Enter intake month"
                key="intake_month"
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
            <Form.Group className="mb-3" controlId="estimated_budget">
              <Form.Label>Estimated budget</Form.Label>
              <FormInput
                type="number"
                name="estimated_budget"
                placeholder="Enter estimated budget"
                key="estimated_budget"
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
            <Form.Group className="mb-3" controlId="course_field_of_intrest">
              <Form.Label>Course field of intrest</Form.Label>
              <FormInput
                type="text"
                name="course_field_of_intrest"
                placeholder="Enter interested course field"
                key="course_field_of_intrest"
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

          <Button variant="primary" className="mt-4" type="submit">
            Save Details
          </Button>
        </Row>
      </>
    </>
  );
};

export default StudyPreference;
