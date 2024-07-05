import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import moment from "moment";

// components
import PageTitle from "../../../../components/PageTitle";

import TaskSection from "./Section";

// dummy data
import { TaskItemTypes } from "./data";
import axios from "axios";
import { AUTH_SESSION_KEY, DateReverse, handleDateFormat } from "../../../../constants";
import ReactDatePicker from "react-datepicker";
import calender from "../../../../assets/images/icons/calendar.svg";
import StudentDetails from "./StudentDetails";
import { useDispatch } from "react-redux";

// Task List
const TaskList = () => {
  const dispatch = useDispatch();
  const [TaskArray, setTaskArray] = useState<TaskItemTypes[]>([]);
  // const [selectedTask, setSelectedTask] = useState<TaskItemTypes>(TaskList[0]);
  const [selectedTask, setSelectedTask] = useState<TaskItemTypes>(TaskArray[0]);
  const [selectedDate, setSelectedDate] = useState(handleDateFormat(new Date()));
  const [pickedDate, setPickedDate] = useState(new Date()); // Replace with your selected date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [isToday, setIsToday] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setpendingTasks] = useState([]);

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
      const suffix =
        day % 10 === 1 && day !== 11
          ? "st"
          : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
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

  const getTaskList = () => {
    axios
      .get(`/tasks`)
      .then((res) => {
        setpendingTasks(res.data.data);
        setTaskArray(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getTaskList();
  }, [selectedDate]);

  const handleDateChange = (newDate: any) => {
    // This function is called when the user selects a new date
    const convertedDate = handleDateFormat(newDate);
    setSelectedDate(convertedDate);
  };

  console.log("selectedTask========>", selectedTask);

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
                      <div
                        className="btn btn-outline"
                        style={{ position: "absolute", right: "10px", top: "30px", background: "rgba(0,0,0,0.1)" }}
                      >
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
                          initialTaskId={selectedTask?.id}
                          tasks={pendingTasks}
                          selectTask={selectTask}
                          date={selectedDate}
                          setSelectedDate={setSelectedDate}
                        ></TaskSection>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xl={8}>
          {selectedTask && (
            <StudentDetails studentId={selectedTask?.studentId} taskDetails={selectedTask} />
          )}
        </Col>
      </Row>
    </>
  );
};

export default TaskList;
