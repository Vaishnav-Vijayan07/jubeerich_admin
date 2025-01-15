import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import RemarksSection from "../../../components/CheckRemarkTextBox";
import FormButtons from "./FormButtons";
import { useRemarks } from "../../../hooks/useChecksData";
import CheckHeadings from "../../../components/CheckHeadings";

const styles = {
  h5: { fontWeight: "600px", fontSize: "16px" },
  p: { fontWeight: "500px", fontSize: "14px" },
};

function ProgramAvailabiltyCheck({ current, handleStepChange, student_id, country_id, application_id, type, eligibility_id }: any) {
  const { data, remarks, showRemark, saveRemark, remark, setRemark } = useRemarks({
    type,
    application_id,
    eligibility_id,
  });

  const onRemarkChange = (value: string) => {
    setRemark(value);
  };

  return (
    <>
      <Row>
        <CheckHeadings title={"Program Availability Check"} />
      </Row>
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body>
            <Row>
              <Col md={2} className="d-flex flex-column align-content-center text-center program-availability-col">
                <h5 style={styles?.h5}>Country</h5>
                <p style={styles?.p}>{data?.country_name || "N/A"}</p>
              </Col>

              <Col md={2} className="d-flex flex-column align-content-center text-center program-availability-col">
                <h5 style={styles?.h5}>University</h5>
                <p style={styles?.p}>{data?.university_name || "N/A"}</p>
              </Col>

              <Col md={2} className="d-flex flex-column align-content-center text-center program-availability-col">
                <h5 style={styles?.h5}>Intake applying for</h5>
                <p style={styles?.p}>{data?.intake_applying_for || "N/A"}</p>
              </Col>

              <Col md={2} className="d-flex flex-column align-content-center text-center program-availability-col">
                <h5 style={styles?.h5}>Course Link</h5>
                <p style={styles?.p}>
                  <a href={data?.course_link} target="_blank" rel="noopener noreferrer">
                    {data?.course_link || "N/A"}
                  </a>
                </p>
              </Col>

              <Col md={2} className="d-flex flex-column align-content-center text-center program-availability-col">
                <h5 style={styles?.h5}>Stream</h5>
                <p style={styles?.p}>{data?.stream_name}</p>
              </Col>

              <Col md={2} className="d-flex flex-column align-content-center text-center">
                <h5 style={styles?.h5}>Program</h5>
                <p style={styles?.p}>{data?.program_name}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>

      <RemarksSection showRemark={showRemark} remarks={remarks} saveRemark={saveRemark} onRemarkChange={onRemarkChange} />

      <FormButtons
        type={type}
        current={current}
        isCheckPassed={data?.isCheckPassed}
        handleStepChange={handleStepChange}
        student_id={student_id}
        country_id={country_id}
        application_id={application_id}
        remarks={remarks}
        remark={remark}
        eligibility_id = {eligibility_id}
      />
    </>
  );
}

export default ProgramAvailabiltyCheck;
