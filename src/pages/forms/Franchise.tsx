import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Dropdown,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import Table from "../../components/Table";

import { withSwal } from "react-sweetalert2";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  AUTH_SESSION_KEY,
  franchise_counsellor_id,
} from "../../constants";
import { Link } from "react-router-dom";
import {
  addFranchise,
  addFranchiseAdminUser,
  deleteFranchise,
  getFranchise,
  updateFranchise,
  updateFranchiseAdminUser,
} from "../../redux/franchise/actions";
import { regrexValidation } from "../../utils/regrexValidation";

interface TableRecords {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  pocName: string;
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

const initialState = {
  id: "",
  name: "",
  email: "",
  address: "",
  phone: "",
  pocName: "",
};

const initialValidationState = {
  name: "",
  email: "",
  address: "",
  phone: "",
  pocName: "",
};

const initialStateAdminUsers = {
  id: "",
  employee_id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  username: "",
  password: "",
  updated_by: "",
  role_id: "",
  branch_ids: null,
  country_id: null,
  franchise_id: "",
};

const initialValidationStateAdminUsers = {
  employee_id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  username: "",
  password: "",
  role_id: "",
  branch_ids: "",
  country_id: "",
  franchise_id: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, error, loading, initialLoading } = props;

  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  const { user_id } = JSON.parse(userInfo || "");

