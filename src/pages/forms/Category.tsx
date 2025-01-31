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
import { addCategory, deleteCategory, getCategory, updateCategory } from "../../redux/actions";
import { AUTH_SESSION_KEY } from "../../constants";
import { error } from "console";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { regrexValidation } from "../../utils/regrexValidation";
const HistoryTable = React.lazy(() => import('../../components/HistoryTable'));

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
  category_name: "",
  category_description: "",
};

const initialValidationState = {
  category_name: "",
  category_description: "",
};

const BasicInputElements = withSwal((props: any) => {
  const { swal, state, loading, error, initialLoading } = props;
  const dispatch = useDispatch();

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  const [historyModal, setHistoryModal] = useState<boolean>(false);

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  //Input data
  const [formData, setFormData] = useState(initialFormData);

  const [validationErrors, setValidationErrors] = useState(initialValidationState);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  const records: TableRecords[] = state;

  const validationSchema = yup.object().shape({
    category_name: yup.string().required("Category name is required"),
    category_description: yup.string(),
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
      category_name: item?.name,
      category_description: item?.description,
    });
    setIsUpdate(true);
  };

  const handleDelete = (category_id: number) => {
    swal
      .fire({
        title: "Confirm Action",
        text: `Do you want to delete this category?`,
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
          dispatch(deleteCategory(category_id));
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

    if (!regrexValidation(name, value)) {
      console.error(`Invalid ${name}: ${value}`);
      return; // Stop updating if validation fails
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checkboxValue : value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      swal
        .fire({
          title: "Confirm Action",
          text: `Do you want to ${isUpdate ? "update" : "create"} this category?`,
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
            if (userInfo) {
              const { user_id } = JSON.parse(userInfo);
              // Validation passed, handle form submission
              if (isUpdate) {
                dispatch(updateCategory(formData.id, formData.category_name, formData.category_description));
              } else {
                dispatch(addCategory(formData.category_name, formData.category_description));
              }
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
      Header: "Lead Type Name",
      accessor: "name",
      sort: true,
    },
    {
      Header: "Lead Type Description",
      accessor: "description",
      sort: false,
    },
    // {
    //   Header: "Status",
    //   accessor: "status",
    //   sort: true,
    //   Cell: ({ row }: any) => (
    //     <React.Fragment>
    //       <span
    //         className={classNames("badge", {
    //           "badge-soft-success": row.original.status === true,
    //           "badge-soft-danger": row.original.status === false,
    //         })}
    //       >
    //         {row.original.status ? "active" : "disabled"}
    //       </span>
    //     </React.Fragment>
    //   ),
    // },
    // {
    //   Header: "Actions",
    //   accessor: "",
    //   sort: false,
    //   Cell: ({ row }: any) => (
    //     <div className="d-flex justify-content-center align-items-center gap-2">
    //       <Link to="#" className="action-icon" onClick={() => {
    //         setIsUpdate(true);
    //         handleUpdate(row.original);
    //         toggleResponsiveModal();
    //       }}>
    //         <i className="mdi mdi-square-edit-outline"></i>
    //       </Link>

    //       <Link to="#" className="action-icon" onClick={() =>
    //         handleDelete(row.original.id)
    //       }>
    //         <i className="mdi mdi-delete-outline"></i>
    //       </Link>
    //     </div>
    //   ),
    // },
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

  const toggleHistoryModal = () => {
    setHistoryModal(!historyModal);
  };

  return (
    <>
      <Row className="justify-content-between px-2">
        {/* <Col lg={5} className="bg-white p-3"> */}
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} dialogClassName="modal-dialog-centered">
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Lead Type Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="validationCustom01">
                <Form.Label>Lead Type Name</Form.Label>
                <Form.Control type="text" name="category_name" value={formData.category_name} onChange={handleInputChange} />
                {validationErrors.category_name && (
                  <Form.Text className="text-danger">{validationErrors.category_name}</Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="validationCustom01">
                <Form.Label>Lead Type Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="category_description"
                  value={formData.category_description}
                  onChange={handleInputChange}
                />
                {validationErrors.category_description && (
                  <Form.Text className="text-danger">{validationErrors.category_description}</Form.Text>
                )}
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
                onClick={() =>
                  isUpdate ? [handleCancelUpdate(), toggleResponsiveModal()] : [toggleResponsiveModal(), handleResetValues()]
                }
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

        <Modal show={historyModal} onHide={toggleHistoryModal} centered dialogClassName={"modal-full-width"} scrollable>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body style={{ margin: "0 !important", padding: "0 !important" }}>
            <HistoryTable apiUrl={"lead_type"} />
          </Modal.Body>
        </Modal>

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Add Lead Type
              </Button>

              <Button className="btn-sm btn-secondary waves-effect waves-light float-end me-2" onClick={toggleHistoryModal}>
                <i className="mdi mdi-history"></i> View History
              </Button>
              <h4 className="header-title mb-4">Manage Lead Type</h4>
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

const Category = () => {
  const dispatch = useDispatch<AppDispatch>();
  //Fetch data from redux store
  const { state, loading, success, error, initialloading } = useSelector((state: RootState) => ({
    state: state.Category.category.data,
    loading: state.Category.loading,
    success: state.Category.success,
    error: state.Category.error,
    initialloading: state.Category.initialloading,
  }));

  useEffect(() => {
    dispatch(getCategory());
  }, []);

  return (
    <React.Fragment>
      <PageTitle breadCrumbItems={[{ label: "Lead Type", path: "/settings/master/type", active: true }]} title={"Lead Type"} />
      <Row>
        <Col>
          <BasicInputElements state={state} loading={loading} success={success} error={error} initialLoading={initialloading} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Category;
