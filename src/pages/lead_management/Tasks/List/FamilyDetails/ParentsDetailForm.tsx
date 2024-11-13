import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../../components";

interface ParentDetailsFormProps {
  parentType: string;
  parentDetails: any;
  onChange: (e: any) => void;
}

const ParentDetailsForm = ({
  parentType,
  parentDetails,
  onChange,
}: ParentDetailsFormProps) => {
  return (
    <Row className="border-bottom p-1 mb-1">
      <Row>
        <h5 className="mb-4 text-uppercase">{`${parentType}'s Details`}</h5>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${parentType}_name`}>
            <Form.Label>{`Name of ${
              parentType.charAt(0).toUpperCase() + parentType.slice(1)
            }`}</Form.Label>
            <FormInput
              type="text"
              name={`${parentType}.name`}
              placeholder={`Enter name of ${parentType}`}
              onChange={onChange}
              value={parentDetails?.name}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${parentType}_occupation`}>
            <Form.Label>Occupation</Form.Label>
            <FormInput
              type="text"
              name={`${parentType}.occupation`}
              placeholder={`Enter ${parentType}'s occupation`}
              onChange={onChange}
              value={parentDetails?.occupation}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group
            className="mb-3"
            controlId={`${parentType}_annual_income`}
          >
            <Form.Label>Annual Income</Form.Label>
            <FormInput
              type="number"
              name={`${parentType}.annual_income`}
              placeholder={`Enter ${parentType}'s annual income`}
              onChange={onChange}
              value={parentDetails?.annual_income}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${parentType}_organization`}>
            <Form.Label>Organization</Form.Label>
            <FormInput
              type="text"
              name={`${parentType}.organization`}
              placeholder={`Enter ${parentType}'s organization`}
              onChange={onChange}
              value={parentDetails?.organization}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group
            className="mb-3"
            controlId={`${parentType}_income_tax_payer`}
          >
            <Form.Label>Income Tax Payer</Form.Label>
            <Form.Check
              type="checkbox"
              label="Is Income Tax Payer"
              name={`${parentType}.income_tax_payer`}
              checked={parentDetails?.income_tax_payer}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        {parentType !== "spouse" && (
          <Col md={6}>
            <Form.Group
              className="mb-3"
              controlId={`${parentType}_nature_of_occupation`}
            >
              <Form.Label>Nature of Occupation</Form.Label>
              <FormInput
                type="text"
                name={`${parentType}.nature_of_occupation`}
                placeholder={`Enter ${parentType}'s nature of occupation`}
                onChange={onChange}
                value={parentDetails?.nature_of_occupation}
              />
            </Form.Group>
          </Col>
        )}
      </Row>
    </Row>
  );
};

export default ParentDetailsForm;
