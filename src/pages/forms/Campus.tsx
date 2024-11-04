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
import { Link } from "react-router-dom";
import { addCampus, deleteCampus, getCampus, updateCampus } from "../../redux/actions";
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
  campus_name: "",
  location: "",
  university_id: "",
  courses: [{ course_fee: "", application_fee: "", course_link: "", course_id: "" }],
};

const initialValidationState = {
  campus_name: "",
  location: "",
  university_id: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, university, error, loading, courseData } = props;

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
    campus_name: yup
      .string()
      .min(3, "Campus name name must be at least 3 characters long")
      .required("Campus name name is required"),
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
      courses: item?.courses || [], // Ensure courses is an array, defaulting to empty if undefined
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
      if (typeof index === "number") {
        const updatedCourses = [...prevData.courses];
        updatedCourses[index] = {
          ...updatedCourses[index],
          [name]: value,
        };

        return {
          ...prevData,
          courses: updatedCourses,
        };
      }

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
            if (userInfo) {
              const { user_id } = JSON.parse(userInfo);
              if (isUpdate) {
                // Handle update logic
                dispatch(
                  updateCampus(formData?.id, formData.campus_name, formData.location, formData.university_id, formData.courses)
                );
                setIsUpdate(false);
              } else {
                // Handle add logic
                console.log("Here");
                dispatch(addCampus(formData.campus_name, formData.location, formData.university_id, formData.courses));
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
      sort: false,
    },
    {
      Header: "University",
      accessor: "university",
      sort: false,
    },
    {
      Header: "courses",
      accessor: "courseNames",
      sort: false,
      Cell: ({ row }: any) => (
        <ul style={{ listStyle: "none" }}>
          {row.original.courseNames?.map((item: string) => (
            <li>{item}</li>
          ))}
        </ul>
      ),
    },
    {
      Header: " ",
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

  const addNewCourse = () => {
    setFormData((prevData) => {
      const currentCoursesLength = prevData.courses.length; // Get the current number of courses
      const maxCourses = courseData.length; // Use the length of courseData as the limit

      if (currentCoursesLength >= maxCourses) {
        // If the current number of courses is greater than or equal to the max allowed, do nothing
        return prevData;
      }

      return {
        ...prevData,
        courses: [...prevData.courses, { course_fee: "", application_fee: "", course_link: "", course_id: "" }],
      };
    });
  };

  const removeCourse = (index: number) => {
    setFormData((prevData) => {
      const updatedCourses = prevData.courses.filter((_, i) => i !== index);
      return {
        ...prevData,
        courses: updatedCourses,
      };
    });
  };

  console.log("formData ==>", formData);

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
                    {validationErrors.campus_name && (
                      <Form.Text className="text-danger">{validationErrors.campus_name}</Form.Text>
                    )}
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
                    {validationErrors.university_id && (
                      <Form.Text className="text-danger">{validationErrors.university_id}</Form.Text>
                    )}
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

              <h5 className="mb-4 text-uppercase" style={{ backgroundColor: "#f0f0f0", padding: "10px", borderRadius: "4px" }}>
                <i className="mdi mdi-book-open-outline me-1"></i> Courses
              </h5>
              {formData?.courses?.map((course, index) => (
                <>
                  <h5>Course {index + 1}</h5>
                  <Row key={index} className="">
                    <Col md={6}>
                      <Form.Group className="mb-2" controlId={`course_id_${index}`}>
                        <Form.Label>Course Name</Form.Label>
                        {console.log("course ==>", course)}
                        <Form.Control
                          as="select"
                          name="course_id"
                          value={course.course_id || ""}
                          onChange={(e) => handleInputChange(e, index)}
                        >
                          <option value="">Select a Course</option>
                          {courseData?.map((courseOption: any) => (
                            <option key={courseOption.id} value={courseOption.id}>
                              {courseOption.course_name}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-2" controlId={`course_fee_${index}`}>
                        <Form.Label>Course Fee</Form.Label>
                        <Form.Control
                          type="text"
                          name="course_fee"
                          value={course.course_fee}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-2" controlId={`application_fee${index}`}>
                        <Form.Label>Application Fee</Form.Label>
                        <Form.Control
                          type="text"
                          name="application_fee"
                          value={course.application_fee}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-2" controlId={`course_link_${index}`}>
                        <Form.Label>Course Link</Form.Label>
                        <Form.Control
                          type="text"
                          name="course_link"
                          value={course.course_link}
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      </Form.Group>
                    </Col>

                    <Col className="d-flex align-items-center gap-1">
                      <i
                        className="text-danger mdi mdi-minus-circle-outline fs-3 ps-1"
                        style={{ cursor: "pointer" }}
                        onClick={() => removeCourse(index)}
                      ></i>
                      <span className="text-danger">Remove</span>
                    </Col>
                  </Row>
                </>
              ))}

              {/* Button to add a new course */}
              {formData.courses?.length < courseData?.length && (
                <Row className="mb-2">
                  <Col sm={6} className="d-flex align-items-center gap-1">
                    <i
                      className="text-primary mdi mdi-plus-circle-outline fs-3 ps-1"
                      style={{ cursor: "pointer" }}
                      onClick={addNewCourse}
                    ></i>
                    <span className="text-primary">Add More</span>
                  </Col>
                </Row>
              )}
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
                <i className="mdi mdi-plus-circle"></i> Add Campus
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
  const { dropdownData: universities, loading: dropDownLoading } = useDropdownData("universities");

  //Fetch data from redux store
  const { state, error, loading, initialLoading, courseData } = useSelector((state: RootState) => ({
    state: state.Campus.campus.data,
    error: state.Campus.error,
    loading: state.Campus.loading,
    initialLoading: state.Campus.initialloading,
    courseData: state.Course.course.data,
  }));

  useEffect(() => {
    dispatch(getCampus());
    dispatch(getCourse());
  }, []);

  // if (initialLoading) {
  //   return <Spinner animation="border" style={{ position: "absolute", top: "50%", left: "50%" }} />;
  // }

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Master", path: "/master/campus" },
          { label: "Campus", path: "/master/campus", active: true },
        ]}
        title={"Campus"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            university={universities.universities}
            error={error}
            loading={loading}
            courseData={courseData}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Campus;
