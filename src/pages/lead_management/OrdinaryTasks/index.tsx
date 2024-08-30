import React, { useEffect, useState } from "react";
import { Row, Col, Dropdown, Card, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

// components
import PageTitle from "../../../components/PageTitle";
import TaskSection from "./Section";
import Task from "./Task";

// dummy data
import { TaskItemTypes, taskPriorityTypes, taskStatusTypes } from "./data";
import axios from "axios";
import { FormInput } from "../../../components";
import Select, { ActionMeta, OptionsType } from "react-select";

// Task List
const TaskList = () => {
  const initialTaskFormState = {
    id: "",
    title: "",
    description: "",
    status: "",
    due_date: "",
    priority: "",
  }

  const [todayTask, setTodayTask] = useState([]);
  const [upcomingTask, setUpcomingTask] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);
  const [expiredTask, setExpiredTask] = useState([]);
  const [selectedTask, setSelectedTask] = useState<TaskItemTypes>(todayTask[0]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [taskFormData, setTaskFormData] = useState<any>(initialTaskFormState);

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

  const toggleModal = () => {
    setShowModal(!showModal);
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setTaskFormData((prev: any) => ({
      ...prev, [name]: value
    }))
  }

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
                      <Link onClick={toggleModal}
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
                  <Modal show={showModal} onHide={toggleModal} dialogClassName="modal-dialog-centered">
                    <Modal.Header>
                      <h4 className="modal-title">Add Task</h4>
                    </Modal.Header>
                    <Modal.Body>
                      <Col className="col-auto">
                        <FormInput
                          label="Name"
                          type="text"
                          name="title"
                          placeholder="Enter task name"
                          value={taskFormData.title}
                          onChange={handleInputChange}
                          containerClass={"mb-3"}
                        />
                        <FormInput
                          label="Description"
                          type="text"
                          name="description"
                          placeholder="Enter description"
                          value={taskFormData.description}
                          onChange={handleInputChange}
                          containerClass={"mb-3"}
                        />
                        <FormInput
                          label="Due Date"
                          type="date"
                          name="due_date"
                          placeholder="Choose Date"
                          value={taskFormData.due_date}
                          onChange={handleInputChange}
                          containerClass={"mb-3"}
                        />
                        <FormInput
                          label="Priority"
                          type="text"
                          name="priority"
                          placeholder="Choose priority"
                          value={taskFormData.priority}
                          onChange={handleInputChange}
                          containerClass={"mb-3"}
                        />
                        <Form.Group className="mb-3" controlId="status">
                          <Form.Label>Status</Form.Label>
                          <Select
                            // styles={customStyles}
                            className="react-select react-select-container select-wrapper"
                            classNamePrefix="react-select"
                            name="status"
                            options={[{ value: null, label: "All" }, ...taskStatusTypes]}
                            value={taskFormData.status}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="priority">
                          <Form.Label>Priority</Form.Label>
                          <Select
                            // styles={customStyles}
                            className="react-select react-select-container select-wrapper"
                            classNamePrefix="react-select"
                            name="priority"
                            options={[{ value: null, label: "All" }, ...taskPriorityTypes]}
                            value={taskFormData.priority}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Modal.Body>
                  </Modal>
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
