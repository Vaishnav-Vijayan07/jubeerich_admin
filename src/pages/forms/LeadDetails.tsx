import React, { Suspense, useEffect, useState } from "react";
import { Card, Nav, Row, Spinner, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import useDropdownData from "../../hooks/useDropdownDatas";
import { RootState } from "../../redux/store";
import { useParams } from "react-router-dom";
import BasicInfo from "../lead_management/Tasks/List/BasicInfo";
import AcademicInfo from "../lead_management/Tasks/List/AcademicInfo";
import VisaProcess from "../lead_management/Tasks/List/VisaProcess";
import StudyPreference from "../lead_management/Tasks/List/StudyPreference/StudyPreference";
import FundPlan from "../lead_management/Tasks/List/FundPlan/FundPlan";
import EducationDetails from "../lead_management/Tasks/List/EducationDetails";
import Comments from "../lead_management/Tasks/List/Comments";
import Attachments from "../lead_management/Tasks/List/Attachments";
import AdditionalDocuments from "../lead_management/Tasks/List/AdditionalDocuments";
import PassportDetails from "../lead_management/Tasks/List/PassportDetails";
import FamilyDetails from "../lead_management/Tasks/List/FamilyDetails/FamilyDetails";
import WorkExpereince from "../lead_management/Tasks/List/WorkExpereince/WorkExpereince";
import axios from "axios";
import { icons } from "../../assets/images/icons";
import moment from "moment";
import DocumentsOverview from "../lead_management/Tasks/List/DocumentsOverview/DocumentsOverview";

interface Props {}

const LeadDetails = (props: Props) => {
  const { id: studentId } = useParams();
  const [basicInfo, setBasicInfo] = useState<any>({});
  const [activeTab, setActiveTab] = useState<any>("basic_info");

  const dispatch = useDispatch();
  const { user, refresh } = useSelector((state: RootState) => ({
    user: state.Auth.user,
    refresh: state.refreshReducer.refreshing,
  }));

  const { dropdownData, loading } = useDropdownData("marital,officeType,franchise,region");
  const { officeTypes, regions, franchises, maritalStatus } = dropdownData;

  const getBasicInfo = async () => {
    try {
      const { data } = await axios.get(`/getStudentBasicInfo/${studentId}`);
      setBasicInfo(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getBasicInfo();
  }, []);

  if (loading) {
    return <Spinner animation="border" style={{ position: "absolute", top: "50%", left: "50%" }} />;
  }

  return (
    <>
      <Card className="mt-3">
        <Card.Body>
          <Row className="mt-1">
            <h4 className="text-secondary mt-0">Basic Details</h4>
          </Row>
          <div className="grid-container mb-2">
            <div className="">
              <p className="mt-2 mb-1 text-muted fw-light">Name</p>
              <div className="d-flex align-items-start" style={{ gap: "5px" }}>
                <img src={icons.user} alt="date" className="me-1" height="16" />
                <h5 className="m-0 font-size-14">{basicInfo?.full_name}</h5>
              </div>
            </div>

            <div className="">
              <p className="mt-2 mb-1 text-muted fw-light">Phone Number</p>
              <div className="d-flex align-items-center outline-none" style={{ gap: "5px" }}>
                <img src={icons.apple} alt="phone" className="me-1" width="16" />
                {/* <h5 className="m-0 font-size-14">{taskObject.phone}</h5> */}
                <input
                  type="tel"
                  value={basicInfo?.phone}
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                />
              </div>
              {/* <Form.Text className="text-danger">{phoneNumberError}</Form.Text> */}
            </div>

            <div className="">
              <p className="mt-2 mb-1 text-muted fw-light">Email</p>
              <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                <img src={icons.email} alt="email" className="me-1" width="17" />
                {/* <h5 className="m-0 font-size-14">{taskObject.email}</h5> */}
                <input
                  type="text"
                  value={basicInfo?.email}
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: "16px",
                    fontWeight: 600,
                    width: "100%",
                  }}
                />
              </div>
            </div>

            {/* </div> */}

            {/* <div className="mt-2 grid-container"> */}
            <br className="grid-br" />
            <div className="">
              <p className="mt-2 mb-1 text-muted fw-light">Source</p>
              <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                <img src={icons.cloud} alt="source icon" className="me-1" width="16" />
                <h5 className="m-0 font-size-14">{basicInfo?.source_name}</h5>
              </div>
            </div>

            <div className="">
              <p className="mt-2 mb-1 text-muted fw-light">Channel</p>
              <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                <img src={icons.information} alt="cahnnel icon" className="me-1" width="16" />
                <h5 className="m-0 font-size-14">{basicInfo?.channel_name}</h5>
              </div>
            </div>

            <div className="">
              <p className="mt-2 mb-1 text-muted fw-light">City</p>
              <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                <img src={icons.business} alt="comapny icon" className="me-1" width="16" />
                <h5 className="m-0 font-size-14">{basicInfo?.city}</h5>
              </div>
            </div>

            {/* <div className="">
              <p className="mt-2 mb-1 text-muted fw-light">Lead Received Date</p>
              <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                <img src={icons.calender_time} alt="phone" className="me-1" width="16" />
                <input
                  type="tel"
                  value={basicInfo?.lead_received_date && moment(basicInfo?.lead_received_date).format("DD/MM/YYYY")}
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                />
              </div>
            </div> */}
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Row>
            <Tab.Container activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
              <Card>
                <Card.Body>
                  <Nav variant="pills" as="ul" className="nav nav-pills nav-fill navtab-bg row-gap-1">
                    <Nav.Item as="li" className="nav-item nav_item_1">
                      <Nav.Link eventKey="basic_info" className="nav-link cursor-pointer">
                        Basic Info
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_2">
                      <Nav.Link eventKey="academic_info" className="nav-link cursor-pointer">
                        Exam Details
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_2">
                      <Nav.Link eventKey="work_info" className="nav-link cursor-pointer">
                        Work Experience
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_3">
                      <Nav.Link eventKey="study_preference" className="nav-link cursor-pointer">
                        Study Preference
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_3">
                      <Nav.Link eventKey="education_details" className="nav-link cursor-pointer">
                        Education Details
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_3">
                      <Nav.Link eventKey="fund_plan" className="nav-link cursor-pointer">
                        Fund Plan
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_4">
                      <Nav.Link eventKey="comments" className="nav-link cursor-pointer">
                        Comments
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_4">
                      <Nav.Link eventKey="passport_details" className="nav-link cursor-pointer">
                        Passport Details
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_4">
                      <Nav.Link eventKey="family_details" className="nav-link cursor-pointer">
                        Family Details
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_6">
                      <Nav.Link eventKey="visa_process" className="nav-link cursor-pointer">
                        Visa Process
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_5">
                      <Nav.Link eventKey="additional_documents" className="nav-link cursor-pointer">
                        Additional Documents
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_5">
                      <Nav.Link eventKey="documents_overview" className="nav-link cursor-pointer">
                        Documents Overview
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    {/* Conditionally render the content based on the active tab */}
                    {activeTab === "basic_info" && studentId && (
                      <Suspense fallback={null}>
                        <BasicInfo
                          studentId={studentId}
                          role={user.role}
                          officeTypes={officeTypes}
                          regions={regions}
                          franchises={franchises}
                          maritalStatus={maritalStatus}
                        />
                      </Suspense>
                    )}

                    {activeTab === "academic_info" && studentId && (
                      <Suspense fallback={null}>
                        <AcademicInfo studentId={studentId} />
                      </Suspense>
                    )}

                    {activeTab === "work_info" && studentId && (
                      <Suspense fallback={null}>
                        <WorkExpereince studentId={studentId} />
                      </Suspense>
                    )}

                    {activeTab === "visa_process" && studentId && (
                      <Suspense fallback={null}>
                        <VisaProcess studentId={studentId} />
                      </Suspense>
                    )}

                    {activeTab === "study_preference" && studentId && (
                      <Suspense fallback={null}>
                        <StudyPreference studentId={studentId} />
                      </Suspense>
                    )}

                    {activeTab === "fund_plan" && studentId && (
                      <Suspense fallback={null}>
                        <FundPlan student_id={studentId} />
                      </Suspense>
                    )}

                    {activeTab === "education_details" && studentId && (
                      <Suspense fallback={null}>
                        <EducationDetails studentId={studentId} />
                      </Suspense>
                    )}

                    {activeTab === "comments" && studentId && (
                      <Suspense fallback={null}>
                        <Comments studentId={studentId} />
                      </Suspense>
                    )}

                    {activeTab === "additional_documents" && studentId && (
                      <Suspense fallback={null}>
                        <AdditionalDocuments studentId={studentId} />
                      </Suspense>
                    )}

                    {activeTab === "passport_details" && studentId && (
                      <Suspense fallback={null}>
                        <PassportDetails studentId={studentId} />
                      </Suspense>
                    )}

                    {activeTab === "family_details" && studentId && (
                      <Suspense fallback={null}>
                        <FamilyDetails studentId={studentId} />
                      </Suspense>
                    )}

                    {activeTab === "documents_overview" && studentId && (
                      <Suspense fallback={null}>
                        <DocumentsOverview studentId={studentId} />
                      </Suspense>
                    )}
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default LeadDetails;
