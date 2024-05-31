import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import moment from "moment";

// components
import PageTitle from "../../../../components/PageTitle";

import TaskSection from "./Section";
import Task from "./Task";

// dummy data
import { TaskItemTypes } from "./data";
import axios from "axios";
import { AUTH_SESSION_KEY, DateReverse, handleDateFormat } from "../../../../constants";
import ReactDatePicker from "react-datepicker";
import calender from "../../../../assets/images/icons/calendar.svg";

// Task List
const TaskList = () => {
  const [TaskArray, setTaskArray] = useState<TaskItemTypes[]>([]);
  // const [selectedTask, setSelectedTask] = useState<TaskItemTypes>(TaskList[0]);
  const [selectedTask, setSelectedTask] = useState<TaskItemTypes>(TaskArray.filter((item) => item.is_completed == false)[0]);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(handleDateFormat(new Date()));
  const [pickedDate, setPickedDate] = useState(new Date()); // Replace with your selected date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [isToday, setIsToday] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setpendingTasks] = useState([]);

  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  useEffect(() => {
    if (selectedDate) {
      setPickedDate(new Date(DateReverse(selectedDate)));
    }
  }, [selectedDate]);

  useEffect(() => {
    // Function to format the date as "1st Monday's task"
    const formatDate = (date: any) => {
      const options = { day: "numeric", weekday: "long" };
      const dateStr = date.toLocaleDateString(undefined, options);
      const day = date.getDate();
      const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
      return `${day}${suffix} ${dateStr.split(" ")[1]}'s Task`;
    };

    if (pickedDate.toDateString() === currentDate.toDateString()) {
      setFormattedDate("Today's Task");
      setIsToday(true);
    } else {
      setFormattedDate(formatDate(pickedDate));
      setIsToday(false);
    }
  }, [pickedDate, currentDate]);

  /**
   * Selects the task
   * @param {*}
   */
  const selectTask = (task: TaskItemTypes) => {
    setSelectedTask(task);
  };

  const getTaskList = (url: string) => {
    axios
      .get(`/${url}/${DateReverse(selectedDate)}`)
      .then((res) => {
        console.log("res--->", res.data);

        const completedTasks = res.data.completedTasks?.map((task: any) => {
          return {
            id: task.id,
            lead_title: task.leads_array[0].lead_title,
            name: task.title,
            status: task.status_id,
            due_date: task.leads_array[0].followup_date,
            color: task.color,
            status_name: task.status_name,
            next_status_name: task.next_status_name,
            next_status_color: task.next_status_color,
            lead_id: task.lead_id,
            flag_name: task.flag_name,
            created_at: handleDateFormat(task.created_at),
            is_completed: task.is_completed,
          };
        });

        const pendingTasks = res.data.pendingTasks?.map((task: any) => {
          return {
            id: task.id,
            lead_title: task.leads_array[0].lead_title,
            name: task.title,
            status: task.status_id,
            due_date: task.leads_array[0].followup_date,
            color: task.color,
            status_name: task.status_name,
            next_status_name: task.next_status_name,
            next_status_color: task.next_status_color,
            lead_id: task.lead_id,
            flag_name: task.flag_name,
            created_at: handleDateFormat(task.created_at),
            is_completed: task.is_completed,
          };
        });
        setpendingTasks(pendingTasks);
        setCompletedTasks(completedTasks);
        setTaskArray(pendingTasks.concat(completedTasks));
        setSelectedTask(pendingTasks.length > 0 ? pendingTasks[0] : completedTasks[0]);
      })
      .catch((err) => console.error(err));
  };

  const sendRequest = () => {
    if (userInfo) {
      const { user_id } = JSON.parse(userInfo);

      if (user_id === 1) {
        getTaskList("task_by_date");
      } else {
        getTaskList("task_by_user");
      }
    }
  };

  useEffect(() => {
    sendRequest();
  }, [selectedDate]);

  const getAttachedFiles = () => {
    if (selectedTask?.lead_id) {
      axios.get(`file_upload/${selectedTask?.lead_id}`).then((res: any) => {
        setAttachedFiles(res.data.data);
      });
    }
  };

  useEffect(() => {
    getAttachedFiles();
  }, [selectedTask]);

  const handleUpdateLeadTitle = (taskId: any, fieldName: any, newLeadTitle: any) => {
    console.log("The data", taskId, fieldName, newLeadTitle);

    // Find the selected task in the tasks array and update its lead_title
    const updatedTasks = TaskArray.map((task) => (task.id === taskId ? { ...task, [fieldName]: newLeadTitle } : task));
    console.log("updatedTasks", updatedTasks);

    setTaskArray(updatedTasks);

    // Update the selected task if it matches the updated task
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask });
    }
  };

  const handleUpdateStatus = (taskId: number, status_name: string, color: string, status: string) => {
    const isStatus = status_name?.length > 0;

    const updatedTasks = TaskArray?.map((task) =>
      task.id === taskId ? { ...task, next_status_name: isStatus ? status_name : "", next_status_color: isStatus ? color : "" } : task
    );

    setTaskArray(updatedTasks);

    // Update the selected task if it matches the updated task
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask });
    }
  };

  const handleDateChange = (newDate: any) => {
    // This function is called when the user selects a new date
    const convertedDate = handleDateFormat(newDate);
    setSelectedDate(convertedDate);
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Tasks", path: "/leads/tasks" },
          { label: "Tasks List", path: "/leads/tasks", active: true },
        ]}
        title={"Tasks List"}
      />
      <Row>
        <Col xl={4}>
          <Row>
            <Col>
              <Card>
                <Card.Body style={{ minHeight: "400px" }}>
                  <Row>
                    <Col className="p-0 m-0">
                      {/* className="d-flex align-items-center justify-content-end" */}
                      <div className="btn btn-outline" style={{ position: "absolute", right: "10px", top: "30px", background:"rgba(0,0,0,0.1)" }}>
                        <img src={calender} alt="date logo" width={16.3} className="calender-img" />
                        <ReactDatePicker
                          onChange={handleDateChange}
                          selected={new Date(DateReverse(selectedDate))}
                          dateFormat={"dd-MM-yyyy"}
                          className="custom-react-date-picker"
                        />
                      </div>
                      <div className="mt-2">
                        <TaskSection
                          title={formattedDate}
                          // tasks={TaskList}
                          initialTaskId={selectedTask?.id}
                          // tasks={isToday ? TaskArray.filter((item) => item.is_completed == false) : TaskArray}
                          tasks={pendingTasks}
                          selectTask={selectTask}
                          date={selectedDate}
                          setSelectedDate={setSelectedDate}
                        ></TaskSection>
                      </div>

                      {completedTasks.length > 0 && (
                        <div className="mt-2">
                          <TaskSection
                            title="Completed Task"
                            initialTaskId={selectedTask?.id}
                            tasks={completedTasks}
                            selectTask={selectTask}
                            date={selectedDate}
                            setSelectedDate={setSelectedDate}
                          ></TaskSection>
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xl={8}>
          {TaskArray.length > 0 && (
            <Task
              {...selectedTask}
              getTaskList={sendRequest}
              attachedFiles={attachedFiles}
              getAttachedFiles={getAttachedFiles}
              setTaskArray={setTaskArray}
              pickedDate={pickedDate}
              TaskArray={TaskArray}
              handleUpdateLeadTitle={handleUpdateLeadTitle}
              handleUpdateStatus={handleUpdateStatus}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default TaskList;
