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

export const types = {
  education: "education",
  visa: "visa",
};

type EducationDetail = {
  qualification: string; // e.g., "Bachelor of Science"
  school_name: string; // e.g., "XYZ University"
  start_date?: string | null; // ISO format date string, nullable
  end_date?: string | null; // ISO format date string, nullable
  percentage?: string | number | null; // Percentage as a string, number, or nullable
};

type EducationDetailsArray = EducationDetail[];

const eDetails: EducationDetailsArray = [
  {
    qualification: "Bachelor of Science in Computer Science",
    school_name: "XYZ University",
    start_date: "2015-08-01",
    end_date: "2019-05-15",
    percentage: 85,
  },
  {
    qualification: "Master of Science in Data Science",
    school_name: "ABC University",
    start_date: "2020-01-10",
    end_date: "2022-04-20",
    percentage: "90%",
  },
  {
    qualification: "Diploma in Web Development",
    school_name: "Online Academy",
    start_date: "2018-06-01",
    end_date: "2019-06-01",
    percentage: 88,
  },
  {
    qualification: "High School Diploma",
    school_name: "City High School",
    start_date: "2013-06-01",
    end_date: "2015-05-01",
    percentage: "78%",
  },
  {
    qualification: "Certificate in Graphic Design",
    school_name: "Creative Arts College",
    start_date: "2019-09-01",
    end_date: "2020-06-01",
    percentage: null,
  },
  {
    qualification: "Ph.D. in Artificial Intelligence",
    school_name: "Tech University",
    start_date: "2022-08-01",
    end_date: null, // Ongoing
    percentage: null,
  },
  {
    qualification: "Bachelor of Business Administration",
    school_name: "Commerce University",
    start_date: "2014-08-01",
    end_date: "2018-06-01",
    percentage: 72,
  },
  {
    qualification: "Associate Degree in Marketing",
    school_name: "Marketing College",
    start_date: "2016-01-01",
    end_date: "2018-12-31",
    percentage: 80,
  },
];

function EntryRequirementCheck({ current, handleStepChange, studentId, country_id, application_id, type, eligibility_id }: any) {
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

              <Row>
                {educationDetails?.length > 0 ? (
                  <div className="qualification-container">
                    {educationDetails.map((qual: any, index: number) => (
                      <div key={index} className="qualification-box">
                        <p className="mb-1 font-15">
                          <strong>Qualification:</strong>
                          <span className="ms-2">{qual?.qualification}</span>
                        </p>
                        <p className="mb-1 font-15">
                          <strong>College & University:</strong>
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
                  <div className="d-flex justify-content-center align-items-center no-data-container">
                    <h4 className="text-muted">No Documents Uploaded</h4>
                  </div>
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
                        <p className="mb-1 font-15">
                          <strong>Reason:</strong>
                          <span className="ms-2">{gap?.reason}</span>
                        </p>
                        <p className="mb-1 font-15">
                          <strong>Supporting Documents:</strong>
                          <span className="ms-2">{gap?.type.toUpperCase()}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="d-flex justify-content-center align-items-center no-data-container">
                    <h4 className="text-muted">No Documents Uploaded</h4>
                  </div>
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
