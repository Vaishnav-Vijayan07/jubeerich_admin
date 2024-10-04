import React, { Suspense, useEffect, useState } from "react";
import { Card, Nav, Row, Spinner, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import useDropdownData from "../../hooks/useDropdownDatas";
import { RootState } from "../../redux/store";
import { useParams } from "react-router-dom";
import BasicInfo from "../lead_management/Tasks/List/BasicInfo";
import AcademicInfo from "../lead_management/Tasks/List/AcademicInfo";
import WorkExpereince from "../lead_management/Tasks/List/WorkExpereince";
import VisaProcess from "../lead_management/Tasks/List/VisaProcess";
import StudyPreference from "../lead_management/Tasks/List/StudyPreference";
import FundPlan from "../lead_management/Tasks/List/FundPlan";
import EducationDetails from "../lead_management/Tasks/List/EducationDetails";
import Comments from "../lead_management/Tasks/List/Comments";
import Attachments from "../lead_management/Tasks/List/Attachments";

interface Props {}

const LeadDetails = (props: Props) => {
  const { id: studentId } = useParams();


  const [activeTab, setActiveTab] = useState<any>("basic_info");

  const dispatch = useDispatch();
  const { user, refresh } = useSelector((state: RootState) => ({
    user: state.Auth.user,
    refresh: state.refreshReducer.refreshing,
  }));

  const { dropdownData, loading } = useDropdownData(
    "marital,officeType,franchise,region"
  );
  const { officeTypes, regions, franchises, maritalStatus } = dropdownData;

  if (loading) {
    return (
      <Spinner
        animation="border"
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  }

  return (
    <>
      <Card>
        <Card.Body>
          <Row>
            <Tab.Container
              activeKey={activeTab}
              onSelect={(tab) => setActiveTab(tab)}
            >
              <Card>
                <Card.Body>
                  <Nav
                    variant="pills"
                    as="ul"
                    className="nav nav-pills nav-fill navtab-bg row-gap-1"
                  >
                    <Nav.Item as="li" className="nav-item nav_item_1">
                      <Nav.Link
                        eventKey="basic_info"
                        className="nav-link cursor-pointer"
                      >
                        Basic Info
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_2">
                      <Nav.Link
                        eventKey="academic_info"
                        className="nav-link cursor-pointer"
                      >
                        Academic Info
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_2">
                      <Nav.Link
                        eventKey="work_info"
                        className="nav-link cursor-pointer"
                      >
                        Work Experience
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_3">
                      <Nav.Link
                        eventKey="study_preference"
                        className="nav-link cursor-pointer"
                      >
                        Study Preference
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_3">
                      <Nav.Link
                        eventKey="education_details"
                        className="nav-link cursor-pointer"
                      >
                        Education Details
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_3">
                      <Nav.Link
                        eventKey="fund_plan"
                        className="nav-link cursor-pointer"
                      >
                        Fund Plan
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_4">
                      <Nav.Link
                        eventKey="comments"
                        className="nav-link cursor-pointer"
                      >
                        Comments
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_5">
                      <Nav.Link
                        eventKey="attachments"
                        className="nav-link cursor-pointer"
                      >
                        Attachments
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_6">
                      <Nav.Link
                        eventKey="visa_process"
                        className="nav-link cursor-pointer"
                      >
                        Visa Process
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

                    {activeTab === "attachments" && studentId && (
                      <Suspense fallback={null}>
                        <Attachments studentId={studentId} />
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
