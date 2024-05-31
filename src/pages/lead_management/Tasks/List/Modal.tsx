import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import { DateReverse, FindStatusColor, FindStatusName, handleDateFormat, showErrorAlert, showSuccessAlert } from "../../../../constants";
import axios from "axios";
import { getHistoryByLeadId } from "../../../../redux/actions";
import { useDispatch } from "react-redux";

const Modal1 = ({
  id,
  showModal,
  closeModal,
  leadId,
  next_status,
  Status,
  handleUpdateStatus,
  getTaskListData,
  statusId,
  handleStatusChange,
  lead_id,
  user_id,
  getTaskList,
}: any) => {
  const [selectedDate, setSelectedDate] = useState(DateReverse(handleDateFormat(new Date())));
  const dispatch = useDispatch();
  const date = new Date();

  const handleDateChange = (newDate: any) => {
    // This function is called when the user hat a new date
    const convertedDate = handleDateFormat(newDate);
    setSelectedDate(DateReverse(convertedDate));
  };

  const handleNextStatusChange = (next_status: any) => {
    if (!selectedDate) {
      showErrorAlert("Please select a date.");
      return;
    }
    axios
      .put(`/update_status/${lead_id}`, {
        user_id: user_id,
        status: statusId,
      })
      .then(async (res) => {
        const StatusName = FindStatusName(statusId, Status);
        axios
          .post(`leads_history`, { lead_id: lead_id, date: DateReverse(handleDateFormat(date)), status_id: statusId, status: StatusName })
          .then((res) => {
            dispatch(getHistoryByLeadId(lead_id));
          })
          .then(() => {
            axios
              .put(`/update_next_status/${leadId}`, {
                user_id: user_id,
                next_status: next_status ? next_status : null,
                followup_date: selectedDate,
              })
              .then(async (res) => {
                const StatusName = FindStatusName(next_status, Status);
                const StatusColor = FindStatusColor(next_status, Status);

                handleUpdateStatus(id, StatusName, StatusColor, next_status);

                getTaskListData();
                closeModal();

                axios
                  .post(`leads_history`, { lead_id: lead_id, date: DateReverse(handleDateFormat(date)), follow_up_date: selectedDate })
                  .then((res) => {
                    dispatch(getHistoryByLeadId(lead_id));
                  })
                  .catch((err) => console.error(err));

                showSuccessAlert(res.data.message);
              })
              .catch((err) => {
                console.log("err", err);
              });
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <Modal className="custom-modal" show={showModal} onHide={closeModal} centered>
      <Modal.Body>
        {/* <p className="text-muted fw-light">Choose a date</p> */}
        <div className="d-flex align-items-center justify-content-center">
          {/* <input type="date" value={DateReverse(date)} onChange={(e: any) => setSelectedDate(e.target.value)} name="" id="" className="custom-react-date-picker" /> */}
          <ReactDatePicker onChange={handleDateChange} inline dateFormat={"dd-MM-yyyy"} selected={new Date(selectedDate)} minDate={new Date()} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={closeModal}>
          Close
        </Button>
        <Button variant="success" onClick={() => handleNextStatusChange(next_status)}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Modal1;
