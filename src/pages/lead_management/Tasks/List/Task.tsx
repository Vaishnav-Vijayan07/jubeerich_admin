import React, { useState, useEffect,  } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// dummy data
import { TaskItemTypes, TaskObjects } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { getHistoryByLeadId, getStatus } from "../../../../redux/actions";
import axios from "axios";
import {
  AUTH_SESSION_KEY,
  DateReverse,
  FindStatusColor,
  FindStatusName,
  handleDateFormat,
  setColorOpacity,
  showErrorAlert,
  showSuccessAlert,
  spam_id,
} from "../../../../constants";
import { icons } from "../../../../assets/images/icons";
import Spinner from "../../../../components/Spinner";
import Modal1 from "./Modal";
import TaskDetails from "./TaskDetails";
import TaskDetailsTab from "./TaskDetailsTab";
import TaskStatusChange from "./TaskStatusChange";

// const Task = (task: TaskItemTypes) => {
const Task = ({ id, lead_id, attachedFiles, getAttachedFiles, getTaskList, setTaskArray, TaskArray, handleUpdateLeadTitle, handleUpdateStatus, pickedDate }: TaskItemTypes) => {
  const Status = useSelector((state: RootState) => state?.Status?.status?.data);
  // const [completed, setCompleted] = useState<boolean>(stage === "Done");
  const dispatch = useDispatch();
  const date = new Date();
  const [enquiryText, setEnquiryText] = useState<any>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [taskObject, setTaskObject] = useState<TaskObjects>({
    id: "",
    enquiry: "",
    lead_title: "",
    title: "",
    name: "",
    assigned_to: "",
    completed: false,
    status: "",
    status_id: "",
    checklists: [],
    due_date: "",
    color: "",
    status_name: "",
    lead_id: "",
    flag_name: "",
    next_actions: [],
    email: "",
    phone: "",
    source_name: "",
    channel_name: "",
    company_name: "",
    branch: "",
    created_at: "",
    next_status: "",
    next_status_name: "",
    next_status_color: "",
    is_completed: false,
    completed_at: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [nextStatusId, setNextStatusId] = useState<string | null>(null);
  const [statusId, setStatusId] = useState<number | null>(null);

  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  const { user_id } = JSON.parse(userInfo ? userInfo : "");

  const openModal = (id: string, statusId: number) => {
    setShowModal(true);
    setNextStatusId(id);
    setStatusId(statusId);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    dispatch(getStatus());
  }, []);

  useEffect(() => {
    setEnquiryText(taskObject.lead_title);
  }, [taskObject.lead_title]);

  //This will trigger when the enter key is pressed
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleBlur();
    }
  };

  //This function will trigger on losing the focus
  const handleBlur = () => {
    if (taskObject.lead_title !== enquiryText) {
      axios
        .put(`/leads/${lead_id}`, { title: enquiryText })
        .then((res) => {
          getTaskListData();
          handleUpdateLeadTitle(id, "title", enquiryText);
          showSuccessAlert(res.data.message);
        })
        .catch((err) => {
          console.error(err);
          showErrorAlert(err.message);
        });
    }
  };

  const updateChecklistStatus = (id: number, e: any, checklist: string) => {
    axios
      .put(`/checklist/${id}`, { checklist_status: e.target.checked })
      .then((res) => {
        // getTaskList();
        // showSuccessAlert(res.data.message);
        getTaskListData();

        axios
          .post(`leads_history`, { lead_id: lead_id, date: DateReverse(handleDateFormat(date)), checklist: checklist })
          .then((res) => {
            dispatch(getHistoryByLeadId(lead_id));
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        console.error("Error", err);
        showErrorAlert("Error occured");
      });
  };

  const handleStatusChange = (status_id: any) => {
    axios
      .put(`/update_status/${lead_id}`, {
        user_id: user_id,
        status: status_id,
      })
      .then(async (res) => {
        const StatusName = FindStatusName(status_id, Status);
        axios
          .post(`leads_history`, { lead_id: lead_id, date: DateReverse(handleDateFormat(date)), status_id: status_id, status: StatusName })
          .then((res) => {
            dispatch(getHistoryByLeadId(lead_id));
          })
          .catch((err) => console.error(err));
        getTaskListData();
        showSuccessAlert(res.data.message ? res.data.message : "Updated Successfull");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleNextStatusChange = (next_status: any) => {
    axios
      .put(`/update_next_status/${lead_id}`, {
        user_id: user_id,
        next_status: next_status,
        followup_date: taskObject.due_date,
      })
      .then(async (res) => {
        const StatusName = FindStatusName(next_status, Status);
        const StatusColor = FindStatusColor(next_status, Status);
        handleUpdateStatus(id, StatusName, StatusColor, next_status);

        // {
        //   next_status &&
        //     date &&
        //     axios
        //       .post(`leads_history`, { lead_id: lead_id, date: DateReverse(handleDateFormat(date)), action_id: next_status })
        //       .then((res) => {})
        //       .catch((err) => console.error(err));
        // }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getTaskListData = () => {
    axios
      .get(`/task/${id}`)
      .then((res) => {
        const task: any = res.data;
        const obj = {
          id: task.id,
          enquiry: task.leads_array[0].enquiry,
          lead_title: task.leads_array[0].lead_title,
          title: `Mr. ${task.leads_array[0].name}, inquiring about ${task.leads_array[0].enquiry} for his/her company,
           ${task.leads_array[0].company_name}`,
          name: task.title,
          assigned_to: task.assigned_user,
          completed: false,
          // status: task.status,
          status_id: task.leads_array[0].status,
          checklists: task.checklists,
          due_date: task.leads_array[0].followup_date,
          color: task.color,
          status_name: task.status_name,
          lead_id: task.lead_id,
          flag_name: task.flag_name,
          next_actions: task.next_actions,
          email: task.leads_array[0].email,
          phone: task.leads_array[0].phone,
          source_name: task.leads_array[0].source_name,
          channel_name: task.leads_array[0].channel_name,
          company_name: task.leads_array[0].company_name,
          branch: task.leads_array[0].branch_name,
          created_at: handleDateFormat(task.created_at),
          next_status: task.leads_array[0].next_status,
          next_status_name: task.next_status_name,
          next_status_color: task.next_status_color,
          is_completed: task.is_completed,
          completed_at: task.completed_at,
        };

        setTaskObject((prev) => ({ ...prev, ...obj }));
        // return obj;
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleFinish = (e: any) => {
    axios
      .put(`task/${id}`, {
        is_completed: "true",
      })
      .then((res) => {
        getTaskList();
        getTaskListData();
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (id) {
      getTaskListData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh", width: "100%" }}>
        <Spinner className="m-2" />;
      </div>
    );
  }

  return (
    <React.Fragment>
      <Modal1
        showModal={showModal}
        getTaskListData={getTaskListData}
        closeModal={closeModal}
        leadId={lead_id}
        Status={Status}
        next_status={nextStatusId}
        handleUpdateStatus={handleUpdateStatus}
        id={id}
        statusId={statusId}
        handleStatusChange={handleStatusChange}
        getTaskList={getTaskList}
        lead_id={lead_id}
        user_id={user_id}
      />

      <TaskDetails
        taskObject={taskObject}
        spam_id={spam_id}
        id={id}
        enquiryText={enquiryText}
        setEnquiryText={setEnquiryText}
        handleBlur={handleBlur}
        handleKeyPress={handleKeyPress}
        icons={icons}
        setColorOpacity={setColorOpacity}
        handleFinish={handleFinish}
        pickedDate={pickedDate}
        lead_id={lead_id}
        getTaskListData={getTaskListData}
        handleUpdateLeadTitle={handleUpdateLeadTitle}
      />

      <TaskStatusChange
        taskObject={taskObject}
        updateChecklistStatus={updateChecklistStatus}
        openModal={openModal}
        handleNextStatusChange={handleNextStatusChange}
        handleStatusChange={handleStatusChange}
      />

      <TaskDetailsTab lead_id={lead_id} getAttachedFiles={getAttachedFiles} attachedFiles={attachedFiles} user_id={user_id} date={date} />

      <ToastContainer />
    </React.Fragment>
  );
};

export default Task;
