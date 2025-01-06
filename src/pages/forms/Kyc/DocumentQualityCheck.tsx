import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshData } from "../../../redux/countryReducer";
import { RootState } from "../../../redux/store";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../components";
import axios from "axios";
import RemarksSection from "../../../components/CheckRemarkTextBox";
import FormButtons from "./FormButtons";

function DocumentQualityCheck({ studentId, country_id, current, handleStepChange, application_id, type, eligibility_id }: any) {
  const dispatch = useDispatch();
  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);
  const [remarks, setRemarks] = useState<string>("");
  const [showRemark, setShowRemark] = useState<boolean>(false);
  const [isCheckPassed, setIsCheckPassed] = useState<boolean>(false);
  const [localData, setLocalData] = useState<any>({
    formatting: false,
    clarity: false,
    scanning: false,
  });
  const [qualityForm, setQualityForm] = useState<any>({
    formatting: false,
    clarity: false,
    scanning: false,
  });

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`/checks/${type}/${application_id}`);
      setRemarks(data.data?.remarks?.remarks);
      setIsCheckPassed(data.data?.remarks?.isCheckPassed);
      setQualityForm(data.data?.remarks?.qualityForm);
      setLocalData(data.data?.remarks?.qualityForm);
      setShowRemark(data.data?.remarks?.remarks ? true : false);
    } catch (error) {
      console.log(error);
    }
  };

  const showRemarkBox = () => {
    setShowRemark(true);
  };

  const saveRemark = async () => {
    try {
      await axios.post(`/checks_remarks/${type}/${application_id}`, {
        remarks: remarks == "" ? null : remarks,
        eligibility_id,
      });
      dispatch(refreshData());
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckChange = (e: any) => {
    const { name, checked } = e.target;
    setQualityForm((prev: any) => ({
      ...prev,
      [name]: checked,
    }));
  };

  useEffect(() => {
    fetchData();
  }, [application_id, refresh]);

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
      <RemarksSection showRemark={showRemark} remarks={remarks} setRemarks={setRemarks} saveRemark={saveRemark} showRemarkBox={showRemarkBox} />
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
        localData = {localData}
      />
    </>
  );
}

export default DocumentQualityCheck;