  //Table data
  const records: TableRecords[] = state;

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [isUpdateAdminUser, setIsUpdateAdminUser] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [adminUserFormData, setAdminUserFormData] = useState(
    initialStateAdminUsers
  );

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);
  const [responsiveModalAdminUser, setResponsiveModalAdmiUser] =
    useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(
    initialValidationState
  );

  const [adminUsersValidationErrors, setAdminUsersValidationErrors] = useState(
    initialValidationStateAdminUsers
  );

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required"),
    address: yup.string().required("Address is required"),
    phone: yup.string().required("Phone number is required"),
    // pocName: yup.string().required("Point of Contact Name is required"),
  });

  const adminUsersValidationSchema = yup.object().shape({
    employee_id: yup.string().required("Employee ID is required"),
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: yup.string().required("Phone number is required"),
    address: yup.string().required("Address is required"),
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  const handleUpdate = (item: any) => {
    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      name: item?.name,
      email: item?.email,
      address: item?.address,
      phone: item?.phone,
      pocName: item?.pocName,
    }));
    setIsUpdate(true);
  };

  const handleUpdateAdminUser = (item: any) => {
    setAdminUserFormData((prev) => ({
      ...prev,
      id: item?.id,
      employee_id: item?.employee_id,
      name: item?.name,
      email: item?.email,
      phone: item?.phone,
      address: item?.address,
      username: item?.username,
      password: item?.password,
      updated_by: item?.updated_by,
      role_id: item?.role_id,
      franchise_id: item?.franchise_id,
    }));
    setIsUpdateAdminUser(true);
  };

  //handle delete function
  const handleDelete = (id: string) => {
    swal
      .fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          dispatch(deleteFranchise(id));
          if (isUpdate) {
            setFormData(initialState);
          }
        }
      });
  };

  //handle onchange function
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (!regrexValidation(name, value)) {
      console.error(`Invalid ${name}: ${value}`);
      return; // Stop updating if validation fails
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChangeAdminUsers = (e: any) => {
    const { name, value } = e.target;
    setAdminUserFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //handle form submission
  const onSubmit = (type: string) => async (e: React.FormEvent) => {
    e.preventDefault();

    if (type == "franchise") {
      // Validate the form using yup
      try {
        // Validation passed, handle form submission
        await validationSchema.validate(formData, { abortEarly: false });

        swal
          .fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, ${isUpdate ? "Update" : "Create"}`,
          })
          .then((result: any) => {
            if (result.isConfirmed) {
              if (isUpdate) {
                // Handle update logic
                dispatch(
                  updateFranchise(
                    formData.id,
                    formData.name, // Updated from channel_name to name
                    formData.email, // Updated from channel_description to email
                    formData.address, // New field address
                    formData.phone, // New field phone
                    formData.pocName // New field pocName
                  )
                );
                setIsUpdate(false);
              } else {
                // Handle add logic
                dispatch(
                  addFranchise(
                    formData.name, // Updated from channel_name to name
                    formData.email, // Updated from channel_description to email
                    formData.address, // New field address
                    formData.phone, // New field phone
                    formData.pocName
                  )
                );
              }
            }
          });

        // ... Rest of the form submission logic ...
      } catch (validationError) {
        // Handle validation errors
        if (validationError instanceof yup.ValidationError) {
          const errors: any = {};
          validationError.inner.forEach((error) => {
            if (error.path) {
              errors[error.path] = error.message;
            }
          });
          setValidationErrors(errors);
        }
      }
      return;
    }

    if (type == "adminuser") {
      // Validate the form using yup
      try {
        // Validation passed, handle form submission
        await adminUsersValidationSchema.validate(adminUserFormData, {
          abortEarly: false,
        });

        swal
          .fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, ${
              isUpdateAdminUser ? "Update" : "Create"
            }`,
          })
          .then((result: any) => {
            if (result.isConfirmed) {
              if (isUpdateAdminUser) {
                console.log("here");
                dispatch(
                  updateFranchiseAdminUser(
                    adminUserFormData.id,
                    adminUserFormData.employee_id,
                    adminUserFormData.name,
                    adminUserFormData.email,
                    adminUserFormData.phone,
                    adminUserFormData.address,
                    adminUserFormData.username,
                    user_id,
                    franchise_counsellor_id,
                    null,
                    null,
                    adminUserFormData.franchise_id
                  )
                );
              } else {
                dispatch(
                  addFranchiseAdminUser(
                    adminUserFormData.employee_id,
                    adminUserFormData.name,
                    adminUserFormData.email,
                    adminUserFormData.phone,
                    adminUserFormData.address,
                    adminUserFormData.username,
                    adminUserFormData.password,
                    user_id,
                    franchise_counsellor_id,
                    null,
                    null,
                    adminUserFormData.franchise_id
                  )
                );
              }
            }
          });

        // ... Rest of the form submission logic ...
      } catch (validationError) {
        // Handle validation errors
        if (validationError instanceof yup.ValidationError) {
          const errors: any = {};
          validationError.inner.forEach((error) => {
            if (error.path) {
              errors[error.path] = error.message;
            }
          });
          setAdminUsersValidationErrors(errors);
        }
      }
      return;
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
      Header: "Franchisee Name",
      accessor: "name",
      sort: true,
    },
    {
      Header: "POC Name",
      accessor: "pocName",
      sort: false,
    },
    {
      Header: "Email",
      accessor: "email",
      sort: false,
    },
    {
      Header: "Phone",
      accessor: "phone",
      sort: false,
    },
    {
      Header: "Address",
      accessor: "address",
      sort: false,
    },
    {
      Header: "Slug",
      accessor: "slug",
      sort: false,
    },
    {
      Header: "Actions",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* View Icon */}
          <Link to={`/settings/master/franchise_details/${row.original?.id}`} className="action-icon">
            <i className="mdi mdi-eye-outline"></i>
          </Link>
          {/* Edit Icon */}
          <Link
            to="#"
            className="action-icon"
            onClick={() => {
              setIsUpdate(true);
              handleUpdate(row.original);
              toggleResponsiveModal();
            }}
          >
            <i className="mdi mdi-square-edit-outline"></i>
          </Link>

          {/* Delete Icon */}
          <Link
            to="#"
            className="action-icon"
            onClick={() => handleDelete(row.original.id)}
          >
            {/* <i className="mdi mdi-delete"></i> */}
            <i className="mdi mdi-delete-outline"></i>
          </Link>
        </div>
      ),
    },
  ];

  //handle cancel update section
  const handleCancelUpdate = (type: string) => {
    if (type === "franchise") {
      setIsUpdate(false);
      handleResetValues("franchise");
      return;
    }

    if (type === "adminuser") {
      setIsUpdateAdminUser(false);
      handleResetValues("adminuser");
      return; //clear form data
    }
  };

  const handleResetValues = (type: string) => {
    if (type === "franchise") {
      setValidationErrors(initialValidationState); // Clear validation errors
      setFormData(initialState);
      return; //clear form data
    }

    if (type === "adminuser") {
      setAdminUsersValidationErrors(initialValidationStateAdminUsers);
      setAdminUserFormData(initialStateAdminUsers);
      return; //clear form data
    }
  };

  const toggleResponsiveModal = () => {
    setResponsiveModal(!responsiveModal);
    setValidationErrors(initialValidationState);
    if (isUpdate) {
      handleCancelUpdate("franchise");
    }
  };

  const toggleResponsiveModalAdminUser = () => {
    setResponsiveModalAdmiUser(!responsiveModalAdminUser);
    setAdminUsersValidationErrors(initialValidationStateAdminUsers);
    if (isUpdateAdminUser) {
      handleCancelUpdate("adminUser");
    }
  };

  useEffect(() => {
    // Check for errors and clear the form
    if (!loading && !error) {
      setResponsiveModal(false);
      setValidationErrors(initialValidationState); // Clear validation errors
      setFormData(initialState); //clear form data
    }
  }, [loading, error]);

  return (
    <>
      <Row className="justify-content-between px-2">
        {/* <Col lg={5} className="bg-white p-3"> */}
        <Modal
          show={responsiveModal}
          onHide={toggleResponsiveModal}
          dialogClassName="modal-dialog-centered"
        >
          <Form onSubmit={onSubmit("franchise")}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Franchise Management</h4>
            </Modal.Header>
            {error && (
              <Alert variant="danger" className="my-2">
                {error}
              </Alert>
            )}

            <Modal.Body>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Franchise Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {validationErrors.name && (
                  <Form.Text className="text-danger">
                    {validationErrors.name}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {validationErrors.email && (
                  <Form.Text className="text-danger">
                    {validationErrors.email}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  // type="text"
                  as="textarea"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {validationErrors.address && (
                  <Form.Text className="text-danger">
                    {validationErrors.address}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {validationErrors.phone && (
                  <Form.Text className="text-danger">
                    {validationErrors.phone}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="pocName">
                <Form.Label>Point of Contact Name</Form.Label>
                <Form.Control
                  type="text"
                  name="pocName"
                  value={formData.pocName}
                  onChange={handleInputChange}
                />
                {validationErrors.pocName && (
                  <Form.Text className="text-danger">
                    {validationErrors.pocName}
                  </Form.Text>
                )}
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="primary"
                id="button-addon2"
                className="mt-1 ms-2"
                onClick={() => [handleResetValues("franchise")]}
              >
                Clear
              </Button>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1"
                onClick={() => {
                  if (isUpdate) {
                    handleCancelUpdate("franchise");
                  } else {
                    handleResetValues("franchise");
                  }
                  toggleResponsiveModal();
                }}
              >
                {isUpdate ? "Cancel" : "Close"}
              </Button>
              <Button
                type="submit"
                variant="success"
                id="button-addon2"
                className="mt-1"
              >
                {isUpdate ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        <Modal
          show={responsiveModalAdminUser}
          onHide={toggleResponsiveModalAdminUser}
          dialogClassName="modal-dialog-centered"
        >
          <Modal.Header closeButton>
            <h4 className="modal-title">Franchise Admin user Management</h4>
          </Modal.Header>
          {error && (
            <Alert variant="danger" className="my-2">
              {error}
            </Alert>
          )}
          <Modal.Body>
            <Row>
              <Col className="bg-white">
                <Form onSubmit={onSubmit("adminuser")}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="employee_id">
                        <Form.Label>Employee ID</Form.Label>
                        <Form.Control
                          type="text"
                          name="employee_id"
                          placeholder="Enter employee id"
                          value={adminUserFormData.employee_id}
                          onChange={handleInputChangeAdminUsers}
                        />
                        {adminUsersValidationErrors.employee_id && (
                          <Form.Text className="text-danger">
                            {adminUsersValidationErrors.employee_id}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter name"
                          name="name"
                          value={adminUserFormData.name}
                          onChange={handleInputChangeAdminUsers}
                        />
                        {adminUsersValidationErrors.name && (
                          <Form.Text className="text-danger">
                            {adminUsersValidationErrors.name}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="text"
                          name="email"
                          placeholder="Enter email"
                          value={adminUserFormData.email}
                          onChange={handleInputChangeAdminUsers}
                        />
                        {adminUsersValidationErrors.email && (
                          <Form.Text className="text-danger">
                            {adminUsersValidationErrors.email}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="phone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          placeholder="Enter phone number"
                          value={adminUserFormData.phone}
                          onChange={handleInputChangeAdminUsers}
                        />
                        {adminUsersValidationErrors.phone && (
                          <Form.Text className="text-danger">
                            {adminUsersValidationErrors.phone}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Row>
                        <Form.Group className="mb-3" controlId="username">
                          <Form.Label>Username</Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={adminUserFormData.username}
                            onChange={handleInputChangeAdminUsers}
                          />
                          {adminUsersValidationErrors.username && (
                            <Form.Text className="text-danger">
                              {adminUsersValidationErrors.username}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </Row>

                      {(!isUpdateAdminUser && !error) && (
                        <Row>
                          <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              type="text"
                              name="password"
                              placeholder="Enter password"
                              value={adminUserFormData.password}
                              onChange={handleInputChangeAdminUsers}
                            />
                            {adminUsersValidationErrors.password && (
                              <Form.Text className="text-danger">
                                {adminUsersValidationErrors.password}
                              </Form.Text>
                            )}
                          </Form.Group>
                        </Row>
                      )}
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          placeholder="Enter adress"
                          className="py-2"
                          name="address"
                          value={adminUserFormData.address}
                          onChange={handleInputChangeAdminUsers}
                        />
                        {adminUsersValidationErrors.address && (
                          <Form.Text className="text-danger">
                            {adminUsersValidationErrors.address}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="text-end">
                    <Button
                      variant="primary"
                      id="button-addon2"
                      className="mt-1 ms-2 me-2"
                      onClick={() => [handleResetValues("adminuser")]}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="danger"
                      id="button-addon2"
                      disabled={loading}
                      className="mt-1 waves-effect waves-light me-2"
                      onClick={() => {
                        if (isUpdateAdminUser) {
                          handleCancelUpdate("adminuser");
                        } else {
                          handleResetValues("adminuser");
                        }
                        toggleResponsiveModalAdminUser();
                      }}
                    >
                      {!isUpdateAdminUser ? "Close" : "Cancel"}
                    </Button>

                    <Button
                      type="submit"
                      variant="success"
                      id="button-addon2"
                      className="waves-effect waves-light mt-1"
                      disabled={loading}
                    >
                      {isUpdateAdminUser ? "Update" : "Submit"}
                    </Button>
                  </div>
                  {/* )} */}
                </Form>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>

        {/* </Col> */}

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button
                className="btn-sm btn-blue waves-effect waves-light float-end"
                onClick={toggleResponsiveModal}
              >
                <i className="mdi mdi-plus-circle"></i> Add Franchise
              </Button>
              <h4 className="header-title mb-4">Manage Franchise</h4>
              <Table
                columns={columns}
                data={records ? records : []}
                pageSize={10}
                sizePerPageList={sizePerPageList}
                isSortable={true}
                pagination={true}
                isSearchable={true}
                tableClass="table-striped dt-responsive nowrap w-100"
                initialLoading={initialLoading}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

const Franchise = () => {
  const dispatch = useDispatch<AppDispatch>();

  //Fetch data from redux store
  const { state, error, loading, initialLoading } = useSelector(
    (state: RootState) => ({
      state: state.Franchise.franchiseUsers,
      error: state.Franchise.error,
      loading: state.Franchise.loading,
      initialLoading: state.Franchise.initialLoading,
    })
  );

  useEffect(() => {
    dispatch(getFranchise());
  }, []);

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Master", path: "/master/franchise" },
          { label: "Franchise Users", path: "/master/franchise", active: true },
        ]}
        title={"Franchise Users"}
      />
      <Row>
        <Col>
          <BasicInputElements state={state} error={error} loading={loading} initialLoading={initialLoading} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Franchise;
