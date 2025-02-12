import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import Table from "../../components/Table";
import { withSwal } from "react-sweetalert2";
// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addVisaChecklist, deleteVisaChecklist, getVisaChecklist, updateVisaCheklist } from "../../redux/actions";
import Select from "react-select";
import { AUTH_SESSION_KEY, customStyles } from "../../constants";
import { Link } from "react-router-dom";
import { regrexValidation } from "../../utils/regrexValidation";
import { useHistoryModal } from "../../hooks/useHistoryModal";
const HistoryTable = React.lazy(() => import('../../components/HistoryTable'));

// Interfaces
interface TableRecords {
  id: string;
  step_name: string;
  description: string;
  fields: Array<FieldData>;
}

interface FieldData {
  field_name: string;
  field_type: string;
}

interface ValidationErrors {
  step_name?: string;
  description?: string;
  fields?: Array<{
    field_name?: string;
    field_type?: string;
  }>;
}

// Constants
const sizePerPageList = [
  { text: "10", value: 10 },
  { text: "25", value: 25 },
  { text: "50", value: 50 },
  { text: "100", value: 100 },
];

const initialState = {
  id: "",
  step_name: "",
  description: "",
  fields: [{ field_name: "", field_type: "" }],
};

const initialValidationState: ValidationErrors = {
  step_name: "",
  description: "",
  fields: [],
};

const fieldTypeOptions = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  // { value: "checkbox", label: "Checkbox" },
  { value: "textarea", label: "Textarea" },
  { value: "radio", label: "Radio" },
  // { value: "select", label: "Dropdown" },
];

