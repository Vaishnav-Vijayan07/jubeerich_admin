import axios from "axios";
import classNames from "classnames";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Dropdown, Form, Row } from "react-bootstrap";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";

const TaskDetails = ({
  taskObject,
  pickedDate,
  id,
  enquiryText,
  setEnquiryText,
  handleBlur,
  handleKeyPress,
  icons,
  setColorOpacity,
  handleFinish,
  lead_id,
  getTaskListData,
  handleUpdateLeadTitle,
}: any) => {
  const today = new Date();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isToday, setIstoday] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [emailAddress, setEmailAddress] = useState(taskObject.email);

  useEffect(() => {
    // Check te task is completed or not based on the date
    const completed =
      moment(today).format("DD-MM-YYYY") === moment(taskObject.completed_at).format("DD-MM-YYYY") &&
      moment(taskObject.completed_at).format("DD-MM-YYYY") === moment(pickedDate).format("DD-MM-YYYY");

    setIsCompleted(completed);
  }, [pickedDate, taskObject]);

  useEffect(() => {
    if (moment(today).format("DD-MM-YYYY") === moment(pickedDate).format("DD-MM-YYYY")) {
      setIstoday(true);
    } else {
      setIstoday(false);
    }
  }, [pickedDate]);

  useEffect(() => {
    if (taskObject) {
      setPhoneNumber(taskObject.phone);
      setEmailAddress(taskObject.email);
    }
    setPhoneNumberError("");
  }, [taskObject]);

  //This will trigger when the enter key is pressed
  const handleKeyPressPhone = (event: any) => {
    if (event.key === "Enter") {
      handleBlurPhone();
    }
  };

  //This function will trigger on losing the focus
  const handleBlurPhone = async () => {
    try {
      if (taskObject.phone !== phoneNumber) {
        const response = await axios.get(`/leads/check-mobilenumber/${phoneNumber}`);
        if (response?.data.status) {
          setPhoneNumberError(null);
          // if (taskObject.phone !== phoneNumber) {
          axios
            .put(`/leads/${lead_id}`, { phone: phoneNumber })
            .then((res: any) => {
              getTaskListData();
              showSuccessAlert(res.data.message);
              handleUpdateLeadTitle(id, "phone", phoneNumber);
            })
            .catch((err: any) => {
              console.error(err);
              showErrorAlert(err.message);
            });
          // }
        } else {
          setPhoneNumberError(response.data.message);
        }
      }
    } catch (err) {
      return false;
    }
  };

  //This will trigger when the enter key is pressed
  const handleKeyPressEmail = (event: any) => {
    if (event.key === "Enter") {
      handleBlurEmail();
    }
  };

  //This function will trigger on losing the focus
  const handleBlurEmail = () => {
    if (taskObject.email !== emailAddress) {
      axios
        .put(`/leads/${lead_id}`, { email: emailAddress })
        .then((res: any) => {
          getTaskListData();
          showSuccessAlert(res.data.message);
        })
        .catch((err: any) => {
          console.error(err);
          showErrorAlert(err.message);
        });
    }
  };

  return (
    <Card className="ribbon-box" style={{ fontFamily: "Nunito" }}>
      <Card.Body>
        <Row>
          <Col>
            <div className="ribbon ribbon-primary float-start px-4 max-content mt-1 mb-0">
              <span>{"INTR" + id}</span>
            </div>
            <Col className="d-flex gap-2 float-end">
              {/* <i className="mdi mdi-close font-18 cursor-pointer" onClick={handleClose}></i> */}
              {isToday && (
                <Button className="d-flex align-items-center btn-light" disabled={taskObject.is_completed && isCompleted ? true : false} onClick={handleFinish}>
                  <div className="round-circle" />
                  {taskObject.is_completed && isCompleted ? "Finished" : "Finish"}
                </Button>
              )}

              <Dropdown align="end">
                <Dropdown.Toggle as="a" className="my-dropdown-toggle cursor-pointer text-muted">
                  <i className="mdi mdi-dots-horizontal font-18"></i>
                </Dropdown.Toggle>
              </Dropdown>
            </Col>

            <div className="clearfix"></div>

            <hr className="my-3" />
          </Col>
        </Row>

        <Row className="dotted-border-bottom" style={{ paddingBottom: "20px" }}>
          <Col>
            <input
              type="text"
              value={enquiryText}
              onChange={(e) => setEnquiryText(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "22px",
                width: "100%",
                fontWeight: "600",
              }}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
            />
            <p className="mt-1" style={{ color: "#4D4D4D" }}>
              {taskObject.title}
            </p>
            <small
              style={{
                backgroundColor: setColorOpacity(taskObject.color),
                color: taskObject.color,
                border: `1px solid ${taskObject.color}`,
                borderRadius: "5px",
                padding: "4px 10px",
              }}
              className={classNames("rounded-pill fs-6 me-1")}
            >
              {taskObject.status_name}
            </small>
          </Col>
        </Row>

        <Row className="mt-3">
          <h4 className="text-secondary mt-1">Task Details</h4>
        </Row>
        <div className="grid-container mb-2">
          <div className="">
            <p className="mt-2 mb-1 text-muted fw-light">Phone Number</p>
            <div className="d-flex align-items-center outline-none" style={{ gap: "5px" }}>
              <img src={icons.apple} alt="phone" className="me-1" width="16" />
              {/* <h5 className="m-0 font-size-14">{taskObject.phone}</h5> */}
              <input
                type="tel"
                value={phoneNumber}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
                onChange={(e) => {
                  const inputValue = e.target.value.replace(/[^0-9-]/g, "");
                  setPhoneNumber(inputValue);
                }}
                onBlur={handleBlurPhone}
                onKeyPress={handleKeyPressPhone}
              />
            </div>
            {phoneNumberError && <Form.Text className="text-danger">{phoneNumberError}</Form.Text>}
          </div>

          <div className="">
            <p className="mt-2 mb-1 text-muted fw-light">Email</p>
            <div className="d-flex align-items-center" style={{ gap: "5px" }}>
              <img src={icons.email} alt="email" className="me-1" width="16" />
              {/* <h5 className="m-0 font-size-14">{taskObject.email}</h5> */}
              <input
                type="text"
                value={emailAddress}
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: "16px",
                  fontWeight: 600,
                  width: "100%",
                }}
                onChange={(e) => setEmailAddress(e.target.value)}
                onBlur={handleBlurEmail}
                onKeyPress={handleKeyPressEmail}
              />
            </div>
          </div>

          <div className="">
            <p className="mt-2 mb-1 text-muted fw-light">Start Date</p>
            <div className="d-flex align-items-start" style={{ gap: "5px" }}>
              <img src={icons.Layer} alt="date" className="me-1" height="16" />
              <h5 className="m-0 font-size-14">{taskObject.created_at}</h5>
            </div>
          </div>
          {/* </div> */}

          {/* <div className="mt-2 grid-container"> */}
          <br className="grid-br" />
          <div className="">
            <p className="mt-2 mb-1 text-muted fw-light">Source</p>
            <div className="d-flex align-items-center" style={{ gap: "5px" }}>
              <img src={icons.cloud} alt="source icon" className="me-1" width="16" />
              <h5 className="m-0 font-size-14">{taskObject.source_name}</h5>
            </div>
          </div>

          <div className="">
            <p className="mt-2 mb-1 text-muted fw-light">Channel</p>
            <div className="d-flex align-items-center" style={{ gap: "5px" }}>
              <img src={icons.information} alt="cahnnel icon" className="me-1" width="16" />
              <h5 className="m-0 font-size-14">{taskObject.channel_name}</h5>
            </div>
          </div>

          <div className="">
            <p className="mt-2 mb-1 text-muted fw-light">Company</p>
            <div className="d-flex align-items-center" style={{ gap: "5px" }}>
              <img src={icons.business} alt="comapny icon" className="me-1" width="16" />
              <h5 className="m-0 font-size-14">{taskObject.company_name}</h5>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskDetails;
