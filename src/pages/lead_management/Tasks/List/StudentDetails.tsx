import React, { useEffect, useState } from "react";
import { Card, Col, Nav, Row, Tab } from "react-bootstrap";
import BasicInfo from "./BasicInfo";
import AcademicInfo from "./AcademicInfo";
import StudyPreference from "./StudyPreference";
import classNames from "classnames";
import { icons } from "../../../../assets/images/icons";
import { getCountry } from "../../../../redux/country/actions";
import { getOfficeTypeData } from "../../../../redux/OfficeType/actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { getMaritalStatus } from "../../../../redux/marital_status/actions";
import axios from "axios";

const StudentDetails = ({ studentId, taskDetails }: any) => {
  console.log("selectedTask====>", taskDetails);

  const [basicData, setBasicData] = useState<any>([]);
  const dispatch = useDispatch();
  const { Countries, OfficeTypes, MaritalStatus } = useSelector((state: RootState) => ({
    Countries: state?.Country?.countries,
    OfficeTypes: state?.OfficeTypes?.officeTypes,
    MaritalStatus: state?.MaritalStatus?.maritalStatus,
  }));

  const getBasicInfo = () => {
    axios
      .get(`getStudentBasicInfo/${studentId}`)
      .then((res) => {
        setBasicData(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    if (studentId) {
      getBasicInfo();
    }
  }, [studentId]);

  useEffect(() => {
    dispatch(getCountry());
    dispatch(getOfficeTypeData());
    dispatch(getMaritalStatus());
  }, []);

  return (
    <>
      <Card className="ribbon-box" style={{ fontFamily: "Nunito" }}>
        <Card.Body>
          <Row>
            <Col>
              <div className="ribbon ribbon-primary float-start px-4 max-content mt-1 mb-0">
                <span>{"JBR" + taskDetails?.id}</span>
              </div>
              <Col className="d-flex gap-2 float-end"></Col>

              <div className="clearfix"></div>

              <hr className="my-3" />
            </Col>
          </Row>

          <Row className="dotted-border-bottom" style={{ paddingBottom: "20px" }}>
            <Col>
              <h3>{taskDetails?.title}</h3>
              <p className="mt-1" style={{ color: "#4D4D4D" }}>
                MBBS Admission for Russia, 2024 August intake, Mr. Austin Stephen from Aluva,Kochi
              </p>

              <div className="d-flex">
                {/* <small
                  style={{
                    backgroundColor: "#a4f5c3",
                    color: "#14522b",
                    border: `1px solid #14522b`,
                    borderRadius: "5px",
                    padding: "4px 10px",
                  }}
                  className={classNames("rounded-pill fs-6 me-1")}
                >
                  High Priority
                </small> */}
                <small
                  style={{
                    backgroundColor: "#9dd3f5",
                    color: "#122d3d",
                    border: `1px solid #122d3d`,
                    borderRadius: "5px",
                    padding: "4px 10px",
                  }}
                  className={classNames("rounded-pill fs-6 me-1")}
                >
                  {basicData?.country_name}
                </small>

                {/* <small
                  style={{
                    backgroundColor: "#a4f5c3",
                    color: "#14522b",
                    border: `1px solid #14522b`,
                    borderRadius: "5px",
                    padding: "4px 10px",
                  }}
                  className={classNames("rounded-pill fs-6 me-1")}
                >
                  MBBS
                </small> */}
              </div>
            </Col>
          </Row>
          <Row>
            <Row className="mt-3">
              <h4 className="text-secondary mt-1">Task Details</h4>
            </Row>
            <div className="grid-container mb-2">
              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Name</p>
                <div className="d-flex align-items-start" style={{ gap: "5px" }}>
                  <img src={icons.user} alt="date" className="me-1" height="16" />
                  <h5 className="m-0 font-size-14">{basicData?.full_name}</h5>
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Phone Number</p>
                <div className="d-flex align-items-center outline-none" style={{ gap: "5px" }}>
                  <img src={icons.apple} alt="phone" className="me-1" width="16" />
                  {/* <h5 className="m-0 font-size-14">{taskObject.phone}</h5> */}
                  <input
                    type="tel"
                    value={basicData?.phone}
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
                  <img src={icons.email} alt="email" className="me-1" width="16" />
                  {/* <h5 className="m-0 font-size-14">{taskObject.email}</h5> */}
                  <input
                    type="text"
                    value={basicData?.email}
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
                  <h5 className="m-0 font-size-14">{basicData?.source_name}</h5>
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Channel</p>
                <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                  <img src={icons.information} alt="cahnnel icon" className="me-1" width="16" />
                  <h5 className="m-0 font-size-14">{basicData?.channel_name}</h5>
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">City</p>
                <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                  <img src={icons.business} alt="comapny icon" className="me-1" width="16" />
                  <h5 className="m-0 font-size-14">{basicData?.city}</h5>
                </div>
              </div>
            </div>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Row>
            <Tab.Container defaultActiveKey="basic_info">
              <Card>
                <Card.Body>
                  <Nav variant="pills" as="ul" className="nav nav-pills nav-fill navtab-bg row-gap-1">
                    <Nav.Item as="li" className="nav-item">
                      <Nav.Link
                        // href="#"
                        eventKey="basic_info"
                        className="nav-link cursor-pointer"
                      >
                        Basic info
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item">
                      <div>
                        <Nav.Link
                          // href="#"
                          eventKey="academic_info"
                          className="nav-link cursor-pointer"
                        >
                          Academic info
                        </Nav.Link>
                      </div>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item">
                      <div>
                        <Nav.Link
                          // href="#"
                          eventKey="study_preference"
                          className="nav-link cursor-pointer"
                        >
                          Study preference info
                        </Nav.Link>
                      </div>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    <Tab.Pane eventKey="basic_info">
                      {/* <About projectDetails={projectDetails} /> */}
                      {studentId && (
                        <BasicInfo
                          studentId={studentId}
                          Countries={Countries}
                          OfficeTypes={OfficeTypes}
                          MaritalStatus={MaritalStatus}
                          basicData={basicData}
                          getBasicInfoApi={getBasicInfo}
                        />
                      )}
                    </Tab.Pane>

                    <Tab.Pane eventKey="academic_info">{studentId && <AcademicInfo studentId={studentId} />}</Tab.Pane>

                    <Tab.Pane eventKey="study_preference">
                      {studentId && <StudyPreference studentId={studentId} Countries={Countries} />}
                    </Tab.Pane>
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

export default StudentDetails;
