import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import PageTitle from "../../../../components/PageTitle";
import axios from "axios";
import moment from "moment";
import { TaskItemTypes } from "../../../lead_management/Tasks/List/data";
import TaskSectionMaterial from "./TaskSectionMaterial";
import StudentDetailsMaterial from "./StudentDetailsMaterial";

const TasksMaterial = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [initialLoading, setLoading] = useState(true);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskItemTypes>(pendingTasks[0]);
  const [taskFilterDate, setTaskFilterDate] = useState<any>('')
  const [selectedDate, setSelectedDate] = useState<any>('')

  const selectTask = (task: TaskItemTypes) => {
    setSelectedTask(task);
    setSelectedTaskId(task?.id);
  };

  const getTaskList = (date: any) => {
    date = date ? moment(date).startOf('day').format('YYYY-MM-DD') : (selectedDate ? moment(selectedDate).startOf('day').format('YYYY-MM-DD') : moment(new Date()).startOf('day').format('YYYY-MM-DD'));

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
          { label: "Tasks", path: "/leads/tasks" },
          { label: "Tasks List", path: "/leads/tasks", active: true },
        ]}
        title={"Tasks List"}
      />
      <Row>
        <Col xl={5}>
          <Row>
            <Col>
              <Card>

                <Card.Body style={{ minHeight: "68vh", maxHeight: "68vh" }}>
                  <Row>
                    <Col className="p-0 m-0">
                      <div className="mt-0">
                        <TaskSectionMaterial
                          title={"Pending Tasks"}
                          initialTaskId={selectedTask?.id}
                          tasks={pendingTasks}
                          selectTask={selectTask}
                          date={""}
                          initialLoading={initialLoading}
                          setSelectedDate={function (value: React.SetStateAction<string>): void {
                            setSelectedDate(value)
                            getTaskList(value)
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

        <Col xl={7} className="">
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
}

export default TasksMaterial