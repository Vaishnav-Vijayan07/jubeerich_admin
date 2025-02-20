import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button, Modal, Spinner } from "react-bootstrap";
import Table from "../../components/Table";

import { withSwal } from "react-sweetalert2";
import Select from "react-select";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Link } from "react-router-dom";

import { getStream } from "../../redux/stream/actions";
import { customStyles } from "../../constants";
import { getCourseType } from "../../redux/actions";
import { addCourse, deleteCourse, getCourse, updateCourse } from "../../redux/course/actions";
import { regrexValidation } from "../../utils/regrexValidation";
import { useHistoryModal } from "../../hooks/useHistoryModal";
const HistoryTable = React.lazy(() => import('../../components/HistoryTable'));

interface TableRecords {
  id: string;
  stream_name: string;
  stream_description: string;
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
  course_name: "",
  course_description: "",
  course_type_id: "",
  stream_id: "",
  updated_by: "",
};

const initialValidationState = {
  course_name: "",
  course_description: "",
  course_type_id: "",
  stream_id: "",
  updated_by: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {historyModal,toggleHistoryModal} = useHistoryModal();
  const { swal, state, error, loading, userId, streamOptions, courseTypeOptions, initialLoading } = props;

  //fetch token from session storage

  //Table data
  const records: TableRecords[] = state;

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [selectedCourseType, setSelectedCourseType] = useState<any>(null);
  const [selectedStream, setSelectedStream] = useState<any>(null);


  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(initialValidationState);

  const validationSchema = yup.object().shape({
    course_name: yup.string().required("Course name is required").min(3, "Course name must be at least 3 characters long"),

    course_description: yup
      .string()
      .required("Course description is required")
      .min(5, "Course description must be at least 5 characters long"),

    course_type_id: yup.string().required("Course type is required"),

    stream_id: yup.string().required("Stream is required"),
  });

  const handleUpdate = (item: any) => {
    const courseType = courseTypeOptions.find((record: any) => record?.value == item?.course_type?.id);
    const stream = streamOptions.find((record: any) => record?.value == item?.stream?.id);

    if (courseType && stream) {
      setSelectedCourseType(courseType);
      setSelectedStream(stream);
    } else {
      setSelectedCourseType(null);
      setSelectedStream(null);
    }

    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      course_name: item?.course_name,
      course_description: item?.course_description,
      course_type_id: item?.course_type?.id,
      stream_id: item?.stream?.id,
    }));

    setIsUpdate(true);
  };

  //handle delete function
  const handleDelete = (id: string) => {
    swal
      .fire({
        title: "Confirm Action",
        text: `Do you want to delete this course?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, delete`,
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
          dispatch(deleteCourse(id));
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

  const handleCourseTypeChange = (selected: any) => {
    setSelectedCourseType(selected);
    setFormData((prev) => ({
      ...prev,
      course_type_id: selected.value,
    }));
  };

  const handleStreamChange = (selected: any) => {
    setSelectedStream(selected);
    setFormData((prev) => ({
      ...prev,
      stream_id: selected.value,
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
          title: "Confirm Action",
          text: `Do you want to ${isUpdate ? "update" : "create"} this course?`,
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
            if (isUpdate) {
              // Handle update logic
              dispatch(
                updateCourse(
                  formData?.id,
                  formData.course_name,
                  formData.course_description,
                  formData.course_type_id,
                  formData.stream_id
                )
              );
              setIsUpdate(false);
              setSelectedCourseType(null);
              setSelectedStream(null);
            } else {
              // Handle add logic
              console.log("Here");

              dispatch(addCourse(formData.course_name, formData.course_description, formData.course_type_id, formData.stream_id));
              setSelectedCourseType(null);
              setSelectedStream(null);
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
      Header: "Course",
      accessor: "course_name",
      sort: true,
    },
    {
      Header: "Description",
      accessor: "course_description",
      sort: false,
    },
    {
      Header: "Type",
      accessor: "course_type.type_name",
      sort: true,
    },
    {
      Header: "Stream",
      accessor: "stream.stream_name",
      sort: true,
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
    setSelectedCourseType(null);
    setSelectedStream(null);
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
    }
  }, [loading, error]);

  
  return (
    <>
      <Row className="justify-content-between px-2">
        {/* <Col lg={5} className="bg-white p-3"> */}
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} dialogClassName="modal-dialog-centered">
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Course Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="course_name">
                <Form.Label>Course Name</Form.Label>
                <Form.Control type="text" name="course_name" value={formData.course_name} onChange={handleInputChange} />
                {validationErrors.course_name && <Form.Text className="text-danger">{validationErrors.course_name}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="course_description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="course_description"
                  value={formData.course_description}
                  onChange={handleInputChange}
                />
                {validationErrors.course_description && (
                  <Form.Text className="text-danger">{validationErrors.course_description}</Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="course_type_id">
                <Form.Label>Course Type</Form.Label>
                <Select
                  styles={customStyles}
                  className="react-select react-select-container"
                  classNamePrefix="react-select"
                  name="course_type_id"
                  options={courseTypeOptions}
                  value={selectedCourseType}
                  onChange={handleCourseTypeChange}
                />

                {validationErrors.course_type_id && (
                  <Form.Text className="text-danger">{validationErrors.course_type_id}</Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="stream_id">
                <Form.Label>Streams</Form.Label>
                <Select
                  styles={customStyles}
                  className="react-select react-select-container"
                  classNamePrefix="react-select"
                  name="stream_id"
                  options={streamOptions}
                  value={selectedStream}
                  onChange={handleStreamChange}
                />

                {validationErrors.stream_id && <Form.Text className="text-danger">{validationErrors.stream_id}</Form.Text>}
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="primary" id="button-addon2" className="mt-1 ms-2" onClick={() => [handleResetValues()]}>
                Clear
              </Button>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1 "
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
            <HistoryTable apiUrl={"course"} />
          </Modal.Body>
        </Modal>

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Add Course
              </Button>

              <Button className="btn-sm btn-secondary waves-effect waves-light float-end me-2" onClick={toggleHistoryModal}>
                <i className="mdi mdi-history"></i> View History
              </Button>

              <h4 className="header-title mb-4">Manage Course</h4>
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

const Course = () => {
  const dispatch = useDispatch<AppDispatch>();

  //Fetch data from redux store
  const { state, error, loading, initialLoading, userId, streamOptions, courseTypeOptions } = useSelector((state: RootState) => ({
    state: state.Course.course.data,
    streamOptions: state.Stream.stream.formattedStreams,
    courseTypeOptions: state.CourseType.courseType.formattedCourseTypes,
    error: state.Course.error,
    loading: state.Course.loading,
    initialLoading: state.Course.initialloading,
    userId: state.Auth.user?.user_id,
  }));

  useEffect(() => {
    dispatch(getStream());
    dispatch(getCourse());
    dispatch(getCourseType());
  }, []);

  return (
    <React.Fragment>
      <PageTitle breadCrumbItems={[{ label: "Courses", path: "/settings/master/course", active: true }]} title={"Courses"} />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            streamOptions={streamOptions || []}
            courseTypeOptions={courseTypeOptions || []}
            error={error}
            loading={loading}
            userId={userId}
            initialLoading={initialLoading}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Course;
