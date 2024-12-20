import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Card, Form, Button, Dropdown, Modal, Spinner } from "react-bootstrap";
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
import { addRegion, deleteRegion, getRegion, updateRegion } from "../../redux/regions/actions";
import { getCountry } from "../../redux/country/actions";
import { addUniversity, deleteUniversity, getUniversity, updateUniversity } from "../../redux/University/actions";
import { Link } from "react-router-dom";
import useDropdownData from "../../hooks/useDropdownDatas";
import { regrexValidation } from "../../utils/regrexValidation";

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
  university_name: "",
  description: "",
  location: "",
  country_id: "",
  website_url: "",
  image_url: "",
  portal_link: "",
  username: "",
  password: "",
  updated_by: "",
  is_active: true,
};

const initialValidationState = {
  university_name: "",
  location: "",
  description: "",
  country_id: "",
  website_url: "",
  image_url: "",
  portal_link: "",
  username: "",
  password: "",
  updated_by: "",
  is_active: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, country, error, loading, initialLoading } = props;

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //Table data
  const records: TableRecords[] = state;

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(null);
  const [formData, setFormData] = useState(initialState);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(initialValidationState);

  const validationSchema = yup.object().shape({
    university_name: yup
      .string()
      .required("University name is required")
      .min(3, "University name must be at least 3 characters long"),
    location: yup.string().required("Location is required").min(3, "Location must be at least 3 characters long"),
    country_id: yup.string().required("Country ID is required"),
    // website_url: yup
    //   .string()
    //   .required("Website URL is required")
    //   .url("Website URL must be a valid URL"),
    // image_url: yup
    //   .string()
    //   .required("Image URL is required")
    //   .url("Image URL must be a valid URL"),
    // updated_by: yup.string().required("Updated by is required"),
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
    const updatedCountry: OptionType[] = country?.filter((country: any) => country.value == item.country_id);
    setSelectedCountry(updatedCountry[0]);
    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      university_name: item?.university_name,
      description: item?.description,
      location: item?.location,
      website_url: item?.website_url,
      image_url: item?.image_url,
      portal_link: item?.portal_link,
      username: item?.username,
      password: item?.password,
      country_id: item?.country_id,
      updated_by: "",
      is_active: item?.is_active,
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
          dispatch(deleteUniversity(id));
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
                  updateUniversity(
                    formData?.id,
                    formData.university_name,
                    formData.location,
                    formData.country_id,
                    formData.website_url,
                    formData.image_url,
                    formData.portal_link,
                    formData.username,
                    formData.password,
                    user_id,
                    formData.description,
                    formData.is_active
                  )
                );
                setIsUpdate(false);
              } else {
                // Handle add logic
                console.log("Here");

                dispatch(
                  addUniversity(
                    formData.university_name,
                    formData.location,
                    formData.country_id,
                    formData.website_url,
                    formData.image_url,
                    formData.portal_link,
                    formData.username,
                    formData.password,
                    user_id,
                    formData.description,
                    formData.is_active
                  )
                );
              }
            }
          }
        })
        .catch((err: any) => {
          console.log(err);
        });

      // if (userInfo) {
      //   const { user_id } = JSON.parse(userInfo);
      //   if (isUpdate) {
      //     // Handle update logic
      //     dispatch(
      //       updateUniversity(
      //         formData?.id,
      //         formData.university_name,
      //         formData.location,
      //         formData.country_id,
      //         formData.website_url,
      //         formData.image_url,
      //         user_id
      //       )
      //     );
      //     setIsUpdate(false);
      //   } else {
      //     // Handle add logic
      //     console.log("Here");

      //     dispatch(
      //       addUniversity(
      //         formData.university_name,
      //         formData.location,
      //         formData.country_id,
      //         formData.website_url,
      //         formData.image_url,
      //         user_id
      //       )
      //     );
      //   }
      // }

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
      sort: false,
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
    },
    {
      Header: "University Name",
      accessor: "university_name",
      sort: true,
      Cell: ({ row }: any) => (
        <div className="table-user">
          <Link to="#" className="text-body fw-semibold">
            {row.original.university_name}
          </Link>
        </div>
      ),
    },
    {
      Header: "Country",
      accessor: "country_name",
      sort: false,
    },
    {
      Header: "Location",
      accessor: "location",
      sort: false,
    },
    {
      Header: "Description",
      accessor: "description",
      sort: false,
    },
    {
      Header: "Website",
      accessor: "website_url",
      sort: false,
      Cell: ({ row }: any) => (
        <>
          <a href={row.original.website_url} target="_next" style={{ cursor: "pointer" }}>
            {row.original.website_url}
          </a>
        </>
      ),
    },
    {
      Header: "Portal Link",
      accessor: "portal_link",
      sort: false,
      Cell: ({ row }: any) => (
        <>
          <a href={row.original.portal_link} target="_next" style={{ cursor: "pointer" }}>
            {row.original.portal_link}
          </a>
        </>
      ),
    },
    {
      Header: "Username",
      accessor: "username",
      sort: false,
    },
    {
      Header: "Password",
      accessor: "password",
      sort: false,
    },
    {
      Header: "Status",
      accessor: "is_active",
      sort: false,
      Cell: ({ row }: any) => (
        <>
          <span
            style={{ fontSize: "10px" }}
            className={`badge rounded-pill ${row.original.is_active ? "bg-success" : "bg-danger"}`}
          >
            {row.original.is_active ? "Active" : "Disabled"}
          </span>
        </>
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
          {/* <Link to="#" className="action-icon" onClick={() => handleDelete(row.original.id)}>
            <i className="mdi mdi-delete-outline"></i>
          </Link> */}
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
    setSelectedCountry(selected);
    setFormData((prev) => ({
      ...prev,
      country_id: selected.value,
    }));
  };

  const handleResetValues = () => {
    setValidationErrors(initialValidationState); // Clear validation errors
    setFormData(initialState); //clear form data
    setSelectedCountry(null);
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
      setSelectedCountry(null);
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
              <h4 className="modal-title">University Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>University Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="university_name"
                      value={formData.university_name}
                      onChange={handleInputChange}
                    />
                    {validationErrors.university_name && (
                      <Form.Text className="text-danger">{validationErrors.university_name}</Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="channel_description">
                    <Form.Label>University Location</Form.Label>
                    <Form.Control type="text" name="location" value={formData.location} onChange={handleInputChange} />
                    {validationErrors.location && <Form.Text className="text-danger">{validationErrors.location}</Form.Text>}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="source_id">
                    <Form.Label>Country</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="country_id"
                      options={country}
                      value={selectedCountry}
                      onChange={handleSourceChange}
                    />

                    {validationErrors.country_id && <Form.Text className="text-danger">{validationErrors.country_id}</Form.Text>}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Website URL</Form.Label>
                    <Form.Control type="text" name="website_url" value={formData.website_url} onChange={handleInputChange} />
                    {validationErrors.website_url && (
                      <Form.Text className="text-danger">{validationErrors.website_url}</Form.Text>
                    )}
                  </Form.Group>
                </Col>

                {/* <Col md={6}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} />
                    {validationErrors.image_url && <Form.Text className="text-danger">{validationErrors.image_url}</Form.Text>}
                  </Form.Group>
                </Col> */}

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="portal_link">
                    <Form.Label>Portal Link</Form.Label>
                    <Form.Control type="text" name="portal_link" value={formData.portal_link} onChange={handleInputChange} />
                    {validationErrors.portal_link && (
                      <Form.Text className="text-danger">{validationErrors.portal_link}</Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" value={formData.username} onChange={handleInputChange} />
                    {validationErrors.username && <Form.Text className="text-danger">{validationErrors.username}</Form.Text>}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="text" name="password" value={formData.password} onChange={handleInputChange} />
                    {validationErrors.password && <Form.Text className="text-danger">{validationErrors.password}</Form.Text>}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" name="description" value={formData.description} onChange={handleInputChange} />

                    {validationErrors.description && (
                      <Form.Text className="text-danger">{validationErrors.description}</Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="is_active">
                    <Form.Label>Status</Form.Label>
                    <Form.Check
                      type="switch"
                      name="is_active"
                      id="is_active_toggle"
                      checked={formData.is_active}
                      onChange={(e) =>
                        handleInputChange({
                          target: { name: "is_active", value: e.target.checked },
                        })
                      }
                      label={formData.is_active ? "Active" : "Inactive"} /* Optional label */
                    />

                    {validationErrors.is_active && <Form.Text className="text-danger">{validationErrors.is_active}</Form.Text>}
                  </Form.Group>
                </Col>
              </Row>
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

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Add University
              </Button>
              <h4 className="header-title mb-4">Manage University</h4>
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

const University = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { dropdownData: country, loading: dropDownLoading } = useDropdownData("countries");

  //Fetch data from redux store
  const { state, error, loading, initialLoading } = useSelector((state: RootState) => ({
    state: state.University.universities.data,
    error: state.University.error,
    loading: state.University.loading,
    initialLoading: state.University.initialloading,
  }));

  useEffect(() => {
    dispatch(getUniversity());
  }, []);

  // if (initialLoading) {
  //   return <Spinner animation="border" style={{ position: "absolute", top: "50%", left: "50%" }} />;
  // }

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Master", path: "/settings/master/university" },
          { label: "University", path: "/settings/master/university", active: true },
        ]}
        title={"University"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            country={country?.countries || []}
            error={error}
            loading={loading}
            initialLoading={initialLoading}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default University;
