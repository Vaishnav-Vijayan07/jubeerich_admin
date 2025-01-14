import React, { Suspense, useEffect, useState } from 'react'
import PageTitle from '../../../components/PageTitle'
import { Button, Card, Col, Form, Nav, Row, Spinner, Tab } from 'react-bootstrap'
import { FormInput } from '../../../components'
import TaskTodoList from './TaskTodoList'
import axios from 'axios'
import { showErrorAlert, showSuccessAlert } from '../../../constants'
import * as yup from 'yup';

const TaskTodo = () => {

    const taskNameSchema = yup.string().min(4, "Minimum 4 characters needed").required('Task Name is required');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [taskName, setTaskName] = useState<string>('')
    const [activeTab, setActiveTab] = useState<any>('all');
    const [todayTask, setTodayTask] = useState([]);
    const [upcomingTask, setUpcomingTask] = useState([]);
    const [completedTask, setCompletedTask] = useState([]);
    const [expiredTask, setExpiredTask] = useState([]);
    const [allTask, setAllTask] = useState([]);
    const [validationErrors, setValidationErrors] = useState({ name: '' });


    const getAllTasks = async () => {
        setIsLoading(true)
        try {
            const tasks = await axios.get("ordinary_task");
            setTodayTask(tasks?.data?.data?.todaysTasks);
            setUpcomingTask(tasks?.data?.data?.upcomingTasks);
            setCompletedTask(tasks?.data?.data?.completedTasks);
            setExpiredTask(tasks?.data?.data?.expiredTasks);
            setAllTask(tasks?.data?.data?.allTasks);
            setIsLoading(false);
        } catch (err) {
            console.log("error:", err);
            setIsLoading(false);
        }
    };

    const addNewTask = async () => {
        try {
            await taskNameSchema.validate(taskName, { abortEarly: false });

            const result = await axios.post('/ordinary_task', { title: taskName });
            if (result) {
                showSuccessAlert("Created New Task");
                getAllTasks();
                setTaskName('');
                setValidationErrors({name: ''});
            }
        } catch (validationError) {
            showErrorAlert("Creation Failed")
            if (validationError instanceof yup.ValidationError) {
                const errors: any = {};
                validationError.inner.forEach((error) => {
                    error.path = 'name';
                    if (error.path) {
                        errors[error.path] = error.message;
                    }
                });
                setValidationErrors(errors);
            }
        }
    }

    useEffect(() => {
        getAllTasks()
    }, [])

    // if (isLoading) {
    //     return (
    //         <Spinner
    //             animation="border"
    //             style={{ position: "absolute", top: "50%", left: "50%" }}
    //         />
    //     );
    // }

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: "Todo", path: "/leads/ordinary_tasks" },
                    { label: "Todo List", path: "/leads/ordinary_tasks", active: true },
                ]}
                title={"Tasks Todo"}
            />
            <Row>
                <Col xl={12}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col md={10} lg={10} xl={10}>
                                    <FormInput name='Task' autoComplete='false' placeholder='New task ...' type='text' className="form-control" value={taskName} onChange={(e: any) => setTaskName(e?.target?.value)} />
                                    {validationErrors.name && (<Form.Text className="text-danger">{validationErrors.name}</Form.Text>)}
                                </Col>
                                <Col md={2} lg={2} xl={2}>
                                    <Button onClick={(e) => addNewTask()}>Add</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Body>
                            <Row className='mb-4'>
                                <Col md={12} lg={12} xl={12}>
                                    <Tab.Container activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
                                        <Row className='ms-3'>
                                            <Col md={10} lg={10} xl={10}>
                                                <Nav variant="tabs" as="ul" className="nav nav-fill row-gap-1 navtab-native-bg">
                                                    <Nav.Item as="li" className="nav-item">
                                                        <Nav.Link eventKey="all" className="nav-link cursor-pointer">
                                                            All
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item as="li" className="nav-item ">
                                                        <Nav.Link eventKey="today" className="nav-link cursor-pointer">
                                                            Today
                                                        </Nav.Link>
                                                    </Nav.Item>

                                                    <Nav.Item as="li" className="nav-item ">
                                                        <Nav.Link eventKey="upcoming" className="nav-link cursor-pointer">
                                                            Upcoming
                                                        </Nav.Link>
                                                    </Nav.Item>

                                                    <Nav.Item as="li" className="nav-item ">
                                                        <Nav.Link eventKey="pending" className="nav-link cursor-pointer">
                                                            Pending
                                                        </Nav.Link>
                                                    </Nav.Item>

                                                    <Nav.Item as="li" className="nav-item ">
                                                        <Nav.Link eventKey="completed" className="nav-link cursor-pointer">
                                                            Completed
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                </Nav>
                                            </Col>
                                        </Row>

                                        <Row className='mt-4'>
                                            <Tab.Content>
                                                <Col md={12} lg={12} xl={12}>
                                                    {activeTab === "all" && (
                                                        <Suspense fallback={null}>
                                                            <TaskTodoList tasks={allTask} setTasks={setAllTask} getAllTasks={getAllTasks} />
                                                        </Suspense>
                                                    )}
                                                    {activeTab === "today" && (
                                                        <Suspense fallback={null}>
                                                            <TaskTodoList tasks={todayTask} setTasks={setTodayTask} getAllTasks={getAllTasks} />
                                                        </Suspense>
                                                    )}

                                                    {activeTab === "upcoming" && (
                                                        <Suspense fallback={null}>
                                                            <TaskTodoList tasks={upcomingTask} setTasks={setUpcomingTask} getAllTasks={getAllTasks} />
                                                        </Suspense>
                                                    )}

                                                    {activeTab === "pending" && (
                                                        <Suspense fallback={null}>
                                                            <TaskTodoList tasks={expiredTask} setTasks={setExpiredTask} getAllTasks={getAllTasks} />
                                                        </Suspense>
                                                    )}

                                                    {activeTab === "completed" && (
                                                        <Suspense fallback={null}>
                                                            <TaskTodoList tasks={completedTask} setTasks={setCompletedTask} getAllTasks={getAllTasks} />
                                                        </Suspense>
                                                    )}
                                                </Col>

                                            </Tab.Content>
                                        </Row>
                                    </Tab.Container>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default TaskTodo