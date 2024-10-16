import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button, Modal, Spinner } from "react-bootstrap";
import Table from "../../components/Table";

import { withSwal } from "react-sweetalert2";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Link } from "react-router-dom";

import {
  deleteStream,
  getStream,
  updateStream,
  addStream,
} from "../../redux/stream/actions";

interface TableRecords {
  id: string;
  stream_name: string;
  stream_description: string;
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
  stream_name: "",
  stream_description: "",
};

const initialValidationState = {
  stream_name: "",
  stream_description: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, error, loading, userId } = props;

  //fetch token from session storage

  //Table data
  const records: TableRecords[] = state;

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState(initialState);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(
    initialValidationState
  );

  const validationSchema = yup.object().shape({
    stream_name: yup.string().required("Streams is required"),
    stream_description: yup
      .string()
      .required("stream_description is required")
      .min(3, "stream_description must be at least 3 characters long"),
  });

  const handleUpdate = (item: any) => {
    //update source dropdown

    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      stream_name: item?.stream_name,
      stream_description: item?.stream_description,
    }));

    setIsUpdate(true);
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
          dispatch(deleteStream(id));
          if (isUpdate) {
            setFormData(initialState);
          }
        }
      });
  };

  //handle onchange function
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form using yup
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      // Validation passed, handle form submission

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
                updateStream(
                  formData?.id,
                  formData.stream_name,
                  formData.stream_description,
                  userId ? userId : null
                )
              );
              setIsUpdate(false);
            } else {
              // Handle add logic
              console.log("Here");

              dispatch(
                addStream(
                  formData.stream_name,
                  formData.stream_description,
                  userId ? userId : null
                )
              );
            }
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
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
  };

  const columns = [
    {
      Header: "No",
      accessor: "id",
      sort: false,
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
    },
    {
      Header: "Stream",
      accessor: "stream_name",
      sort: true,
    },
    {
      Header: "Description",
      accessor: "stream_description",
      sort: false,
    },
    {
      Header: " ",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
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
  const handleCancelUpdate = () => {
    setIsUpdate(false);
    handleResetValues();
  };

  const handleResetValues = () => {
    setValidationErrors(initialValidationState); // Clear validation errors
    setFormData(initialState); //clear form data
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

  return (
    <>
      <Row className="justify-content-between px-2">
        {/* <Col lg={5} className="bg-white p-3"> */}
        <Modal
          show={responsiveModal}
          onHide={toggleResponsiveModal}
          dialogClassName="modal-dialog-centered"
        >
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Streams Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="stream_name">
                <Form.Label>Streams</Form.Label>
                <Form.Control
                  type="text"
                  name="stream_name"
                  value={formData.stream_name}
                  onChange={handleInputChange}
                />
                {validationErrors.stream_name && (
                  <Form.Text className="text-danger">
                    {validationErrors.stream_name}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="stream_description">
                <Form.Label>Stream Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="stream_description"
                  value={formData.stream_description}
                  onChange={handleInputChange}
                />
                {validationErrors.stream_description && (
                  <Form.Text className="text-danger">
                    {validationErrors.stream_description}
                  </Form.Text>
                )}
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="primary"
                id="button-addon2"
                className="mt-1 ms-2"
                onClick={() => [handleResetValues()]}
              >
                Clear
              </Button>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1 "
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
                className="mt-1"
              >
                {isUpdate ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        {/* </Col> */}

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button
                className="btn-sm btn-blue waves-effect waves-light float-end"
                onClick={toggleResponsiveModal}
              >
                <i className="mdi mdi-plus-circle"></i> Add Streams
              </Button>
              <h4 className="header-title mb-4">Manage Streams</h4>
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

const Stream = () => {
  const dispatch = useDispatch<AppDispatch>();

  //Fetch data from redux store
  const { state, error, loading, initialLoading, userId } = useSelector(
    (state: RootState) => ({
      state: state.Stream.stream.data,
      error: state.Stream.error,
      loading: state.Stream.loading,
      initialLoading: state.Stream.initialloading,
      userId: state.Auth.user?.user_id,
    })
  );

  useEffect(() => {
    dispatch(getStream());
  }, []);

  if (initialLoading) {
    return (
      <Spinner
        animation="border"
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  }

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Master", path: "" },
          { label: "Streams", path: "", active: true },
        ]}
        title={"Streams"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            error={error}
            loading={loading}
            userId={userId}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Stream;
