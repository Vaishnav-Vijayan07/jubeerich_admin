import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";

const AcademicInfo = () => {
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
            <Form.Group className="mb-3" controlId="place">
              <Form.Label>Place</Form.Label>
              <FormInput
                type="text"
                name="place"
                placeholder="Enter place"
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
            <Form.Group className="mb-3" controlId="percentage">
              <Form.Label>Percentage</Form.Label>
              <FormInput
                type="number"
                name="percentage"
                placeholder="Enter percentage"
                key="percentage"
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
            <Form.Group className="mb-3" controlId="year_of_passing">
              <Form.Label>Year of passing</Form.Label>
              <FormInput
                type="number"
                name="year_of_passing"
                placeholder="Enter year of passing"
                key="year_of_passing"
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
            <Form.Group className="mb-3" controlId="backlogs">
              <Form.Label>Backlogs</Form.Label>
              <FormInput
                type="number"
                name="backlogs"
                placeholder="Enter year of passing"
                key="backlogs"
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
            <Form.Group className="mb-3" controlId="designation">
              <Form.Label>Designation</Form.Label>
              <FormInput
                type="text"
                name="designation"
                placeholder="Enter designation"
                key="designation"
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

export default AcademicInfo;
