import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshData } from "../../../redux/countryReducer";
import { RootState } from "../../../redux/store";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../components";
import RemarksSection from "../../../components/CheckRemarkTextBox";
import FormButtons from "./FormButtons";

export const types = {
  education: "education",
  visa: "visa",
};

function EntryRequirementCheck({  current, handleStepChange, studentId, country_id, application_id, type, eligibility_id }: any) {
  const dispatch = useDispatch();
  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);
  const [remarks, setRemarks] = useState<string>("");
  const [isCheckPassed, setIsCheckPassed] = useState<boolean>(false);
  const [showRemark, setShowRemark] = useState<boolean>(false);
  const [educationDetails, setEducationDetails] = useState<any>([]);
  const [gapDetails, setGapDetails] = useState<any>([]);

  const fetchEducationalCheck = async () => {
    try {
      const [detailsResponse, checkDetails] = await Promise.all([
        axios.get(`/details_application/${types.education}/${studentId}`),
        axios.get(`/checks/${type}/${application_id}`),
      ]);

      let edDetails: any = [];

      const educationDetails = detailsResponse?.data?.data?.educationDetails;
      const graduationDetails = detailsResponse?.data?.data?.graduationDetails;

      if (educationDetails?.length > 0) {
        edDetails = [...educationDetails];
      }
      if (graduationDetails?.length > 0) {
        edDetails = [...edDetails, ...graduationDetails];
      }

      setEducationDetails(edDetails.length > 0 ? edDetails : []);
      setGapDetails(detailsResponse?.data?.data?.gapReasons);
      setRemarks(checkDetails.data.data?.remarks?.remarks);
      setIsCheckPassed(checkDetails.data.data?.remarks?.isCheckPassed);
      setShowRemark(checkDetails.data.data?.remarks?.remarks ? true : false);
    } catch (error) {
      console.log(error);
    }
  };

  const showRemarkBox = () => {
    setShowRemark(true);
  };

  const saveRemark = async (value:string) => {
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
    fetchEducationalCheck();
  }, [application_id, refresh]);

  return (
    <>
      <Row>
        <h4 className="py-1" style={{ width: "max-content", color: "#1976d2", fontWeight: "800" }}>
          Entry Requirement Check
        </h4>
      </Row>

      <Row className="mt-2">
        <Card>
          <Card.Body>
            <Row className="mb-2">
              <div className="text-start mt-2 ps-1">
                <h5 className="font-weight-bold text-danger">Qualifications:</h5>

                {educationDetails?.length > 0 ? (
                  educationDetails?.map((qual: any, index: number) => (
                    <div key={index} className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`} style={{ padding: "10px", borderRadius: "4px" }}>
                      <p className="mb-1 font-15">
                        <strong>Qualification:</strong>
                        <span className="ms-2">{qual?.qualification}</span>
                      </p>
                      <p className="mb-1 font-15">
                        <strong>Name of the College & University:</strong>
                        <span className="ms-2">{qual?.school_name}</span>
                      </p>
                      <p className="mb-1 font-15">
                        <strong>Start Date:</strong>
                        <span className="ms-2">{qual?.start_date ? moment(qual?.start_date).format("DD/MM/YYYY") : "N/A"}</span>
                      </p>
                      <p className="mb-1 font-15">
                        <strong>End Date:</strong>
                        <span className="ms-2">{qual?.end_date ? moment(qual?.end_date).format("DD/MM/YYYY") : "N/A"}</span>
                      </p>
                      <p className="mb-1 font-15">
                        <strong>Percentage:</strong>
                        <span className="ms-2">{qual?.percentage}</span>
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="d-flex justify-content-center align-items-center border border-secondary mt-2 me-2">
                    <h4 className="text-muted">No Documents Uploaded</h4>
                  </div>
                )}

                <h5 className="font-weight-bold text-danger">Periods of Gap:</h5>

                {gapDetails?.length > 0 ? (
                  gapDetails?.map((gap: any, index: any) => (
                    <div key={index} className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`} style={{ padding: "10px", borderRadius: "4px" }}>
                      <p className="mb-1 font-15">
                        <strong>Period of Gap:</strong>
                        <span className="ms-2">{`${gap?.start_date ? moment(gap?.start_date).format("DD/MM/YYYY") : "N/A"} - ${
                          gap?.end_date ? moment(gap?.end_date).format("DD/MM/YYYY") : "N/A"
                        }`}</span>
                      </p>
                      <p className="mb-1 font-15">
                        <strong>Reason:</strong>
                        <span className="ms-2">{gap?.reason}</span>
                      </p>
                      <p className="mb-1 font-15">
                        <strong>Supporting Documents:</strong>
                        <span className="ms-2">{gap?.type.toUpperCase()}</span>
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="d-flex justify-content-center align-items-center border border-secondary mt-2 me-2">
                    <h4 className="text-muted">No Documents Uploaded</h4>
                  </div>
                )}
              </div>
            </Row>
          </Card.Body>
        </Card>
      </Row>
      <RemarksSection  showRemark={showRemark} remarks={remarks} saveRemark={saveRemark} />
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

export default EntryRequirementCheck;
