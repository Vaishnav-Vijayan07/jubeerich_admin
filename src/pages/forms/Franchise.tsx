import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Card, Form, Button, Modal, Alert } from "react-bootstrap";
import Table from "../../components/Table";

import { withSwal } from "react-sweetalert2";

import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Link } from "react-router-dom";
import { addFranchise, deleteFranchise, getFranchise, updateFranchise } from "../../redux/franchise/actions";
import { regrexValidation } from "../../utils/regrexValidation";
import HistoryTable from "../../components/HistoryTable";

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

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, error, loading, initialLoading } = props;

  const records: TableRecords[] = state;
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState(initialValidationState);

  const [historyModal, setHistoryModal] = useState<boolean>(false);

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required"),
    address: yup.string().required("Address is required"),
    phone: yup.string().required("Phone number is required"),
    pocName: yup.string().required("Point of Contact Name is required"),
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

  //handle delete function
  const handleDelete = (id: string) => {
    swal
      .fire({
        title: "Confirm Action",
        text: `Do you want to delete this franchise?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, delete it!`,
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
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      swal
        .fire({
          title: "Confirm Action",
          text: `Do you want to ${isUpdate ? "update" : "create"} this franchise?`,
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
        .then((result: any) => {
          if (result.isConfirmed) {
            if (isUpdate) {
              dispatch(
                updateFranchise(formData.id, formData.name, formData.email, formData.address, formData.phone, formData.pocName)
              );
              setIsUpdate(false);
            } else {
              dispatch(addFranchise(formData.name, formData.email, formData.address, formData.phone, formData.pocName));
            }
          }
        });
    } catch (validationError) {
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
          <Link to="#" className="action-icon" onClick={() => handleDelete(row.original.id)}>
            <i className="mdi mdi-delete-outline"></i>
          </Link>
        </div>
      ),
    },
  ];

  //handle cancel update section
  const handleCancelUpdate = () => {
    setIsUpdate(false);
    handleResetValues();
  };

  const handleResetValues = () => {
    setValidationErrors(initialValidationState);
    setFormData(initialState);
  };

  const toggleResponsiveModal = () => {
    setResponsiveModal(!responsiveModal);
    setValidationErrors(initialValidationState);
    if (isUpdate) {
      handleCancelUpdate();
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

  const toggleHistoryModal = () => {
    setHistoryModal(!historyModal);
  };

  return (
    <>
      <Row className="justify-content-between px-2">
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} dialogClassName="modal-dialog-centered">
          <Form onSubmit={(e) => onSubmit(e)}>
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
                <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} />
                {validationErrors.name && <Form.Text className="text-danger">{validationErrors.name}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} />
                {validationErrors.email && <Form.Text className="text-danger">{validationErrors.email}</Form.Text>}
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
                {validationErrors.address && <Form.Text className="text-danger">{validationErrors.address}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="number" name="phone" value={formData.phone} onChange={handleInputChange} />
                {validationErrors.phone && <Form.Text className="text-danger">{validationErrors.phone}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="pocName">
                <Form.Label>Point of Contact Name</Form.Label>
                <Form.Control type="text" name="pocName" value={formData.pocName} onChange={handleInputChange} />
                {validationErrors.pocName && <Form.Text className="text-danger">{validationErrors.pocName}</Form.Text>}
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="primary" id="button-addon2" className="mt-1 ms-2" onClick={() => [handleResetValues()]}>
                Clear
              </Button>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1"
                onClick={() => {
                  if (isUpdate) {
                    handleCancelUpdate();
                  } else {
                    handleResetValues();
                  }
                  toggleResponsiveModal();
                }}
              >
                {isUpdate ? "Cancel" : "Close"}
              </Button>
              <Button type="submit" variant="success" id="button-addon2" className="mt-1">
                {isUpdate ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        <Modal show={historyModal} onHide={toggleHistoryModal} centered dialogClassName={"modal-full-width"} scrollable>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body style={{ margin: "0 !important", padding: "0 !important" }}>
            <HistoryTable apiUrl={"franchise"} />
          </Modal.Body>
        </Modal>

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Add Franchise
              </Button>

              <Button className="btn-sm btn-secondary waves-effect waves-light float-end me-2" onClick={toggleHistoryModal}>
                <i className="mdi mdi-history"></i> View History
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
  const { state, error, loading, initialLoading } = useSelector((state: RootState) => ({
    state: state.Franchise.franchiseUsers,
    error: state.Franchise.error,
    loading: state.Franchise.loading,
    initialLoading: state.Franchise.initialLoading,
  }));

  useEffect(() => {
    dispatch(getFranchise());
  }, []);

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[{ label: "Franchise Users", path: "/settings/master/franchise", active: true }]}
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
