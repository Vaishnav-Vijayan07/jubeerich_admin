import React, { useEffect, useState } from 'react'
import { Accordion, Card, Col, Form, Row, Spinner } from 'react-bootstrap'
import { ReactSortable } from 'react-sortablejs'
import { FormInput } from '../../../components'
import Select from "react-select";
import { Button } from 'react-bootstrap';
import { IFormState, initialFormState, priority, status } from './data';
import { withSwal } from "react-sweetalert2";
import axios from 'axios';
import { showErrorAlert, showSuccessAlert } from '../../../constants';
import moment from 'moment';
import * as yup from 'yup';
import classNames from 'classnames';

const TaskTodoList = withSwal((props: any) => {
    const { swal, tasks, setTasks, getAllTasks } = props;

    const taskNameSchema = yup.string().min(4, "Minimum 4 characters needed").required('Task Name is required');
    const [formData, setFormData] = useState<IFormState[]>([initialFormState]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState({ name: '' });

    const handleInputChange = (index: number, e: any) => {
        const { name, value } = e.target;

        const newFields: any = [...formData];
        newFields[index][name] = value;
        setFormData(newFields);
    };

    const handleDropDown = (index: number, selected: any, name: any) => {
        const { value } = selected;
        const newFields: any = [...formData];
        newFields[index][name] = value;
        setFormData(newFields);
    };

    const handleUpdate = async (e: any, data: any) => {
        try {
            await taskNameSchema.validate(data?.title, { abortEarly: false });

            setIsLoading(true);
            e.preventDefault();
        
            const result = await axios.put(`/ordinary_task/${data?.id}`, data);
            if (result) {
                showSuccessAlert('Task Updated Successfully');
                getAllTasks();
                setIsLoading(false);
                setValidationErrors({name: ''});
            }
        } catch (validationError) {
            console.log(validationError);
            showErrorAlert('Task Updation Failed');
            setIsLoading(false);
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

    const deleteTodo = async (id: string) => {
        try {
            const confirmResult = await swal.fire({
                title: "Are you sure?",
                text: "This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete",
            });
            if (confirmResult.isConfirmed) {
                const result = await axios.delete(`/ordinary_task/${id}`);
                if (result) {
                    showSuccessAlert('Todo Deleted Succesfully');
                    getAllTasks();
                }
            }
        } catch (err) {
            console.log(err);
            showErrorAlert('Todo Deletion Failed')
        }
    };

    const handlePatchData = (data: any) => {
        setFormData(data);
    }

    const filterDisplayStatus = (statusName: any) => {
        if(!status) return '';
        const selected = status?.filter((data: any) => data?.value == statusName);
        return selected?.[0]?.label || '';
    }

    const BGColor = (statusName: any) => {
        if (!statusName) return 'white';
        switch (statusName) {
            case 'pending':
                return 'rgb(249, 84, 84)'
            case 'in_progress':
                return 'rgb(13, 146, 244)'
            case 'completed':
                return 'rgb(52, 121, 40)'
            default:
                break;
        }
    }

    useEffect(() => {
        handlePatchData(tasks)
    }, [tasks])

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
            <Row>
                {tasks?.length > 0 ?
                    <Col md={10} lg={10} xl={10}>
                        <ReactSortable className="row" list={formData ? formData : []} setList={setFormData}>
                            {formData && formData.map(((data: any, index: number) => (
                                <Accordion key={index} className='ms-4 custom-accordion3'>
                                    <Accordion.Item eventKey={index.toString()} className='mb-4'>
                                        <Accordion.Header className='w-100 d-flex justify-content-start align-items-center pt-0 mt-0'>
                                            <span className='p-1'>
                                                <h4 className='fs-8'>{data?.title}</h4>
                                            </span>
                                            <span className='ps-2'>
                                                <small
                                                    style={{
                                                        backgroundColor: `${BGColor(data?.status)}`,
                                                        color: "white",
                                                        border: `1px solid #122d3d`,
                                                        borderRadius: "5px",
                                                        padding: "2px 12px",
                                                        fontSize: "0.7rem",
                                                        borderColor: `${BGColor(data?.status)}`,
                                                        height: "max-content",
                                                    }}
                                                    className={classNames("rounded-pill me-1")}
                                                >
                                                    {filterDisplayStatus(data?.status)}
                                                </small>
                                            </span>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Card>
                                                <Card.Body style={{ paddingTop: "0px" }}>
                                                    <div className='d-flex justify-content-end align-items-center mt-0 pt-0'>
                                                        <i className='mdi mdi-delete-outline fs-3 mb-2' onClick={(e) => deleteTodo(data?.id)}></i>
                                                    </div>
                                                    <Row>
                                                        <Col>
                                                            <FormInput name='title' type='text' label='Task Name' value={data?.title} onChange={(e) => handleInputChange(index, e)} />
                                                            {validationErrors.name && (<Form.Text className="text-danger">{validationErrors.name}</Form.Text>)}
                                                        </Col>
                                                        <Col>
                                                            <FormInput name='description' type='text' label='Description' value={data?.description} onChange={(e) => handleInputChange(index, e)} />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col className='mt-2'>
                                                            <FormInput name='due_date' type='date' label='Due Date' value={moment(data?.due_date).format('YYYY-MM-DD')} onChange={(e) => handleInputChange(index, e)} />
                                                        </Col>
                                                        <Col className='mt-2'>
                                                            <label htmlFor="status">Status</label>
                                                            <Select
                                                                className="react-select react-select-container mt-1"
                                                                classNamePrefix="react-select"
                                                                options={status}
                                                                value={
                                                                    data?.status
                                                                        ? {
                                                                            label: status.find((u: any) => u.value == data?.status)?.label,
                                                                            value: data?.status,
                                                                        }
                                                                        : null
                                                                }
                                                                placeholder="Select status"
                                                                name="status"
                                                                onChange={(e) => handleDropDown(index, e, 'status')}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col className='mt-2'>
                                                            <label htmlFor="priority">Priority</label>
                                                            <Select
                                                                className="react-select react-select-container mt-1"
                                                                classNamePrefix="react-select"
                                                                options={priority}
                                                                value={
                                                                    data?.priority
                                                                        ? {
                                                                            label: priority.find((u: any) => u.value == data?.priority)?.label,
                                                                            value: data?.priority,
                                                                        }
                                                                        : null
                                                                }
                                                                placeholder="Select priority"
                                                                name="priority"
                                                                onChange={(e) => handleDropDown(index, e, 'priority')}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col className='d-flex justify-content-end mt-2'>
                                                            <Button disabled={isLoading} onClick={(e) => handleUpdate(e, data)}>Save</Button>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            )))}
                        </ReactSortable>
                    </Col>
                    :
                    <Col>
                        <div className='d-flex justify-content-center align-items-center'>
                            <h2 className='text-muted'>No Todo Found</h2>
                        </div>
                    </Col>
                }
            </Row></>
    )
})

export default TaskTodoList