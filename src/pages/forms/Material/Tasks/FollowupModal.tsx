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
import classNames from "classnames";
import { setColorOpacityRGB } from "../../../../utils/setColorOpacity";
import DatePicker from "react-datepicker";
import { FormInput } from "../../../../components";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
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
        submitFollowupDate
    } = props;
    const [remarkId, setRemarkId] = useState<any>("");

    const dispatch = useDispatch();
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const targetRef = useRef<HTMLDivElement | null>(null);
    const [remarkForm, setRemarkForm] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState<any>(false);
    const headerHeight = 100;
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const scrollToStartOfTarget = () => {
        if (targetRef.current) {
            const topOffset = targetRef.current.getBoundingClientRect().top - headerHeight;
            window.scrollTo({
                top: window.scrollY + topOffset,
                behavior: "smooth",
            });
        }
    };

    // const handleSubmit = async (e: any) => {
    const handleSubmit = async () => {
        setIsLoading(true);
        // e.preventDefault();
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
                submitFollowupDate(selectedDate);
                toggleRemarkModal();
                callGetRemark();
                dispatch(refreshData());
                setRemarkForm(initialFormState);
                submitFollowupDate(selectedDate)
                setIsLoading(false);
                return
            }

            if (!isUpdate) {
                result = await axios.post("/followup_remark", payload);
            } else {
                result = await axios.put(`/followup_remark/${studentId}`, payload);
            }
            if (result) {
                showSuccessAlert("Remark Saved Successfully");
                toggleRemarkModal();
                callGetRemark();
                dispatch(refreshData());
                setRemarkForm(initialFormState);
                submitFollowupDate(selectedDate)
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

    const handleCancelUpdate = () => {
        setRemarkForm(initialFormState);
        setIsUpdate(false);
        // setIsCancelModal();
    };

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
    };

    return (
        <>
            <Modal dialogClassName="modal-dialog-centered" show={showModal} onHide={toggleRemarkModal}>
                <Modal.Header style={{ paddingTop: '0px' }}>
                    <h3>Followup Date</h3>
                </Modal.Header>

                <Modal.Body style={{ paddingTop: '0px'}}>
                    {/* <div className=" w-100 lead-date-picker/"> */}
                    <div className="w-100 border rounded shadow-sm mb-2">
                        {/* <DatePicker
                            minDate={new Date()}
                            selected={selectedDate}
                            onChange={handleDateChange}
                            inline
                            placeholderText="Choose a date"
                            className="w-100"
                        /> */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <StaticDatePicker defaultValue={dayjs()}
                                slotProps={{
                                    actionBar: {
                                        actions: []
                                    },
                                    toolbar: {
                                        hidden: true
                                    }
                                }}
                            />

                        </LocalizationProvider>
                    </div>
                    <div className="row">
                        {/* <div style={{ minHeight: "90px", maxHeight: "250px", overflowY: "auto", scrollbarWidth: "none" }} className="col"> */}
                        {/* {remarkData?.[0]?.remark ? (
                                remarkData?.map((remark: any, idx: any) => (
                                    <React.Fragment key={idx}>
                                        <div key={idx} className="d-flex align-items-start p-1 pt-4">
                                            <img src={UserImage} className="me-2 rounded-circle" height="36" width="36" alt={remark.created_by_name} />
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
                            )} */}
                        {/* </div> */}
                    </div>

                    {!viewOnly && (
                        <Row>
                            <Col>
                                {/* <div className="border rounded" ref={targetRef}> */}
                                <div>
                                    {/* <form onSubmit={handleSubmit}>
                                        <textarea
                                            rows={3}
                                            name="remark"
                                            className="form-control border-0 resize-none"
                                            placeholder="Add your remarks..."
                                            value={remarkForm.remark}
                                            onChange={handleRemarkInputChange}
                                            required
                                        ></textarea>
                                        <div className="p-2 bg-light d-flex justify-content-end align-items-center">
                                            <div>
                                                {isUpdate && (
                                                    <button type="reset" className="btn btn-sm btn-danger me-2" onClick={() => handleCancelUpdate()}>
                                                        <i className="mdi mdi-cancel me-1"></i>Cancel
                                                    </button>
                                                )}
                                                <button type="submit" className="btn btn-sm btn-success" disabled={isLoading}>
                                                    <i className="mdi mdi-send me-1"></i>
                                                    {isUpdate ? "Update" : "Submit"}
                                                </button>
                                            </div>
                                        </div>
                                    </form> */}
                                    <FormInput label="Remarks" name="remark" type="textarea" rows="2" className="bg-muted" value={remarkForm.remark} onChange={handleRemarkInputChange} />
                                </div>
                            </Col>
                        </Row>
                    )}

                    <Modal.Footer style={{ paddingBottom: '0px' }}>
                        <Button className="bg-danger" onClick={() => [toggleRemarkModal(), handleCancelUpdate(), setViewOnly(false)]}>
                            Close
                        </Button>
                        <Button className="bg-primary" onClick={(e) => [handleSubmit(), handleCancelUpdate(), setViewOnly(false)]}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
        </>
    );
});

export default FollowupModal;
