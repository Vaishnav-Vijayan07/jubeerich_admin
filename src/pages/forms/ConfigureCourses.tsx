import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Card, Form, Button, Modal, Spinner } from "react-bootstrap";
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
import { Link, useParams } from "react-router-dom";
import { addCampus, configureCourses, deleteCampus, getCampus, getCampusCourses, updateCampus } from "../../redux/actions";
import { getCourse } from "../../redux/course/actions";
import useDropdownData from "../../hooks/useDropdownDatas";

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
  campus_id: "",
  course_fee: "",
  course_link: "",
  course_id: "",
  application_fee: "",
};

const initialValidationState = {
  campus_id: "",
  course_fee: "",
  course_link: "",
  course_id: "",
  application_fee: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, error, loading, courseData, initialLoading, campusId, campusData } = props;
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
    course_id: yup.string().required("Course is required"),
  });

  console.log("campusOd", campusId);

  console.log("formData", formData);

  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  const handleUpdate = (item: any) => {
    // Update university dropdown
    const updatedUniversity: OptionType[] = courseData?.filter((course: any) => course.value == item.course_id);
    console.log("updatedUniversity", courseData, item);

    setSelectedUniversity(updatedUniversity[0]);

    // Set form data including courses
    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      course_fee: item?.course_fee,
      course_link: item?.course_link,
      course_id: item?.course_id,
      campus_id: item?.campus_id,
      application_fee: item?.application_fee, // Ensure courses is an array, defaulting to empty if undefined
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
    console.log("here");

    // Validate the form using yup
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      console.log("validationSchema ==>", validationSchema);

      // Validation passed, handle form submission

      swal
        .fire({
          title: "Are you sure?",
          text: "This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: `Yes, ${isUpdate ? "Update" : "Create"}`,
        })
        .then((result: any) => {
          if (result.isConfirmed) {
            dispatch(
              configureCourses(
                campusId,
                formData.course_fee,
                formData.application_fee,
                formData.course_link,
                formData.course_id,
                isUpdate ? "update" : "add"
              )
            );
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
      Header: "Course Name",
      accessor: "course_name",
      sort: true,
    },
    {
      Header: "Course Fee (₹)",
      accessor: "course_fee",
      sort: false,
    },
    {
      Header: "Application Fee (₹)",
      accessor: "application_fee",
      sort: false,
    },
    {
      Header: "Course Link",
      accessor: "course_link",
      sort: false,
      Cell: ({ row }: any) => (
        <a href={row.original?.course_link} target="_blank">
          {row.original?.course_link}
        </a>
      ),
    },
    {
      Header: "Actions",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
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
      course_id: selected.value,
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

  const getCampusName = () => {
    if (campusData && campusData.length > 0) {
      return campusData.find((item: any) => item.id == campusId)?.campus_name;
    }
    return "";
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
              <h4 className="modal-title">Course Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  {/* University */}
                  <Form.Group className="mb-3" controlId="course_id">
                    <Form.Label>Course</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="course_id"
                      options={courseData}
                      isDisabled={isUpdate}
                      value={selectedUniversity}
                      onChange={handleUniversityChange}
                    />
                    {validationErrors.course_id && <Form.Text className="text-danger">{validationErrors.course_id}</Form.Text>}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  {/* Location */}
                  <Form.Group className="mb-3" controlId="course_link">
                    <Form.Label>Course Link</Form.Label>
                    <Form.Control type="text" name="course_link" value={formData.course_link} onChange={handleInputChange} />
                    {validationErrors.course_link && (
                      <Form.Text className="text-danger">{validationErrors.course_link}</Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  {/* Campus Name */}
                  <Form.Group className="mb-3" controlId="course_fee">
                    <Form.Label>Course Fee (₹)</Form.Label>
                    <Form.Control type="number" name="course_fee" value={formData.course_fee} onChange={handleInputChange} />
                    {validationErrors.course_fee && <Form.Text className="text-danger">{validationErrors.course_fee}</Form.Text>}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  {/* Location */}
                  <Form.Group className="mb-3" controlId="application_fee">
                    <Form.Label>Application Fee (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      name="application_fee"
                      value={formData.application_fee}
                      onChange={handleInputChange}
                    />
                    {validationErrors.application_fee && (
                      <Form.Text className="text-danger">{validationErrors.application_fee}</Form.Text>
                    )}
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

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Configure Courses
              </Button>
              <h4 className="header-title mb-4">Manage Courses - {getCampusName()}</h4>
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

const ConfigureCourses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  console.log("id ===>", id);

  const { dropdownData: courses, loading: dropDownLoading } = useDropdownData("courses");

  //Fetch data from redux store
  const { state, error, loading, initialLoading, courseData, campusCourses } = useSelector((state: RootState) => ({
    state: state.Campus?.campus?.data,
    campusCourses: state?.Campus?.courses,
    error: state.Campus.error,
    loading: state.Campus.loading,
    initialLoading: state.Campus.initialloading,
    courseData: state.Course.course.data,
  }));

  useEffect(() => {
    dispatch(getCampus());
    dispatch(getCourse());
    dispatch(getCampusCourses(id));
  }, []);

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Master", path: "/settings/master/campus" },
          { label: "Configure Courses", path: "/settings/master/configure_courses", active: true },
        ]}
        title={"Course Configuration"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={campusCourses}
            campusData={state}
            error={error}
            loading={loading}
            courseData={courses.courses}
            initialLoading={initialLoading}
            campusId={id}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default ConfigureCourses;
