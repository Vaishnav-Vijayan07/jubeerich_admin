import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../components";

type Props = {
  studentId: any
};

function DocumentQualityCheck({ studentId }: Props) {
  return (
    <>
      <Row>
        <h4>Document Quality Check</h4>
      </Row>
      <Row className="mt-2">
        <Card>
          <Card.Body>
            <Row className="d-flex-col mt-2 gap-2 mb-3">
              <FormInput label="Formatting" name="formatting" type="checkbox" />
              <FormInput label="Clarity" name="clarity" type="checkbox" />
              <FormInput label="Scanning" name="scanning" type="checkbox" />
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </>
  );
}

export default DocumentQualityCheck;
