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
import {
  addCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "../../redux/actions";
import { AUTH_SESSION_KEY } from "../../constants";
import { error } from "console";

interface TableRecords {
  id: number;
  category_name: string;
  category_description: string;
  status: boolean;
}

const sizePerPageList = [
  {
    text: "5",
    value: 5,
  },
];

const initialFormData = {
  id: "",
  category_name: "",
  category_description: "",
  parent_category_id: "1",
  status: true,
  updated_by: "",
};

const initialValidationState = {
  category_name: "",
  category_description: "",
};

const BasicInputElements = withSwal((props: any) => {
  const { swal, state, loading, error } = props;
  const dispatch = useDispatch();

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  //Input data
  const [formData, setFormData] = useState(initialFormData);

  const [validationErrors, setValidationErrors] = useState(
    initialValidationState
  );

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  const records: TableRecords[] = state;

  const validationSchema = yup.object().shape({
    category_name: yup
      .string()
      .required("Category name is required")
      .min(3, "Category name must be at least 3 characters long"),
    category_description: yup
      .string()
      .required("Category description is required")
      .min(3, "Category description must be at least 3 characters long"),
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
      category_name: item?.category_name,
      category_description: item?.category_description,
      parent_category_id: item.parent_category_id,
      status: item?.status,
      updated_by: item.updated_by,
    });
    setIsUpdate(true);
  };

  const handleDelete = (category_id: number, updated_by: number) => {
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
          dispatch(deleteCategory(category_id, updated_by));
          //clear form data
          if (isUpdate) {
            setFormData(initialFormData);
          }
        }
      });
  };

  //handle onchange function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    const checkboxValue = checked ? true : false;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checkboxValue : value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      if (userInfo) {
        const { user_id } = JSON.parse(userInfo);
        // Validation passed, handle form submission
        if (isUpdate) {
          dispatch(
            updateCategory(
              formData.id,
              formData.category_name,
              formData.category_description,
              // formData.parent_category_id,
              formData.status,
              user_id
            )
          );
        } else {
          await dispatch(
            addCategory(
              formData.category_name,
              formData.category_description,
              // formData.parent_category_id,
              formData.status,
              user_id
            )
          );
        }
      }
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
      sort: true,
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
    },
    {
      Header: "Lead Category Name",
      accessor: "category_name",
      sort: true,
    },
    {
      Header: "Lead Category Description",
      accessor: "category_description",
      sort: false,
    },
    {
      Header: "Status",
      accessor: "status",
      sort: true,
      Cell: ({ row }: any) => (
        <span>{row.original.status ? "active" : "disabled"}</span>
      ),
    },
    {
      Header: "Actions",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* Edit Icon */}
          <FeatherIcons
            icon="edit"
            size="15"
            className="cursor-pointer text-secondary"
            onClick={() => {
              setIsUpdate(true);
              handleUpdate(row.original);
              toggleResponsiveModal();
            }}
          />

          {/* Delete Icon */}
          <FeatherIcons
            icon="trash-2"
            size="15"
            className="cursor-pointer text-secondary"
            onClick={() =>
              handleDelete(row.original.id, row.original.updated_by)
            }
          />
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
        <Modal
          show={responsiveModal}
          onHide={toggleResponsiveModal}
          dialogClassName="modal-dialog-centered"
        >
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Lead Category Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="validationCustom01">
                <Form.Label>Lead Category Name</Form.Label>
                <Form.Control
                  type="text"
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleInputChange}
                />
                {validationErrors.category_name && (
                  <Form.Text className="text-danger">
                    {validationErrors.category_name}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="validationCustom01">
                <Form.Label>Lead Category Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="category_description"
                  value={formData.category_description}
                  onChange={handleInputChange}
                />
                {validationErrors.category_description && (
                  <Form.Text className="text-danger">
                    {validationErrors.category_description}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Check
                  type="switch"
                  id="active-switch"
                  label={formData.status === true ? "Active" : "Inactive"}
                  name="status"
                  onChange={handleInputChange}
                  // value={inputs.status}
                  checked={formData.status}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-3 ms-2"
                onClick={() =>
                  isUpdate
                    ? [handleCancelUpdate(), toggleResponsiveModal()]
                    : toggleResponsiveModal()
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
        {/* </Col> */}

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button
                className="btn-sm btn-blue waves-effect waves-light float-end"
                onClick={toggleResponsiveModal}
              >
                <i className="mdi mdi-plus-circle"></i> Add Lead Category
              </Button>
              <h4 className="header-title mb-4">Manage Lead Categories</h4>
              <Table
                columns={columns}
                data={records ? records : []}
                pageSize={5}
                sizePerPageList={sizePerPageList}
                isSortable={true}
                pagination={true}
                isSearchable={true}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

const Category = () => {
  const dispatch = useDispatch<AppDispatch>();
  //Fetch data from redux store
  const { state, loading, success, error, initialloading } = useSelector(
    (state: RootState) => ({
      state: state.Category.category.data,
      loading: state.Category.loading,
      success: state.Category.success,
      error: state.Category.error,
      initialloading: state.Category.initialloading,
    })
  );

  useEffect(() => {
    dispatch(getCategory());
  }, []);

  if (initialloading) {
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
          { label: "Master", path: "/master/category" },
          { label: "Lead Category", path: "/master/category", active: true },
        ]}
        title={"Lead Category"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            loading={loading}
            success={success}
            error={error}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Category;
