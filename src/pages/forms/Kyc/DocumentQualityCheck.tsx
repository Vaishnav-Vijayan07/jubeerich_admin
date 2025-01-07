import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../components";
import RemarksSection from "../../../components/CheckRemarkTextBox";
import FormButtons from "./FormButtons";
import { useRemarks } from "../../../hooks/useChecksData";
import CheckHeadings from "../../../components/CheckHeadings";
import CheckQuality from "../../../components/ApplicationChecks/CheckQuality";

function DocumentQualityCheck({ studentId, country_id, current, handleStepChange, application_id, type, eligibility_id }: any) {
  const { remarks, showRemark, saveRemark, isCheckPassed, localData, qualityForm, setQualityForm } = useRemarks({
    type,
    application_id,
    eligibility_id,
  });

  const handleCheckChange = (e: any) => {
    const { name, checked } = e.target;
    setQualityForm((prev: any) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <>
      <Row>
        <CheckHeadings title={"Document Quality Check"} />
      </Row>
      <Row className="mt-2">
        <Card>
          <Card.Body>
            <Row className="d-flex-col mt-2 gap-2 mb-3">
              <FormInput label="Formatting" name="formatting" type="checkbox" checked={qualityForm?.formatting} onChange={handleCheckChange} />
              <FormInput label="Clarity" name="clarity" type="checkbox" checked={qualityForm?.clarity} onChange={handleCheckChange} />
              <FormInput label="Scanning" name="scanning" type="checkbox" checked={qualityForm?.scanning} onChange={handleCheckChange} />
            </Row>
          </Card.Body>
        </Card>
      </Row>
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body className="d-flex gap-2 justify-content-center">
            <Col md={4} className="doc-quantity-item">
              <CheckQuality type={"format"} label={"Formatting"} name={"formatting"} onChange={handleCheckChange} checked={qualityForm?.formatting} />
            </Col>
            <Col md={4} className="doc-quantity-item">
              <CheckQuality type={"format"} label={"Clarity"} name={"clarity"} onChange={handleCheckChange} checked={qualityForm?.clarity} />
            </Col>
            <Col md={4} className="doc-quantity-item">
              <CheckQuality type={"scan"} label={"Scanning"} name={"scanning"} onChange={handleCheckChange} checked={qualityForm?.formatting} />
            </Col>
          </Card.Body>
        </Card>
      </Row>
      <RemarksSection showRemark={showRemark} remarks={remarks} saveRemark={saveRemark} />
      <FormButtons
        type={type}
        current={current}
        isCheckPassed={isCheckPassed}
        handleStepChange={handleStepChange}
        student_id={studentId}
        country_id={country_id}
        application_id={application_id}
        remarks={remarks}
        qualityForm={qualityForm}
        localData={localData}
      />
    </>
  );
}

export default DocumentQualityCheck;
