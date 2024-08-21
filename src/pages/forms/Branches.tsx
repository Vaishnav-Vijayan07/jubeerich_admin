import * as yup from "yup";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Row, Col, Card, Form, Button, Modal, Spinner } from "react-bootstrap";
import Table from "../../components/Table";
import { withSwal } from "react-sweetalert2";
import FeatherIcons from "feather-icons-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Country, City, ICity, State } from "country-state-city";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addBranches, deleteBranches, getBranches, updateBranches } from "../../redux/branches/actions";
import { AUTH_SESSION_KEY } from "../../constants";
import { getRegion } from "../../redux/regions/actions";
import Select from "react-select";
import { getOfficeTypeData } from "../../redux/OfficeType/actions";
import { Link } from "react-router-dom";
import classNames from "classnames";

interface TableRecords {
  id: string;
  branch_name: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  updated_by: string;
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
  branch_name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  contact_person_email: "",
  contact_person_name: "",
  contact_person_mobile: "",
  contact_person_designation: "",
  website: "",
  social_media: "",
  account_mail: "",
  support_mail: "",
  office_type: "",
  region_id: "",
  status: false,
};

const initialValidationState = {
  branch_name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  contact_person_email: "",
  contact_person_name: "",
  contact_person_mobile: "",
  contact_person_designation: "",
  website: "",
  social_media: "",
  account_mail: "",
  support_mail: "",
  office_type: "",
  region_id: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, regions, office } = props;

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //Table data
  const records: TableRecords[] = state;
  const [isUpdate, setIsUpdate] = useState(false);
  //Input data
  const [formData, setFormData] = useState(initialState);
  //validation errors
  const [validationErrors, setValidationErrors] = useState<any>(initialValidationState);
  const [selectedOffice, setSelectedOffice] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  // Country and city
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [cities, setCities] = useState<any>([]);
  const [states, setStates] = useState<any>([]);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  const options = useMemo(() => Country.getAllCountries(), []);

  const validationSchema = yup.object().shape({
    branch_name: yup
      .string()
      .required("Branch name is required")
      .min(3, "Branch name must be at least 3 characters long"),
    email: yup.string().email("Must be a valid email").required("Email is required"),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number must be digits only")
      .min(10, "Phone number must be at least 10 digits long"),
    address: yup.string().required("Address is required").min(3, "Address must be at least 3 characters long"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    country: yup.string().required("Country is required"),
    pincode: yup
      .string()
      .required("Pincode is required")
      .matches(/^[0-9]+$/, "Pincode must be digits only")
      .min(5, "Pincode must be at least 5 digits long"),
    contact_person_email: yup.string().email("Must be a valid email").required("Contact person email is required"),
    contact_person_name: yup
      .string()
      .required("Contact person name is required")
      .min(3, "Contact person name must be at least 3 characters long"),
    contact_person_mobile: yup
      .string()
      .required("Contact person mobile number is required")
      .matches(/^[0-9]+$/, "Mobile number must be digits only")
      .min(10, "Mobile number must be at least 10 digits long"),
    contact_person_designation: yup
      .string()
      .required("Contact person designation is required")
      .min(3, "Designation must be at least 3 characters long"),
    website: yup.string().url("Must be a valid URL").required("Website URL is required"),
    social_media: yup.string().url("Must be a valid URL").required("Social media URL is required"),
    account_mail: yup.string().email("Must be a valid email").required("Account email is required"),
    support_mail: yup.string().email("Must be a valid email").required("Support email is required"),
    office_type: yup.string().required("Office type is required"),
    region_id: yup.string().required("Region ID is required"),
    updated_by: yup.string().required("Updated by is required"),
    status: yup.string().required("Status is required"),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  //handling update logic
  const handleUpdate = (item: any) => {
    const selected = options?.find((country) => country?.name === item?.country);
    if (selected) {
      setSelectedCountry(selected?.isoCode);
    } else {
      setSelectedCountry("");
    }

    const updatedOffice = office?.filter((office: any) => office?.value == item.office_type);
    setSelectedOffice(updatedOffice[0]);

    const updatedRegion = regions?.filter((region: any) => region?.value == item.region_id);
    setSelectedRegion(updatedRegion[0]);

    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      branch_name: item?.branch_name,
      email: item?.email,
      phone: item?.phone,
      address: item?.address,
      city: item?.city,
      state: item?.state,
      country: item?.country,
      pincode: item?.pincode,
      contact_person_email: item?.contact_person_email,
      contact_person_name: item?.contact_person_name,
      contact_person_mobile: item?.contact_person_mobile,
      contact_person_designation: item?.contact_person_designation,
      website: item?.website,
      social_media: item?.social_media,
      account_mail: item?.account_mail,
      support_mail: item?.support_mail,
      office_type: item?.office_type,
      region_id: item?.region_id,
      status: item?.status,
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
          dispatch(deleteBranches(id));
          // swal.fire("Deleted!", "Your item has been deleted.", "success");
        }
      });
  };

  //handle onchange function
  const handleInputChange = (e: any) => {
    const { name, value, checked } = e.target;
    if (name == "status") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
      return;
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
      console.log('ENTERED');
      
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
                updateBranches(
                  formData.id,
                  formData.branch_name,
                  formData.email,
                  formData.phone,
                  formData.address,
                  formData.city,
                  formData.state,
                  formData.country,
                  formData.pincode,
                  formData.contact_person_email,
                  formData.contact_person_name,
                  formData.contact_person_mobile,
                  formData.contact_person_designation,
                  formData.website,
                  formData.social_media,
                  formData.account_mail,
                  formData.support_mail,
                  formData.office_type,
                  formData.region_id,
                  formData.status,
                  user_id
                )
              );
              setIsUpdate(false);
            } else {
              // Handle add logic
              dispatch(
                addBranches(
                  formData.branch_name,
                  formData.email,
                  formData.phone,
                  formData.address,
                  formData.city,
                  formData.state,
                  formData.country,
                  formData.pincode,
                  formData.contact_person_email,
                  formData.contact_person_name,
                  formData.contact_person_mobile,
                  formData.contact_person_designation,
                  formData.website,
                  formData.social_media,
                  formData.account_mail,
                  formData.support_mail,
                  formData.office_type,
                  formData.region_id,
                  formData.status,
                  user_id
                )
              );
            }
          }
        }
      }).catch((err: any)=>{
        console.log(err);
      })

      // Clear validation errors
      setValidationErrors({
        branch_name: "",
        address: "",
        city: "",
        country: "",
      });

      //clear form data
      setFormData(initialState);

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
      Header: "Branch Name",
      accessor: "branch_name",
      sort: false,
    },
    {
      Header: "Email",
      accessor: "email",
      sort: false,
    },
    {
      Header: "Phone",
      accessor: "phone",
      sort: false,
    },
    {
      Header: "City",
      accessor: "city",
      sort: false,
    },
    {
      Header: "Region",
      accessor: "region_name",
      sort: false,
    },
    {
      Header: "Status",
      accessor: "status",
      sort: false,
      Cell: ({ row }: any) => (
        <React.Fragment>
          <span
            className={classNames("badge", {
              "badge-soft-success": row.original.status === true,
              "badge-soft-danger": row.original.status === false,
            })}
          >
            {row.original.status ? "active" : "disabled"}
          </span>
        </React.Fragment>
      )
    },
    {
      Header: " ",
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
    setFormData(initialState);
  };

  const handleOfficeChanges = (selected: any) => {
    setSelectedOffice(selected);
    setFormData((prev) => ({
      ...prev,
      office_type: selected.value,
    }));
  };
  const handleRegionChanges = (selected: any) => {
    setSelectedRegion(selected);
    setFormData((prev) => ({
      ...prev,
      region_id: selected.value,
    }));
  };

  const handleCountryChange = (event: any) => {
    const selectedCountryName = event.target.value;
    const selectedCountry = options.find((country) => country.name === selectedCountryName);

    if (selectedCountry) {
      setSelectedCountry(selectedCountry.isoCode);
      setStates(State?.getStatesOfCountry(selectedCountry.isoCode));
      setCities([]); // Update selectedCountry with isoCode
      setFormData({
        ...formData,
        country: selectedCountryName,
        city: "", // Reset the city when country changes
      });
    } else {
      // Handle the case when no matching country is found
      setSelectedCountry(""); // Reset selectedCountry
      setStates("");
      setCities([]);
      setFormData({
        ...formData,
        country: selectedCountryName,
        city: "", // Reset the city when country changes
      });
    }
  };
  const handleStateChange = (event: any) => {
    const selectedCountryName = event.target.value;
    const selectedCountry = states.find((country: any) => country.name === selectedCountryName);

    if (selectedCountry) {
      setSelectedState(selectedCountry.isoCode); // Update selectedCountry with isoCode
      setFormData({
        ...formData,
        state: selectedCountryName,
        city: "", // Reset the city when country changes
      });
    } else {
      // Handle the case when no matching country is found
      setSelectedState(""); // Reset selectedCountry
      setFormData({
        ...formData,
        state: selectedCountryName,
        city: "", // Reset the city when country changes
      });
    }
  };

  const handleResetValues = () => {
    setValidationErrors({
      branch_name: "",
      address: "",
      city: "",
      country: "",
    });

    setFormData(initialState)
    setSelectedRegion('')
    setSelectedOffice('')
    setValidationErrors(initialValidationState);
  }

  useEffect(() => {
    if (selectedCountry !== null && selectedState !== null) {
      const fetchCities = async () => {
        const updatedCities = City.getCitiesOfState(selectedCountry, selectedState);
        setCities(updatedCities);
      };

      fetchCities();
    }
  }, [selectedState, isUpdate]);

  const toggleResponsiveModal = () => {
    setResponsiveModal(!responsiveModal);
    setValidationErrors(initialValidationState);
    if (isUpdate) {
      handleCancelUpdate();
    }
  };

  return (
    <>
      <Row className="justify-content-between px-2">
        {/* <Col lg={5} className="bg-white p-3"> */}
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} size="lg" dialogClassName="modal-right">
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Branch Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="branch_name">
                    <Form.Label className="">Branch Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="branch_name"
                      value={formData.branch_name}
                      onChange={handleInputChange}
                    />
                    {validationErrors.branch_name && (
                      <Form.Text className="text-danger">{validationErrors.branch_name}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="branch_name">
                    <Form.Label className="">Email</Form.Label>
                    <Form.Control type="text" name="email" value={formData.email} onChange={handleInputChange} />
                    {validationErrors.email && <Form.Text className="text-danger">{validationErrors.email}</Form.Text>}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="branch_name">
                    <Form.Label className="">Phone</Form.Label>
                    <Form.Control type="number" name="phone" value={formData.phone} onChange={handleInputChange} />
                    {validationErrors.phone && <Form.Text className="text-danger">{validationErrors.phone}</Form.Text>}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="branch_name">
                    <Form.Label className="">Pincode</Form.Label>
                    <Form.Control type="number" name="pincode" value={formData.pincode} onChange={handleInputChange} />
                    {validationErrors.pincode && (
                      <Form.Text className="text-danger">{validationErrors.pincode}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="country">
                    <Form.Label>Branch Country</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      name="country"
                      value={formData.country}
                      onChange={handleCountryChange}
                    >
                      <option value="">
                        Choose..
                      </option>
                      {options?.map((item: any) => (
                        <option
                          value={item?.name}
                          key={item?.name}
                          onClick={() => setSelectedCountry(item.isoCode)}
                          defaultValue={item.name === formData.country ? item.name : undefined}
                        >
                          {item.name}
                        </option>
                      ))}
                    </Form.Select>

                    {validationErrors.country && (
                      <Form.Text className="text-danger">{validationErrors.country}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="country">
                    <Form.Label>Branch State</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      name="country"
                      value={formData.state}
                      onChange={handleStateChange}
                    >
                      <option value="">
                        Choose..
                      </option>
                      {states?.map((item: any) => (
                        <option
                          value={item?.name}
                          key={item?.name}
                          defaultValue={item.name === formData.country ? item.name : undefined}
                        >
                          {item.name}
                        </option>
                      ))}
                    </Form.Select>

                    {validationErrors.country && (
                      <Form.Text className="text-danger">{validationErrors.country}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="city">
                    <Form.Label>Branch City</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    >
                      <option value="">
                        Choose..
                      </option>
                      {cities?.map((item: any, index: number) => (
                        <option
                          value={item?.name}
                          key={index}
                          defaultValue={item.name === formData.country ? item.name : ""}
                        >
                          {item.name}
                        </option>
                      ))}
                    </Form.Select>

                    {validationErrors.city && <Form.Text className="text-danger">{validationErrors.city}</Form.Text>}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="source_id">
                    <Form.Label>Office</Form.Label>
                    <Select
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="office_type"
                      options={[{ value: null, label: "None" }, ...office]}
                      value={selectedOffice}
                      onChange={handleOfficeChanges}
                    />

                    {validationErrors.office_type && (
                      <Form.Text className="text-danger">{validationErrors.office_type}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="source_id">
                    <Form.Label>Region</Form.Label>
                    <Select
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="region_id"
                      options={[{ value: null, label: "None" }, ...regions]}
                      value={selectedRegion}
                      onChange={handleRegionChanges}
                    />

                    {validationErrors.region_id && (
                      <Form.Text className="text-danger">{validationErrors.region_id}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col className="text-center">
                  <Form.Group className="mb-3" controlId="source_id">
                    <Form.Label>Status</Form.Label>
                    <Form.Check
                      type="switch"
                      id="active-switch"
                      name="status"
                      onChange={handleInputChange}
                      checked={formData.status}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Branch Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                    {validationErrors.address && (
                      <Form.Text className="text-danger">{validationErrors.address}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="contact_person_email">
                    <Form.Label>Contact Person Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="contact_person_email"
                      value={formData.contact_person_email}
                      onChange={handleInputChange}
                    />
                    {validationErrors.contact_person_email && (
                      <Form.Text className="text-danger">{validationErrors.contact_person_email}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="contact_person_name">
                    <Form.Label>Contact Person Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="contact_person_name"
                      value={formData.contact_person_name}
                      onChange={handleInputChange}
                    />
                    {validationErrors.contact_person_name && (
                      <Form.Text className="text-danger">{validationErrors.contact_person_name}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="contact_person_mobile">
                    <Form.Label>Contact Person Mobile</Form.Label>
                    <Form.Control
                      type="text"
                      name="contact_person_mobile"
                      value={formData.contact_person_mobile}
                      onChange={handleInputChange}
                    />
                    {validationErrors.contact_person_mobile && (
                      <Form.Text className="text-danger">{validationErrors.contact_person_mobile}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="contact_person_designation">
                    <Form.Label>Contact Person Designation</Form.Label>
                    <Form.Control
                      type="text"
                      name="contact_person_designation"
                      value={formData.contact_person_designation}
                      onChange={handleInputChange}
                    />
                    {validationErrors.contact_person_designation && (
                      <Form.Text className="text-danger">{validationErrors.contact_person_designation}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="website">
                    <Form.Label>Website</Form.Label>
                    <Form.Control type="url" name="website" value={formData.website} onChange={handleInputChange} />
                    {validationErrors.website && (
                      <Form.Text className="text-danger">{validationErrors.website}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="social_media">
                    <Form.Label>Social Media</Form.Label>
                    <Form.Control
                      type="url"
                      name="social_media"
                      value={formData.social_media}
                      onChange={handleInputChange}
                    />
                    {validationErrors.social_media && (
                      <Form.Text className="text-danger">{validationErrors.social_media}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="account_mail">
                    <Form.Label>Account Mail</Form.Label>
                    <Form.Control
                      type="email"
                      name="account_mail"
                      value={formData.account_mail}
                      onChange={handleInputChange}
                    />
                    {validationErrors.account_mail && (
                      <Form.Text className="text-danger">{validationErrors.account_mail}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="support_mail">
                    <Form.Label>Support Mail</Form.Label>
                    <Form.Control
                      type="email"
                      name="support_mail"
                      value={formData.support_mail}
                      onChange={handleInputChange}
                    />
                    {validationErrors.support_mail && (
                      <Form.Text className="text-danger">{validationErrors.support_mail}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>
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
                onClick={() => (isUpdate ? [handleCancelUpdate(), toggleResponsiveModal()] : [toggleResponsiveModal(),handleResetValues()])}
              >
                {isUpdate ? "Cancel" : "Close"}
              </Button>
              <Button type="submit" variant="success" id="button-addon2" className="mt-1">
                {isUpdate ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
          {/* </Col> */}
        </Modal>

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Add Branch
              </Button>
              <h4 className="header-title mb-4">Manage Branch Details</h4>
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

const Branches = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [regionsData, setRegionsData] = useState([]);
  const [officeData, setOfficeData] = useState([]);

  //Fetch data from redux store
  const { state, regions, office, initialLoading } = useSelector((state: RootState) => ({
    state: state.Branches.branches.data,
    initialLoading: state.Branches.initialLoading,
    regions: state.Region.regions,
    office: state.OfficeTypes.officeTypes,
  }));

  useEffect(() => {
    dispatch(getBranches());
    dispatch(getRegion());
    dispatch(getOfficeTypeData());
  }, []);

  useEffect(() => {
    if (regions) {
      const data = regions.map((region: any) => ({
        value: region.id,
        label: region.region_name,
      }));
      setRegionsData(data);
    }
  }, [regions]);

  useEffect(() => {
    if (office) {
      const data = office.map((office: any) => ({
        value: office.id,
        label: office.office_type_name,
      }));
      setOfficeData(data);
    }
  }, [office]);

  if (initialLoading) {
    return <Spinner animation="border" style={{ position: "absolute", top: "50%", left: "50%" }} />;
  }

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Master", path: "/master/branches" },
          { label: "Branches", path: "/master/branches", active: true },
        ]}
        title={"Branches"}
      />
      <Row>
        <Col>
          <BasicInputElements state={state} regions={regionsData} office={officeData} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Branches;
