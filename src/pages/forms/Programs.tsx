import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Dropdown,
  Modal,
  Spinner,
} from "react-bootstrap";
import Table from "../../components/Table";

import { withSwal } from "react-sweetalert2";
import FeatherIcons from "feather-icons-react";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getSource } from "../../redux/sources/actions";
import Select from "react-select";
import { AUTH_SESSION_KEY, customStyles } from "../../constants";
import { getUniversity } from "../../redux/University/actions";
import {
  addProgram,
  deleteProgram,
  getProgram,
  updateProgram,
} from "../../redux/programs/actions";
import { Link } from "react-router-dom";

interface OptionType {
  value: string;
  label: string;
}

interface TableRecords {
  id: string;
  source_id: string;
  channel_name: string;
  channel_description: string;
  updated_by: string;
  status: string;
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
  program_name: "",
  university_id: "",
  degree_level: "",
  duration: "",
  tuition_fees: null,
  currency: "",
};

const initialValidationState = {
  program_name: "",
  university_id: "",
  degree_level: "",
  duration: "",
  tuition_fees: "",
  currency: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, sourceData, error, loading } = props;

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //Table data
  const records: TableRecords[] = state;

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedSource, setSelectedSource] = useState<OptionType | null>(null);
  const [formData, setFormData] = useState(initialState);

  console.log("formData", formData);


  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(
    initialValidationState
  );

  const validationSchema = yup.object().shape({
    program_name: yup
      .string()
      .required("Program name is required")
      .min(3, "Program name must be at least 3 characters long"),
    university_id: yup.string().required("University is required"),
    degree_level: yup.string().required("Degree level is required"),
    duration: yup.string().required("Duration is required"),
    tuition_fees: yup
      .number()
      .required("Tuition fees are required")
      .positive("Tuition fees must be a positive number").nullable(),
    currency: yup.string().required("Currency is required"),
  });

  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  const handleUpdate = (item: any) => {
    //update source dropdown
    const updatedSource: OptionType[] = sourceData?.filter(
      (source: any) => source.value == item.university_id
    );
    setSelectedSource(updatedSource[0]);
    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      university_id: item?.university_id,
      program_name: item?.program_name,
      degree_level: item?.degree_level,
      duration: item?.duration,
      tuition_fees: item?.tuition_fees,
      currency: item?.currency,
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
          dispatch(deleteProgram(id));
          if (isUpdate) {
            setFormData(initialState);
            setSelectedSource(null);
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
          confirmButtonText: `Yes, ${isUpdate ? 'Update' : 'Create'}`,
        })
        .then((result: any) => {
          if (result.isConfirmed) {
            if (isUpdate) {
              // Handle update logic
              dispatch(
                updateProgram(
                  formData.id,
                  formData.program_name,
                  formData.university_id,
                  formData.degree_level,
                  formData.duration,
                  formData.tuition_fees,
                  formData.currency
                )
              );
              setIsUpdate(false);
            } else {
              // Handle add logic
              dispatch(
                addProgram(
                  formData.program_name,
                  formData.university_id,
                  formData.degree_level,
                  formData.duration,
                  formData.tuition_fees,
                  formData.currency
                )
              );
            }
          }
        }).catch((err: any) => {
          console.log(err);
        })

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
      Header: "Program Name",
      accessor: "program_name",
      sort: true,
    },
    {
      Header: "Degree level",
      accessor: "degree_level",
      sort: true,
    },
    {
      Header: "University",
      accessor: "university_name",
      sort: false,
    },
    {
      Header: "Duration",
      accessor: "duration",
      sort: false,
    },
    {
      Header: "Fee",
      accessor: "tuition_fees",
      sort: true,
    },
    {
      Header: "Currency",
      accessor: "currency",
      sort: true,
    },
    {
      Header: " ",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* Edit Icon */}
          <Link to="#" className="action-icon" onClick={() => {
            setIsUpdate(true);
            handleUpdate(row.original);
            toggleResponsiveModal();
          }}>
            <i className="mdi mdi-square-edit-outline"></i>
          </Link>

          {/* Delete Icon */}
          <Link to="#" className="action-icon" onClick={() =>
            handleDelete(row.original.id)
          }>
            <i className="mdi mdi-delete-outline"></i>
            {/* <i className="mdi mdi-delete"></i> */}
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

  //source
  const handleSourceChange = (selected: any) => {
    setSelectedSource(selected);
    setFormData((prev) => ({
      ...prev,
      university_id: selected.value,
    }));
  };

  const handleResetValues = () => {
    setValidationErrors(initialValidationState); // Clear validation errors
    setFormData(initialState); //clear form data
    setSelectedSource(null);
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
      setSelectedSource(null);
      // Clear validation errors
    }
  }, [loading, error]);

  return (
    <>
      <Row className="justify-content-between px-2">
        <Modal
          show={responsiveModal}
          onHide={toggleResponsiveModal}
          dialogClassName="modal-dialog-centered"
        >
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Program Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="program_name">
                <Form.Label>Program Name</Form.Label>
                <Form.Control
                  type="text"
                  name="program_name"
                  value={formData.program_name}
                  onChange={handleInputChange}
                />
                {validationErrors.program_name && (
                  <Form.Text className="text-danger">
                    {validationErrors.program_name}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="university_id">
                <Form.Label>University</Form.Label>
                <Select
                  styles={customStyles}
                  className="react-select react-select-container"
                  classNamePrefix="react-select"
                  name="university_id"
                  options={sourceData}
                  value={selectedSource}
                  onChange={handleSourceChange}
                />
                {validationErrors.university_id && (
                  <Form.Text className="text-danger">
                    {validationErrors.university_id}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="degree_level">
                <Form.Label>Degree Level</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  name="degree_level"
                  value={formData.degree_level}
                  onChange={handleInputChange}
                >
                  <option value="">
                    Choose..
                  </option>
                  <option
                    value="UG"
                    key="ug">
                    UG
                  </option>
                  <option
                    value="PG"
                    key="pg">
                    PG
                  </option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="duration">
                <Form.Label>Duration</Form.Label>
                <Form.Control
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
                {validationErrors.duration && (
                  <Form.Text className="text-danger">
                    {validationErrors.duration}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="tuition_fees">
                <Form.Label>Tuition Fees</Form.Label>
                <Form.Control
                  type="number"
                  name="tuition_fees"
                  value={formData.tuition_fees || ""}
                  onChange={handleInputChange}
                />
                {validationErrors.tuition_fees && (
                  <Form.Text className="text-danger">
                    {validationErrors.tuition_fees}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="currency">
                <Form.Label>Currency</Form.Label>
                <Form.Control
                  type="text"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                />
                {validationErrors.currency && (
                  <Form.Text className="text-danger">
                    {validationErrors.currency}
                  </Form.Text>
                )}
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
                <i className="mdi mdi-plus-circle"></i> Add Program{" "}
              </Button>
              <h4 className="header-title mb-4">Manage Programs</h4>
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

const Programs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [sourceData, setSourceData] = useState([]);

  //Fetch data from redux store
  const { state, error, loading, initialloading, university } = useSelector(
    (state: RootState) => ({
      state: state.Program.programs.data,
      error: state.Program.error,
      loading: state.Program.loading,
      initialloading: state.Program.initialloading,
      university: state.University.universities.data,
    })
  );

  useEffect(() => {
    dispatch(getProgram());
    dispatch(getUniversity());
  }, []);

  useEffect(() => {
    if (university) {
      const SourceArray = university?.map((source: any) => ({
        value: source.id.toString(),
        label: source.university_name, // Replace with the appropriate field from the lead data
      }));
      setSourceData(SourceArray);
    }
  }, [university]);

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
          { label: "Master", path: "/master/programs" },
          { label: "Programs", path: "/master/programs", active: true },
        ]}
        title={"Programs"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            sourceData={sourceData}
            error={error}
            loading={loading}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Programs;
