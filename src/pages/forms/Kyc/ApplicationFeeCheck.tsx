import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshData } from "../../../redux/countryReducer";
import { RootState } from "../../../redux/store";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import RemarksSection from "../../../components/CheckRemarkTextBox";
import FormButtons from "./FormButtons";
import { useNavigate } from "react-router-dom";
import { FormInput } from "../../../components";
import { baseUrl, showErrorAlert, showSuccessAlert } from "../../../constants";

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
  eligibility_id,
}: any) {
  const navigate = useNavigate();
  const [fee, setFee] = useState<any>("");
  const [remarks, setRemarks] = useState<string>("");
  const [showRemark, setShowRemark] = useState<boolean>(false);
  const [isCheckPassed, setIsCheckPassed] = useState<boolean>(false);
  const [applicaiton_reciept, setApplicationReciept] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      setApplicationReciept(data.data?.checks?.application_reciept);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        setSelectedFile(null);
      }
    }
  };

  const handleUploadReciept = async () => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("application_reciept", selectedFile);
    }

    try {
      const { data } = await axios.patch(`/application_receipt/${application_id}`, formData);
      if (data?.status) {
        showSuccessAlert(data?.message);
        setSelectedFile(null);
        dispatch(refreshData());
      } else {
        showErrorAlert(data?.message);
      }
    } catch (error) {
      showErrorAlert(error);
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
              <Col className="d-flex align-items-center">
                <Form.Group controlId="fee">
                  <Form.Label>
                    {`Application Fee`} - {fee?.fee}
                  </Form.Label>
                </Form.Group>
              </Col>

              <Col md={3} className="d-flex gap-2">
                <Form.Group className="mb-3" controlId={`payslip_document`}>
                  <Form.Label>
                    <span className="text-danger">*</span> Applicaton Fee Reciept
                  </Form.Label>
                  <div className="d-flex ">
                    <FormInput type="file" name="payslip_document" accept="application/pdf" onChange={(e) => handleFileChange(e)} />
                    {selectedFile && (
                      <Button variant="primary" type="submit" className="ms-2" onClick={handleUploadReciept}>
                        Upload
                      </Button>
                    )}
                  </div>
                  {applicaiton_reciept !== "" && applicaiton_reciept !== null && (
                    <div className="d-flex align-items-center">
                      <i className="mdi mdi-eye text-primary me-2"></i>
                      <a
                        href={`${baseUrl}/uploads/application_receipts/${applicaiton_reciept}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        application reciept
                      </a>
                    </div>
                  )}
                </Form.Group>
              </Col>
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
        successNavigate={successNavigate}
      />
    </>
  );
}

export default ApplicationFeeCheck;
