import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";

// components
import PageTitle from "../../../../components/PageTitle";

import TaskSection from "./Section";

// dummy data
import { TaskItemTypes } from "./data";
import axios from "axios";
import StudentDetails from "./StudentDetails";

// Task List
const TaskList = () => {
  const [TaskArray, setTaskArray] = useState<TaskItemTypes[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskItemTypes>(TaskArray[0]);
  const [initialLoading, setLoading] = useState(false);
  const [pendingTasks, setpendingTasks] = useState<any[]>([]);

  const selectTask = (task: TaskItemTypes) => {
    setSelectedTask(task);
  };

  const getTaskList = () => {
    setLoading(true);
    axios
      .get(`/tasks`)
      .then((res) => {
        let pendingArray: any = [];
        let completedArray: any = [];
        res.data.data.map((item: any) => {
          if (!item.isCompleted) {
            pendingArray.push(item);
          } else {
            completedArray.push(item);
          }
        });
        // setSelectedTask(res.data.data[0]);
        // setTaskArray(res.data.data);
        // setpendingTasks(res.data.data);
        setpendingTasks(pendingArray);
        setTaskArray(completedArray);
        setSelectedTask(pendingArray[0]);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getTaskList();
  }, []);

  console.log("selectedTask========>", selectedTask);

  // if (initialLoading) {
  //   return (
  //     <Spinner
  //       animation="border"
  //       style={{ position: "absolute", top: "50%", left: "50%" }}
  //     />
  //   );
  // }

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
                      <div className="mt-0">
                        <TaskSection
                          // title={formattedDate}
                          title={"Pending Tasks"}
                          initialTaskId={selectedTask?.id}
                          tasks={pendingTasks}
                          selectTask={selectTask}
                          date={""}
                          setSelectedDate={function (
                            value: React.SetStateAction<string>
                          ): void {
                            throw new Error("Function not implemented.");
                          }}
                        ></TaskSection>
                      </div>

                      {TaskArray.length > 0 && (
                        <div className="mt-2">
                          <TaskSection
                            title="Completed Task"
                            initialTaskId={selectedTask?.id}
                            tasks={TaskArray}
                            selectTask={selectTask}
                            date={""}
                            setSelectedDate={function (
                              value: React.SetStateAction<string>
                            ): void {
                              throw new Error("Function not implemented.");
                            }}
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
          {selectedTask && (
            <StudentDetails
              studentId={selectedTask?.studentId}
              taskId={selectedTask?.id}
              getTaskList={getTaskList}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default TaskList;
