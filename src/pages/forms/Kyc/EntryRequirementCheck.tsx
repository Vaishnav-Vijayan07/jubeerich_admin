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
import CheckHeadings from "../../../components/CheckHeadings";
import RequirementCheck from "../../../components/ApplicationChecks/RequirementCheck";
import { Tooltip } from "@mui/material";
import NoDoc from "../../../components/ApplicationChecks/NoDoc";

export const types = {
  education: "education",
  visa: "visa",
};

function EntryRequirementCheck({ current, handleStepChange, studentId, country_id, application_id, type, eligibility_id }: any) {
  const dispatch = useDispatch();
  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);
  const [remarks, setRemarks] = useState<string>("");
  const [isCheckPassed, setIsCheckPassed] = useState<boolean>(false);
  const [showRemark, setShowRemark] = useState<boolean>(false);
  const [educationDetails, setEducationDetails] = useState<any>([]);
  const [graduationDetails, setGraduationDetails] = useState<any>([]);
  const [gapDetails, setGapDetails] = useState<any>([]);

  const fetchEducationalCheck = async () => {
    try {
      const [detailsResponse, checkDetails] = await Promise.all([
        axios.get(`/details_application/${types.education}/${studentId}`),
        axios.get(`/checks/${type}/${application_id}`),
      ]);

      console.log("isCheckPassed", checkDetails.data.data?.remarks?.isCheckPassed);
      const educationDetails = detailsResponse?.data?.data?.educationDetails;
      const graduationDetails = detailsResponse?.data?.data?.graduationDetails;

      setEducationDetails(educationDetails);
      setGraduationDetails(graduationDetails);
      setGapDetails(detailsResponse?.data?.data?.gapReasons);
      setRemarks(checkDetails.data.data?.remarks?.remarks);
      setIsCheckPassed(checkDetails.data.data?.remarks?.isCheckPassed);
      setShowRemark(checkDetails.data.data?.remarks?.remarks ? true : false);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("isCheckPassed", isCheckPassed);

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
    fetchEducationalCheck();
  }, [application_id, refresh]);

  return (
    <>
      <Row>
        <CheckHeadings title={"Entry Requirement Check"} />
      </Row>

      <Row className="mt-2 mb-2">
        <Card className="basic-card">
          <Card.Body>
            <Row className="mb-2">
              <CheckHeadings title={"Educational Qualifications"} />

              <Row className="mb-2">
                {educationDetails?.length > 0 ? (
                  <div className="qualification-container">
                    {educationDetails.map((qual: any, index: number) => (
                      <div key={index} className="qualification-box">
                        <p className="mb-1 font-15">
                          <strong>Qualification:</strong>
                          <span className="ms-2">{qual?.qualification}</span>
                        </p>
                        <p className="mb-1 font-15">
                          <strong>School Name:</strong>
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
                    ))}
                  </div>
                ) : (
                  <NoDoc />
                )}
              </Row>

              <CheckHeadings title={"Graduation Qualifications"} />

              <Row>
                {graduationDetails?.length > 0 ? (
                  <div className="qualification-container">
                    {graduationDetails.map((qual: any, index: number) => (
                      <div key={index} className="qualification-box">
                        <p className="mb-1 font-15">
                          <strong>Qualification:</strong>
                          <span className="ms-2">{qual?.qualification}</span>
                        </p>
                        <p className="mb-1 font-15">
                          <strong>College & University:</strong>
                          <span className="ms-2">
                            {qual?.college_name} - {qual?.university_name}
                          </span>
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
                    ))}
                  </div>
                ) : (
                  <NoDoc />
                )}
              </Row>
            </Row>
          </Card.Body>
        </Card>
      </Row>

      <Row className="mt-2 mb-2">
        <Card className="basic-card">
          <Card.Body>
            <Row className="mb-2">
              <CheckHeadings title={"Gap Periods"} />

              <Row>
                {gapDetails?.length > 0 ? (
                  <div className="qualification-container">
                    {gapDetails.map((gap: any, index: number) => (
                      <div key={index} className="qualification-box">
                        <p className="mb-1 font-15">
                          <strong>Period of Gap:</strong>
                          <span className="ms-2">{`${gap?.start_date ? moment(gap?.start_date).format("DD/MM/YYYY") : "N/A"} - ${
                            gap?.end_date ? moment(gap?.end_date).format("DD/MM/YYYY") : "N/A"
                          }`}</span>
                        </p>
                        <p className="mb-1 font-15 d-flex">
                          <strong>Reason:</strong>
                          <Tooltip title={gap?.reason || "N/A"} placement="top" arrow>
                            <span className="ms-2 truncate-text">{gap?.reason}</span>
                          </Tooltip>
                        </p>
                        <p className="mb-1 font-15">
                          <strong>Supporting Documents:</strong>
                          <span className="ms-2">{gap?.type.toUpperCase()}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <NoDoc />
                )}
              </Row>
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
      />
    </>
  );
}

export default EntryRequirementCheck;
