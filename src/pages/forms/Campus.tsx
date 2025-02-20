import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import Table from "../../components/Table";

import { withSwal } from "react-sweetalert2";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Select from "react-select";
import { AUTH_SESSION_KEY, customStyles } from "../../constants";
import { getUniversity } from "../../redux/University/actions";
import { Link, useNavigate } from "react-router-dom";
import { addCampus, deleteCampus, getCampus, updateCampus } from "../../redux/actions";
import { getCourse } from "../../redux/course/actions";
import { regrexValidation } from "../../utils/regrexValidation";
import { useHistoryModal } from "../../hooks/useHistoryModal";
const HistoryTable = React.lazy(() => import("../../components/HistoryTable"));

interface OptionType {
  value: string;
  label: string;
}

interface TableRecords {
  id: string;
  campus_name: string;
  location: string;
  university_id: string;
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
  campus_name: "",
  location: "",
  university_id: "",
};

const initialValidationState = {
  campus_name: "",
  location: "",
  university_id: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { historyModal, toggleHistoryModal } = useHistoryModal();
  const { swal, state, university, error, loading, courseData, initialLoading } = props;

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //Table data
  const records: TableRecords[] = state;

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<OptionType | null>(null);
  const [formData, setFormData] = useState(initialState);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(initialValidationState);

  const validationSchema = yup.object().shape({
    campus_name: yup.string().min(3, "Campus name name must be at least 3 characters long").required("Campus name name is required"),
    location: yup.string().required("Location is required"),
    university_id: yup.string().required("University is required"),
  });

  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  const handleUpdate = (item: any) => {
    // Update university dropdown
    const updatedUniversity: OptionType[] = university?.filter((university: any) => university.value == item.university_id);
    setSelectedUniversity(updatedUniversity[0]);

    // Set form data including courses
    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      campus_name: item?.campus_name,
      location: item?.location,
      university_id: item?.university_id,
    }));

    setIsUpdate(true);
  };

  //handle delete function
  const handleDelete = (id: string) => {
    swal
      .fire({
        title: "Confirm Action",
        text: `Do you want to delete this campus?`,
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
          dispatch(deleteCampus(id));
          if (isUpdate) {
            setFormData(initialState);
          }
        }
      });
  };

  //handle onchange function
  const handleInputChange = (e: any, index?: number) => {
    const { name, value } = e.target;

    if (!regrexValidation(name, value)) {
      console.error(`Invalid ${name}: ${value}`);
      return; // Stop updating if validation fails
    }

    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
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
          title: "Confirm Action",
          text: `Do you want to ${isUpdate ? "update" : "create"} this campus?`,
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
              if (isUpdate) {
                // Handle update logic
                dispatch(updateCampus(formData?.id, formData.campus_name, formData.location, formData.university_id));
                setIsUpdate(false);
              } else {
                // Handle add logic
                console.log("Here");
                dispatch(addCampus(formData.campus_name, formData.location, formData.university_id));
              }
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
      Header: "Campus Name",
      accessor: "campus_name",
      sort: true,
    },
    {
      Header: "Location",
      accessor: "location",
      sort: true,
    },
    {
      Header: "University",
      accessor: "university",
      sort: true,
    },
    {
      Header: "Country",
      accessor: "country",
      sort: true,
    },
    {
      Header: "Course Configuration",
      accessor: "",
      Cell: ({ row }: any) => (
        <a onClick={() => navigate(`/settings/master/configure_courses/${row.original.id}`)} className="">
          <i className="mdi mdi-cog"></i> Course Configuration
        </a>
      ),
    },
    {
      Header: "Actions",
      accessor: "",
      sort: false,
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

  //source
  const handleUniversityChange = (selected: any) => {
    setSelectedUniversity(selected);
    setFormData((prev) => ({
      ...prev,
      university_id: selected.value,
    }));
  };

  const handleResetValues = () => {
    setValidationErrors(initialValidationState); // Clear validation errors
    setFormData(initialState); //clear form data
    setSelectedUniversity(null);
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
      setSelectedUniversity(null);
      // Clear validation errors
    }
  }, [loading, error]);

  return (
    <>
      <Row className="justify-content-between px-2">
        {/* <Col lg={5} className="bg-white p-3"> */}
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} dialogClassName="modal-lg modal-dialog-centered">
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Campus Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  {/* Campus Name */}
                  <Form.Group className="mb-3" controlId="campus_name">
                    <Form.Label>Campus Name</Form.Label>
                    <Form.Control type="text" name="campus_name" value={formData.campus_name} onChange={handleInputChange} />
                    {validationErrors.campus_name && <Form.Text className="text-danger">{validationErrors.campus_name}</Form.Text>}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  {/* University */}
                  <Form.Group className="mb-3" controlId="university_id">
                    <Form.Label>University</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="university_id"
                      options={university}
                      value={selectedUniversity}
                      onChange={handleUniversityChange}
                    />
                    {validationErrors.university_id && <Form.Text className="text-danger">{validationErrors.university_id}</Form.Text>}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  {/* Location */}
                  <Form.Group className="mb-3" controlId="location">
                    <Form.Label>Location</Form.Label>
                    <Form.Control as="textarea" rows={5} name="location" value={formData.location} onChange={handleInputChange} />
                    {validationErrors.location && <Form.Text className="text-danger">{validationErrors.location}</Form.Text>}
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="primary" id="button-addon2" className="mt-1 ms-2" onClick={handleResetValues}>
                Clear
              </Button>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1"
                onClick={() => (isUpdate ? [handleCancelUpdate(), toggleResponsiveModal()] : [toggleResponsiveModal(), handleResetValues()])}
              >
                {isUpdate ? "Cancel" : "Close"}
              </Button>
              <Button type="submit" variant="success" id="button-addon2" className="mt-1">
                {isUpdate ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        <Modal show={historyModal} onHide={toggleHistoryModal} centered dialogClassName={"modal-full-width"} scrollable>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body style={{ margin: "0 !important", padding: "0 !important" }}>
            <HistoryTable apiUrl={"campus"} />
          </Modal.Body>
        </Modal>

        {/* </Col> */}

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Add Campus
              </Button>

              <Button className="btn-sm btn-secondary waves-effect waves-light float-end me-2" onClick={toggleHistoryModal}>
                <i className="mdi mdi-history"></i> View History
              </Button>

              <h4 className="header-title mb-4">Manage Campus</h4>
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

const Campus = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [university, setUniversity] = useState([]);

  //Fetch data from redux store
  const { state, error, loading, initialLoading, courseData, universityData } = useSelector((state: RootState) => ({
    state: state.Campus.campus.data,
    error: state.Campus.error,
    loading: state.Campus.loading,
    initialLoading: state.Campus.initialloading,
    courseData: state.Course.course.data,
    universityData: state.University?.universities?.data,
  }));

  useEffect(() => {
    dispatch(getCampus());
    dispatch(getCourse());
    dispatch(getUniversity());
  }, []);

  useEffect(() => {
    if (universityData) {
      const UniversityArray = universityData?.map((unvsty: any) => ({
        value: unvsty.id.toString(),
        label: `${unvsty.university_name} - ${unvsty.country_name}`, // Replace with the appropriate field from the lead data
        country_name: unvsty.country_name,
      }));
      setUniversity(UniversityArray);
    }
  }, [universityData]);

  // if (initialLoading) {
  //   return <Spinner animation="border" style={{ position: "absolute", top: "50%", left: "50%" }} />;
  // }

  return (
    <React.Fragment>
      <PageTitle breadCrumbItems={[{ label: "Campus", path: "/settings/master/campus", active: true }]} title={"Campus"} />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            university={university}
            error={error}
            loading={loading}
            courseData={courseData}
            initialLoading={initialLoading}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Campus;
