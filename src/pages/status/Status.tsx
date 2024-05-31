import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
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
    text: "5",
    value: 5,
  },
  {
    text: "10",
    value: 10,
  },
  {
    text: "20",
    value: 20,
  },
];

const initialState = {
  id: "",
  status_name: "",
  status_description: "",
  color: "",
  updated_by: "",
  status_type: null,
  is_substatus: null,
};

const initialValidationState = {
  status_name: "",
  status_description: "",
  color: "",
  status_type: "",
  is_substatus: "",
};

const BasicInputElements = withSwal((props: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state } = props;
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
    status_type: yup.string().nullable().required("choose atleast one status type"),
    is_substatus: yup.string().nullable().required("choose atleast one status type"),
  });

  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  const setDefaultColor = (color: string) => {
    // RGBA color value
    const rgbaColor: string = color;

    // Extract RGB values
    const rgbValues: RegExpMatchArray | null = rgbaColor.match(/\d+/g);
    let hexColor: string;
    if (rgbValues !== null) {
      const red: number = parseInt(rgbValues[0]);
      const green: number = parseInt(rgbValues[1]);
      const blue: number = parseInt(rgbValues[2]);

      // Convert RGB to hex
      const redHex: string = red.toString(16).padStart(2, "0");
      const greenHex: string = green.toString(16).padStart(2, "0");
      const blueHex: string = blue.toString(16).padStart(2, "0");

      // Combine to form hex color code
      hexColor = `#${redHex}${greenHex}${blueHex}`;

      setupdateColor(hexColor);
    }
  };

  const handleUpdate = (item: any) => {
    const updatedOptions: OptionType[] = statusTypes?.filter((option: any) => option.value == item.status_type);
    setSelectedOptions(updatedOptions[0]);

    const updatedStatusType: OptionType[] = isSubStatus?.filter((option: any) => option.value == item.is_substatus);
    setSubStatusType(updatedStatusType[0]);

    setDefaultColor(item.color);
    setFormData({
      id: item?.id,
      status_name: item?.status_name,
      status_description: item?.status_description,
      color: item?.color ? item.color : "",
      updated_by: item?.updated_by,
      status_type: item?.status_type,
      is_substatus: item?.is_substatus,
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
      if (userInfo) {
        const { user_id } = JSON.parse(userInfo);
        if (isUpdate) {
          // Handle update logic

          dispatch(updateStatus(formData.id, formData.status_name, formData.status_description, formData.color, user_id, formData.status_type, formData.is_substatus));
          setIsUpdate(false);
        } else {
          // Handle add logic
          dispatch(addStatus(formData.status_name, formData.status_description, formData.color, user_id, formData.status_type, formData.is_substatus));
        }
      }

      // Clear validation errors
      setValidationErrors(initialValidationState);

      //clear form data
      setFormData(initialState);
      setSelectedOptions(null);
      setSubStatusType(null);
      setupdateColor(null);

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

  const columns = [
    {
      Header: "ID",
      accessor: "id",
      sort: true,
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
      Header: "Status Priority",
      accessor: "status_type",
      sort: false,
      Cell: ({ row }: any) => <span>{row.original.status_type === 0 ? "Potential" : "Spam"}</span>,
    },
    {
      Header: "Status Type",
      accessor: "is_substatus",
      sort: false,
      Cell: ({ row }: any) => <span>{row.original.is_substatus === 0 ? "Status" : row.original.is_substatus === 1 ? "Sub Status" : ""}</span>,
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
      Header: "View Checklist",
      accessor: "view_checklist",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-1">
          <FeatherIcons
            icon="eye"
            size={15}
            className="cursor-pointer text-secondary"
            onClick={() => {
              navigate(`/settings/master/status/checklist/${row.original.id}`, {
                state: { data: row.original.status_name },
              });
            }}
          />
        </div>
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
              handleUpdate(row.original);
              toggleResponsiveModal();
              setValidationErrors(initialValidationState);
            }}
          />

          {/* Delete Icon */}
          <FeatherIcons icon="trash-2" size="15" className="cursor-pointer text-secondary" onClick={() => handleDelete(row.original.id)} />
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
  const handleOptionsChange = (selected: any) => {
    setSelectedOptions(selected);
    setFormData((prev) => ({
      ...prev,
      status_type: selected.value,
    }));
  };

  const handleSubStatusChange = (selected: any) => {
    setSubStatusType(selected);
    setFormData((prev) => ({
      ...prev,
      is_substatus: selected.value,
    }));
  };

  const toggleResponsiveModal = () => {
    setResponsiveModal(!responsiveModal);
    setValidationErrors(initialValidationState);
    if(isUpdate){
      handleCancelUpdate()
    }
  };

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

              <Form.Group className="mb-3" controlId="status_type">
                <Form.Label>Status Priority</Form.Label>
                <Select
                  className="react-select react-select-container"
                  name="status_type"
                  classNamePrefix="react-select"
                  options={statusTypes}
                  value={selectedOptions}
                  onChange={handleOptionsChange}
                />

                {validationErrors.status_type && <Form.Text className="text-danger">{validationErrors.status_type}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="is_substatus">
                <Form.Label>Status Type</Form.Label>
                <Select
                  className="react-select react-select-container"
                  name="is_substatus"
                  classNamePrefix="react-select"
                  options={isSubStatus}
                  value={subStatusType}
                  onChange={handleSubStatusChange}
                />

                {validationErrors.is_substatus && <Form.Text className="text-danger">{validationErrors.is_substatus}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="color">
                <Form.Label>Color</Form.Label>
                <br />
                <InputColor
                  initialValue={updateColor ? updateColor : "#5e72e4"}
                  onChange={(e) =>
                    setFormData((prevData: any) => ({
                      ...prevData,
                      color: e.rgba,
                    }))
                  }
                  placement="right"
                />
                {validationErrors.color && <Form.Text className="text-danger">{validationErrors.color}</Form.Text>}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1 ms-2"
                onClick={() => (isUpdate ? [handleCancelUpdate(), toggleResponsiveModal()] : toggleResponsiveModal())}
              >
                {isUpdate ? "Cancel" : "Close"}
              </Button>
              <Button type="submit" variant="success" id="button-addon2" className="mt-1">
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
              <Table columns={columns} data={records ? records : []} pageSize={5} sizePerPageList={sizePerPageList} isSortable={true} pagination={true} isSearchable={true} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

const Status = () => {
  const dispatch = useDispatch<AppDispatch>();

  //Fetch data from redux store
  const Status = useSelector((state: RootState) => state.Status.status.data);
  useEffect(() => {
    dispatch(getStatus());
  }, []);

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
          <BasicInputElements state={Status} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Status;
