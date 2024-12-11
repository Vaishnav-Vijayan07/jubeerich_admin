import React, { useRef, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import FeatherIcons from "feather-icons-react";
import moment from "moment";
import UserImage from "../../../../assets/images/users/user_circle_icon.png";
import { withSwal } from "react-sweetalert2";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";
import { refreshData } from "../../../../redux/countryReducer";
import DatePicker from "react-datepicker";
import { FormInput } from "../../../../components";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import dayjs from "dayjs";

const initialFormState = {
  id: "",
  remark: "",
};

const FollowupModal = withSwal((props: any) => {
  const {
    swal,
    showModal,
    toggleRemarkModal,
    studentId,
    followup,
    statusId,
    remarkData,
    callGetRemark,
    setViewOnly,
    viewOnly = false,
    setIsCancelModal,
    submitFollowupDate,
  } = props;
  const [remarkId, setRemarkId] = useState<any>("");

  const dispatch = useDispatch();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [remarkForm, setRemarkForm] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState<any>(false);
  const headerHeight = 100;
  // const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());

  const calenderStyle = {
    "& .MuiPickersDay-root": {
      margin: "4px", // Add spacing between days
      padding: "12px", // Increase the padding inside each day
      fontSize: "1rem", // Adjust font size if needed
    },
    "& .MuiDateCalendar-root": {
      width: "350px", // Increase the overall width of the calendar
    },
    "& .MuiPickersCalendarHeader-root": {
      fontSize: "1.25rem", // Adjust header font size
    },
    "& .MuiDayCalendar-header": {
      display: "flex", // Ensure it's a flex container
      justifyContent: "space-between", // Spread the items evenly
      gap: "8px", // Add horizontal spacing between labels
      padding: "0 16px",
    },
  };

  const scrollToStartOfTarget = () => {
    if (targetRef.current) {
      const topOffset = targetRef.current.getBoundingClientRect().top - headerHeight;
      window.scrollTo({
        top: window.scrollY + topOffset,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let payload;
    let result;

    if (!isUpdate) {
      payload = {
        followup_date: followup ? followup : new Date(),
        remark: remarkForm?.remark,
        status_id: statusId,
        lead_id: studentId,
      };
    } else {
      payload = {
        followup_date: followup ? followup : new Date(),
        remark: remarkForm?.remark,
        status_id: statusId,
        remark_id: remarkId,
      };
    }
    try {
      if (remarkForm?.remark == "") {
        toggleRemarkModal();
        callGetRemark();
        dispatch(refreshData());
        setRemarkForm(initialFormState);
        submitFollowupDate(selectedDate);
        setSelectedDate(dayjs());
        setIsLoading(false);
        return;
      }

      if (!isUpdate) {
        result = await axios.post("/followup_remark", payload);
      } else {
        result = await axios.put(`/followup_remark/${studentId}`, payload);
      }
      if (result) {
        toggleRemarkModal();
        callGetRemark();
        dispatch(refreshData());
        setRemarkForm(initialFormState);
        submitFollowupDate(selectedDate);
        setSelectedDate(dayjs());
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      showErrorAlert("Something went wrong");
      setIsLoading(false);
    }
  };

  const handleRemarkUpdate = (remark: any) => {
    setRemarkId(remark?.id);
    setRemarkForm((prev: any) => ({
      ...prev,
      remark: remark?.remark,
    }));
  };

  const handleRemarkInputChange = (e: any) => {
    const { name, value } = e.target;

    setRemarkForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleCancelUpdate = () => {
  //     setRemarkForm(initialFormState);
  //     setIsUpdate(false);
  //     // setIsCancelModal();
  // };

  const handleDateChange = (date: any) => {
    // setSelectedDate(date);
    setSelectedDate(date ? date.toDate() : null);
  };

  return (
    <>
      <Modal dialogClassName="modal-dialog-centered" show={showModal} onHide={toggleRemarkModal}>
        <Modal.Header style={{ paddingTop: "0px" }}>
          <h3>{viewOnly ? `Remarks` : `Followup Date`}</h3>
        </Modal.Header>

        <Modal.Body style={{ paddingTop: "0px" }}>
          <div className={`w-100 shadow-sm ${viewOnly ? "" : "border rounded mb-2"}`}>
            {/* <DatePicker
                            minDate={new Date()}
                            selected={selectedDate}
                            onChange={handleDateChange}
                            inline
                            placeholderText="Choose a date"
                            className="w-100"
                        /> */}
            {!viewOnly && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  defaultValue={dayjs()}
                  slotProps={{
                    actionBar: {
                      actions: [],
                    },
                    toolbar: {
                      hidden: true,
                    },
                  }}
                  sx={{ ...calenderStyle }}
                  onChange={handleDateChange}
                  value={selectedDate ? dayjs(selectedDate) : null}
                  disablePast
                />
              </LocalizationProvider>
            )}
          </div>
          <div className="row">
            {viewOnly && (
              <div style={{ minHeight: "90px", maxHeight: "250px", overflowY: "auto", scrollbarWidth: "none" }} className="col">
                {remarkData?.[0]?.remark ? (
                  remarkData?.map((remark: any, idx: any) => (
                    <React.Fragment key={idx}>
                      <div key={idx} className="d-flex align-items-start p-1 pt-1">
                        <img
                          src={UserImage}
                          className="me-2 rounded-circle"
                          height="36"
                          width="36"
                          alt={remark.created_by_name}
                        />
                        <div className="w-100">
                          {!viewOnly && (
                            <FeatherIcons
                              icon="edit"
                              size="13"
                              className="cursor-pointer float-end ms-2 mt-0"
                              onClick={() => {
                                handleRemarkUpdate(remark);
                                scrollToStartOfTarget();
                                setIsUpdate(true);
                              }}
                            />
                          )}
                          <h5 className="mt-0 mb-0 font-size-14">
                            <span className="float-end text-muted font-12">
                              {moment(remark?.followup_date).format("DD-MM-YYYY")}
                            </span>
                            <span className="text-muted fs-12">{remark?.created_by_name}</span>
                            <div className="mt-3">{remark?.remark}</div>
                          </h5>
                        </div>
                      </div>
                      <hr style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }} />
                    </React.Fragment>
                  ))
                ) : (
                  <div className="d-flex justify-content-center align-items-center">
                    <h3 className="text-muted">No Remarks Available</h3>
                  </div>
                )}
              </div>
            )}
          </div>

          {!viewOnly && (
            <Row>
              <Col>
                <div>
                  <FormInput
                    label="Remarks"
                    name="remark"
                    type="textarea"
                    rows="2"
                    value={remarkForm.remark}
                    onChange={handleRemarkInputChange}
                  />
                </div>
              </Col>
            </Row>
          )}

          <Modal.Footer style={{ paddingBottom: "0px" }}>
            <Button className="bg-danger" onClick={() => [toggleRemarkModal(), setTimeout(() => setViewOnly(false), 500)]}>
              Close
            </Button>
            {!viewOnly && (
              <Button className="bg-primary" onClick={() => [handleSubmit(), setViewOnly(false)]}>
                Save
              </Button>
            )}
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  );
});

export default FollowupModal;
