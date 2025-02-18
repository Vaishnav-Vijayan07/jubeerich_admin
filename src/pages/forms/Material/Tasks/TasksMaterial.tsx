import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import PageTitle from "../../../../components/PageTitle";
import axios from "axios";
import moment from "moment";
import { TaskItemTypes } from "../../../lead_management/Tasks/List/data";
import TaskSectionMaterial from "./TaskSectionMaterial";
import StudentDetailsMaterial from "./StudentDetailsMaterial";
import ReactDatePicker from "react-datepicker";
import calender from "../../../../assets/images/icons/calendar.svg";
import { showErrorAlert } from "../../../../constants";
import "react-datepicker/dist/react-datepicker.css";
import { APICore } from "../../../../helpers/api/apiCore";

const TasksMaterial = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [initialLoading, setLoading] = useState(true);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [incompleteTasks, setIncompleteTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskItemTypes>(pendingTasks[0]);
  const [selectedDate, setSelectedDate] = useState<any>("");
  const [taskPrefix, setTaskPrefix] = useState<string>("");
  const [collapseState, setCollapseState] = useState(false);

  const selectTask = (task: TaskItemTypes) => {
    setSelectedTask(task);
    setSelectedTaskId(task?.id);
  };

  // const getTaskList = (date: any) => {
  //   date = date
  //     ? moment(date).startOf("day").format("YYYY-MM-DD")
  //     : selectedDate
  //     ? moment(selectedDate).startOf("day").format("YYYY-MM-DD")
  //     : moment(new Date()).startOf("day").format("YYYY-MM-DD");

  //   axios
  //     .get(`/tasks`, { params: { date: date } })
  //     .then((res) => {
  //       console.log("res.data.data ==>", res.data);

  //       let pendingArray: any = [];
  //       let pastArray: any = [];
  //       res.data.data.map((item: any) => {
  //         if (!item.isCompleted) {
  //           pendingArray.push(item);
  //         }
  //       });

  //       res.data.pendingTasks.map((item: any) => {
  //         pastArray.push(item);
  //       });
  //       setPendingTasks(pendingArray);
  //       setIncompleteTasks(pastArray);

  //       if (selectedTaskId) {
  //         const pendingSelected =
  //           pendingArray?.filter((item: any) => item.id == selectedTaskId) ||
  //           pastArray?.filter((item: any) => item?.id == selectedTaskId);

  //         if (pendingSelected == null) {
  //           setSelectedTask(pendingSelected[0]);
  //         }
  //       } else {
  //         // setSelectedTask(pendingArray[0]);
  //         if (pendingArray?.length > 0) {
  //           setSelectedTask(pendingArray[0]);
  //         } else {
  //           setSelectedTask(pastArray[0]);
  //         }
  //       }
  //       setLoading(false);
  //     })
  //     .catch((err) => console.error(err))
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  const getTaskList = (date: any, resetSelectedId: boolean = false) => {
    // Resolve the date to fetch tasks for
    const resolvedDate = moment(date || selectedDate || new Date())
      .startOf("day")
      .format("YYYY-MM-DD");

    setLoading(true);

    axios
      .get(`/tasks`, { params: { date: resolvedDate } })
      .then(({ data }) => {
        const tasks = data?.data || [];
        const pendingTasks = tasks.filter((task: any) => !task.isCompleted);
        const pastTasks = data?.pendingTasks || [];

        setPendingTasks(pendingTasks);
        setIncompleteTasks(pastTasks);

        // Toggle collapse state based on pending tasks
        setCollapseState(pendingTasks.length === 0);

        // Resolve the selected task
        const selectedTask =
          selectedTaskId && !resetSelectedId
            ? [...pendingTasks, ...pastTasks].find((task: any) => task.id === selectedTaskId)
            : pendingTasks[0] || pastTasks[0];

        setSelectedTask(selectedTask || null);
      })
      .catch((error) => {
        console.error("Error fetching task list:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getTaskList(new Date());
  }, []);

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
    getTaskPrefix();
  }, []);

  const api = new APICore();
  const loggedInUser = api.getLoggedInUser();

  const { name } = loggedInUser;

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          // { label: "Tasks", path: "/leads/tasks" },
          { label: "Inbox", path: "/leads/tasks", active: true },
        ]}
        title={"Inbox"}
      />
      <h4 className="m-0 mb-3 mt-1 inter-font" style={{ fontSize: "19px", fontWeight: "400" }}>
        Good Day, {name} ! Here's your to-do list for a productive day !
      </h4>
      <Row>
        <Col xl={4} className="mb-3">
          <Row>
            <Col>
              <div className="inbox__list">
                <div className="inbox__list_header">
                  <h5 className="text-secondary" style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: "16px" }}>
                    Task List{" "}
                    <span className="text-danger" style={{ fontWeight: 500, fontSize: "14px" }}>
                      ({pendingTasks?.length})
                    </span>
                  </h5>

                  <div className="calender__container">
                    <div className="calender_img_container">
                      <img src={calender} alt="date logo" width={16.3} className="calender-img" />
                    </div>
                    <ReactDatePicker
                      minDate={new Date()}
                      onChange={(date) => [setSelectedDate(date), getTaskList(date)]}
                      selected={selectedDate || new Date()}
                      dateFormat={"dd-MM-yyyy"}
                      onKeyDown={(e) => e.preventDefault()}
                      className="custom-react-date-picker"
                    />
                  </div>
                </div>

                <div className="inbox__list_body">
                  <div className="task__list_wrapper">
                    <TaskSectionMaterial
                      taskPrefix={taskPrefix}
                      title={"Past"}
                      initialTaskId={selectedTask?.id}
                      tasks={incompleteTasks || []}
                      selectTask={selectTask}
                      initialLoading={initialLoading}
                      setSelectedDate={function (value: React.SetStateAction<string>): void {
                        setSelectedDate(value);
                        getTaskList(value);
                      }}
                      collapseState={collapseState}
                    ></TaskSectionMaterial>
                  </div>

                  <div className="task__list_wrapper">
                    <TaskSectionMaterial
                      taskPrefix={taskPrefix}
                      title={"Today"}
                      initialTaskId={selectedTask?.id}
                      tasks={pendingTasks || []}
                      selectTask={selectTask}
                      initialLoading={initialLoading}
                      setSelectedDate={function (value: React.SetStateAction<string>): void {
                        setSelectedDate(value);
                        getTaskList(value);
                      }}
                      collapseState={true}
                    ></TaskSectionMaterial>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Col>

        {console.log(selectedTask)}

        <Col xl={8} className="task_section">
          {selectedTask && (
            <StudentDetailsMaterial
              studentId={selectedTask?.studentId}
              office_type={selectedTask?.student_name?.office_type}
              // region={selectedTask?.student_name?.region_name ? selectedTask?.student_name?.region_name?.id : ""}
              region={selectedTask?.student_name?.region_id}
              taskId={selectedTask?.id}
              getTaskList={getTaskList}
              setPendingTasks={setPendingTasks}
              initialLoading={initialLoading}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default TasksMaterial;
