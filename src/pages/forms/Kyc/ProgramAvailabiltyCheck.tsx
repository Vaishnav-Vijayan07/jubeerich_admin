import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshData } from "../../../redux/countryReducer";
import { RootState } from "../../../redux/store";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../components";
import axios from "axios";
import RemarksSection from "../../../components/CheckRemarkTextBox";
import { showSuccessAlert } from "../../../constants";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import FormButtons from "./FormButtons";

function ProgramAvailabiltyCheck({ current, handleStepChange, student_id, country_id, application_id, type, eligibility_id }: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);
  const [data, setData] = useState<any>(null);
  const [remarks, setRemarks] = useState<string>("");
  const [showRemark, setShowRemark] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`/checks/${type}/${application_id}`);
      setData(data.data?.checks);
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

  useEffect(() => {
    fetchData();
  }, [application_id, refresh]);

  return (
    <>
      <Row>
        <h4 className="py-1" style={{ width: "max-content", color: "#1976d2", fontWeight: "800" }}>
          Program Availability Check
        </h4>
      </Row>
      <Row className="mt-2">
        <Card>
          <Card.Body>
            <Row>
              <Col md={3}>
                <h5>Country</h5>
                <p>{data?.country_name || "N/A"}</p>
              </Col>

              <Col md={3}>
                <h5>University</h5>
                <p>{data?.university_name || "N/A"}</p>
              </Col>

              <Col md={3}>
                <h5>Intake applying for</h5>
                <p>{data?.intake_applying_for || "N/A"}</p>
              </Col>

              <Col md={3}>
                <h5>Course Link</h5>
                <p>
                  <a href={data?.course_link} target="_blank" rel="noopener noreferrer">
                    {data?.course_link || "N/A"}
                  </a>
                </p>
              </Col>
            </Row>
            <Row className="mt-2 mb-2">
              <Col md={3}>
                <h5>Stream</h5>
                <p>{data?.stream_name}</p>
              </Col>

              <Col md={3}>
                <h5>Program</h5>
                <p>{data?.program_name}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
      <RemarksSection showRemark={showRemark} remarks={remarks} setRemarks={setRemarks} saveRemark={saveRemark} showRemarkBox={showRemarkBox} />
      <FormButtons
        type={type}
        current={current}
        isCheckPassed={data?.isCheckPassed}
        handleStepChange={handleStepChange}
        student_id={student_id}
        country_id={country_id}
        application_id={application_id}
        remarks={remarks}
      />
    </>
  );
}

export default ProgramAvailabiltyCheck;
