import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import { types } from "./EntryRequirementCheck";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { refreshData } from "../../../redux/countryReducer";
import RemarksSection from "../../../components/CheckRemarkTextBox";
import FormButtons from "./FormButtons";
import CheckHeadings from "../../../components/CheckHeadings";
import ImmigrationDetails from "../../../components/ApplicationChecks/DocsQuantity/ImmigrationDetails";

function PreviousImmigrationCheck({ current, handleStepChange, studentId, country_id, application_id, type, eligibility_id }: any) {
  const dispatch = useDispatch();
  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);
  const [remarks, setRemarks] = useState<string>("");
  const [isCheckPassed, setIsCheckPassed] = useState<boolean>(false);
  const [showRemark, setShowRemark] = useState<boolean>(false);
  const [visaApprovals, setVisaApprovals] = useState<any>([]);
  const [visaDeclines, setVisaDeclines] = useState<any>([]);
  const [remark, setRemark] = useState<string>("");

  const onRemarkChange = (value: string) => {
    setRemark(value);
  };

  const fetchImmigrationDetails = async () => {
    try {
      const [visaData, checkData] = await Promise.all([
        axios.get(`/details_application/${types.visa}/${studentId}`),
        axios.get(`/checks/${type}/${application_id}`),
      ]);

      setVisaApprovals(visaData.data?.visaDetails?.previousVisaApprovals);
      setVisaDeclines(visaData.data?.visaDetails?.previousVisaDeclines);
      setRemarks(checkData.data.data?.remarks?.remarks);
      setIsCheckPassed(checkData.data.data?.remarks?.isCheckPassed);
      setShowRemark(checkData.data.data?.remarks?.remarks ? true : false);
    } catch (error) {
      console.log(error);
    }
  };

  const showRemarkBox = () => {
    setShowRemark(true);
  };

  const saveRemark = async (value: string) => {
    try {
      await axios.post(`/checks_remarks/${type}/${application_id}`, {
        remarks: value == "" ? null : value,
        eligibility_id,
      });
      dispatch(refreshData());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImmigrationDetails();
  }, [studentId, refresh]);

  return (
    <>
      <Row>
        <CheckHeadings title="Previous Immigration" />
      </Row>

      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body>
            <CheckHeadings title="Previous Visa Approvals" />
            <ImmigrationDetails VisaData={visaApprovals} />
          </Card.Body>
        </Card>
      </Row>
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body>
            <CheckHeadings title="Previous Visa Declines" />
            <ImmigrationDetails VisaData={visaDeclines} />
          </Card.Body>
        </Card>
      </Row>
      <RemarksSection showRemark={showRemark} remarks={remarks} saveRemark={saveRemark} onRemarkChange={onRemarkChange} />
      <FormButtons
        type={type}
        current={current}
        isCheckPassed={isCheckPassed}
        handleStepChange={handleStepChange}
        student_id={studentId}
        country_id={country_id}
        application_id={application_id}
        remarks={remarks}
        remark = {remark}
        eligibility_id = {eligibility_id}
      />
    </>
  );
}

export default PreviousImmigrationCheck;
