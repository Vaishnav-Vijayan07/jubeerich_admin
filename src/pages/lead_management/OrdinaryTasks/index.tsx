import React, { useEffect, useState } from "react";
import { Row, Col, Dropdown, Card, Modal, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

// components
import PageTitle from "../../../components/PageTitle";
import TaskSection from "./Section";
import Task from "./Task";

// dummy data
import { actionTypes, TaskItemTypes, taskPriorityTypes, taskStatusTypes } from "./data";
import axios from "axios";
import { FormInput } from "../../../components";
import Select, { ActionMeta, OptionsType } from "react-select";
import { showErrorAlert, showSuccessAlert } from "../../../constants";
import moment from "moment";
import { format } from "path";

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

  const Type = {
    Status: 'status',
    Priority: 'priority'
  }

  const [todayTask, setTodayTask] = useState([]);
  const [upcomingTask, setUpcomingTask] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);
  const [expiredTask, setExpiredTask] = useState([]);
  const [selectedTask, setSelectedTask] = useState<TaskItemTypes>(todayTask[0]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [taskFormData, setTaskFormData] = useState<any>(initialTaskFormState);
  const [selectedPriority, setselectedPriority] = useState<any>(null);
  const [selectedStatus, setselectedStatus] = useState<any>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isTaskLoading, setIsTaskLoading] = useState(false)
  const baseUrl = '/ordinary_task'

  const getAllTasks = async () => {
    try {
      const tasks = await axios.get('ordinary_task')
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

  const handleInputSelect = (selected: any,  { name }: any) => {
    setTaskFormData((prev: any) => ({
      ...prev,
      [name]: selected?.value
    }))

    switch (name) {
      case 'priority':
        setselectedPriority(selected);
        break;
      case 'status':
        setselectedStatus(selected);
        break
      default:
        break;
    }
  }

  const handleResetValues = () => {
    setTaskFormData(initialTaskFormState);
    setselectedPriority(null)
    setselectedStatus(null)
    setIsUpdate(false)
  }

  const onSubmit = async() => {
    try {
      setIsTaskLoading(true)
      const userId = sessionStorage.getItem('jb_user');
      const userDetails = userId ? JSON.parse(userId) : '';

      if(!isUpdate) {
        let formattedData = { ...taskFormData, user_id: userDetails.user_id }
  
        const result = await axios.post(`${baseUrl}`, formattedData);
        if(result?.status){
          showSuccessAlert('Task Created Succesfully');
          handleResetValues();
          toggleModal();
          setIsTaskLoading(false);
          getAllTasks()
        } 
      } else {
        let formattedData = { ...taskFormData, user_id: userDetails.user_id }
  
        const result = await axios.put(`${baseUrl}/${taskFormData?.id}`, formattedData);
        if(result?.status){
          showSuccessAlert('Task Updated Succesfully');
          setIsUpdate(false);
          handleResetValues();
          toggleModal();
          setIsTaskLoading(false);
          getAllTasks()
        } 
      }
    } catch (error) {
      showErrorAlert('Task Error')
      console.log(error);
    }
  }

  const handleDropdownUpdate = (value: string, type: string) => {
    switch (type) {
      case Type.Status:
        const filteredStatus = taskStatusTypes.filter((data: any) => data.value == value);
        setselectedStatus(filteredStatus[0])
        break;
      case Type.Priority:
        const filteredPriority = taskPriorityTypes.filter((data: any) => data.value == value);
        setselectedPriority(filteredPriority[0])
        break;
      default:
        break;
    }
  }

  const deleteTask = async(id: any) => {
    try {
      setIsTaskLoading(true);
      const result = await axios.delete(`${baseUrl}/${id}`);
      if (result?.status) {
        showSuccessAlert('Task Deleted Succesfully');
        handleResetValues();
        setIsTaskLoading(false);
        getAllTasks()
      }
    } catch (error) {
      showErrorAlert('Task Error')
      console.log(error);
    }
  }

  const actionFunction = (item: any, action: string) => {

    switch (action) {
      case actionTypes.update:
        setTaskFormData((prev: any)=> ({
          ...prev,
          id: item?.id,
          title: item?.title,
          description: item?.description,
          status: item?.status,
          priority: item?.priority,
          due_date: moment(item?.due_date).format('YYYY-MM-DD')
        }));

        handleDropdownUpdate(item.status, Type.Status);
        handleDropdownUpdate(item.priority, Type.Priority);
        setIsUpdate(true);
        toggleModal();
        break;
      case actionTypes.delete:
        deleteTask(item?.id);
        break;
      default:
        break;
    }
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
        <Col xl={8}>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Row style={{ display: "flex", justifyContent: "end" }}>
                    <Col sm={3} md={3} lg={3}>
                      <Link onClick={toggleModal}
                        to="#"
                        className="btn btn-primary waves-effect waves-light"
                      >
                        <i className="fe-plus me-1" style={{margin: "0px !important"}}></i>Add New
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
                          actionFunction={actionFunction}
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
                    <Modal.Header closeButton>
                      <h4 className="modal-title">{ isUpdate ? 'Update' : 'Add' } Task</h4>
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
                          type="textarea"
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
                        <Form.Group className="mb-3" controlId="status">
                          <Form.Label>Status</Form.Label>
                          <Select
                            className="react-select react-select-container select-wrapper"
                            classNamePrefix="react-select"
                            name="status"
                            options={[{ value: null, label: "All" }, ...taskStatusTypes]}
                            value={selectedStatus}
                            onChange={handleInputSelect}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="priority">
                          <Form.Label>Priority</Form.Label>
                          <Select
                            className="react-select react-select-container select-wrapper"
                            classNamePrefix="react-select"
                            name="priority"
                            options={[{ value: null, label: "All" }, ...taskPriorityTypes]}
                            value={selectedPriority}
                            onChange={handleInputSelect}
                          />
                        </Form.Group>
                      </Col>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button className="btn btn-danger" onClick={() => [handleResetValues(), toggleModal()]}>Close</Button>
                      <Button className="btn btn-primary" disabled={isTaskLoading} onClick={onSubmit}>{ isUpdate ? 'Update' : 'Submit' }</Button>
                    </Modal.Footer>
                  </Modal>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xl={4}>
          <Task {...selectedTask} />
        </Col>
      </Row>
    </>
  );
};

export default TaskList;
