import React, { useEffect, useState } from "react";
import { Accordion, Button, Card, Col, Form, Row } from "react-bootstrap";
import DocumentsOverview from "../../lead_management/Tasks/List/DocumentsOverview/DocumentsOverview";
import RemarksSection from "../../../components/CheckRemarkTextBox";
import FormButtons from "./FormButtons";
import { useRemarks } from "../../../hooks/useChecksData";
import CheckHeadings from "../../../components/CheckHeadings";
import EmpHistories from "../../../components/ApplicationChecks/DocsQuantity/EmpHistories";
import axios from "axios";
import { showErrorAlert } from "../../../constants";
import SkeletonComponent from "../../lead_management/Tasks/List/StudyPreference/LoadingSkeleton";
import PoliceDocs from "../../../components/ApplicationChecks/DocsQuantity/PoliceDocs";
import ExamData from "../../../components/ApplicationChecks/DocsQuantity/ExamData";
import WorkInfos from "../../../components/ApplicationChecks/DocsQuantity/WorkInfos";
import EducationDetails from "../../../components/ApplicationChecks/DocsQuantity/EducationDetails";
import FundDetails from "../../../components/ApplicationChecks/DocsQuantity/FundDetails";
import NoDoc from "../../../components/ApplicationChecks/NoDoc";
import VisaDeclineDetails from "../../../components/ApplicationChecks/DocsQuantity/VisaDecline";
import AdditionalDocs from "../../../components/ApplicationChecks/DocsQuantity/AdditionalDocs";
import GraduationDetails from "../../../components/ApplicationChecks/DocsQuantity/GraduationInfo";
import GapDocs from "../../../components/ApplicationChecks/DocsQuantity/GapDocs";

