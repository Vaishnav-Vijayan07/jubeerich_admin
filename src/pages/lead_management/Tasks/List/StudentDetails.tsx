import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Dropdown, Form, Modal, Nav, Placeholder, Row, Spinner, Tab } from "react-bootstrap";
import classNames from "classnames";
import { icons } from "../../../../assets/images/icons";
import { getCountry } from "../../../../redux/country/actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import axios from "axios";
import {
  branch_counsellor_id,
  counsellor_id,
  country_manager_id,
  cre_id,
  follow_up_id,
  franchise_counsellor_id,
  future_leads_id,
  handleDateFormat,
  not_responding_id,
  showErrorAlert,
  showSuccessAlert,
} from "../../../../constants";
import DatePicker from "react-datepicker";
import moment from "moment";
import { refreshData } from "../../../../redux/countryReducer";
import useDropdownData from "../../../../hooks/useDropdownDatas";
import swal from "sweetalert2";
import RemarkModal from "./RemarkModal";
import { Link } from "react-router-dom";
import SkeletonComponent from "./StudyPreference/LoadingSkeleton";
import CardLoadingSkeleton from "../../../../components/SkeletonLoading/CardLoadingSkeleton1";

const Comments = lazy(() => import("./Comments"));
const History = lazy(() => import("./History"));

