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

    console.log("CHECK",name, checked)

    setQualityForm((prev: any) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleDivClickForCheck = (type: "formatting" | "clarity" | "scanning") => {
    const cbox = document.getElementById(type) as HTMLInputElement;
    cbox.checked = !cbox.checked;
    setQualityForm((prev: any) => ({
      ...prev,
      [type]: cbox.checked,
    }))
  };

  return (
    <>
      <Row>
        <CheckHeadings title={"Document Quality Check"} />
      </Row>
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body className="d-flex gap-2 justify-content-center">
            <Col md={4} className="doc-quantity-item" onClick={() => handleDivClickForCheck("formatting")}>
              <CheckQuality
                id={"formatting"}
                type={"format"}
                label={"Formatting"}
                name={"formatting"}
                onChange={handleCheckChange}
                checked={qualityForm?.formatting}
              />
            </Col>
            <Col md={4} className="doc-quantity-item" onClick={() => handleDivClickForCheck("clarity")}>
              <CheckQuality
                id={"clarity"}
                type={"clarity"}
                label={"Clarity"}
                name={"clarity"}
                onChange={handleCheckChange}
                checked={qualityForm?.clarity}
              />
            </Col>
            <Col md={4} className="doc-quantity-item" onClick={() => handleDivClickForCheck("scanning")}>
              <CheckQuality
                id={"scanning"}
                type={"scan"}
                label={"Scanning"}
                name={"scanning"}
                onChange={handleCheckChange}
                checked={qualityForm?.scanning}
              />
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
