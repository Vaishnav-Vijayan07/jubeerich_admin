import React, { useEffect, useState } from "react";
import { Row, Col, Dropdown, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

// components
import PageTitle from "../../../components/PageTitle";
import TaskSection from "./Section";
import Task from "./Task";

// dummy data
import { TaskItemTypes } from "./data";
import axios from "axios";

// Task List
const TaskList = () => {
  const [todayTask, setTodayTask] = useState([]);
  const [upcomingTask, setUpcomingTask] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);
  const [expiredTask, setExpiredTask] = useState([]);
  const [selectedTask, setSelectedTask] = useState<TaskItemTypes>(todayTask[0]);  

  const getAllTasks = async () => {
    try {
      const tasks = await axios.get('ordinary_task')
      console.log("tasks ==>", tasks.data.data);
      setTodayTask(tasks?.data?.data?.todaysTasks)
      setSelectedTask(tasks?.data?.data?.todaysTasks[0])
      setUpcomingTask(tasks?.data?.data?.upcomingTasks)
      setCompletedTask(tasks?.data?.data?.completedTasks)
      setExpiredTask(tasks?.data?.data?.expiredTasks)
    } catch (err) {
      console.log("error:", err);
    }
  }

  useEffect(() => {
    getAllTasks()
  }, [])


  const selectTask = (task: TaskItemTypes) => {
    setSelectedTask(task);
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Tasks", path: "/apps/tasks/list" },
          { label: "Tasks List", path: "/apps/tasks/list", active: true },
        ]}
        title={"Tasks List"}
      />
      <Row>
        <Col xl={7}>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Row style={{ display: "flex", justifyContent: "end" }}>
                    <Col sm={3}>
                      <Link
                        to="#"
                        className="btn btn-primary waves-effect waves-light"
                      >
                        <i className="fe-plus me-1"></i>Add New
                      </Link>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col>
                      {/* tasks */}
                      <div>
                        <TaskSection
                          title="Today"
                          tasks={todayTask}
                          selectTask={selectTask}
                        ></TaskSection>
                      </div>
                      <div className="mt-4">
                        <TaskSection
                          title="Upcoming"
                          tasks={upcomingTask}
                          selectTask={selectTask}
                        ></TaskSection>
                      </div>
                      <div className="mt-4 mb-4">
                        <TaskSection
                          title="Completed"
                          tasks={completedTask}
                          selectTask={selectTask}
                        ></TaskSection>
                      </div>
                      <div className="mt-4 mb-4">
                        <TaskSection
                          title="Expired"
                          tasks={expiredTask}
                          selectTask={selectTask}
                        ></TaskSection>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xl={5}>
          <Task {...selectedTask} />
        </Col>
      </Row>
    </>
  );
};

export default TaskList;
