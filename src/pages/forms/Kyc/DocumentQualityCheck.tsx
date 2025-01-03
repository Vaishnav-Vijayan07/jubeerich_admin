import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshData } from "../../../redux/countryReducer";
import { RootState } from "../../../redux/store";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../components";
import axios from "axios";
import RemarksSection from "../../../components/CheckRemarkTextBox";

function DocumentQualityCheck({ studentId, quality, handleFormData, application_id, type, eligibility_id }: any) {
  const dispatch = useDispatch();
  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);
  const [remarks, setRemarks] = useState<string>("");
  const [showRemark, setShowRemark] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`/checks/${type}/${application_id}`);
      setRemarks(data.data?.remarks?.remarks);
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
    handleFormData(name, checked);
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
              <FormInput label="Formatting" name="formatting" type="checkbox" checked={quality?.formatting} onChange={handleCheckChange} />
              <FormInput label="Clarity" name="clarity" type="checkbox" checked={quality?.clarity} onChange={handleCheckChange} />
              <FormInput label="Scanning" name="scanning" type="checkbox" checked={quality?.scanning} onChange={handleCheckChange} />
            </Row>
          </Card.Body>
        </Card>
      </Row>
      <RemarksSection showRemark={showRemark} remarks={remarks} setRemarks={setRemarks} saveRemark={saveRemark} showRemarkBox={showRemarkBox} />
    </>
  );
}

export default DocumentQualityCheck;
