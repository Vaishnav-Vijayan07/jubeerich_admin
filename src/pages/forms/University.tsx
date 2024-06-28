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
import {
  addChannel,
  deleteChannel,
  getChannel,
  updateChannel,
} from "../../redux/actions";
import Select from "react-select";
import { AUTH_SESSION_KEY } from "../../constants";
import {
  addRegion,
  deleteRegion,
  getRegion,
  updateRegion,
} from "../../redux/regions/actions";
import { getCountry } from "../../redux/country/actions";
import {
  addUniversity,
  deleteUniversity,
  getUniversity,
  updateUniversity,
} from "../../redux/University/actions";

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
    text: "5",
    value: 5,
  },
];

const initialState = {
  id: "",
  university_name: "",
  location: "",
  country_id: "",
  website_url: "",
  image_url: "",
  updated_by: "",
};

const initialValidationState = {
  university_name: "",
  location: "",
  country_id: "",
  website_url: "",
  image_url: "",
  updated_by: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, country, error, loading } = props;

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //Table data
  const records: TableRecords[] = state;

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(
    null
  );
  const [formData, setFormData] = useState(initialState);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(
    initialValidationState
  );

  const validationSchema = yup.object().shape({
    university_name: yup
      .string()
      .required("University name is required")
      .min(3, "University name must be at least 3 characters long"),
    location: yup
      .string()
      .required("Location is required")
      .min(3, "Location must be at least 3 characters long"),
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
    // const updatedSource: OptionType[] = sourceData?.filter(
    //   (source: any) => source.value == item.source_id
    // );
    // setSelectedSource(updatedSource[0]);
    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      university_name: item?.university_name,
      location: item?.location,
      website_url: item?.website_url,
      image_url: item?.image_url,
      country_id: item?.country_id,
      updated_by: "",
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
      // await validationSchema.validate(formData, { abortEarly: false });

      // Validation passed, handle form submission

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
              user_id
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
              user_id
            )
          );
        }
      }

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
      Header: "University Name",
      accessor: "university_name",
      sort: true,
    },
    {
      Header: "Locaton",
      accessor: "location",
      sort: false,
    },
    {
      Header: "Country",
      accessor: "country_id",
      sort: false,
    },
    {
      Header: "Website",
      accessor: "website_url",
      sort: false,
    },
    {
      Header: "Image",
      accessor: "image_url",
      sort: false,
    },
    {
      Header: "Updated By",
      accessor: "updated_by",
      sort: true,
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
            }}
          />

          {/* Delete Icon */}
          <FeatherIcons
            icon="trash-2"
            size="15"
            className="cursor-pointer text-secondary"
            onClick={() => handleDelete(row.original.id)}
          />
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
        <Modal
          show={responsiveModal}
          onHide={toggleResponsiveModal}
          dialogClassName="modal-dialog-centered"
        >
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">University Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="channel_name">
                <Form.Label>University Name</Form.Label>
                <Form.Control
                  type="text"
                  name="university_name"
                  value={formData.university_name}
                  onChange={handleInputChange}
                />
                {validationErrors.university_name && (
                  <Form.Text className="text-danger">
                    {validationErrors.university_name}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="channel_description">
                <Form.Label>University Location</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                {validationErrors.location && (
                  <Form.Text className="text-danger">
                    {validationErrors.location}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="source_id">
                <Form.Label>Country</Form.Label>
                <Select
                  className="react-select react-select-container"
                  classNamePrefix="react-select"
                  name="country_id"
                  options={country}
                  value={selectedCountry}
                  onChange={handleSourceChange}
                />

                {validationErrors.country_id && (
                  <Form.Text className="text-danger">
                    {validationErrors.country_id}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="channel_name">
                <Form.Label>Website URL</Form.Label>
                <Form.Control
                  type="text"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                />
                {validationErrors.website_url && (
                  <Form.Text className="text-danger">
                    {validationErrors.website_url}
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="channel_name">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                />
                {validationErrors.image_url && (
                  <Form.Text className="text-danger">
                    {validationErrors.image_url}
                  </Form.Text>
                )}
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1 ms-2"
                onClick={() =>
                  isUpdate
                    ? [handleCancelUpdate(), toggleResponsiveModal()]
                    : toggleResponsiveModal()
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
                <i className="mdi mdi-plus-circle"></i> Add University
              </Button>
              <h4 className="header-title mb-4">Manage University</h4>
              <Table
                columns={columns}
                data={records ? records : []}
                pageSize={5}
                sizePerPageList={sizePerPageList}
                isSortable={true}
                pagination={true}
                isSearchable={true}
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
  const [sourceData, setSourceData] = useState([]);

  //Fetch data from redux store
  const { state, error, loading, initialLoading, country } = useSelector(
    (state: RootState) => ({
      state: state.University.universities.data,
      error: state.University.error,
      loading: state.University.loading,
      initialLoading: state.University.initialloading,
      country: state.Country.countries,
    })
  );

  // const Source = useSelector(
  //   (state: RootState) => state?.Source?.sources?.data
  // );

  useEffect(() => {
    dispatch(getUniversity());
    dispatch(getCountry());
  }, []);

  useEffect(() => {
    if (country) {
      const CountryArray = country?.map((source: any) => ({
        value: source.id.toString(),
        label: source.country_name, // Replace with the appropriate field from the lead data
      }));
      setSourceData(CountryArray);
    }
  }, [country]);

  if (initialLoading) {
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
          { label: "Master", path: "/master/university" },
          { label: "University", path: "/master/university", active: true },
        ]}
        title={"University"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            country={sourceData}
            error={error}
            loading={loading}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default University;
