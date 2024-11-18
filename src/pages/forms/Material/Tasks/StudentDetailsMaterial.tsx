import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Dropdown, Modal, Row } from "react-bootstrap";
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
    customStyles,
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
import { Link, useNavigate } from "react-router-dom";
import { setColorOpacityRGB } from "../../../../utils/setColorOpacity";
import CardLoadingSkeleton from "../../../../components/SkeletonLoading/CardLoadingSkeleton1";
import { Autocomplete, Box, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import Tab from '@mui/material/Tab';
import DocumentsOverview from "../../../lead_management/Tasks/List/DocumentsOverview/DocumentsOverview";
import RemarkModal from "../../../lead_management/Tasks/List/RemarkModal";
import MatButton from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';

const Comments = lazy(() => import("../../../lead_management/Tasks/List/History"));
const History = lazy(() => import("../../../lead_management/Tasks/List/Comments"));

const StudentDetailsMaterial = ({ studentId, taskId, getTaskList, initialLoading }: any) => {
    const { userRole } = useSelector((state: RootState) => ({
        userRole: state?.Auth.user.role,
    }));

    const [basicData, setBasicData] = useState<any>([]);
    const [flagData, setFlagData] = useState<any>([])
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
    const [tabValue, setTabValue] = React.useState('comments');
    const navigate = useNavigate();

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    const tabsStyle = {
        '& .MuiTabs-indicator': {
            backgroundColor: '#26BCA2',
            height: '4px'
        },
    }

    const individualTabStyle = {
        '&.Mui-selected': {
            color: 'black',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700
        },
    }

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
        setSelectedDate(date);
    };
    const getRoleBasedStatus = async (user_role: string) => {
        const { data } = await axios.get(`/lead_status`, {
            params: { user_role },
        });
        setStatus(data.data);
    };

    
  const formattedStatus = useMemo(() => {
    if (!status) return [];
    return status?.map((item: any) => ({
      value: item.id.toString(),
      label: item.status_name,
    }));
  }, [status]);

    const getBasicInfo = () => {
        axios
            .get(`getStudentBasicInfo/${studentId}`)
            .then((res) => {
                console.log(res.data);

                setBasicData(res.data.data);
                setFlagData(res?.data?.data?.flags);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const formattedFlagData = useMemo(() => {
        if (!flags || !basicData?.flags) return [];

        const basicDataFlagIds = new Set(basicData?.flags?.map((data: any) => data?.id));

        return flags.filter((item: any) => !basicDataFlagIds.has(item.value));
    }, [flags, basicData?.flags]);

    const handleStatusChange = async (status_id: number) => {
        let country_id = taskDetails?.student_name?.preferredCountries?.[0]?.id;

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
                    country_id: country_id
                });

                dispatch(refreshData());
                showSuccessAlert(data.message);
                setShowRemarkModal(true);
                getTaskList()
            }
        }
    };

    const handleFollowUpDate = () => {
        let country_id = taskDetails?.student_name?.preferredCountries?.[0]?.id;

        setIsFollowupLoading(true);
        axios
            .put("/lead_status", {
                lead_id: studentId,
                status_id: statusId,
                followup_date: selectedDate,
                country_id: country_id
            })
            .then((res) => {
                toggleStandard();
                dispatch(refreshData());
                setLoading(false);
                showSuccessAlert(res.data.message);
                setIsFollowupLoading(false);
                setShowRemarkModal(true);
                getTaskList()
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
                    getTaskList()
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
            const result = await swal.fire({
                title: "Are you sure?",
                text: "This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
            });

            if (result.isConfirmed) {
                const res = await axios.put("finish_task", {
                    isCompleted: true,
                    id: taskId,
                });

                console.log("res ==>", res.data);

                getTaskDetails();
                getTaskList();

                // Show success alert
                showSuccessAlert(res.data.message);
            }
        } catch (err) {
            console.log("Error during task completion:", err);
        }
    };

    const handleCompleteTask = async () => {
        try {
            const result = await swal.fire({
                title: "Are you sure?",
                text: "This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
            });

            if (result.isConfirmed) {
                const res = await axios.put("complete_task", {
                    isCompleted: true,
                    id: taskId,
                });

                getTaskDetails();
                getTaskList();
                showSuccessAlert(res.data.message);
            }
        } catch (err) {
            console.log("Error during task completion:", err);
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
            showErrorAlert(error);
        }
    };

    const removeFlag = async (flagId: any) => {
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
                const res = await axios.put(`/remove_flag_status/${studentId}`, { flag_id: flagId });
                if (res) {
                    showSuccessAlert('Flag Updated Successfully');
                    getRemarks();
                    dispatch(refreshData());
                    getTaskList();
                }
            }
        } catch (error) {
            console.log(error);
            showErrorAlert(error)
        }

    }

    return (
        <>
            <Row>
                {loading ? (
                    <CardLoadingSkeleton />
                ) : (
                    <Card className="ribbon-box ms-1 pb-0" style={{ fontFamily: "Nunito" }}>
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

                                    <Row className="g-1 float-end">
                                        {(userRole == counsellor_id || userRole == franchise_counsellor_id || userRole == branch_counsellor_id) && (
                                            <Col className="d-flex gap-2">
                                                <Button
                                                    className="d-flex align-items-center btn-light"
                                                    disabled={taskDetails?.isCompleted ? true : false}
                                                    onClick={handleCompleteTask}
                                                >
                                                    <div className="round-circle" />
                                                    Complete Task
                                                </Button>
                                            </Col>
                                        )}

                                        {(userRole == counsellor_id || userRole == franchise_counsellor_id || userRole == branch_counsellor_id) && (
                                            <Col className="d-flex gap-2 float-end">
                                                <Button
                                                    style={{ minWidth: "150px" }}
                                                    disabled={taskDetails?.is_proceed_to_kyc}
                                                    className="d-flex align-items-center btn-light"
                                                    onClick={handleProccedToKyc}
                                                >
                                                    <div className="round-circle" />
                                                    Proceed to KYC
                                                </Button>
                                            </Col>
                                        )}
                                    </Row>
                                    <div className="clearfix"></div>
                                    <hr className="my-3" />
                                </Col>
                            </Row>
                            <Row className="dotted-border-bottom" style={{ paddingBottom: "20px" }}>
                                <Col>
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
                            </Row>
                            <Row className="mb-2">
                                <Row className="mt-3" style={{ paddingRight: '0px' }}>
                                    <Col>
                                        <h4 className="text-secondary mt-1">Task Details</h4>
                                    </Col>
                                    <Col style={{ paddingRight: '0px' }}>
                                        <div className="action-icon d-flex justify-content-end align-items-center">
                                            <Tooltip title='View All Details'>
                                                <MatButton sx={{ mb: 2 }} onClick={() => navigate(`/leads/manage/${studentId}`)} startIcon={<VisibilityIcon />} variant="contained"><Typography sx={{ fontFamily: "'Nunito', sans-serif", textTransform: 'none', fontWeight: '700', fontSize: '12px' }}>View More</Typography></MatButton>
                                            </Tooltip>
                                        </div>
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
                                    </div>

                                    <div className="">
                                        <p className="mt-2 mb-1 text-muted fw-light">Email</p>
                                        <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                                            <img src={icons.email} alt="email" className="me-1" width="17" />
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
                                            <h5 className="m-0 font-size-14">{basicData?.followup_date && moment(basicData?.followup_date).format("DD/MM/YYYY")}</h5>
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

                {!loading && <Row className="d-flex align-items-stretch mb-3 ms-1 pe-1" style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                    <Col md={6} style={{paddingLeft: '0px'}}>
                        <Card className="h-100">
                            <Card.Body>
                                <h4 className="text-secondary m-0">Status</h4>
                                <p className="mt-2 mb-2 text-muted fw-light">Change the lead status</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    {/* <Dropdown>
                                        <Dropdown.Toggle
                                            className="cursor-pointer"
                                            variant="light"
                                        >
                                            {basicData?.status?.status_name ? basicData?.status?.status_name : "Change status"}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {(status || [])?.map((item: any) => (
                                                <Dropdown.Item
                                                    eventKey={item.id}
                                                    key={item.id}
                                                    onClick={() => [handleStatusChange(item?.id), setStatusId(item?.id), setViewOnly(false)]}
                                                >
                                                    {item.status_name}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown> */}

                                    <Autocomplete
                                        disablePortal
                                        disableClearable 
                                        options={formattedStatus || []}
                                        value={basicData?.status?.status_name ? basicData?.status?.status_name : "Change status"}
                                        sx={{ width: 300, paddingTop: '1.2rem' }}
                                        renderInput={(params) =>
                                            <TextField {...params}
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                  padding: '4px 12px',
                                                },
                                                '& .MuiInputBase-input': {
                                                  height: '1.2rem',
                                                  paddingTop: '6px',
                                                  paddingBottom: '6px',
                                                //   marginBottom: '6px',
                                                  lineHeight: '1.2rem', 
                                                },
                                                '& .MuiInputLabel-root': {
                                                  lineHeight: 'normal', 
                                                },
                                              }}
                                                label="Status" />}
                                        onChange={(event, newValue) => {
                                            if (newValue) {
                                                handleStatusChange(newValue.value);
                                                setStatusId(newValue.value);
                                                setViewOnly(false);
                                            }
                                        }}
                                    />
                                    <span className="mt-2 ms-2">
                                        {/* <i
                                            className="mdi mdi-comment-eye-outline fs-2 ps-3"
                                            title="View Comments"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            onClick={() => [setShowRemarkModal(true), setViewOnly(true)]}
                                        ></i> */}
                                        <Tooltip title='View Comments'>
                                            <MatButton sx={{ marginTop: '8px' }} variant="text" color="primary" startIcon={<CommentIcon sx={{ marginLeft: '6px' }} style={{ fontSize: '2.5rem' }} />} onClick={() => [setShowRemarkModal(true), setViewOnly(true)]} />
                                        </Tooltip>
                                    </span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}  style={{ paddingRight: '0px'}}>
                        <Card className="h-100">
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
                                        disabled={formattedFlagData?.length == 0}
                                    >
                                        {basicData?.user_primary_flags?.flag_name ? basicData?.user_primary_flags?.flag_name : "Change Flag"}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {(formattedFlagData || [])?.map((item: any) => (

                                            <Dropdown.Item
                                                eventKey={item.value}
                                                key={item.value}
                                                onClick={() => [updateFlagStatus(item.value)]}
                                            >
                                                {item.label}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <div className="mt-2" style={{ display: "flex", flexWrap: "wrap", gap: "1px" }}>
                                    {basicData?.flags?.length > 0 && basicData?.flags.map((data: any) => (<div style={{ border: `2px solid ${data?.color}`, backgroundColor: `${setColorOpacityRGB(data?.color)}` }} className="rounded-5 me-2 mt-1">
                                        <div className="ps-1 pe-1 fw-bold" style={{ fontSize: "0.6rem", paddingTop: '2px' }}>{data?.flag_name}<i className="mdi mdi-close" style={{ paddingLeft: '12px' }} onClick={() => removeFlag(data?.id)}></i></div>
                                    </div>))}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>}

                {(!loading && user.role == 7) && (
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

                {!loading && <Card className="ms-1 mb-0">
                    <Card.Body>
                        <Row>
                            <Box sx={{ width: '100%' }}>
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    textColor="secondary"
                                    aria-label="secondary tabs example"
                                    sx={{ ...tabsStyle }}
                                >
                                    <Tab value="comments" label="Comments"
                                        sx={{ ...individualTabStyle }}
                                    />

                                    <Tab value="history" label="History"
                                        sx={{ ...individualTabStyle }}
                                    />

                                    <Tab value="attachments" label="Attachments"
                                        sx={{ ...individualTabStyle }}
                                    />
                                </Tabs>

                                {/* Tab content */}
                                <Box sx={{ mt: 2 }}>
                                    {tabValue === 'comments' && studentId && (
                                        <Suspense fallback={null}>
                                            <Comments studentId={studentId} />
                                        </Suspense>
                                    )}
                                    {tabValue === 'history' && studentId && (
                                        <Suspense fallback={null}>
                                            <History studentId={studentId} />
                                        </Suspense>
                                    )}
                                    {tabValue === 'attachments' && studentId && (
                                        <Suspense fallback={null}>
                                            <DocumentsOverview studentId={studentId} />
                                        </Suspense>
                                    )}
                                </Box>
                            </Box>
                        </Row>
                    </Card.Body>
                </Card>}

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
            </Row>
        </>
    );
};

export default StudentDetailsMaterial;
