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
  addCountry,
  deleteCountry,
  getCountry,
  updateCountry,
} from "../../redux/country/actions";
import { Link } from "react-router-dom";
import { regrexValidation } from "../../utils/regrexValidation";

interface OptionType {
  value: string;
  label: string;
}

interface TableRecords {
  id: string;
  country_name: string;
  country_code: string;
  isd: string;
}

const sizePerPageList = [
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
  country_name: "",
  country_code: "",
  isd: "",
};

const initialValidationState = {
  country_name: "",
  country_code: "",
  isd: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, error, loading, initialLoading } = props;

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //Table data
  const records: TableRecords[] = state;

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState(initialState);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(
    initialValidationState
  );

  const validationSchema = yup.object().shape({
    country_name: yup
      .string()
      .required("Country name is required")
      .min(3, "Country name must be at least 3 characters long"),
    country_code: yup.string().required("Country code is required"),
    isd: yup.string().required("ISD code is required"),
  });

  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  const handleUpdate = (item: any) => {
    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      country_name: item?.country_name,
      country_code: item?.country_code,
      isd: item?.isd,
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
          dispatch(deleteCountry(id));
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
        confirmButtonText: `Yes, ${isUpdate ? 'Update': 'Create'}`,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          if (userInfo) {
            const { user_id } = JSON.parse(userInfo);
            if (isUpdate) {
              // Handle update logic
              dispatch(
                updateCountry(
                  formData.id,
                  formData.country_name,
                  formData.country_code,
                  formData.isd
                )
              );
              setIsUpdate(false);
            } else {
              // Handle add logic
              dispatch(
                addCountry(
                  formData.country_name,
                  formData.country_code,
                  formData.isd
                )
              );
            }
          }
        }
      });

      // if (userInfo) {
      //   const { user_id } = JSON.parse(userInfo);
      //   if (isUpdate) {
      //     // Handle update logic
      //     dispatch(
      //       updateCountry(
      //         formData.id,
      //         formData.country_name,
      //         formData.country_code,
      //         formData.isd
      //       )
      //     );
      //     setIsUpdate(false);
      //   } else {
      //     // Handle add logic
      //     dispatch(
      //       addCountry(
      //         formData.country_name,
      //         formData.country_code,
      //         formData.isd
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
      Header: "Country Name",
      accessor: "country_name",
      sort: true,
    },
    {
      Header: "Country Code",
      accessor: "country_code",
      sort: false,
    },
    {
      Header: "ISD Code",
      accessor: "isd",
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
            toggleResponsiveModal();
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
    handleResetValues();
  };

  const handleResetValues = () => {
    setValidationErrors(initialValidationState); // Clear validation errors
    setFormData(initialState); //clear form data
  };

  const toggleResponsiveModal = () => {
    setResponsiveModal(!responsiveModal);
    setValidationErrors(initialValidationState);
    if (isUpdate) {
      handleCancelUpdate();
    }
  };

  const handleKeyPress = (event: any) => {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    // Check for errors and clear the form
    if (!loading && !error) {
      setResponsiveModal(false);
      setValidationErrors(initialValidationState); // Clear validation errors
      setFormData(initialState); //clear form data
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
              <h4 className="modal-title">Country Management</h4>
            </Modal.Header>
            <Modal.Body>
              <>
                <Form.Group className="mb-3" controlId="country_name">
                  <Form.Label>Country Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="country_name"
                    value={formData.country_name}
                    onChange={handleInputChange}
                  />
                  {validationErrors.country_name && (
                    <Form.Text className="text-danger">
                      {validationErrors.country_name}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="country_code">
                  <Form.Label>Country Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleInputChange}
                  />
                  {validationErrors.country_code && (
                    <Form.Text className="text-danger">
                      {validationErrors.country_code}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="isd">
                  <Form.Label>ISD Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="isd"
                    value={formData.isd}
                    onKeyPress={handleKeyPress}
                    onChange={handleInputChange}
                  />
                  {validationErrors.isd && (
                    <Form.Text className="text-danger">
                      {validationErrors.isd}
                    </Form.Text>
                  )}
                </Form.Group>
              </>
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
                    : [toggleResponsiveModal(),handleResetValues()]
                }
              >
                {isUpdate ? "Cancel" : "Close"}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                variant="success"
                id="button-addon2"
                className="mt-1"
              >
                {isUpdate ? "Update" : loading ? "Loading" : "Submit"}
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
                <i className="mdi mdi-plus-circle"></i> Add Country
              </Button>
              <h4 className="header-title mb-4">Manage Countries</h4>
              <Table
                columns={columns}
                data={records ? records : []}
                pageSize={25}
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

const Country = () => {
  const dispatch = useDispatch<AppDispatch>();

  //Fetch data from redux store
  const { state, error, loading, initialLoading } = useSelector(
    (state: RootState) => ({
      state: state.Country.countries,
      error: state.Country.error,
      loading: state.Country.loading,
      initialLoading: state.Country.initialLoading,
    })
  );

  const Source = useSelector(
    (state: RootState) => state?.Source?.sources?.data
  );

  useEffect(() => {
    dispatch(getCountry());
  }, []);

  // if (initialLoading) {
  //   return (
  //     <Spinner
  //       animation="border"
  //       style={{ position: "absolute", top: "50%", left: "50%" }}
  //     />
  //   );
  // }

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Master", path: "/settings/master/country" },
          { label: "Countries", path: "/settings/master/country", active: true },
        ]}
        title={"Countries"}
      />
      <Row>
        <Col>
          <BasicInputElements state={state} error={error} loading={loading} initialLoading={initialLoading} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Country;
