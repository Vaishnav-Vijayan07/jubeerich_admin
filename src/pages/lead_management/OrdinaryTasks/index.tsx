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
import { withSwal } from "react-sweetalert2";
import * as yup from 'yup';

// Task List
const TaskList = withSwal(({ swal }: any) => {
  const initialTaskFormState = {
    id: "",
    title: "",
    description: "",
    status: "pending",
    due_date: "",
    priority: "",
  }

  const initialTaskFormValidationError = {
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
  const [selectedStatus, setselectedStatus] = useState<any>({ label: "Pending", value: "pending" });
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isTaskLoading, setIsTaskLoading] = useState(false);
  const [isValidationError, setIsValidationError] = useState(initialTaskFormValidationError);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [clearForm, setClearForm] = useState<boolean>(true)
  const baseUrl = '/ordinary_task';

  const ValidationSchema = yup.object().shape({
    title: yup.string().min(3, "Title must be valid").required("Title is required"),
    description: yup.string().nullable(),
    due_date: yup.string().required("Due date is required"),
    priority: yup.string().required("Priority is required"),
    status: yup.string().required("Status is required")
  })

  const getAllTasks = async () => {
    try {
      const tasks = await axios.get('ordinary_task')
      setTodayTask(tasks?.data?.data?.todaysTasks)
      // setSelectedTask(tasks?.data?.data?.todaysTasks[0])
      setSelectedTask(tasks?.data?.data?.todaysTasks)
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
    setSelectedTaskId(task?.id)
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

  const handleInputSelect = (selected: any, { name }: any) => {
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

  const onSubmit = async () => {
    try {

      await ValidationSchema.validate(taskFormData, { abortEarly: false })

      setIsTaskLoading(true);
      const userId = sessionStorage.getItem('jb_user');
      const userDetails = userId ? JSON.parse(userId) : '';

      const confirmResult = await swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: isUpdate ? "Yes, update it!" : "Yes, Create",
      });

      if (confirmResult.isConfirmed) {
        let formattedData = { ...taskFormData, user_id: userDetails.user_id };

        let result;
        if (!isUpdate) {
          result = await axios.post(`${baseUrl}`, formattedData);
          if (result?.status) {
            showSuccessAlert('Todo Created Successfully');
          }
        } else {
          result = await axios.put(`${baseUrl}/${taskFormData?.id}`, formattedData);
          if (result?.status) {
            showSuccessAlert('Todo Updated Successfully');
            setIsUpdate(false);
          }
        }

        if (result?.status) {
          handleResetValues();
          toggleModal();
          getAllTasks();
        }
      }

      setIsTaskLoading(false);
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        const errors: any = {};
        validationError.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        showErrorAlert('Todo Error');
        setIsTaskLoading(false);
        setIsValidationError(errors);
      }
      // showErrorAlert('Todo Error');
      // console.error(error);
      // setIsTaskLoading(false); // Ensure loading is stopped in case of error
    }
  };

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

  const deleteTask = async (id: any) => {
    try {
      setIsTaskLoading(true);
      const result = await axios.delete(`${baseUrl}/${id}`);
      if (result?.status) {
        showSuccessAlert('Todo Deleted Succesfully');
        handleResetValues();
        setIsTaskLoading(false);
        getAllTasks();
      }
    } catch (error) {
      showErrorAlert('Todo Error')
      console.log(error);
    }
  }

  const actionFunction = (item: any, action: string) => {

    switch (action) {
      case actionTypes.update:
        setTaskFormData((prev: any) => ({
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

  const updateStatus = async (form: any, selected: any) => {
    try {
      let formattedData = {
        id: form?.id,
        title: form?.title,
        description: form?.description,
        status: selected?.value,
        due_date: form?.due_date,
        priority: form?.priority,
        user_id: form.user_id
      }

      const result = await axios.put(`/ordinary_task/${form?.id}`, formattedData);

      if (result) {
        showSuccessAlert('Status Updated Successfully');
        getAllTasks();
        setSelectedTask(todayTask[0]);
        setClearForm((prev) => !prev);
        setSelectedTaskId('');
      }
    } catch (error) {
      console.log(error);
      showErrorAlert(error)
    }


  }

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Todo", path: "/apps/tasks/list" },
          { label: "Todo List", path: "/apps/tasks/list", active: true },
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
                        <i className="fe-plus me-1" style={{ margin: "0px !important" }}></i>Add New
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
                          actionFunction={actionFunction}
                          selectedTaskId={selectedTaskId}
                        ></TaskSection>
                      </div>
                      <div className="mt-4">
                        <TaskSection
                          title="Upcoming"
                          tasks={upcomingTask}
                          selectTask={selectTask}
                          actionFunction={actionFunction}
                          selectedTaskId={selectedTaskId}
                        ></TaskSection>
                      </div>
                      <div className="mt-4 mb-4">
                        <TaskSection
                          title="Completed"
                          tasks={completedTask}
                          selectTask={selectTask}
                          actionFunction={actionFunction}
                          selectedTaskId={selectedTaskId}
                        ></TaskSection>
                      </div>
                      <div className="mt-4 mb-4">
                        <TaskSection
                          title="Expired"
                          tasks={expiredTask}
                          selectTask={selectTask}
                          actionFunction={actionFunction}
                          selectedTaskId={selectedTaskId}
                        ></TaskSection>
                      </div>
                    </Col>
                  </Row>
                  <Modal show={showModal} onHide={toggleModal} dialogClassName="modal-dialog-centered">
                    <Modal.Header closeButton>
                      <h4 className="modal-title">{isUpdate ? 'Update' : 'Add'} Todo</h4>
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
                        {isValidationError.title && <Form.Text className="text-danger">{isValidationError.title}</Form.Text>}
                        <FormInput
                          label="Description"
                          type="textarea"
                          name="description"
                          placeholder="Enter description"
                          value={taskFormData.description}
                          onChange={handleInputChange}
                          containerClass={"mb-3"}
                        />
                        {isValidationError.description && <Form.Text className="text-danger">{isValidationError.description}</Form.Text>}
                        <FormInput
                          label="Due Date"
                          type="date"
                          name="due_date"
                          placeholder="Choose Date"
                          value={taskFormData.due_date}
                          onChange={handleInputChange}
                          containerClass={"mb-3"}
                        />
                        {isValidationError.due_date && <Form.Text className="text-danger">{isValidationError.due_date}</Form.Text>}
                        {isUpdate && <Form.Group className="mb-3" controlId="status">
                          <Form.Label>Status</Form.Label>
                          <Select
                            className="react-select react-select-container select-wrapper"
                            classNamePrefix="react-select"
                            name="status"
                            options={[{ value: null, label: "All" }, ...taskStatusTypes]}
                            value={selectedStatus}
                            onChange={handleInputSelect}
                          />
                        </Form.Group>}
                        {isValidationError.status && <Form.Text className="text-danger">{isValidationError.status}</Form.Text>}
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
                        {isValidationError.priority && <Form.Text className="text-danger">{isValidationError.priority}</Form.Text>}
                      </Col>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button className="btn btn-danger" onClick={() => [handleResetValues(), toggleModal()]}>Close</Button>
                      <Button className="btn btn-primary" disabled={isTaskLoading} onClick={onSubmit}>{isUpdate ? 'Update' : 'Submit'}</Button>
                    </Modal.Footer>
                  </Modal>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xl={4}>
          {/* <Task  task={selectedTask} updateStatus={updateStatus} /> */}
          <Task clearForm={clearForm} task={selectedTask} updateStatus={updateStatus} />
        </Col>
      </Row>
    </>
  );
});

export default TaskList;
