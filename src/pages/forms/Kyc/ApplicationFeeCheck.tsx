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
import CheckHeadings from "../../../components/CheckHeadings";
import { FileText } from "lucide-react";
import FileUpload from "../../../components/ApplicationChecks/RecieptUpload";

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
  const [isCheckPassed, setIsCheckPassed] = useState<boolean>(false);
  const [applicaiton_reciept, setApplicationReciept] = useState<string>("");
  const [remark, setRemark] = useState<string>("");

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
      setRemark(data.data?.remarks?.remarks);
      setIsCheckPassed(data.data?.remarks?.isCheckPassed);
    } catch (error) {
      console.log(error);
    }
  };

  const viewReceipt = (applicaiton_reciept: string) => {
    window.open(`${baseUrl}uploads/application_receipts/${applicaiton_reciept}`, "_blank");
  };

  useEffect(() => {
    fetchData();
  }, [application_id, refresh]);

  return (
    <>
      <Row>
        <Col md={6}>
          <CheckHeadings title="Application Fee Check" />
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          <FileUpload application_id={application_id} />
        </Col>
      </Row>
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body className="d-flex gap-2 align-items-center">
            <div className="d-flex justify-content-between align-items-center application-fee-col p-2">
              <div className="fs-4 text-dark">Application Fee Check</div>
              <div className="application-fee-col-amount-col p-1 d-flex align-items-center justify-content-center">
                <span>{fee?.fee}/-</span>
              </div>
            </div>

            {applicaiton_reciept !== "" && applicaiton_reciept !== null && (
              <div>
                <div
                  style={{
                    width: "280px",
                    height: "53px",
                    backgroundColor: "#e0ddf8",
                    borderRadius: "5px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                  onClick={() => viewReceipt(applicaiton_reciept)}
                >
                  <FileText color="#6657de" strokeWidth={0.5} />
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: "500", color: "#333" }}>Receipt</p>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </Row>
      <RemarksSection remark={remark} onRemarkChange={setRemark} />
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
        remark={remark}
        eligibility_id={eligibility_id}
      />
    </>
  );
}

export default ApplicationFeeCheck;
