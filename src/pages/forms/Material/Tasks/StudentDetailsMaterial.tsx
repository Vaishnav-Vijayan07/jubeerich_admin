import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
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
  cre_tl_id,
  follow_up_id,
  franchise_counsellor_id,
  future_leads_id,
  handleDateFormat,
  not_responding_id,
  showErrorAlert,
  showSuccessAlert,
} from "../../../../constants";
import { refreshData } from "../../../../redux/countryReducer";
import useDropdownData from "../../../../hooks/useDropdownDatas";
import swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import CardLoadingSkeleton from "../../../../components/SkeletonLoading/CardLoadingSkeleton1";
import { Autocomplete, Box, Menu, MenuItem, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import MatButton from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FollowupModal from "./FollowupModal";
import OfficeAssignModal from "./OfficeAssignModal";
import { showConfirmation } from "../../../../utils/showConfirmation";

const History = lazy(() => import("./History"));

const inputStyle = {
  "& .MuiInputBase-root": {
    padding: "4px 12px",
  },
  "& .MuiInputBase-input": {
    height: "1.1rem",
    paddingTop: "6px",
    paddingBottom: "6px",
    //   marginBottom: '6px',
    lineHeight: "1.2rem",
  },
  "& .MuiInputLabel-root": {
    lineHeight: "normal",
  },
};

const StudentDetailsMaterial = ({ studentId, taskId, getTaskList, initialLoading, office_type,region }: any) => {
  const { userRole } = useSelector((state: RootState) => ({
    userRole: state?.Auth.user.role,
  }));

  const [basicData, setBasicData] = useState<any>([]);
  const [flagData, setFlagData] = useState<any>([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [standard, setStandard] = useState(false);
  const [statusId, setStatusId] = useState(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [taskDetails, setTaskDetails] = useState<any>({});
  const [ShowRemarkModal, setShowRemarkModal] = useState<boolean>(false);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [remarkData, setRemarkData] = useState<any>(null);
  const [viewOnly, setViewOnly] = useState<boolean>(false);
  const [isFollowupLoading, setIsFollowupLoading] = useState<boolean>(false);
  const [taskPrefix, setTaskPrefix] = useState<string>("");
  const currentDate = new Date();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const { Countries, user, refresh } = useSelector((state: RootState) => ({
    Countries: state?.Country?.countries,
    user: state.Auth.user,
    refresh: state.refreshReducer.refreshing,
  }));

  const { dropdownData } = useDropdownData("marital,officeType,franchise,region,flags");
  const { flags } = dropdownData;

  const handleOpen = () => setShowAssignModal(true);
  const handleClose = () => setShowAssignModal(false);

  const getRoleBasedStatus = async (user_role: string) => {
    const { data } = await axios.get(`/lead_status`, {
      params: { user_role },
    });
    setStatus(data.data);
  };

  const formattedStatus = useMemo(() => {
    if (!status) return [];

    return (
      status
        // .filter((item: any) => item.status_name !== currentStatus) // Filter out the current status
        .map((item: any) => ({
          value: item.id.toString(),
          label: item.status_name,
        }))
        .filter((data: any) => {
          if (taskDetails?.is_rejected) {
            return data?.value == follow_up_id;
          }
          return true;
        })
    );
  }, [status, basicData]); // Ensure basicData is included in dependencies if it's part of the logic

  const getBasicInfo = () => {
    setLoading(true);
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
    // let country_id = taskDetails?.student_name?.preferredCountries?.[0]?.id;
    let country_id = taskDetails?.assigned_country;

    if (status_id == follow_up_id || status_id == future_leads_id || status_id == not_responding_id) {
      // toggleStandard();
      setShowRemarkModal(true);
    } else {
      const result = await swal.fire({
        title: "Confirm Action",
        text: `Do you want to update this lead status?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, Update`,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#8B8BF5", // Purple color for confirm button
        cancelButtonColor: "#E97777", // Pink/red color for cancel button
        buttonsStyling: true,
        customClass: {
          popup: "rounded-4 shadow-lg",
          confirmButton: "btn btn-lg px-4 rounded-3 order-2 hover-custom",
          cancelButton: "btn btn-lg px-4 rounded-3 order-1 hover-custom",
          title: "fs-2 fw-normal mb-2",
        },
        width: "26em",
        padding: "2em",
      });

      if (result.isConfirmed) {
        const { data } = await axios.put("/lead_status", {
          lead_id: studentId,
          status_id,
          country_id: country_id,
        });

        dispatch(refreshData());
        showSuccessAlert(data.message);
        // setShowRemarkModal(true);
        getTaskList();
      }
    }
  };

  const handleFollowUpDate = (value: any) => {
    let country_id = taskDetails?.assigned_country;

    // let country_id = taskDetails?.student_name?.preferredCountries?.[0]?.id;

    setIsFollowupLoading(true);
    axios
      .put("/lead_status", {
        lead_id: studentId,
        status_id: statusId,
        // followup_date: selectedDate,
        followup_date: value,
        country_id: country_id,
      })
      .then((res) => {
        // toggleStandard();
        dispatch(refreshData());
        setLoading(false);
        showSuccessAlert(res.data.message);
        setIsFollowupLoading(false);
        // setShowRemarkModal(true);
        getTaskList();
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

  const updateFlagStatus = async (flag_id: string) => {
    try {
      const result = await swal.fire({
        title: "Confirm Action",
        text: `Do you want to add new flag?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, Add`,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#8B8BF5", // Purple color for confirm button
        cancelButtonColor: "#E97777", // Pink/red color for cancel button
        buttonsStyling: true,
        customClass: {
          popup: "rounded-4 shadow-lg",
          confirmButton: "btn btn-lg px-4 rounded-3 order-2 hover-custom",
          cancelButton: "btn btn-lg px-4 rounded-3 order-1 hover-custom",
          title: "fs-2 fw-normal mb-2",
        },
        width: "26em",
        padding: "2em",
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

  const countryData = useMemo(() => {
    if (!Countries) return [];

    const currentCountries = basicData?.country_names;

    return Countries.filter((item: any) => !basicData?.all_country_ids?.includes(item?.id))
      .filter((item: any) => !currentCountries?.includes(item?.country_name))
      .map((item: any) => ({
        value: item?.id.toString(),
        label: item?.country_name,
      }));
  }, [Countries, basicData]);

  // const handleFinishTask = async () => {
  //   try {
  //     const result = await swal.fire({
  //       title: "Confirm Action",
  //       text: `Do you want to proceed?`,
  //       icon: "question",
  //       iconColor: "#8B8BF5", // Purple color for the icon
  //       showCancelButton: true,
  //       confirmButtonText: `Yes`,
  //       cancelButtonText: "Cancel",
  //       confirmButtonColor: "#8B8BF5", // Purple color for confirm button
  //       cancelButtonColor: "#E97777", // Pink/red color for cancel button
  //       buttonsStyling: true,
  //       customClass: {
  //         popup: "rounded-4 shadow-lg",
  //         confirmButton: "btn btn-lg px-4 rounded-3 order-2 hover-custom",
  //         cancelButton: "btn btn-lg px-4 rounded-3 order-1 hover-custom",
  //         title: "fs-2 fw-normal mb-2",
  //       },
  //       width: "26em",
  //       padding: "2em",
  //     });

  //     if (result.isConfirmed) {
  //       const res = await axios.put("finish_task", {
  //         isCompleted: true,
  //         id: taskId,
  //       });

  //       getTaskDetails();
  //       getTaskList(null, true);

  //       // Show success alert
  //       showSuccessAlert(res.data.message);
  //     }
  //   } catch (err) {
  //     console.log("Error during task completion:", err);
  //   }
  // };

  const handleSubmit = async (type: string, office_id: number, counselor_id: number, region_id: number, branch_id: number) => {
    try {
      const payload: any = {
        type,
        lead_id: studentId,
        office_id,
        counselor_id: counselor_id == 0 ? undefined : counselor_id,
        task_id: taskId,
        region_id: region_id == 0 ? undefined : region_id,
        branch_id: branch_id == 0 ? undefined : branch_id,
      };
      console.log(payload);
      const { data } = await axios.post("assign_office", payload);
      if (data.status) {
        handleClose();
        getTaskDetails();
        getTaskList(null, true);
        showSuccessAlert(data.message);
      }
    } catch (error) {
      console.log(error);
      showErrorAlert(error);
    }
  };

  const handleFinishTask = async () => {
    handleOpen();
  };

  const handleCompleteTask = async () => {
    try {
      const result = await swal.fire({
        title: "Confirm Action",
        text: `Do you want to complete this task?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, Complete`,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#8B8BF5", // Purple color for confirm button
        cancelButtonColor: "#E97777", // Pink/red color for cancel button
        buttonsStyling: true,
        customClass: {
          popup: "rounded-4 shadow-lg",
          confirmButton: "btn btn-lg px-4 rounded-3 order-2 hover-custom",
          cancelButton: "btn btn-lg px-4 rounded-3 order-1 hover-custom",
          title: "fs-2 fw-normal mb-2",
        },
        width: "26em",
        padding: "2em",
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
    const result = await swal.fire({
      title: "Confirm Action",
      text: `Do you want to assign new country?`,
      icon: "question",
      iconColor: "#8B8BF5", // Purple color for the icon
      showCancelButton: true,
      confirmButtonText: `Yes, Assign`,
      cancelButtonText: "Cancel",
      confirmButtonColor: "#8B8BF5", // Purple color for confirm button
      cancelButtonColor: "#E97777", // Pink/red color for cancel button
      buttonsStyling: true,
      customClass: {
        popup: "rounded-4 shadow-lg",
        confirmButton: "btn btn-lg px-4 rounded-3 order-2 hover-custom",
        cancelButton: "btn btn-lg px-4 rounded-3 order-1 hover-custom",
        title: "fs-2 fw-normal mb-2",
      },
      width: "26em",
      padding: "2em",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put("assign_new_country", {
        id: taskId,
        newCountryId: newCountryId,
      });

      showSuccessAlert(response?.data?.message); // Display success message

      getTaskDetails(); // Refresh task details
      getTaskList();
      dispatch(refreshData());
    } catch (error: any) {
      console.error("Error:", error);

      const message = typeof error === "string" ? error : "Network error or server is unreachable.";

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
          text: message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setLoading(false);
      setAnchorEl(null);
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

      let payload = {
        student_id: studentId,
        task_id: taskId,
        assigned_country: taskDetails?.assigned_country,
        study_pref_id: taskDetails.is_rejected ? taskDetails?.study_preference_detail_id : null,
      };

      const result = await swal.fire({
        title: "Confirm Action",
        text: `Do you want to proceed kyc?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, Proceed to KYC`,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#8B8BF5", // Purple color for confirm button
        cancelButtonColor: "#E97777", // Pink/red color for cancel button
        buttonsStyling: true,
        customClass: {
          popup: "rounded-4 shadow-lg",
          confirmButton: "btn btn-lg px-4 rounded-3 order-2 hover-custom",
          cancelButton: "btn btn-lg px-4 rounded-3 order-1 hover-custom",
          title: "fs-2 fw-normal mb-2",
        },
        width: "26em",
        padding: "2em",
      });

      if (result.isConfirmed) {
        const res = await axios.post(`/proceed_kyc`, payload);
        if (res) {
          showSuccessAlert("Proceeded KYC Successfully");
          getTaskDetails();
          getTaskList(null, true);
        }
      }
    } catch (error) {
      console.log(error);
      navigate(`/leads/manage/${studentId}?tab=study_pref`);
      showErrorAlert(error);
    }
  };

  const removeFlag = async (flagId: any) => {
    try {
      const result = await swal.fire({
        title: "Confirm Action",
        text: `Do you want to remove this flag?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, Remove`,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#8B8BF5", // Purple color for confirm button
        cancelButtonColor: "#E97777", // Pink/red color for cancel button
        buttonsStyling: true,
        customClass: {
          popup: "rounded-4 shadow-lg",
          confirmButton: "btn btn-lg px-4 rounded-3 order-2 hover-custom",
          cancelButton: "btn btn-lg px-4 rounded-3 order-1 hover-custom",
          title: "fs-2 fw-normal mb-2",
        },
        width: "26em",
        padding: "2em",
      });

      if (result.isConfirmed) {
        const res = await axios.put(`/remove_flag_status/${studentId}`, { flag_id: flagId });
        if (res) {
          showSuccessAlert("Flag Updated Successfully");
          getRemarks();
          dispatch(refreshData());
          getTaskList();
        }
      }
    } catch (error) {
      console.log(error);
      showErrorAlert(error);
    }
  };

  const getTaskPrefix = async () => {
    try {
      const res = await axios.get("/master_data");
      if (res) {
        setTaskPrefix(res?.data?.data?.[0]?.task_prefix);
      }
    } catch (error) {
      console.log(error);
      showErrorAlert(error);
    }
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

  useEffect(() => {
    getTaskPrefix();
  }, []);

  useEffect(() => {
    dispatch(getCountry());
  }, []);

  const acceptTask = async () => {
    try {
      const result = await swal.fire({
        title: "Confirm Action",
        text: `Do you want to accept this task?`,
        icon: "question",
        iconColor: "#8B8BF5",
        showCancelButton: true,
        confirmButtonText: `Yes, Accept`,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#8B8BF5",
        cancelButtonColor: "#E97777",
        buttonsStyling: true,
        customClass: {
          popup: "rounded-4 shadow-lg",
          confirmButton: "btn btn-lg px-4 rounded-3 order-2 hover-custom",
          cancelButton: "btn btn-lg px-4 rounded-3 order-1 hover-custom",
          title: "fs-2 fw-normal mb-2",
        },
        width: "26em",
        padding: "2em",
      });

      if (result?.isConfirmed) {
        const { data } = await axios.post("/accept_task", { taskId: taskDetails?.id });

        if (data?.success) {
          showSuccessAlert("Task Accepted Successfully");
          getTaskDetails();
          getTaskList(null, true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="task__details">
        {loading ? (
          <CardLoadingSkeleton />
        ) : (
          <>
            <div className="ribbon-box" style={{ fontFamily: "Nunito", borderRadius: "10px", background: "#fff" }}>
              <div className="p-3">
                <Row>
                  <Col>
                    <div className="ribbon ribbon-primary float-start px-4 max-content mt-1 mb-0">
                      <span>{taskPrefix + "/" + currentDate.getFullYear() + "/" + (taskDetails?.id || "000")}</span>
                    </div>
                    {console.log("taskDetails", taskDetails)}

                    {!taskDetails?.is_accepted && (
                      <Col className="d-flex gap-2 float-end">
                        <Button
                          className="d-flex align-items-center btn-light ms-2"
                          onClick={acceptTask}
                          style={{ fontSize: "12px", background: "#EEFFF3", border: ".5px dashed #009A29" }}
                        >
                          <span className="mdi mdi-check me-1" style={{ color: "green", fontSize: "12px" }}></span>
                          Accept Task
                        </Button>
                      </Col>
                    )}

                    {(userRole == cre_id || userRole == cre_tl_id) && (
                      <Col className="d-flex gap-2 float-end">
                        <Button
                          className="d-flex align-items-center btn-light"
                          disabled={taskDetails?.isCompleted ? true : false}
                          onClick={handleFinishTask}
                          style={{ fontSize: "12px", background: "#EEFFF3", border: ".5px dashed #009A29" }}
                        >
                          <div className="round-circle" />

                          {taskDetails?.isCompleted ? "Task Completed" : "Move to Counsellor"}
                        </Button>
                      </Col>
                    )}

                    <Row className="g-1 float-end">
                      {/* {(userRole == counsellor_id || userRole == franchise_counsellor_id || userRole == branch_counsellor_id) && (
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
                      )} */}

                      {(userRole == counsellor_id ||
                        userRole == franchise_counsellor_id ||
                        userRole == branch_counsellor_id ||
                        userRole == country_manager_id) && (
                        <Col className="d-flex gap-2 float-end">
                          <Button
                            style={{ minWidth: "150px" }}
                            disabled={taskDetails?.is_proceed_to_kyc}
                            className="d-flex align-items-center"
                            onClick={handleProccedToKyc}
                          >
                            <div className="round-circle" />
                            Proceed to KYC
                          </Button>
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>

                <Row className="mt-3" style={{ alignItems: "start" }}>
                  <Col md={9} lg={9}>
                    <h3 className="m-0" style={{ fontSize: "20px", fontFamily: "Inter", fontWeight: "400" }}>
                      {taskDetails?.title}
                    </h3>
                    <p className="mb-2" style={{ fontSize: "15px", fontFamily: "Nunito", fontWeight: "300" }}>
                      {taskDetails?.description}
                    </p>
                    <div className="d-flex">
                      {basicData?.country_names?.map((country: any) => (
                        <small
                          style={{
                            // backgroundColor: "#9dd3f5",
                            color: "#122d3d",
                            border: `1px solid #122d3d`,
                            borderRadius: "5px",
                            padding: "2px 10px",
                            fontSize: "0.7rem",
                          }}
                          className={classNames("rounded-pill me-1")}
                        >
                          {country}
                        </small>
                      ))}
                    </div>
                  </Col>

                  <Col md={3} lg={3} className="d-flex justify-content-end align-items-end mt-1">
                    <span>
                      <h5 className="m-0 mb-1 text-muted font-12 text-end" style={{ fontFamily: "Inter", fontWeight: "400" }}>
                        Last Updated
                      </h5>
                      <div
                        className=""
                        style={{
                          background: "#E0DEF8",
                          padding: "12px 14px",
                          borderRadius: "5px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img src={icons.calendarColored} alt="calender" className="me-1" width="18" />
                        <span className="font-14">{handleDateFormat(taskDetails?.updatedAt)}</span>
                      </div>
                    </span>
                  </Col>
                </Row>
              </div>

              <div
                className="p-0"
                style={{ background: "#E0DEF8", borderBottomRightRadius: "10px", borderBottomLeftRadius: "10px" }}
              >
                <div className="" style={{ padding: "15px 30px" }}>
                  <div className="" style={{ paddingRight: "0px" }}>
                    <div>
                      <div className="action-icon d-flex justify-content-end align-items-center"></div>
                    </div>
                  </div>

                  <div className="grid-container mb-1">
                    <div className="">
                      <p className="mt-0 fw-light mb-0 font-14" style={{ fontSize: "0.8rem", color: "#5E5E5E" }}>
                        Phone Number
                      </p>
                      <div className="d-flex align-items-center outline-none" style={{ gap: "5px" }}>
                        <img src={icons.apple} alt="phone" className="me-1" width="16" />
                        <input
                          type="tel"
                          value={basicData?.phone}
                          style={{
                            border: "none",
                            outline: "none",
                            width: "100%",
                            fontSize: "15px",
                            fontWeight: 600,
                            background: "transparent",
                          }}
                        />
                      </div>
                    </div>

                    <div className="">
                      <p className="mt-0 fw-light mb-0 font-14" style={{ fontSize: "0.8rem", color: "#5E5E5E" }}>
                        Email
                      </p>
                      <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                        <img src={icons.email} alt="email" className="me-1" width="17" />
                        <input
                          type="text"
                          value={basicData?.email}
                          style={{
                            border: "none",
                            outline: "none",
                            fontSize: "15px",
                            fontWeight: 600,
                            width: "100%",
                            background: "transparent",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="mt-0 mb-0 fw-light font-14" style={{ fontSize: "0.8rem", color: "#5E5E5E" }}>
                        Passport
                      </p>
                      <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                        <img src={icons.Layer} alt="email" className="me-1" width="17" />
                        <input
                          type="text"
                          value={basicData?.passportNumber || "N/A"}
                          style={{
                            border: "none",
                            outline: "none",
                            fontSize: "15px",
                            fontWeight: 600,
                            width: "100%",
                            background: "transparent",
                          }}
                        />
                      </div>
                    </div>

                    <div className="action-icon d-flex justify-content-end align-items-center" style={{ width: "105px" }}>
                      <Tooltip title="View All Details">
                        <MatButton
                          onClick={() => navigate(`/leads/manage/${studentId}`)}
                          startIcon={<VisibilityIcon />}
                          size="small"
                          variant="contained"
                          style={{ backgroundColor: "#6658DD", boxShadow: "none" }}
                        >
                          <Typography
                            sx={{
                              fontFamily: "'Nunito', sans-serif",
                              textTransform: "none",
                              fontWeight: "600",
                              fontSize: "12px",
                              padding: "3px 0px",
                            }}
                          >
                            View More
                          </Typography>
                        </MatButton>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="mt-3" style={{ borderRadius: "10px" }}>
              <Card.Body>
                <div className="action-grid-container">
                  <div className="mx-2">
                    <h4 className="m-0 label_heading">Status</h4>

                    <div className="d-flex justify-content-between align-items-center">
                      <Autocomplete
                        disablePortal
                        disableClearable
                        options={formattedStatus || []}
                        value={
                          taskDetails?.student_name?.preferredCountries[0]?.country_status[0]?.status_name
                            ? taskDetails?.student_name?.preferredCountries[0]?.country_status[0]?.status_name
                            : "Change status"
                        }
                        sx={{ width: "100%", paddingTop: "1.2rem" }}
                        renderInput={(params) => <TextField {...params} sx={{ ...inputStyle }} />}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            handleStatusChange(newValue.value);
                            setStatusId(newValue.value);
                            setViewOnly(false);
                          }
                        }}
                      />
                    </div>

                    {remarkData?.length > 0 && (
                      <div
                        className="ribbon-box"
                        style={{
                          background: "#EEFFF2",
                          marginTop: "15px",
                          padding: "20px 36px",
                          border: "0.5px solid #009A29",
                          borderRadius: "5px",
                        }}
                      >
                        <span className="text-success">{remarkData[0]?.remark}</span>
                        <div className="ribbon-two ribbon-two-success">
                          <span style={{ fontSize: "10px" }}>{handleDateFormat(remarkData[0]?.followup_date)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mx-2">
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
                            // setViewOnly(false);
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
                  {(userRole == counsellor_id || userRole == franchise_counsellor_id || userRole == branch_counsellor_id) && (
                    <div className="mx-2">
                      <h4 className="m-0 label_heading">Add New Country</h4>

                      <div className="d-flex justify-content-between align-items-center">
                        <Autocomplete
                          disablePortal
                          disableClearable
                          options={countryData || []}
                          value={
                            taskDetails?.student_name?.preferredCountries[0]?.country_name
                              ? taskDetails?.student_name?.preferredCountries[0]?.country_name
                              : "Add New Country"
                          }
                          sx={{ width: "100%", paddingTop: "1.2rem" }}
                          renderInput={(params) => <TextField {...params} sx={{ ...inputStyle }} placeholder="Add New Country" />}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              addNewCountry(newValue?.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {taskDetails?.is_rejected && (
                  <div className="mx-2">
                    <p className="mt-2 mb-1 text-danger font-16">Remarks</p>
                    <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                      <img src={icons.information} alt="comapny icon" className="me-1" width="16" />
                      <h5 className="m-0 font-size-14">{taskDetails?.kyc_remarks?.[0]?.remark}</h5>
                      <h5 className="m-0 font-size-14"></h5>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

            <History studentId={studentId} />

            <FollowupModal
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
              submitFollowupDate={handleFollowUpDate}
            />
            {showAssignModal && (
              <OfficeAssignModal
                office_type={office_type ? office_type : ""}
                region={region ? region : ""}
                show={showAssignModal}
                handleClose={handleClose}
                lead_id={studentId}
                handleSubmit={handleSubmit}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default StudentDetailsMaterial;
