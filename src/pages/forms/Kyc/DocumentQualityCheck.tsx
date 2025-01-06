import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../components";
import RemarksSection from "../../../components/CheckRemarkTextBox";
import FormButtons from "./FormButtons";
import { useRemarks } from "../../../hooks/useChecksData";

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
        <h4 className="py-1" style={{ width: "max-content", color: "#1976d2", fontWeight: "800" }}>
          Document Quality Check
        </h4>
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
