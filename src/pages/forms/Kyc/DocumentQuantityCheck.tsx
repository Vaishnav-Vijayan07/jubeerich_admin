import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import DocumentsOverview from "../../lead_management/Tasks/List/DocumentsOverview/DocumentsOverview";
import { FormInput } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { refreshData } from "../../../redux/countryReducer";
import { RootState } from "../../../redux/store";
import axios from "axios";
import RemarksSection from "../../../components/CheckRemarkTextBox";
import FormButtons from "./FormButtons";
import { useRemarks } from "../../../hooks/useChecksData";
import CheckHeadings from "../../../components/CheckHeadings";

function DocumentQuantityCheck({ current, handleStepChange, studentId, country_id, application_id, type, eligibility_id }: any) {
  const { isCheckPassed, remarks, showRemark, saveRemark } = useRemarks({
    type,
    application_id,
    eligibility_id,
  });

  return (
    <>
      <Row>
        <CheckHeadings title={"Document Quantity Check"}/>
      </Row>
      <Row className="mt-2">
        <Card>
          <Card.Body>
            <Row>
              <DocumentsOverview studentId={studentId} check={true} />
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
      />
    </>
  );
}

export default DocumentQuantityCheck;
