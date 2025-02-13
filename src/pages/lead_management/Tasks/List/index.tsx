import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";

// components
import PageTitle from "../../../../components/PageTitle";

import TaskSection from "./Section";

// dummy data
import { TaskItemTypes } from "./data";
import axios from "axios";
import StudentDetails from "./StudentDetails";
import SkeletonComponent from "./StudyPreference/LoadingSkeleton";
import moment from "moment";

// Task List
const TaskList = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [initialLoading, setLoading] = useState(true);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskItemTypes>(pendingTasks[0]);
  const [taskFilterDate, setTaskFilterDate] = useState<any>("");

  const selectTask = (task: TaskItemTypes) => {
    setSelectedTask(task);
    setSelectedTaskId(task?.id);
  };

  const getTaskList = (date: any) => {
    date = moment(date).startOf("day").format("YYYY-MM-DD");

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
          // { label: "Tasks", path: "/leads/tasks" },
          { label: "Inbox", path: "/leads/tasks", active: true },
        ]}
        title={"Inbox"}
      />
      <Row>
        <Col xl={5}>
          <Row>
            <Col>
              <Card>
                <Card.Body style={{ minHeight: "480px" }}>
                  <Row>
                    <Col className="p-0 m-0">
                      <div className="mt-0">
                        <TaskSection
                          // title={formattedDate}
                          title={"Task List"}
                          initialTaskId={selectedTask?.id}
                          tasks={pendingTasks}
                          selectTask={selectTask}
                          date={""}
                          initialLoading={initialLoading}
                          setSelectedDate={function (value: React.SetStateAction<string>): void {
                            console.log(value);
                            getTaskList(value);
                          }}
                        ></TaskSection>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xl={7}>
          {selectedTask && (
            <StudentDetails
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

export default TaskList;
