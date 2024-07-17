import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import InputColor from "react-input-color";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../redux/store";
import * as yup from "yup";
import FeatherIcons from "feather-icons-react";
import { yupResolver } from "@hookform/resolvers/yup";

import { addStatus, deleteStatus, getStatus, updateStatus } from "../../redux/actions";
import Select from "react-select";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { AUTH_SESSION_KEY } from "../../constants";

interface modalType {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}
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

const StatusModal = ({ modal, setModal }: modalType) => {
  const [standard, setStandard] = useState<boolean>(false);
  const [size, setSize] = useState<"sm" | "lg" | "xl">();
  const [className, setClassName] = useState<string>("");
  const [scroll, setScroll] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedOptions, setSelectedOptions] = useState<OptionType | null>(null);
  const [subStatusType, setSubStatusType] = useState<OptionType | null>(null);
  const [updateColor, setupdateColor] = useState<string | null>(null);

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  //Input data
  const [formData, setFormData] = useState(initialState);

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

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
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result: any) => {
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
          dispatch(
            updateStatus(
              formData.id,
              formData.status_name,
              formData.status_description,
              formData.color,
              // formData.updated_by,
              user_id,
              formData.status_type,
              formData.is_substatus
            )
          );
          setIsUpdate(false);
        } else {
          // Handle add logic
          dispatch(
            addStatus(
              formData.status_name,
              formData.status_description,
              formData.color,
              // formData.updated_by,
              user_id,
              formData.status_type,
              formData.is_substatus
            )
          );
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
      Header: "Status Type",
      accessor: "status_type",
      sort: false,
      Cell: ({ row }: any) => <span>{row.original.status_type === 0 ? "Potential" : "Spam"}</span>,
    },
    {
      Header: "Status / Sub status",
      accessor: "is_substatus",
      sort: false,
      Cell: ({ row }: any) => <span>{row.original.is_substatus === 0 ? "Status" : row.original.is_substatus === 1 ? "Sub Status" : ""}</span>,
    },
    {
      Header: "Color",
      accessor: "color",
      sort: false,
      Cell: ({ row }: any) => (
        <div
          style={{
            width: "40px",
            height: "15px",
            backgroundColor: `${row.original.color}`,
          }}
        />
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
            className="cursor-pointer"
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
        <div className="d-flex gap-2">
          {/* Edit Icon */}
          <FeatherIcons
            icon="edit"
            size="15"
            className="cursor-pointer text-secondary"
            onClick={() => {
              handleUpdate(row.original);
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
  const toggle = () => {
    setModal(!modal);
    if (isUpdate) {
      handleCancelUpdate();
    }
  };
  return (
    <Modal show={modal} onHide={toggle} dialogClassName={className} size={size} scrollable={scroll}>
      <Modal.Header onHide={toggle} closeButton>
        <h4 className="modal-title">Modal Heading</h4>
      </Modal.Header>
      <Modal.Body>
        <Row className="justify-content-between">
          <Col className="bg-white p-3">
            <Form onSubmit={onSubmit}>
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
                <Form.Label>Priority</Form.Label>
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

              <Button type="submit" variant="primary" id="button-addon2" className="mt-1">
                {isUpdate ? "Update" : "Submit"}
              </Button>
              {isUpdate && (
                <Button variant="secondary" id="button-addon2" className="mt-1 ms-2" onClick={() => handleCancelUpdate()}>
                  Cancel
                </Button>
              )}
            </Form>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={toggle}>
          Close
        </Button>{" "}
        <Button variant="primary" onClick={toggle}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StatusModal;
