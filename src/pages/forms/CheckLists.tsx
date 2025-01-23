import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import Table from "../../components/Table";

import { withSwal } from "react-sweetalert2";
import FeatherIcons from "feather-icons-react";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Link, useLocation, useParams } from "react-router-dom";
import { addChecklist, deleteChecklist, getChecklistById, updateCheklist } from "../../redux/actions";
import Select from "react-select";
import { customStyles } from "../../constants";

interface TableRecords {
  id: number;
  source_name: string;
  source_description: string;
  status: string;
}
interface OptionType {
  value: number;
  label: string;
}
interface DataTypes {
  id: string;
  checklist_title: string;
  checklist_description: string;
  priority: number;
  checklist_type: string;
  has_attachment: boolean;
  status_id: string;
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
  checklist_title: "",
  checklist_description: "",
  priority: 0,
  checklist_type: "",
  has_attachment: false,
  status_id: "",
};

const initialValidationState = {
  checklist_title: "",
  checklist_description: "",
  priority: "",
  checklist_type: "",
  has_attachment: false,
};

const proirityTypes = [
  { label: "Low", value: 0 },
  { label: "Medium", value: 1 },
  { label: "High", value: 2 },
];

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { id } = useParams();

  const { swal, state } = props;
  //Table data
  const records: TableRecords[] = state;
  const [selectedOptions, setSelectedOptions] = useState<OptionType | null>(null);

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  //Input data
  const [formData, setFormData] = useState<DataTypes>(initialState);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(initialValidationState);

  const validationSchema = yup.object().shape({
    checklist_title: yup.string().required("checklist title is required").min(3, "checklist title must be at least 3 characters long"),
    checklist_description: yup.string().required("checklist description is required").min(3, "checklist description must be at least 3 characters long"),
    priority: yup.string().required("choose atleast one option"),
    checklist_type: yup.string().required("checklist type is required").min(3, "checklist type must be at least 3 characters long"),
  });

  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  const handleUpdate = (item: any) => {
    const updatedOptions: OptionType[] = proirityTypes?.filter((option: any) => option.value == item.priority);
    setSelectedOptions(updatedOptions[0]);
    setFormData({
      id: item?.id,
      checklist_title: item?.checklist_title,
      checklist_description: item?.checklist_description,
      priority: item?.priority,
      checklist_type: item?.checklist_type,
      has_attachment: item?.has_attachment,
      status_id: item?.status_id,
    });

    setIsUpdate(true);
  };

  //handle delete function
  const handleDelete = (itemId: string) => {
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
          dispatch(deleteChecklist(itemId, id));

          if (isUpdate) {
            setFormData(initialState);
          }
        }
      });
  };

  //handle onchange function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

      if (isUpdate) {
        // Handle update logic
        dispatch(updateCheklist(formData.id, formData.checklist_title, formData.checklist_description, formData.priority, formData.checklist_type, formData.has_attachment, id));
        setIsUpdate(false);
      } else {
        // Handle add logic
        dispatch(addChecklist(formData.checklist_title, formData.checklist_description, formData.priority, formData.checklist_type, formData.has_attachment, id));
      }

      // Clear validation errors
      setValidationErrors(initialValidationState);

      //clear form data
      setFormData(initialState);
      setSelectedOptions(null);

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
      Header: "No",
      accessor: "id",
      sort: true,
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
    },
    {
      Header: "Checklist Name",
      accessor: "checklist_title",
      sort: true,
    },
    {
      Header: "Checklist Description",
      accessor: "checklist_description",
      sort: false,
    },
    {
      Header: "Priority",
      accessor: "priority",
      sort: false,
    },
    {
      Header: "Checklist Type",
      accessor: "checklist_type",
      sort: false,
    },
    {
      Header: "Attachment",
      accessor: "has_attachment",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex gap-2 justify-content-center">
          {/* Edit Icon */}
          {row.original.has_attachment ? "Yes" : "No"}
        </div>
      ),
    },
    {
      Header: "Status Name",
      accessor: "status_name",
      sort: false,
    },
    {
      Header: "Actions",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* Edit Icon */}
          <Link to="#" className="action-icon" onClick={() => {
            handleUpdate(row.original);
          }}>
            <i className="mdi mdi-square-edit-outline"></i>
          </Link>

          {/* Delete Icon */}
          <Link to="#" className="action-icon" onClick={() =>
            handleDelete(row.original.id)
          }>
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
    setFormData(initialState);
    setSelectedOptions(null);
  };

  const handleOptionsChange = (selected: any) => {
    setSelectedOptions(selected);
    setFormData((prev) => ({
      ...prev,
      priority: selected.value,
    }));
  };

  return (
    <>
      <Row className="justify-content-between px-2">
        <Col xl={5} className="bg-white p-3">
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="checklist_title">
              <Form.Label>Checklist Title</Form.Label>
              <Form.Control type="text" name="checklist_title" value={formData.checklist_title} onChange={handleInputChange} />
              {validationErrors.checklist_title && <Form.Text className="text-danger">{validationErrors.checklist_title}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="checklist_description">
              <Form.Label>Checklist Description</Form.Label>
              <Form.Control as="textarea" rows={5} name="checklist_description" value={formData.checklist_description} onChange={handleInputChange} />
              {validationErrors.checklist_description && <Form.Text className="text-danger">{validationErrors.checklist_description}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="checklist_type">
              <Form.Label>Checklist Type</Form.Label>
              <Form.Control type="text" name="checklist_type" value={formData.checklist_type} onChange={handleInputChange} />
              {validationErrors.checklist_type && <Form.Text className="text-danger">{validationErrors.checklist_type}</Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="priority">
              <Form.Label>Status Type</Form.Label>
              <Select
                styles={customStyles}
                className="react-select react-select-container"
                name="priority"
                classNamePrefix="react-select"
                options={proirityTypes}
                value={selectedOptions}
                onChange={handleOptionsChange}
              />

              {validationErrors.priority && <Form.Text className="text-danger">{validationErrors.priority}</Form.Text>}
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

        <Col lg={7} className="p-0 form__card">
          <Card className="bg-white mt-md-3 m-lg-0 ms-lg-3">
            <Card.Body>
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

const CheckLists = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const [statusData, setstatusData] = useState("");

  //Fetch data from redux store
  const { state } = useSelector((state: RootState) => ({
    state: state.Checklist.checklist.data,
  }));

  const Status = useSelector((state: RootState) => state.Status.status.data);

  useEffect(() => {
    if (id) {
      dispatch(getChecklistById(id));
    }
  }, []);

  useEffect(() => {
    if (Status) {
      const SelectedStatus = Status.filter((item: any) => item.id == id);
      setstatusData(SelectedStatus[0].status_name);
    }
  }, [Status]);

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Checklist", path: "/master/checklist", active: true },
        ]}
        title={`Check Lists - ${statusData}`}
      />
      <Row>
        <Col>
          <BasicInputElements state={state} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default CheckLists;
