import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Modal,
  Nav,
  Row,
  Spinner,
  Tab,
} from "react-bootstrap";
import classNames from "classnames";
import { icons } from "../../../../assets/images/icons";
import { getCountry } from "../../../../redux/country/actions";
import { getOfficeTypeData } from "../../../../redux/OfficeType/actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { getMaritalStatus } from "../../../../redux/marital_status/actions";
import axios from "axios";
import {
  follow_up_id,
  future_leads_id,
  not_responding_id,
  showErrorAlert,
  showSuccessAlert,
} from "../../../../constants";
import DatePicker from "react-datepicker";
import moment from "moment";
import Comments from "./Comments";
import Attachments from "./Attachments";
import WorkExpereince from "./WorkExpereince";

const BasicInfo = lazy(() => import('./BasicInfo'));
const AcademicInfo = lazy(() => import('./AcademicInfo'));
const StudyPreference = lazy(() => import('./StudyPreference'));


const StudentDetails = ({ studentId, taskId, getTaskList }: any) => {
  const [basicData, setBasicData] = useState<any>([]);
  const [status, setStatus] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [standard, setStandard] = useState(false);
  const [statusId, setStatusId] = useState(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
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

  const toggleStandard = () => {
    setStandard(!standard)
    setSelectedDate(null)
    setStatusId(null)
  }

  const handleDateChange = (date: any) => {
    // const formattedDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(date);
  };
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
    if (
      status_id == follow_up_id ||
      status_id == future_leads_id ||
      status_id == not_responding_id
    ) {
      toggleStandard();
    } else {
      const { data } = await axios.put("/lead_status", {
        lead_id: studentId,
        status_id,
      });

      showSuccessAlert(data.message);
      setRefresh(!refresh);
    }
  };

  const handleFollowUpDate = () => {
    axios
      .put("/lead_status", {
        lead_id: studentId,
        status_id: statusId,
        followup_date: selectedDate,
      })
      .then((res) => {
        showSuccessAlert(res.data.message);
        setRefresh(!refresh);
        toggleStandard();
      })
      .catch((err) => {
        console.log("err", err);
      });
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

  const officeData = useMemo(() => {
    if (!OfficeTypes) return [];
    return OfficeTypes.map((item: any) => ({
      value: item.id.toString(),
      label: item.office_type_name,
    }));
  }, [OfficeTypes]);

  const maritialData = useMemo(() => {
    if (!MaritalStatus) return [];
    return MaritalStatus.map((item: any) => ({
      value: item.id.toString(),
      label: item.marital_status_name,
    }));
  }, [MaritalStatus]);

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
        getTaskList();
        showSuccessAlert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log("basicData ==>", basicData);

  const addNewCountry = (newCountryId: number) => {
    axios
      .put("assign_new_country", {
        id: taskId,
        newCountryId: newCountryId,
      })
      .then((res) => {
        showSuccessAlert(res.data.message);
        getTaskDetails();
      })
      .catch((err) => {
        console.log("error:", err);
        showErrorAlert(err);
      });
  };

  if (loading) {
    return (
      <Spinner
        animation="border"
        style={{ position: "absolute", top: "50%", left: "65%" }}
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
              <div className="d-flex">
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
                    width="17"
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
            <div className="grid-container mb-2">
              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Status</p>
                <div
                  className="d-flex align-items-start"
                  style={{ gap: "5px" }}
                >
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
                          onClick={() => [
                            handleStatusChange(item?.id),
                            setStatusId(item?.id),
                          ]}
                        >
                          {item.status_name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">
                  Lead Received Date
                </p>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <img
                    src={icons.calender_time}
                    alt="phone"
                    className="me-1"
                    width="16"
                  />
                  <input
                    type="tel"
                    value={
                      basicData?.lead_received_date &&
                      moment(basicData?.lead_received_date).format("DD/MM/YYYY")
                    }
                    style={{
                      border: "none",
                      outline: "none",
                      width: "100%",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Followup Date</p>
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  <img
                    src={icons.calender_time}
                    alt="phone"
                    className="me-1"
                    width="16"
                  />
                  <input
                    type="tel"
                    value={
                      basicData?.followup_date &&
                      moment(basicData?.followup_date).format("DD/MM/YYYY")
                    }
                    style={{
                      border: "none",
                      outline: "none",
                      width: "100%",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>
            </div>
          </Row>

          {user.role == 7 && (
            <Row>
              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Add New Country</p>
                <div
                  className="d-flex align-items-start"
                  style={{ gap: "5px" }}
                >
                  <Dropdown>
                    <Dropdown.Toggle className="cursor-pointer" variant="light">
                      Choose Country
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {(countryData || [])?.map((item: any) => (
                        // Check if the item is visible before rendering the Dropdown.Item

                        <Dropdown.Item
                          eventKey={item.value}
                          key={item.value}
                          onClick={() => addNewCountry(item.value)}
                        >
                          {item.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </Row>
          )}
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
                    <Nav.Item as="li" className="nav-item nav_item_1">
                      <Nav.Link
                        // href="#"
                        eventKey="basic_info"
                        className="nav-link cursor-pointer"
                      >
                        Basic info
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_2">
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

                    <Nav.Item as="li" className="nav-item nav_item_2">
                      <div>
                        <Nav.Link
                          // href="#"
                          eventKey="work_info"
                          className="nav-link cursor-pointer"
                        >
                          Work Experience
                        </Nav.Link>
                      </div>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_3">
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

                    <Nav.Item as="li" className="nav-item nav_item_4">
                      <Nav.Link
                        // href="#"
                        eventKey="comments"
                        className="nav-link cursor-pointer"
                      >
                        Comments
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_5">
                      <Nav.Link
                        // href="#"
                        eventKey="attachments"
                        className="nav-link cursor-pointer"
                      >
                        Attachments
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    <Tab.Pane eventKey="basic_info">
                      {studentId && (
                        <Suspense fallback={<></>}>
                          <BasicInfo
                            studentId={studentId}
                            Countries={Countries}
                            OfficeTypes={officeData}
                            country={countryData || []}
                            MaritalStatus={maritialData}
                            basicData={basicData}
                            getBasicInfoApi={getBasicInfo}
                            role={user.role}
                          />
                        </Suspense>
                      )}
                    </Tab.Pane>

                    <Tab.Pane eventKey="academic_info">
                      <Suspense fallback={<></>}>
                        {studentId && <AcademicInfo studentId={studentId} />}
                      </Suspense>
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="work_info">
                      <Suspense fallback={<></>}>
                        {studentId && <WorkExpereince studentId={studentId} />}
                      </Suspense>
                    </Tab.Pane>

                    <Tab.Pane eventKey="study_preference">
                      {studentId && (
                        <Suspense fallback={<></>}>

                          <StudyPreference
                            studentId={studentId}
                            Countries={Countries}
                          />
                        </Suspense>
                      )}
                    </Tab.Pane>

                    <Tab.Pane eventKey="comments">
                      <Suspense fallback={<></>}>
                        {studentId && <Comments studentId={studentId} />}
                      </Suspense>
                    </Tab.Pane>

                    <Tab.Pane eventKey="attachments">
                      <Suspense fallback={<></>}>
                        {studentId && <Attachments studentId={studentId} />}
                      </Suspense>
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Row>
        </Card.Body>
      </Card>

      <Modal
        show={standard}
        centered
        onHide={toggleStandard}
        dialogClassName="modal-calendar-width"
      >
        <Modal.Header onHide={toggleStandard} closeButton>
          <h4 className="modal-title">Choose Followup Date</h4>
        </Modal.Header>

        <Modal.Body>
          <div className="w-100 lead-date-picker">
            <DatePicker
              minDate={new Date()}
              selected={selectedDate}
              onChange={handleDateChange}
              inline
              placeholderText="Choose a date"
              className="w-100"
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="mt-0">
          <div className="text-end">
            <Button variant="danger" className="me-1" onClick={toggleStandard}>
              Cancel
            </Button>
            <Button
              variant="success"
              type="submit"
              onClick={handleFollowUpDate}
            >
              Submit
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StudentDetails;
