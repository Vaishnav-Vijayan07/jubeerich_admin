import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Card, Form, Button, Modal, Spinner } from "react-bootstrap";
import Table from "../../components/Table";

import { withSwal } from "react-sweetalert2";
import FeatherIcons from "feather-icons-react";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addCategory, addStatus, deleteCategory, getCategory, updateCategory } from "../../redux/actions";
import { AUTH_SESSION_KEY } from "../../constants";
import { error } from "console";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { regrexValidation } from "../../utils/regrexValidation";
import { Slider } from "@mui/material";
import { addStatusType, deleteStatusType, getStatusType, updateStatusType } from "../../redux/status/statusType/actions";

interface TableRecords {
  id: number;
  category_name: string;
  category_description: string;
  status: boolean;
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
  type_name: "",
  priority: 1,
};

const initialValidationState = {
  type_name: "",
};

const BasicInputElements = withSwal((props: any) => {
  const { swal, state, loading, error, initialLoading } = props;
  const dispatch = useDispatch();

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  //Input data
  const [formData, setFormData] = useState(initialFormData);

  const [validationErrors, setValidationErrors] = useState(initialValidationState);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  const records: TableRecords[] = state;

  const validationSchema = yup.object().shape({
    type_name: yup.string().required("Type name is required"),
  });

  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialFormData,
  });

  const {
    formState: { errors },
  } = methods;

  const handleUpdate = (item: any) => {
    setFormData({
      id: item?.id,
      type_name: item?.type_name,
      priority: item?.priority,
    });
    setIsUpdate(true);
  };

  const handleDelete = (type_id: number) => {
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
          dispatch(deleteStatusType(type_id));
          //clear form data
          if (isUpdate) {
            setFormData(initialFormData);
          }
        }
      });
  };

  //handle onchange function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (!regrexValidation(name, value)) {
      console.error(`Invalid ${name}: ${value}`);
      return; // Stop updating if validation fails
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("FORMDATA", formData);

    try {
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
            // Validation passed, handle form submission
            if (isUpdate) {
              // dispatch(updateCategory(formData.id, formData.category_name, formData.category_description));
              dispatch(updateStatusType(formData.id, formData.type_name, formData.priority));
            } else {
              // dispatch(addCategory(formData.category_name, formData.category_description));
              dispatch(addStatusType(formData.type_name, formData.priority));
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
      Header: "Name",
      accessor: "type_name",
      sort: true,
    },
    {
      Header: "Priority",
      accessor: "priority",
      sort: true,
    },
    {
      Header: "Actions",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
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

          <Link to="#" className="action-icon" onClick={() => handleDelete(row.original.id)}>
            <i className="mdi mdi-delete-outline"></i>
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
    setValidationErrors(initialValidationState); // Clear validation errors
    setFormData(initialFormData); //clear form data
  };

  useEffect(() => {
    // Check for errors and clear the form
    if (!loading && !error) {
      setResponsiveModal(false);
      // Clear validation errors
      setValidationErrors(initialValidationState);
      //clear form data
      setFormData(initialFormData);
      setIsUpdate(false);
    }
  }, [loading, error]);

  return (
    <>
      <Row className="justify-content-between px-2">
        {/* <Col lg={5} className="bg-white p-3"> */}
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} dialogClassName="modal-dialog-centered">
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Status Type Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="validationCustom01">
                <Form.Label>Type</Form.Label>
                <Form.Control type="text" name="type_name" value={formData.type_name} onChange={handleInputChange} />
                {validationErrors.type_name && <Form.Text className="text-danger">{validationErrors.type_name}</Form.Text>}
              </Form.Group>
              <Form.Group className="mb-3" controlId="validationCustom02">
                <Form.Label>Priority (1 to 5)</Form.Label>
                <Slider
                  aria-label="Priority"
                  value={formData.priority}
                  min={1}
                  max={5}
                  marks={[
                    { value: 1, label: "1" },
                    { value: 2, label: "2" },
                    { value: 3, label: "3" },
                    { value: 4, label: "4" },
                    { value: 5, label: "5" },
                  ]}
                  step={null}
                  onChange={(event: any, value: number | number[]) => setFormData({ ...formData, priority: value as number })}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" id="button-addon2" className="mt-3 ms-2" onClick={() => [setFormData(initialFormData)]}>
                Clear
              </Button>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-3 "
                onClick={() => (isUpdate ? [handleCancelUpdate(), toggleResponsiveModal()] : [toggleResponsiveModal(), handleResetValues()])}
              >
                {isUpdate ? "Cancel" : "Close"}
              </Button>
              <Button type="submit" variant="success" id="button-addon2" className="mt-3">
                {isUpdate ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        {/* </Col> */}

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Add Status Type
              </Button>
              <h4 className="header-title mb-4">Manage Status Type</h4>
              <Table
                columns={columns}
                data={records ? records : []}
                pageSize={10}
                sizePerPageList={sizePerPageList}
                isSortable={true}
                pagination={true}
                initialLoading={initialLoading}
                // isSelectable={true}
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

const StatusType = () => {
  const dispatch = useDispatch<AppDispatch>();
  //Fetch data from redux store
  const { state, loading, success, error, initialloading } = useSelector((state: RootState) => ({
    state: state.StatusTypes.types.data,
    loading: state.StatusTypes.loading,
    success: state.StatusTypes.success,
    error: state.StatusTypes.error,
    initialloading: state.StatusTypes.initialloading,
  }));


  console.log("STATE", state);

  useEffect(() => {
    dispatch(getStatusType());
  }, []);

  // if (initialloading) {
  //   return (
  //     <Spinner
  //       animation="border"
  //       style={{ position: "absolute", top: "50%", left: "50%" }}
  //     />
  //   );
  // }

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Status", path: "/status/status_type" },
          { label: "Status Type", path: "/status/status_type", active: true },
        ]}
        title={"Status Type"}
      />
      <Row>
        <Col>
          <BasicInputElements state={state || []} loading={loading} success={success} error={error} initialLoading={initialloading} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default StatusType;
