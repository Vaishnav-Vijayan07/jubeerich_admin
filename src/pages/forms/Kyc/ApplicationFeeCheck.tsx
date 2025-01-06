import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshData } from "../../../redux/countryReducer";
import { RootState } from "../../../redux/store";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import RemarksSection from "../../../components/CheckRemarkTextBox";
import FormButtons from "./FormButtons";
import { useNavigate } from "react-router-dom";

function ApplicationFeeCheck({
  current,
  handleStepChange,
  studentId,
  country_id,
  comments,
  reference_id,
  universityId,
  application_id,
  type,
  eligibility_id
}: any) {
  const navigate = useNavigate();
  const [fee, setFee] = useState<any>("");
  const [remarks, setRemarks] = useState<string>("");
  const [showRemark, setShowRemark] = useState<boolean>(false);
  const [isCheckPassed, setIsCheckPassed] = useState<boolean>(false);

  const dispatch = useDispatch();

  const successNavigate = () => {
    navigate("/kyc_details/pending/portal_details", {
      state: { universityId, applicationId: application_id, comments, reference_id },
    });
  };

  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`/checks/${type}/${application_id}`);
      setFee(data.data?.checks);
      setRemarks(data.data?.remarks?.remarks);
      setIsCheckPassed(data.data?.remarks?.isCheckPassed);
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

  useEffect(() => {
    fetchData();
  }, [application_id, refresh]);

  return (
    <>
      <Row>
        <h4 className="py-1" style={{ width: "max-content", color: "#1976d2", fontWeight: "800" }}>
          Application Fee Check
        </h4>
      </Row>
      <Row className="mt-2">
        <Card>
          <Card.Body>
            <Row>
              <Form.Group controlId="fee">
                <Form.Label>
                  {`Application Fee`} - {fee?.fee}
                </Form.Label>
              </Form.Group>
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
        successNavigate ={successNavigate}
      />
    </>
  );
}

export default ApplicationFeeCheck;