const PersonIcon = () => (
  <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="23" height="24" rx="5" fill="#6658DD" />
    <path
      d="M17.1112 17.0624V15.62C17.1112 14.855 16.8069 14.1212 16.2651 13.5803C15.7233 13.0393 14.9885 12.7354 14.2223 12.7354H8.44455C7.67837 12.7354 6.94357 13.0393 6.4018 13.5803C5.86003 14.1212 5.55566 14.855 5.55566 15.62V17.0624"
      stroke="#F5F6F8"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.3332 9.85043C12.9287 9.85043 14.2221 8.55892 14.2221 6.96574C14.2221 5.37257 12.9287 4.08105 11.3332 4.08105C9.73774 4.08105 8.44434 5.37257 8.44434 6.96574C8.44434 8.55892 9.73774 9.85043 11.3332 9.85043Z"
      stroke="#F5F6F8"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function DocumentQuantityCheck({ current, handleStepChange, studentId, country_id, application_id, type, eligibility_id }: any) {
  const { isCheckPassed, remarks, showRemark, saveRemark } = useRemarks({
    type,
    application_id,
    eligibility_id,
  });

  const [activeId, setActiveId] = useState(null);
  const [empHistories, setEmpHistories] = useState<any>(null);
  const [policeDocs, setPoliceDocs] = useState<any>(null);
  const [fundPlan, setFundPlan] = useState<any>([]);
  const [examDocs, setExamDocs] = useState<any>([]);
  const [educationGaps, setEducationGaps] = useState<any>([]);
  const [workGaps, setWorkGaps] = useState<any>([]);
  const [visaDeclines, setVisaDeclines] = useState<any>([]);
  const [visaApprovals, setVisaApprovals] = useState<any>([]);
  const [workInfoDocs, setWorkInfoDocs] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [educationDocs, setEducationDocs] = useState<any>([]);
  const [graduationDocs, setGraduationDocs] = useState<any>([]);
  const [additionalDocs, setAdditionalDocs] = useState<any>(null);
  const [notFound, setNotFound] = useState<any>(false);

  const fetchAllDocs = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get(`/fetch_all_user_docs/${studentId}`);
      console.log(result?.data?.data);

      if (result?.data?.status) {
        setAdditionalDocs(result?.data?.data?.additional_docs);
        setEmpHistories(result?.data?.data?.userEmploymentHistories);
        setVisaDeclines(result?.data?.data?.previousVisaDeclines);
        setVisaApprovals(result?.data?.data?.previousVisaApprovals);
        setExamDocs(result?.data?.data?.exams);
        setEducationGaps(result?.data?.educationGaps);
        setWorkGaps(result?.data?.workGaps);
        setPoliceDocs(result?.data?.data?.basic_info_details?.police_clearance_docs);
        setWorkInfoDocs(result?.data?.data?.userWorkInfos);
        setFundPlan(result?.data?.data?.fundPlan);
        setEducationDocs(result?.data?.data?.educationDetails);
        setGraduationDocs(result?.data?.data?.graduationDetails);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setNotFound(true);
      showErrorAlert("Something went wrong");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDocs();
  }, []);

  const toggleItem = (id: any) => {
    setActiveId(activeId === id ? null : id);
    console.log("");
  };

  if (isLoading) {
    return <SkeletonComponent />;
  }

  return (
    <>
      <Row>
        <CheckHeadings title={"Document Quantity Check"} />
      </Row>
      {/* <Row className="mt-2">
        <Card>
          <Card.Body>
            <Row>
              <DocumentsOverview studentId={studentId} check={true} />
            </Row>
          </Card.Body>
        </Card>
      </Row> */}

      {/* Additional Docs */}
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body className="p-0">
            <div
              className="w-100 cursor-pointer"
              onClick={() => toggleItem(additionalDocs ? 0 : -1)}
              style={{ cursor: "pointer" }}
            >
              <Row className="w-100">
                <Col md={12}>
                  <div className="d-flex justify-content-between align-items-center p-2">
                    <div className="d-flex gap-1 align-items-center">
                      <PersonIcon />
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>Additional Documents</span>
                    </div>
                    <div className="me-3">
                      {!additionalDocs ? <NoDoc /> : activeId === 0 ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {activeId === 0 && (
              <div
                className="p-3 border-top"
                style={{
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <AdditionalDocs AdditionalDocsData={additionalDocs || {}} />
              </div>
            )}
          </Card.Body>
        </Card>
      </Row>

      {/* Visa Approvals */}
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body className="p-0">
            <div className="w-100 cursor-pointer" onClick={() => toggleItem(visaApprovals?.length == 0 ? -1 : 1)} style={{ cursor: "pointer" }}>
              <Row className="w-100">
                <Col md={12}>
                  <div className="d-flex justify-content-between align-items-center p-2">
                    <div className="d-flex gap-1 align-items-center">
                      <PersonIcon />
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>Previous Visa Approval Letters</span>
                    </div>
                    <div className="me-3">
                      {visaApprovals?.length == 0 ? (
                        <NoDoc />
                      ) : activeId === 1 ? (
                        <i className="fas fa-chevron-up"></i>
                      ) : (
                        <i className="fas fa-chevron-down"></i>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {activeId === 1 && (
              <div
                className="p-3 border-top"
                style={{
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <VisaDeclineDetails VisaData={visaApprovals || []} />
              </div>
            )}
          </Card.Body>
        </Card>
      </Row>

      {/* Visa Declines */}
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body className="p-0">
            <div className="w-100 cursor-pointer" onClick={() => toggleItem(visaDeclines?.length == 0 ? -1 : 2)} style={{ cursor: "pointer" }}>
              <Row className="w-100">
                <Col md={12}>
                  <div className="d-flex justify-content-between align-items-center p-2">
                    <div className="d-flex gap-1 align-items-center">
                      <PersonIcon />
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>Previous Visa Decline Letters</span>
                    </div>
                    <div className="me-3">
                      {visaDeclines?.length == 0 ? (
                        <NoDoc />
                      ) : activeId === 2 ? (
                        <i className="fas fa-chevron-up"></i>
                      ) : (
                        <i className="fas fa-chevron-down"></i>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {activeId === 2 && (
              <div
                className="p-3 border-top"
                style={{
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <VisaDeclineDetails VisaData={visaDeclines || []} />
              </div>
            )}
          </Card.Body>
        </Card>
      </Row>

      {/* Fund Infos */}
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body className="p-0">
            <div className="w-100 cursor-pointer" onClick={() => toggleItem(fundPlan?.length == 0 ? -1 : 3)} style={{ cursor: "pointer" }}>
              <Row className="w-100">
                <Col md={12}>
                  <div className="d-flex justify-content-between align-items-center p-2">
                    <div className="d-flex gap-1 align-items-center">
                      <PersonIcon />
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>Fund Plans</span>
                    </div>
                    <div className="me-3">
                      {fundPlan?.length == 0 ? (
                        <NoDoc />
                      ) : activeId === 3 ? (
                        <i className="fas fa-chevron-up"></i>
                      ) : (
                        <i className="fas fa-chevron-down"></i>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {activeId === 3 && (
              <div
                className="p-3 border-top"
                style={{
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <FundDetails Fundinfo={fundPlan || []} />
              </div>
            )}
          </Card.Body>
        </Card>
      </Row>

      {/* Education Details */}
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body className="p-0">
            <div
              className="w-100 cursor-pointer"
              onClick={() => toggleItem(educationDocs?.length == 0 && graduationDocs?.length == 0 ? -1 : 4)}
              style={{ cursor: "pointer" }}
            >
              <Row className="w-100">
                <Col md={12}>
                  <div className="d-flex justify-content-between align-items-center p-2">
                    <div className="d-flex gap-1 align-items-center">
                      <PersonIcon />
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>Education Details</span>
                    </div>
                    <div className="me-3">
                      {educationDocs?.length == 0 && graduationDocs?.length == 0 ? (
                        <NoDoc />
                      ) : activeId === 4 ? (
                        <i className="fas fa-chevron-up"></i>
                      ) : (
                        <i className="fas fa-chevron-down"></i>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {activeId === 4 && (
              <div
                className="p-3 border-top"
                style={{
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <EducationDetails EducationInfo={educationDocs || []} />
                <GraduationDetails GraduationInfo={graduationDocs || []} />
              </div>
            )}
          </Card.Body>
        </Card>
      </Row>

      {/* Work Infos */}
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body className="p-0">
            <div
              className="w-100 cursor-pointer"
              onClick={() => toggleItem(workInfoDocs?.length == 0 ? -1 : 5)}
              style={{ cursor: "pointer" }}
            >
              <Row className="w-100">
                <Col md={12}>
                  <div className="d-flex justify-content-between align-items-center p-2">
                    <div className="d-flex gap-1 align-items-center">
                      <PersonIcon />
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>Work Experiences</span>
                    </div>
                    <div className="me-3">
                      {workInfoDocs?.length == 0 ? (
                        <NoDoc />
                      ) : activeId === 5 ? (
                        <i className="fas fa-chevron-up"></i>
                      ) : (
                        <i className="fas fa-chevron-down"></i>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {activeId === 5 && (
              <div
                className="p-3 border-top"
                style={{
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <WorkInfos WorkInfo={workInfoDocs || []} />
              </div>
            )}
          </Card.Body>
        </Card>
      </Row>

      {/* Gap Documents */}
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body className="p-0">
            <div
              className="w-100 cursor-pointer"
              onClick={() => toggleItem(educationGaps?.length == 0 && workGaps?.length == 0 ? -1 : 9)}
              style={{ cursor: "pointer" }}
            >
              <Row className="w-100">
                <Col md={12}>
                  <div className="d-flex justify-content-between align-items-center p-2">
                    <div className="d-flex gap-1 align-items-center">
                      <PersonIcon />
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>Gap Documents</span>
                    </div>
                    <div className="me-3">
                      {educationGaps?.length == 0 && workGaps?.length == 0 ? (
                        <NoDoc />
                      ) : activeId === 9 ? (
                        <i className="fas fa-chevron-up"></i>
                      ) : (
                        <i className="fas fa-chevron-down"></i>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {activeId === 9 && (
              <div
                className="p-3 border-top"
                style={{
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <GapDocs  GapInfo={educationGaps || []} type="Education"/>
                <GapDocs  GapInfo={workGaps || []} type="Work"/>
              </div>
            )}
          </Card.Body>
        </Card>
      </Row>

      {/* Exam Data */}
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body className="p-0">
            <div className="w-100 cursor-pointer" onClick={() => toggleItem(examDocs?.length == 0 ? -1 : 6)} style={{ cursor: "pointer" }}>
              <Row className="w-100">
                <Col md={12}>
                  <div className="d-flex justify-content-between align-items-center p-2">
                    <div className="d-flex gap-1 align-items-center">
                      <PersonIcon />
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>Exam Details</span>
                    </div>
                    <div className="me-3">
                      {examDocs?.length == 0 ? (
                        <NoDoc />
                      ) : activeId === 6 ? (
                        <i className="fas fa-chevron-up"></i>
                      ) : (
                        <i className="fas fa-chevron-down"></i>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {activeId === 6 && (
              <div
                className="p-3 border-top"
                style={{
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <ExamData Exams={examDocs || []} />
              </div>
            )}
          </Card.Body>
        </Card>
      </Row>

      {/* Police Docs */}
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body className="p-0">
            <div className="w-100 cursor-pointer" onClick={() => toggleItem(policeDocs ? 7 : -1)} style={{ cursor: "pointer" }}>
              <Row className="w-100">
                <Col md={12}>
                  <div className="d-flex justify-content-between align-items-center p-2">
                    <div className="d-flex gap-1 align-items-center">
                      <PersonIcon />
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>Police Clearence Documents</span>
                    </div>
                    <div className="me-3">
                      {policeDocs ? activeId === 7 ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i> : <NoDoc />}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {activeId === 7 && (
              <div
                className="p-3 border-top"
                style={{
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <PoliceDocs PoliceDocs={policeDocs || []} />
              </div>
            )}
          </Card.Body>
        </Card>
      </Row>

      {/* Emp Histories */}
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body className="p-0">
            <div className="w-100 cursor-pointer" onClick={() => toggleItem(empHistories ? 8 : -1)} style={{ cursor: "pointer" }}>
              <Row className="w-100">
                <Col md={12}>
                  <div className="d-flex justify-content-between align-items-center p-2">
                    <div className="d-flex gap-1 align-items-center">
                      <PersonIcon />
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>Employement Histories</span>
                    </div>
                    <div className="me-3">
                      {empHistories ? activeId === 8 ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i> : <NoDoc />}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {activeId === 8 && (
              <div
                className="p-3 border-top"
                style={{
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <EmpHistories userEmploymentHistories={empHistories || {}} />
              </div>
            )}
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

export default DocumentQuantityCheck;
