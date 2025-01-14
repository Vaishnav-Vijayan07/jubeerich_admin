import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshData } from "../../../redux/countryReducer";
import { RootState } from "../../../redux/store";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { FormInput } from "../../../components";
import RemarksSection from "../../../components/CheckRemarkTextBox";
import FormButtons from "./FormButtons";
import { useRemarks } from "../../../hooks/useChecksData";
import CheckHeadings from "../../../components/CheckHeadings";

const styles = {
  h5: { fontWeight: "600px", fontSize: "16px" },
  p: { fontWeight: "500px", fontSize: "14px" },
};

function CampusCheck({ current, handleStepChange, student_id, country_id, application_id, type, eligibility_id }: any) {
  const { data, remarks, showRemark, saveRemark,remark,setRemark } = useRemarks({
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
     <CheckHeadings title={"Campus Check"} />
      </Row>
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body>
            <Row className="mt-1 mb-2">
              <Col md={6}>
                <h5 style={styles.h5} >Campus</h5>
                <p style={styles.p}>{data?.campus_name}</p>
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
        remark = {remark}
        eligibility_id = {eligibility_id}
      />
    </>
  );
}

export default CampusCheck;
