import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import Table from "../../components/Table";
import { withSwal } from "react-sweetalert2";
import PageTitle from "../../components/PageTitle";
import { Link } from "react-router-dom";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../constants";

interface TableRecords {
    id: number;
    task_prefix: string;
}

const sizePerPageList = [
    {
        text: "10",
        value: 10,
    },
    {
        text: "25",
        value: 25,
    },
    {
        text: "50",
        value: 50,
    },
    {
        text: "100",
        value: 100,
    },
];

const initialFormData = {
    id: "",
    task_prefix: "",
};

const initialValidationState = {
    task_prefix: "",
};

const BasicInputElements = withSwal((props: any) => {
    const { swal, state, loading, getTaskPrefix } = props;
    const [isUpdate, setIsUpdate] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [validationErrors, setValidationErrors] = useState(
        initialValidationState
    );
    const [responsiveModal, setResponsiveModal] = useState<boolean>(false);
    const records: TableRecords[] = state;

    const validationSchema = yup.object().shape({
        task_prefix: yup.string().required("Task prefix is required")
    });

    const handleUpdate = (item: any) => {
        setFormData({
            id: item?.id,
            task_prefix: item?.task_prefix,
        });
        setIsUpdate(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await validationSchema.validate(formData, { abortEarly: false });

            const confirmation = await swal.fire({
                title: "Confirm Action",
                text: `Do you want to ${isUpdate ? "update" : "create"} this task prefix?`,
                icon: "question",
                iconColor: "#8B8BF5", // Purple color for the icon
                showCancelButton: true,
                confirmButtonText: `Yes, ${isUpdate ? "Update" : "Create"}`,
                cancelButtonText: "Cancel",
                confirmButtonColor: "#8B8BF5", // Purple color for confirm button
                cancelButtonColor: "#E97777", // Pink/red color for cancel button
                buttonsStyling: true,
                customClass: {
                  popup: "rounded-4 shadow-lg",
                  confirmButton: "btn btn-lg px-4 rounded-3 order-2 hover-custom",
                  cancelButton: "btn btn-lg px-4 rounded-3 order-1 hover-custom",
                  title: "fs-2 fw-normal mb-2",
                },
                width: "26em",
                padding: "2em",
            })

            if (confirmation.isConfirmed) {
                let payload = {
                    id: '1',
                    task_prefix: formData?.task_prefix
                }
                const res = await axios.post('/master_data', payload);
                if (res?.status) {
                    showSuccessAlert(`Successfully ${isUpdate ? 'Updated' : 'Created'}`);
                    handleResetValues();
                    toggleResponsiveModal();
                    getTaskPrefix()
                }
            }

        } catch (validationError) {
            console.log(validationError);

            if (validationError instanceof yup.ValidationError) {
                const errors: any = {};
                validationError.inner.forEach((error) => {
                    if (error.path) {
                        errors[error.path] = error.message;
                    }
                });
                setValidationErrors(errors);
            } else {
                showErrorAlert('Something went wrong')
            }
        }
    };

    const columns = [
        {
            Header: "No",
            accessor: "id",
            sort: false,
            Cell: ({ row }: any) => <span>{row.index + 1}</span>,
        },
        {
            Header: "Task Prefix Name",
            accessor: "task_prefix",
            sort: true,
        },
        {
            Header: "Actions",
            accessor: "",
            sort: false,
            Cell: ({ row }: any) => (
                <div className="d-flex justify-content-center align-items-center gap-2">
                    {/* Edit Icon */}
                    <Link to="#" className="action-icon" onClick={() => {
                        setIsUpdate(true);
                        handleUpdate(row.original);
                        toggleResponsiveModal();
                    }}>
                        <i className="mdi mdi-square-edit-outline"></i>
                    </Link>
                </div>
            ),
        },
    ];

    const handleCancelUpdate = () => {
        setIsUpdate(false);
        setFormData(initialFormData);
        setValidationErrors(initialValidationState);
    };

    const toggleResponsiveModal = () => {
        setResponsiveModal(!responsiveModal);
        setValidationErrors(initialValidationState);
        if (isUpdate) {
            handleCancelUpdate();
        }
    };

    const handleResetValues = () => {
        setValidationErrors(initialValidationState);
        setFormData(initialFormData);
    };

    useEffect(() => {
        if (!loading) {
            setResponsiveModal(false);
            setValidationErrors(initialValidationState);
            setFormData(initialFormData);
            setIsUpdate(false);
        }
    }, [loading]);

    return (
        <>
            <Row className="justify-content-between px-2">
                <Modal
                    show={responsiveModal}
                    onHide={toggleResponsiveModal}
                    dialogClassName="modal-dialog-centered"
                >
                    <Form onSubmit={onSubmit}>
                        <Modal.Header closeButton>
                            <h4 className="modal-title">Task Prefix Management</h4>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group controlId="validationCustom01">
                                <Form.Label>Task Prefix</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="task_prefix"
                                    value={formData.task_prefix}
                                    onChange={handleInputChange}
                                />
                                {validationErrors.task_prefix && (
                                    <Form.Text className="text-danger">
                                        {validationErrors.task_prefix}
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="primary"
                                id="button-addon2"
                                className="mt-3 ms-2"
                                onClick={() => [setFormData(initialFormData)]
                                }
                            >
                                Clear
                            </Button>
                            <Button
                                variant="danger"
                                id="button-addon2"
                                className="mt-3 "
                                onClick={() =>
                                    isUpdate
                                        ? [handleCancelUpdate(), toggleResponsiveModal()]
                                        : [toggleResponsiveModal(), handleResetValues()]
                                }
                            >
                                {isUpdate ? "Cancel" : "Close"}
                            </Button>
                            <Button
                                type="submit"
                                variant="success"
                                id="button-addon2"
                                className="mt-3"
                            >
                                {isUpdate ? "Update" : "Submit"}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>

                <Col className="p-0 form__card">
                    <Card className="bg-white">
                        <Card.Body>
                            <Button
                                className="btn-sm btn-blue waves-effect waves-light float-end"
                                onClick={toggleResponsiveModal}
                                disabled={records?.length > 0}
                            >
                                <i className="mdi mdi-plus-circle"></i> Add Task Prefix
                            </Button>
                            <h4 className="header-title mb-4">Manage Task Prefix</h4>
                            <Table
                                columns={columns}
                                data={records ? records : []}
                                pageSize={10}
                                sizePerPageList={sizePerPageList}
                                isSortable={true}
                                pagination={true}
                                isSearchable={true}
                                tableClass="table-striped dt-responsive nowrap w-100"
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
});

const TaskPrefix = () => {
    const [prefixData, setPrefixData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        getTaskPrefix()
    }, []);

    const getTaskPrefix = async () => {
        setIsLoading(true)
        try {
            const res = await axios.get('/master_data');
            if (res?.status) {
                setPrefixData(res?.data?.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    }

    return (
        <React.Fragment>
            <PageTitle
                breadCrumbItems={[
                    // { label: "Master", path: "/settings/master/task_prefix" },
                    { label: "Task Prefix", path: "/settings/master/task_prefix", active: true },
                ]}
                title={"Task Prefix"}
            />
            <Row>
                <Col>
                    <BasicInputElements
                        state={prefixData}
                        loading={isLoading}
                        getTaskPrefix={getTaskPrefix}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
};
export default TaskPrefix;
