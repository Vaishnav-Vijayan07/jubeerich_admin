import React from "react";
import { Col, Form, Row } from "react-bootstrap";

interface Props {
  data: any;
  handleInputChange: any;
}

const RelativesDetails = ({ data, handleInputChange }: Props) => {
  return (
    <Row className="mt-2">
      <Row>
        <h5 className="mb-4 text-uppercase">Relatives Details</h5>
      </Row>
      <Col md={6}>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Relatives Details</Form.Label>
          <Form.Control
            as="textarea"
            name="relatives_info"
            rows={6}
            value={data}
            onChange={handleInputChange}
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

export default RelativesDetails;
