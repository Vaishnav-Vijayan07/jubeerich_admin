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
import { Autocomplete, TextField } from "@mui/material";
import { inputStyle } from "react-select/src/components/Input";

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
    submitFollowupDate,
    formattedFlagData,
    basicData
  } = props;
  const [remarkId, setRemarkId] = useState<any>("");

  const dispatch = useDispatch();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [remarkForm, setRemarkForm] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState<any>(false);
  const headerHeight = 100;
  // const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const scrollToStartOfTarget = () => {
    if (targetRef.current) {
      const topOffset = targetRef.current.getBoundingClientRect().top - headerHeight;
      window.scrollTo({
        top: window.scrollY + topOffset,
        behavior: "smooth",
      });
    }
  };

  const inputStyle = {
    "& .MuiInputBase-root": {
      padding: "4px 12px",
    },
    "& .MuiInputBase-input": {
      height: "1.1rem",
      paddingTop: "6px",
      paddingBottom: "6px",
      lineHeight: "1.2rem",
    },
    "& .MuiInputLabel-root": {
      lineHeight: "normal",
    },
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
        setSelectedDate(new Date());
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
        setSelectedDate(new Date());
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

  const updateFlagStatus = async (flag_id: string) => {
    try {
      const res = await axios.put(`/update_flag_status/${studentId}`, {
        flag_id: flag_id,
      });
      if (res) {
        showSuccessAlert("Flag Changed Successfully");
        // getRemarks();
        dispatch(refreshData());
        // getTaskList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeFlag = async (flagId: any) => {
    try {
      const res = await axios.put(`/remove_flag_status/${studentId}`, { flag_id: flagId });
      if (res) {
        showSuccessAlert("Flag Updated Successfully");
        // getRemarks();
        dispatch(refreshData());
        // getTaskList();
      }
    } catch (error) {
      console.log(error);
      showErrorAlert(error);
    }
  };

  const handleDateChange = (date: any) => {
    // setSelectedDate(date);
    setSelectedDate(date);
  };

  return (
    <>
      <Modal dialogClassName="modal-dialog-centered" show={showModal} onHide={toggleRemarkModal}>
        <Modal.Body style={{ paddingTop: "0px" }}>
          <h3 className="mt-0 pb-1" style={{ fontFamily: "Nunito", fontSize: "20px", fontWeight: "500" }}>
            {viewOnly ? `Remarks` : `Followup Date`}
          </h3>
          <DatePicker
            minDate={new Date()}
            selected={selectedDate}
            onChange={handleDateChange}
            inline
            placeholderText="Choose a date"
            className="w-100 custom-date-picker"
          />

          <div className="mt-2 mb-2">
            <h4 className="m-0 label_heading">Flag</h4>
            <div className="d-flex justify-content-between align-items-center">
              <Autocomplete
                disablePortal
                disableClearable
                options={formattedFlagData || []}
                value={basicData?.user_primary_flags?.flag_name ? basicData?.user_primary_flags?.flag_name : "Add Flag"}
                sx={{ width: "100%", paddingTop: "1.2rem" }}
                renderInput={(params) => <TextField {...params} sx={{ ...inputStyle }} placeholder="Add Flag" />}
                onChange={(event, newValue) => {
                  if (newValue) {
                    updateFlagStatus(newValue.value);
                  }
                }}
              />
            </div>

            <div className="mt-1" style={{ display: "flex", flexWrap: "wrap", gap: "1px" }}>
              {basicData?.flags?.length > 0 &&
                basicData?.flags.map((data: any) => (
                  <div style={{ border: `1px solid ${data?.color}` }} className="rounded-2 me-2 mt-1">
                    <div className="font-11" style={{ padding: "2px 7px" }}>
                      {data?.flag_name}
                      <i
                        className="mdi mdi-close"
                        style={{ paddingLeft: "3px", cursor: "pointer" }}
                        onClick={() => removeFlag(data?.id)}
                      ></i>
                    </div>
                  </div>
                ))}
            </div>
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

          <Modal.Footer style={{ paddingBottom: "0px", paddingRight: "0" }}>
            <Button
              className="bg-danger"
              style={{ border: "none", margin: "0 10px", padding: "5px 15px" }}
              onClick={() => [toggleRemarkModal(), setTimeout(() => setViewOnly(false), 500)]}
            >
              Close
            </Button>
            {!viewOnly && (
              <Button
                style={{ border: "none", margin: "0", padding: "5px 15px" }}
                className="bg-primary"
                onClick={() => [handleSubmit(), setViewOnly(false)]}
              >
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