// Validation Schema
const validationSchema = yup.object().shape({
  step_name: yup
    .string()
    .required("Step name is required")
    .min(3, "Step name must be at least 3 characters long")
    .matches(/^[a-zA-Z0-9\s_]+$/, "Step name can only contain letters, numbers, spaces and underscores"),
  description: yup.string(),
  fields: yup
    .array()
    .of(
      yup.object().shape({
        field_name: yup
          .string()
          .required("Field name is required")
          .min(2, "Field name must be at least 2 characters long")
          .matches(/^[a-zA-Z0-9\s_]+$/, "Field name can only contain letters, numbers, spaces and underscores"),
        field_type: yup
          .string()
          .required("Field type is required")
          .oneOf(
            fieldTypeOptions.map((option) => option.value),
            "Invalid field type selected"
          ),
      })
    )
    .min(1, "At least one field is required"),
});

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {historyModal,toggleHistoryModal} = useHistoryModal();
  const { swal, state, error, loading, initialLoading } = props;
  

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //Table data
  const records: TableRecords[] = state;

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState(initialState);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(initialValidationState);

  // Update the error handling in onSubmit
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      swal
        .fire({
          title: "Confirm Action",
          text: `Do you want to ${isUpdate ? "update" : "create"} this Visa Checklist?`,
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
          if (result.isConfirmed && userInfo) {
            if (isUpdate) {
              dispatch(updateVisaCheklist(formData.id, formData.step_name, formData.description, formData.fields));
              setIsUpdate(false);
            } else {
              dispatch(addVisaChecklist(formData.step_name, formData.description, formData.fields));
            }
          }
        });
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        const errors: ValidationErrors = {
          fields: [],
        };

        validationError.inner.forEach((error) => {
          if (error.path) {
            if (error.path.includes("fields")) {
              const matches = error.path.match(/fields\[(\d+)\]\.(.+)/);
              if (matches) {
                const [_, indexStr, field] = matches;
                const index = parseInt(indexStr);
                if (!errors.fields) {
                  errors.fields = [];
                }
                // Ensure the array has enough elements
                while (errors.fields.length <= index) {
                  errors.fields.push({});
                }
                errors.fields[index] = {
                  ...errors.fields[index],
                  [field]: error.message,
                };
              }
            } else {
              (errors as any)[error.path] = error.message;
            }
          }
        });
        setValidationErrors(errors);
      }
    }
  };

  // Update the validation schema to match these types
  const validationSchema = yup.object().shape({
    step_name: yup.string().required("Step name is required").min(3, "Step name must be at least 3 characters long"),
    description: yup.string(),
    fields: yup
      .array()
      .of(
        yup.object().shape({
          field_name: yup.string().required("Field name is required").min(2, "Field name must be at least 2 characters long"),
          field_type: yup
            .string()
            .required("Field type is required")
            .oneOf(
              fieldTypeOptions.map((option) => option.value),
              "Invalid field type selected"
            ),
        })
      )
      .min(1, "At least one field is required"),
  });

  const handleUpdate = (item: any) => {
    //update source dropdown
    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      step_name: item?.step_name,
      description: item?.description,
      fields: item?.fields,
    }));

    setIsUpdate(true);
  };

  //handle delete function
  const handleDelete = (id: string) => {
    swal
      .fire({
        title: "Confirm Action",
        text: `Do you want to delete this visa checklist?`,
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
          dispatch(deleteVisaChecklist(id));
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

  const columns = [
    {
      Header: "No",
      accessor: "id",
      sort: false,
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
    },
    {
      Header: "Step Name",
      accessor: "step_name",
      sort: true,
    },
    {
      Header: "Description",
      accessor: "description",
      sort: false,
    },
    {
      Header: "Field name and type",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <ul style={{ listStyle: "none" }}>
          {row.original.fields?.map((item: any) => (
            <li key={item?.id}>
              {item?.field_name} - {item?.field_type}
            </li>
          ))}
        </ul>
      ),
    },
    {
      Header: "Actions",
      accessor: "",
      sort: false,
      maxWidth: 10,
      Cell: ({ row }: any) => (
        <div className="d-flex gap-1">
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
      // Clear validation errors
    }
  }, [loading, error]);

  const handleAddField = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, { field_name: "", field_type: "" }],
    }));
  };

  // Remove field handler
  const handleRemoveField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const handleFieldChange = (index: number, field: string, value: string) => {
    const updatedFields = [...formData.fields];
    updatedFields[index] = {
      ...updatedFields[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      fields: updatedFields,
    }));
  };

  

  return (
    <>
      <Row className="justify-content-between px-2">
        {/* <Col lg={5} className="bg-white p-3"> */}
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} dialogClassName="modal-lg modal-dialog-centered">
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Visa Checklist Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="step_name">
                    <Form.Label>Step Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="step_name"
                      value={formData.step_name}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.step_name}
                    />
                    <Form.Control.Feedback type="invalid">{validationErrors.step_name}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.description}
                    />
                    <Form.Control.Feedback type="invalid">{validationErrors.description}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <label className="form-label mb-0">Fields</label>
                  <Button variant="primary" size="sm" onClick={handleAddField}>
                    <i className="mdi mdi-plus-circle me-1"></i>
                    Add Field
                  </Button>
                </div>

                {formData.fields.map((field, index) => (
                  <div key={index} className="mb-3 p-3 border rounded">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Field {index + 1}</h6>
                      {formData.fields.length > 1 && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="float-end d-flex align-items-center justify-content-center"
                          onClick={() => handleRemoveField(index)}
                        >
                          <i className="mdi mdi-delete-outline"></i>
                        </Button>
                      )}
                    </div>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-2">
                          <Form.Label>Field Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={field.field_name}
                            onChange={(e) => handleFieldChange(index, "field_name", e.target.value)}
                            placeholder="Enter field name"
                            isInvalid={!!validationErrors.fields?.[index]?.field_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.fields?.[index]?.field_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Field Type</Form.Label>
                          <Select
                            value={fieldTypeOptions.find((option) => option.value === field.field_type)}
                            options={fieldTypeOptions}
                            onChange={(option) => handleFieldChange(index, "field_type", option?.value || "")}
                            styles={{
                              ...customStyles,
                              control: (base, state) => ({
                                ...base,
                                borderColor: validationErrors.fields?.[index]?.field_type ? "#dc3545" : base.borderColor,
                                "&:hover": {
                                  borderColor: validationErrors.fields?.[index]?.field_type ? "#dc3545" : base.borderColor,
                                },
                              }),
                            }}
                            placeholder="Select field type"
                          />
                          {validationErrors.fields?.[index]?.field_type && (
                            <div className="text-danger mt-1 small">{validationErrors.fields[index].field_type}</div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="primary" id="button-addon2" className="mt-1 ms-2" onClick={() => [handleResetValues()]}>
                Clear
              </Button>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1"
                onClick={() =>
                  isUpdate ? [handleCancelUpdate(), toggleResponsiveModal()] : [toggleResponsiveModal(), handleResetValues()]
                }
              >
                {isUpdate ? "Cancel" : "Close"}
              </Button>
              <Button type="submit" variant="success" id="button-addon2" className="mt-1">
                {isUpdate ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        {/* </Col> */}

        <Modal show={historyModal} onHide={toggleHistoryModal} centered dialogClassName={"modal-full-width"} scrollable>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body style={{ margin: "0 !important", padding: "0 !important" }}>
            <HistoryTable apiUrl={"visa_checklists"} />
          </Modal.Body>
        </Modal>

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Add Visa Checklist
              </Button>

              {/* <Button className="btn-sm btn-secondary waves-effect waves-light float-end me-2" onClick={toggleHistoryModal}>
                <i className="mdi mdi-history"></i> View History
              </Button> */}
              <h4 className="header-title mb-4">Manage Visa Checklist</h4>
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

const VisaChecklist = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Fetch data from redux store
  const { state, error, loading, initialloading } = useSelector((state: RootState) => ({
    state: state.VisaChecklists?.visaChecklist?.data,
    error: state.VisaChecklists?.error,
    loading: state.VisaChecklists.loading,
    initialloading: state.VisaChecklists.initialloading,
  }));

  useEffect(() => {
    dispatch(getVisaChecklist());
  }, []);

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          // { label: "Master", path: "/settings/master/visa_checklists" },
          { label: "Visa Checklists", path: "/settings/master/visa_checklists", active: true },
        ]}
        title={"Visa Checklists"}
      />
      <Row>
        <Col>
          <BasicInputElements state={state || []} error={error} loading={loading} initialLoading={initialloading} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default VisaChecklist;
