import React from "react";
import { Col, Form, Row } from "react-bootstrap";

interface Props {
  data: boolean;
  handleInputChange: any;
  type: string;
}

const AccompanyingDetails = ({ data, handleInputChange, type }: Props) => {
  return (
    <>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{`Are you accompanying with your ${type}?`}</Form.Label>
            <div>
              <Form.Check
                inline
                label="Yes"
                type="radio"
                name={`accompanying_${type}`}
                value="true"
                checked={data === true}
                onChange={handleInputChange}
              />
              <Form.Check
                inline
                label="No"
                type="radio"
                name={`accompanying_${type}`}
                value="false"
                checked={data === false}
                onChange={handleInputChange}
              />
            </div>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default AccompanyingDetails;
