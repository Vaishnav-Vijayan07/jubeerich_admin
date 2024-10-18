import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Card, Form, Button, Modal, Spinner } from "react-bootstrap";
import Table from "../../components/Table";
import InputColor from "react-input-color";

import { withSwal } from "react-sweetalert2";
import FeatherIcons from "feather-icons-react";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addStatus, deleteStatus, getStatus, updateStatus } from "../../redux/actions";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { AUTH_SESSION_KEY } from "../../constants";

interface TableRecords {
  id: number;
  status_name: string;
  status_description: string;
  color: string;
}
interface OptionType {
  value: number;
  label: string;
}

const statusTypes = [
  { label: "Potential", value: 0 },
  { label: "Spam", value: 1 },
];
const isSubStatus = [
  { label: "Status", value: 0 },
  { label: "Sub Status", value: 1 },
];
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
  status_name: "",
  status_description: "",
  color: "",
  updated_by: ""
};

const initialValidationState = {
  status_name: "",
  status_description: "",
  color: ""
};

const BasicInputElements = withSwal((props: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, loading, success, error, initialloading } = props;

  console.log("loading ===>", loading);
  console.log("error ===>", error);

  const [selectedOptions, setSelectedOptions] = useState<OptionType | null>(null);
  const [subStatusType, setSubStatusType] = useState<OptionType | null>(null);
  const [updateColor, setupdateColor] = useState<string | null>(null);

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //Table data
  const records: TableRecords[] = state;

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  //Input data
  const [formData, setFormData] = useState(initialState);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(initialValidationState);

  const validationSchema = yup.object().shape({
    status_name: yup.string().required("status name is required").min(3, "status name must be at least 3 characters long"),
    status_description: yup.string().required("status description is required").min(3, "status description must be at least 3 characters long"),
  });

  console.log("formData ==>", formData);


  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  const handleUpdate = (item: any) => {
    const updatedOptions: OptionType[] = statusTypes?.filter((option: any) => option.value == item.status_type);
    setSelectedOptions(updatedOptions[0]);

    const updatedStatusType: OptionType[] = isSubStatus?.filter((option: any) => option.value == item.is_substatus);
    setSubStatusType(updatedStatusType[0]);

    setupdateColor(item.color)
    setFormData({
      id: item?.id,
      status_name: item?.status_name,
      status_description: item?.status_description,
      color: item?.color ? item.color : "",
      updated_by: item?.updated_by
    });

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
          dispatch(deleteStatus(id));
          // swal.fire("Deleted!", "Your item has been deleted.", "success");
        }
      });
  };

  //handle onchange function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
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
        confirmButtonText: `Yes, ${isUpdate ? 'Update': 'Create'}`,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          if (userInfo) {
            const { user_id } = JSON.parse(userInfo);
            if (isUpdate) {
              // Handle update logic
    
              dispatch(updateStatus(formData.id, formData.status_name, formData.status_description, formData.color, user_id));
              setIsUpdate(false);
            } else {
              // Handle add logic
              dispatch(addStatus(formData.status_name, formData.status_description, formData.color, user_id));
            }
          }
        }
      }).catch((err: any)=>{
        console.log(err);
      })

      // if (userInfo) {
      //   const { user_id } = JSON.parse(userInfo);
      //   if (isUpdate) {
      //     // Handle update logic

      //     dispatch(updateStatus(formData.id, formData.status_name, formData.status_description, formData.color, user_id));
      //     setIsUpdate(false);
      //   } else {
      //     // Handle add logic
      //     dispatch(addStatus(formData.status_name, formData.status_description, formData.color, user_id));
      //   }
      // }

      // Clear validation errors
      setValidationErrors(initialValidationState);

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
  };
  useEffect(() => {
    // Check for errors and clear the form
    if (!loading && !error) {
      console.log("here ======>");

      setResponsiveModal(false);
      // Clear validation errors
      setValidationErrors(initialValidationState);
      setFormData(initialState);
      setSelectedOptions(null);
      setSubStatusType(null);
      setupdateColor(null);
    }
  }, [loading, error]);

  const columns = [
    {
      Header: "ID",
      accessor: "id",
      sort: false,
    },
    {
      Header: "Status Name",
      accessor: "status_name",
      sort: true,
    },
    {
      Header: "Status Description",
      accessor: "status_description",
      sort: false,
    },
    {
      Header: "Color",
      accessor: "color",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          <span
            style={{
              width: "40px",
              height: "15px",
              backgroundColor: `${row.original.color}`,
            }}
          />
        </div>
      ),
    },
    {
      Header: " ",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* Edit Icon */}
          <FeatherIcons
            stroke="#28a745"
            icon="edit"
            size="15"
            className="cursor-pointer text-secondary"
            onClick={() => {
              handleUpdate(row.original);
              toggleResponsiveModal();
              setValidationErrors(initialValidationState);
            }}
          />

          {/* Delete Icon */}
          <FeatherIcons stroke="#dc3545" icon="trash-2" size="15" className="cursor-pointer text-secondary" onClick={() => handleDelete(row.original.id)} />
        </div>
      ),
    },
  ];

  //handle cancel update section
  const handleCancelUpdate = () => {
    setIsUpdate(false);
    setFormData(initialState);
    setSelectedOptions(null);
    setSubStatusType(null);
  };

  const toggleResponsiveModal = () => {
    setResponsiveModal(!responsiveModal);
    setValidationErrors(initialValidationState);
    if (isUpdate) {
      handleCancelUpdate()
    }
  };

  const handleResetValues = () => {
    setValidationErrors(initialValidationState);
    setFormData(initialState);
    setSelectedOptions(null);
    setSubStatusType(null);
  }

  return (
    <>
      <Row className="justify-content-between px-2">
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} dialogClassName="modal-dialog-centered">
          {/* <Col lg={5} className="bg-white p-3 mr-2"> */}
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Status Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="status_name">
                <Form.Label>Status Name</Form.Label>
                <Form.Control type="text" placeholder="Enter status name" name="status_name" value={formData.status_name} onChange={handleInputChange} />
                {validationErrors.status_name && <Form.Text className="text-danger">{validationErrors.status_name}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="status_description">
                <Form.Label>Status Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter status description"
                  rows={5}
                  name="status_description"
                  value={formData.status_description}
                  onChange={handleInputChange}
                />
                {validationErrors.status_description && <Form.Text className="text-danger">{validationErrors.status_description}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="color">
                <Form.Label>Color</Form.Label>
                <br />
                <InputColor
                  initialValue={updateColor ? updateColor : "#5e72e4"}
                  onChange={(e) => {
                    setFormData((prevData: any) => ({
                      ...prevData,
                      color: e.rgba,
                    }))
                  }
                  }
                  placement="right"
                />
                {validationErrors.color && <Form.Text className="text-danger">{validationErrors.color}</Form.Text>}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                id="button-addon2"
                className="mt-1 ms-2"
                onClick={() => [handleResetValues()]
                }
              >
                Clear
              </Button>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1 "
                onClick={() => (isUpdate ? [handleCancelUpdate(), toggleResponsiveModal()] : [toggleResponsiveModal(), handleResetValues()])}
              >
                {isUpdate ? "Cancel" : "Close"}
              </Button>
              <Button type="submit" variant="success" id="button-addon2" className="mt-1" disabled={loading}>
                {isUpdate ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
            {/* </Col> */}
          </Form>
        </Modal>

        <Col className="form__card p-0">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Add Status
              </Button>
              <h4 className="header-title mb-4">Manage Status</h4>
              <Table columns={columns} data={records ? records : []} pageSize={10} sizePerPageList={sizePerPageList} isSortable={true} pagination={true} isSearchable={true}
                tableClass="table-striped dt-responsive nowrap w-100"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

const Status = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { Status, loading, success, error, initialloading } = useSelector(
    (state: RootState) => ({
      Status: state.Status.status.data,
      loading: state.Status.loading,
      success: state.Status.success,
      error: state.Status.error,
      initialloading: state.Status.initialloading,
    })
  );
  useEffect(() => {
    dispatch(getStatus());
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
          { label: "Master", path: "/master/status" },
          { label: "Status", path: "/master/status", active: true },
        ]}
        title={"Status"}
      />
      <Row>
        <Col>
          <BasicInputElements state={Status} loading={loading} success={success} error={error} initialloading={initialloading} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Status;
