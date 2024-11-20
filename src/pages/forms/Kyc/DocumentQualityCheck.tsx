import React, { useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../components";

type Props = {
  studentId: any;
  quality: any;
  handleFormData: any
};

function DocumentQualityCheck({ studentId, quality, handleFormData }: Props) {

  const handleCheckChange = (e: any) => {

    const { name, checked } = e.target;
    handleFormData(name, checked);

  }

  return (
    <>
      <Row>
        <h4 className="py-1" style={{width:"max-content", color:"#1976d2", fontWeight:"800"}}>Document Quality Check</h4>
      </Row>
      <Row className="mt-2">
        <Card>
          <Card.Body>
            <Row className="d-flex-col mt-2 gap-2 mb-3">
              <FormInput label="Formatting" name="formatting" type="checkbox" checked={quality?.formatting} onChange={handleCheckChange}/>
              <FormInput label="Clarity" name="clarity" type="checkbox" checked={quality?.clarity} onChange={handleCheckChange}/>
              <FormInput label="Scanning" name="scanning" type="checkbox" checked={quality?.scanning} onChange={handleCheckChange}/>
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </>
  );
}

export default DocumentQualityCheck;
