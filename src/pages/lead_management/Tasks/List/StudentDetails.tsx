import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Nav,
  Row,
  Spinner,
  Tab,
} from "react-bootstrap";
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
import { showSuccessAlert } from "../../../../constants";

const StudentDetails = ({ studentId, taskId }: any) => {
  console.log("taskId", taskId);

  const [basicData, setBasicData] = useState<any>([]);
  const [status, setStatus] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const [taskDetails, setTaskDetails] = useState<any>({});

  const dispatch = useDispatch();
  const { Countries, OfficeTypes, MaritalStatus, user } = useSelector(
    (state: RootState) => ({
      Countries: state?.Country?.countries,
      OfficeTypes: state?.OfficeTypes?.officeTypes,
      MaritalStatus: state?.MaritalStatus?.maritalStatus,
      user: state.Auth.user,
    })
  );

  const getRoleBasedStatus = async (user_role: string) => {
    const { data } = await axios.get(`/lead_status`, {
      params: { user_role },
    });
    setStatus(data.data);
  };

  const getBasicInfo = () => {
    setLoading(true);
    axios
      .get(`getStudentBasicInfo/${studentId}`)
      .then((res) => {
        setBasicData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleStatusChange = async (status_id: number) => {
    const { data } = await axios.put("/lead_status", {
      lead_id: studentId,
      status_id,
    });

    showSuccessAlert(data.message);
    setRefresh(!refresh);
  };

  const getTaskDetails = () => {
    axios
      .get(`tasks/${taskId}`)
      .then((res) => {
        console.log("taskId =>", res.data);
        setTaskDetails(res.data.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    getTaskDetails();
  }, [taskId]);

  useEffect(() => {
    if (user) {
      getRoleBasedStatus(user.role);
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      getBasicInfo();
    }
  }, [studentId, refresh]);

  useEffect(() => {
    dispatch(getCountry());
    dispatch(getOfficeTypeData());
    dispatch(getMaritalStatus());
  }, []);

  const countryData = useMemo(() => {
    if (!Countries) return [];
    return Countries.map((item: any) => ({
      value: item.id.toString(),
      label: item.country_name,
    }));
  }, [Countries]);

  // Finish Task
  const handleFinishTask = () => {
    axios
      .put("finish_task", {
        isCompleted: true,
        id: taskId,
      })
      .then((res) => {
        console.log("res ==>", res.data);

        getTaskDetails();
        showSuccessAlert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log("basicData ==>", basicData);

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
      <Card className="ribbon-box" style={{ fontFamily: "Nunito" }}>
        <Card.Body>
          <Row>
            <Col>
              <div className="ribbon ribbon-primary float-start px-4 max-content mt-1 mb-0">
                <span>{"JBR" + taskDetails?.id}</span>
              </div>
              <Col className="d-flex gap-2 float-end">
                {/* <i className="mdi mdi-close font-18 cursor-pointer" onClick={handleClose}></i> */}

                <Button
                  className="d-flex align-items-center btn-light"
                  disabled={taskDetails?.isCompleted ? true : false}
                  onClick={handleFinishTask}
                >
                  <div className="round-circle" />
                  {taskDetails?.isCompleted ? "Finished" : "Finish"}

                  {console.log("taskDetails?.isCompleted ======>", taskDetails)}
                </Button>
              </Col>

              <div className="clearfix"></div>

              <hr className="my-3" />
            </Col>
          </Row>

          <Row
            className="dotted-border-bottom"
            style={{ paddingBottom: "20px" }}
          >
            <Col>
              <h3>{taskDetails?.title}</h3>
              {/* <p className="mt-1" style={{ color: "#4D4D4D" }}>
                MBBS Admission for Russia, 2024 August intake, Mr. Austin
                Stephen from Aluva,Kochi
              </p> */}

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
                {basicData?.country_names?.map((country: any) => (
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
                    {country}
                  </small>
                ))}

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
          <Row className="mb-3">
            <Row className="mt-3">
              <h4 className="text-secondary mt-1">Task Details</h4>
            </Row>
            <div className="grid-container mb-2">
              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Name</p>
                <div
                  className="d-flex align-items-start"
                  style={{ gap: "5px" }}
                >
                  <img
                    src={icons.user}
                    alt="date"
                    className="me-1"
                    height="16"
                  />
                  <h5 className="m-0 font-size-14">{basicData?.full_name}</h5>
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Phone Number</p>
                <div
                  className="d-flex align-items-center outline-none"
                  style={{ gap: "5px" }}
                >
                  <img
                    src={icons.apple}
                    alt="phone"
                    className="me-1"
                    width="16"
                  />
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
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <img
                    src={icons.email}
                    alt="email"
                    className="me-1"
                    width="16"
                  />
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
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <img
                    src={icons.cloud}
                    alt="source icon"
                    className="me-1"
                    width="16"
                  />
                  <h5 className="m-0 font-size-14">{basicData?.source_name}</h5>
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Channel</p>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <img
                    src={icons.information}
                    alt="cahnnel icon"
                    className="me-1"
                    width="16"
                  />
                  <h5 className="m-0 font-size-14">
                    {basicData?.channel_name}
                  </h5>
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">City</p>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <img
                    src={icons.business}
                    alt="comapny icon"
                    className="me-1"
                    width="16"
                  />
                  <h5 className="m-0 font-size-14">{basicData?.city}</h5>
                </div>
              </div>
            </div>
          </Row>
          <Row>
            <Col md={3}>
              <Dropdown>
                <Dropdown.Toggle
                  className="cursor-pointer"
                  variant="light"
                  // disabled={!StudentData?.status}
                >
                  {basicData?.status?.status_name
                    ? basicData?.status?.status_name
                    : "Change status"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {(status || [])?.map((item: any) => (
                    // Check if the item is visible before rendering the Dropdown.Item

                    <Dropdown.Item
                      eventKey={item.id}
                      key={item.id}
                      onClick={() => handleStatusChange(item?.id)}
                    >
                      {item.status_name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            {/* <Col md={3}>
                <Form.Group className="mb-3" controlId="preferred_country">
                  <p className="mt-2 mb-1 text-muted fw-light">Status</p>
                  <Form.Select
                    className="mb-3 border border-primary"
                    name="preferred_country"
                    aria-label="Default select example"
                    value={basicData?.status_id ? basicData?.status_id : ""}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Open this select menu
                    </option>
                    {(status || []).map((statusItem: any) => (
                      <option key={statusItem.id} value={statusItem.id}>
                        {statusItem.status_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col> */}
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Row>
            <Tab.Container defaultActiveKey="basic_info">
              <Card>
                <Card.Body>
                  <Nav
                    variant="pills"
                    as="ul"
                    className="nav nav-pills nav-fill navtab-bg row-gap-1"
                  >
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
                      {studentId && (
                        <BasicInfo
                          studentId={studentId}
                          Countries={Countries}
                          OfficeTypes={OfficeTypes}
                          country={countryData || []}
                          MaritalStatus={MaritalStatus}
                          basicData={basicData}
                          getBasicInfoApi={getBasicInfo}
                        />
                      )}
                    </Tab.Pane>

                    <Tab.Pane eventKey="academic_info">
                      {studentId && <AcademicInfo studentId={studentId} />}
                    </Tab.Pane>

                    <Tab.Pane eventKey="study_preference">
                      {studentId && (
                        <StudyPreference
                          studentId={studentId}
                          Countries={Countries}
                        />
                      )}
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