const StudentDetails = ({ studentId, taskId, getTaskList, initialLoading }: any) => {
  const { userRole } = useSelector((state: RootState) => ({
    userRole: state?.Auth.user.role,
  }));

  const [basicData, setBasicData] = useState<any>([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [standard, setStandard] = useState(false);
  const [statusId, setStatusId] = useState(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [taskDetails, setTaskDetails] = useState<any>({});
  const [ShowRemarkModal, setShowRemarkModal] = useState<boolean>(false);
  const [remarkData, setRemarkData] = useState<any>(null);
  const [viewOnly, setViewOnly] = useState<boolean>(false);
  const [isFollowupLoading, setIsFollowupLoading] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<any>("comments");

  const dispatch = useDispatch();
  const { Countries, user, refresh } = useSelector((state: RootState) => ({
    Countries: state?.Country?.countries,
    user: state.Auth.user,
    refresh: state.refreshReducer.refreshing,
  }));

  const { dropdownData } = useDropdownData("marital,officeType,franchise,region,flags");
  const { flags } = dropdownData;

  const toggleStandard = () => {
    setStandard(!standard);
    setSelectedDate(null);
    setStatusId(null);
  };

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
    axios
      .get(`getStudentBasicInfo/${studentId}`)
      .then((res) => {
        console.log(res.data);

        setBasicData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleStatusChange = async (status_id: number) => {
    if (status_id == follow_up_id || status_id == future_leads_id || status_id == not_responding_id) {
      toggleStandard();
    } else {
      const result = await swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save",
      });

      if (result.isConfirmed) {
        const { data } = await axios.put("/lead_status", {
          lead_id: studentId,
          status_id,
        });

        dispatch(refreshData());
        showSuccessAlert(data.message);
        setShowRemarkModal(true);
      }
    }
  };

  const handleFollowUpDate = () => {
    setIsFollowupLoading(true);
    axios
      .put("/lead_status", {
        lead_id: studentId,
        status_id: statusId,
        followup_date: selectedDate,
      })
      .then((res) => {
        toggleStandard();
        dispatch(refreshData());
        setLoading(false);
        showSuccessAlert(res.data.message);
        setIsFollowupLoading(false);
        setShowRemarkModal(true);
      })
      .catch((err) => {
        console.log("err", err);
        setIsFollowupLoading(false);
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
    getRemarks();
  }, [studentId, taskId]);

  const updateFlagStatus = async (flag_id: string) => {
    try {
      const result = await swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save",
      });

      if (result.isConfirmed) {
        const res = await axios.put(`/update_flag_status/${studentId}`, {
          flag_id: flag_id,
        });
        if (res) {
          showSuccessAlert("Flag Changed Successfully");
          getRemarks();
          dispatch(refreshData());
          getTaskList();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRemarks = async () => {
    try {
      const result = await axios.get(`/followup_remark/${studentId}`);
      console.log(result.data?.data);

      if (result) {
        setRemarkData(result.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const callGetRemark = () => {
    getRemarks();
    setSelectedDate(null);
    setStatusId(null);
  };

  useEffect(() => {
    dispatch(getCountry());
  }, []);

  const countryData = useMemo(() => {
    if (!Countries) return [];
    return Countries.map((item: any) => ({
      value: item.id.toString(),
      label: item.country_name,
    }));
  }, [Countries]);

  const handleFinishTask = async () => {
    try {
      // Await the user's confirmation
      const result = await swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      });

      // If the user confirms, proceed with the API call
      if (result.isConfirmed) {
        const res = await axios.put("finish_task", {
          isCompleted: true,
          id: taskId,
        });

        console.log("res ==>", res.data);

        // Fetch updated task details and list
        getTaskDetails();
        getTaskList();

        // Show success alert
        showSuccessAlert(res.data.message);
      }
    } catch (err) {
      console.log("Error during task completion:", err);
      // Optionally, you can handle the error more gracefully (e.g., showing an alert)
    }
  };

  const addNewCountry = async (newCountryId: number) => {
    try {
      const result = await swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save",
      });

      if (result.isConfirmed) {
        setLoading(true);
        const response = await axios.put("assign_new_country", {
          id: taskId,
          newCountryId: newCountryId,
        });

        showSuccessAlert(response?.data?.message); // Display success message
        getTaskDetails(); // Refresh task details
        getTaskList();
        dispatch(refreshData());
      }
    } catch (error: any) {
      console.error("Error:", error);

      // Display the error message from the backend
      if (error.response) {
        const errorMessage = error.response.data?.message || "An unexpected error occurred.";
        await swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        await swal.fire({
          title: "Error",
          text: "Network error or server is unreachable.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const isCancelModal = () => {
    dispatch(refreshData());
    getRemarks();
    setStandard(false);
    setViewOnly(false);
  };

  const handleProccedToKyc = async () => {
    try {
      if (basicData?.preferredCountries?.length == 0) {
        return showErrorAlert("Please choose a prefered country");
      }

      const result = await swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Proceed to KYC",
      });

      if (result.isConfirmed) {
        const res = await axios.post(`/proceed_kyc`, { student_id: studentId, task_id: taskId });
        if (res) {
          showSuccessAlert("Proceeded KYC Successfully");
          getTaskDetails();
          getTaskList();
        }
      }
    } catch (error) {
      console.log(error);
      showErrorAlert("Something went wrong");
    }
  };

  return (
    <>
      {loading ? (
        <CardLoadingSkeleton />
      ) : (
        <Card className="ribbon-box" style={{ fontFamily: "Nunito" }}>
          <Card.Body>
            <Row>
              <Col>
                <div className="ribbon ribbon-primary float-start px-4 max-content mt-1 mb-0">
                  <span>{"JBR" + (taskDetails?.id || "000")}</span>
                </div>

                {userRole == cre_id && (
                  <Col className="d-flex gap-2 float-end">
                    <Button
                      className="d-flex align-items-center btn-light"
                      disabled={taskDetails?.isCompleted ? true : false}
                      onClick={handleFinishTask}
                    >
                      <div className="round-circle" />
                      {taskDetails?.isCompleted ? "Task Completed" : "Mark As Completed"}
                    </Button>
                  </Col>
                )}

                {(userRole == counsellor_id || userRole == franchise_counsellor_id || userRole == branch_counsellor_id) && (
                  <Col className="d-flex gap-2 float-end">
                    <Button
                      disabled={taskDetails?.is_proceed_to_kyc}
                      className="d-flex align-items-center btn-light"
                      // disabled={taskDetails?.isCompleted ? true : false}
                      onClick={handleProccedToKyc}
                    >
                      <div className="round-circle" />
                      Proceed to KYC
                    </Button>
                  </Col>
                )}
                <div className="clearfix"></div>
                <hr className="my-3" />
              </Col>
            </Row>
            <Row className="dotted-border-bottom" style={{ paddingBottom: "20px" }}>
              <Col md={9}>
                <h3 className="m-0 mb-1">{taskDetails?.title}</h3>
                <p className="mb-2">{taskDetails?.description}</p>
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
              <Col md={3}>
                <div className="text-end text-nowrap">
                  <b>Lead Date: {handleDateFormat(basicData?.lead_received_date)}</b>
                </div>
              </Col>
            </Row>
            <Row className="mb-3">
              <Row className="mt-3">
                <Col>
                  <h4 className="text-secondary mt-1">Task Details</h4>
                </Col>
                <Col>
                  <Link to={`/leads/manage/${studentId}`} className="action-icon d-flex justify-content-end align-items-center">
                    <i className="mdi mdi-eye-outline me-1"></i> {/* View icon */}
                    View All Details
                  </Link>
                </Col>
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
                    <img src={icons.email} alt="email" className="me-1" width="17" />
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
            <Row>
              <div className="grid-container mb-2">
                <div className="">
                  <p className="mt-2 mb-1 text-muted fw-light">Lead Received Date</p>
                  <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                    <img src={icons.calender_time} alt="phone" className="me-1" width="16" />
                    <input
                      type="tel"
                      value={basicData?.lead_received_date && moment(basicData?.lead_received_date).format("DD/MM/YYYY")}
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
                  <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                    <img src={icons.calender_time} alt="phone" className="me-1" width="16" />
                    <input
                      type="tel"
                      value={basicData?.followup_date && moment(basicData?.followup_date).format("DD/MM/YYYY")}
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
            {taskDetails?.is_rejected && (
              <Row className="mt-3">
                <div className="">
                  <p className="mt-2 mb-1 text-danger fw-bold fs-4">Remarks</p>
                  <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                    <img src={icons.information} alt="comapny icon" className="me-1" width="16" />
                    <h5 className="m-0 font-size-14">{taskDetails?.kyc_remarks?.[0]?.remark}</h5>
                  </div>
                </div>
              </Row>
            )}
          </Card.Body>
        </Card>
      )}

      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h4 className="text-secondary m-0">Status</h4>
              <p className="mt-2 mb-2 text-muted fw-light">Change the lead status</p>
              <div className="d-flex justify-content-between align-items-center">
                <Dropdown>
                  <Dropdown.Toggle
                    className="cursor-pointer"
                    variant="light"
                    // disabled={!StudentData?.status}
                  >
                    {basicData?.status?.status_name ? basicData?.status?.status_name : "Change status"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {(status || [])?.map((item: any) => (
                      // Check if the item is visible before rendering the Dropdown.Item

                      <Dropdown.Item
                        eventKey={item.id}
                        key={item.id}
                        onClick={() => [handleStatusChange(item?.id), setStatusId(item?.id), setViewOnly(false)]}
                      >
                        {item.status_name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <span>
                  <i
                    className="mdi mdi-comment-eye-outline fs-2"
                    title="View Comments"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    onClick={() => [setShowRemarkModal(true), setViewOnly(true)]}
                  ></i>
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <span>
                  <h4 className="text-secondary m-0">Flag</h4>
                  <p className="mt-2 mb-2 text-muted fw-light">Change flag</p>
                </span>

                {basicData?.user_primary_flags?.flag_name && (
                  <small
                    style={{
                      backgroundColor: `${basicData?.user_primary_flags?.color}`,
                      color: "white",
                      border: `1px solid ${basicData?.user_primary_flags?.color}`,
                      borderRadius: "5px",
                      padding: "6px 18px",
                      height: "fit-content",
                    }}
                    className={classNames("rounded-pill me-1")}
                  >
                    {basicData?.user_primary_flags?.flag_name}
                  </small>
                )}
              </div>
              <Dropdown>
                <Dropdown.Toggle
                  className="cursor-pointer"
                  variant="light"
                  // disabled={!StudentData?.status}
                >
                  {basicData?.user_primary_flags?.flag_name ? basicData?.user_primary_flags?.flag_name : "Change Flag"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {(flags || [])?.map((item: any) => (
                    // Check if the item is visible before rendering the Dropdown.Item

                    <Dropdown.Item
                      eventKey={item.value}
                      key={item.value}
                      // onClick={() => [handleStatusChange(item?.value), setStatusId(item?.value)]}
                      onClick={() => [updateFlagStatus(item.value)]}
                    >
                      {item.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {user.role == 7 && (
        <Card>
          <Card.Body>
            <Row>
              <div className="">
                <h4 className="text-secondary">Country</h4>
                <p className="mt-2 mb-2 text-muted fw-light">Use this option to assign lead to another country counselor.</p>
                <div className="d-flex align-items-start" style={{ gap: "5px" }}>
                  <Dropdown>
                    <Dropdown.Toggle className="cursor-pointer" variant="light">
                      Choose Country
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {(countryData || [])?.map((item: any) => (
                        <Dropdown.Item eventKey={item.value} key={item.value} onClick={() => addNewCountry(item.value)}>
                          {item.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </Row>
          </Card.Body>
        </Card>
      )}
      <Card>
        <Card.Body>
          <Row>
            <Tab.Container
              activeKey={activeTab}
              onSelect={(tab) => {
                console.log("Selected Tab:", tab); // Log the selected tab
                setActiveTab(tab);
              }}
            >
              <Card>
                <Card.Body>
                  <Nav variant="pills" as="ul" className="nav nav-pills nav-fill navtab-bg row-gap-1">
                    <Nav.Item as="li" className="nav-item nav_item_4">
                      <Nav.Link eventKey="comments" className="nav-link cursor-pointer">
                        Comments
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item as="li" className="nav-item nav_item_3">
                      <Nav.Link eventKey="history" className="nav-link cursor-pointer">
                        History
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    {activeTab === "comments" && studentId && (
                      <>
                        {console.log(studentId)}
                        <Suspense fallback={null}>
                          <Comments studentId={studentId} />
                        </Suspense>
                      </>
                    )}

                    {activeTab === "history" && studentId && (
                      <>
                        {console.log(studentId)}
                        <Suspense fallback={null}>
                          <History studentId={studentId} />
                        </Suspense>
                      </>
                    )}
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Row>
        </Card.Body>
      </Card>

      <Modal show={standard} centered onHide={toggleStandard} dialogClassName="modal-calendar-width">
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
            <Button disabled={isFollowupLoading} variant="success" type="submit" onClick={handleFollowUpDate}>
              Submit
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <RemarkModal
        setIsCancelModal={isCancelModal}
        viewOnly={viewOnly}
        setViewOnly={setViewOnly}
        showModal={ShowRemarkModal}
        toggleRemarkModal={setShowRemarkModal}
        studentId={studentId}
        statusId={statusId}
        followup={selectedDate}
        remarkData={remarkData}
        callGetRemark={callGetRemark}
      />
    </>
  );
};

export default StudentDetails;
