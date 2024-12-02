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

const TasksMaterial = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [initialLoading, setLoading] = useState(true);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [incompleteTasks, setIncompleteTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskItemTypes>(pendingTasks[0]);
  const [selectedDate, setSelectedDate] = useState<any>("");

  const selectTask = (task: TaskItemTypes) => {
    setSelectedTask(task);
    setSelectedTaskId(task?.id);
  };

  const getTaskList = (date: any) => {
    date = date
      ? moment(date).startOf("day").format("YYYY-MM-DD")
      : selectedDate
      ? moment(selectedDate).startOf("day").format("YYYY-MM-DD")
      : moment(new Date()).startOf("day").format("YYYY-MM-DD");

    axios
      .get(`/tasks`, { params: { date: date } })
      .then((res) => {
        let pendingArray: any = [];
        res.data.data.map((item: any) => {
          if (!item.isCompleted) {
            pendingArray.push(item);
          }
        });
        setPendingTasks(pendingArray);
        setIncompleteTasks(res.data?.pendingTasks);

        if (selectedTaskId) {
          const pendingSelected = pendingArray?.filter((item: any) => item.id == selectedTaskId);
          setSelectedTask(pendingSelected[0]);
        } else {
          setSelectedTask(pendingArray[0]);
        }
        setLoading(false);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getTaskList(new Date());
  }, []);

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Tasks", path: "/leads/tasks" },
          { label: "Inbox", path: "/leads/tasks", active: true },
        ]}
        title={"Inbox"}
      />
      <Row>
        <Col xl={4}>
          <Row>
            <Col>
              <Card>
                <Card.Body style={{ minHeight: "68vh" }}>
                  <Row className="pb-2" style={{ borderBottom: "1.3px solid #70707033" }}>
                    <Col>
                      <h5 className=" text-secondary" style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: "16px" }}>
                        Task List{" "}
                        <span className="text-danger" style={{ fontWeight: 500, fontSize: "14px" }}>
                          ({pendingTasks?.length})
                        </span>
                      </h5>
                    </Col>
                    <Col className="d-flex align-items-center justify-content-end">
                      <img
                        src={calender}
                        alt="date logo"
                        width={16.3}
                        className="calender-img"
                        style={{ paddingBottom: "3px" }}
                      />
                      <ReactDatePicker
                        minDate={new Date()}
                        onChange={(date) => [setSelectedDate(date), getTaskList(date)]}
                        selected={selectedDate || new Date()}
                        dateFormat={"dd-MM-yyyy"}
                        onKeyDown={(e) => e.preventDefault()}
                        className="custom-react-date-picker"
                      />
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col className="p-0 m-0">
                      <div className="mt-0">
                        <TaskSectionMaterial
                          title={"Past"}
                          initialTaskId={selectedTask?.id}
                          tasks={incompleteTasks || []}
                          selectTask={selectTask}
                          date={""}
                          initialLoading={initialLoading}
                          setSelectedDate={function (value: React.SetStateAction<string>): void {
                            setSelectedDate(value);
                            getTaskList(value);
                          }}
                        ></TaskSectionMaterial>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="p-0 m-0 mt-3">
                      <div className="mt-0">
                        <TaskSectionMaterial
                          title={"Today"}
                          initialTaskId={selectedTask?.id}
                          tasks={pendingTasks || []}
                          selectTask={selectTask}
                          date={""}
                          initialLoading={initialLoading}
                          setSelectedDate={function (value: React.SetStateAction<string>): void {
                            setSelectedDate(value);
                            getTaskList(value);
                          }}
                        ></TaskSectionMaterial>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xl={8} className="task_section">
          {selectedTask && (
            <StudentDetailsMaterial
              studentId={selectedTask?.studentId}
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
