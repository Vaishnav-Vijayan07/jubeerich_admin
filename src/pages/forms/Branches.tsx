import * as yup from "yup";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Card, Form, Button, Modal, Spinner } from "react-bootstrap";
import Table from "../../components/Table";
import { withSwal } from "react-sweetalert2";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addBranches, deleteBranches, getBranches, updateBranches } from "../../redux/branches/actions";
import { AUTH_SESSION_KEY, customStyles } from "../../constants";
import { getRegion } from "../../redux/regions/actions";
import Select from "react-select";
import { getOfficeTypeData } from "../../redux/OfficeType/actions";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { regrexValidation } from "../../utils/regrexValidation";
import axios from "axios";
import { FormInput } from "../../components";

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
  status: true,
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
  const { swal, state, regions, office, initialLoading, error, loading } = props;

  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  const records: TableRecords[] = state;
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [validationErrors, setValidationErrors] = useState<any>(initialValidationState);
  const [selectedOffice, setSelectedOffice] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);
  const [allCountries, setAllCountries] = useState<any>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [allStates, setAllStates] = useState<any>([]);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [allCities, setAllCities] = useState<any>(null)
  const [selectedCity, setSelectedCity] = useState<any>(null);

  const getAllCountries = async () => {
    try {
      const res = await axios.get(`https://countriesnow.space/api/v0.1/countries/iso`, {
        timeout: 10000,
      });
      setAllCountries(res?.data?.data);

    } catch (error) {
      console.log(error);
    }
  };

  const getStateByCountry = async (country: any) => {
    try {
      const res = await axios.get(`https://countriesnow.space/api/v0.1/countries/states/q?country=${country}`);
      if (res) return res?.data?.data?.states || [];
    
    } catch (error) {
      console.log(error);
    }
  };

  const getCityByState = async (country: any, state: any) => {
    try {
      const res = await axios.get(`https://countriesnow.space/api/v0.1/countries/state/cities/q?country=${country}&state=${state}`);
      if (res) return res?.data?.data || [];

    } catch (error) {
      console.log(error);
    }
  };

  const validationSchema = yup.object().shape({
    branch_name: yup.string().required("Branch name is required").min(3, "Branch name must be at least 3 characters long"),
    email: yup.string().email("Must be a valid email").required("Email is required"),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number must be digits only")
      .min(10, "Phone number must be at least 10 digits long"),
    address: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    country: yup.string().required("Country is required"),
    pincode: yup.string()
      .required("Pincode is required")
      .matches(/^[0-9]+$/, "Pincode must be digits only")
      .min(5, "Pincode must be at least 5 digits long"),
    contact_person_email: yup.string().email("Must be a valid email").required("Email is required"),
    contact_person_name: yup.string()
      .required("Contact person name is required")
      .min(3, "Name must be at least 3 characters long"),
    contact_person_mobile: yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number must be digits only")
      .min(10, "Phone number must be at least 10 digits long"),
    contact_person_designation: yup.string()
      .required("Designation is required")
      .min(3, "Designation must be at least 3 characters long"),
    website: yup.string(),
    social_media: yup.string(),
    account_mail: yup.string(),
    support_mail: yup.string(),
    region_id: yup.string().required("Region is required"),
    updated_by: yup.string(),
    status: yup.string(),
  });

  const columns = [
    {
      Header: "No",
      accessor: "id",
      sort: false,
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
    },
    {
      Header: "Branch Name",
      accessor: "branch_name",
      sort: true,
    },
    {
      Header: "Email",
      accessor: "email",
      sort: true,
    },
    {
      Header: "Phone",
      accessor: "phone",
      sort: false,
    },
    {
      Header: "City",
      accessor: "city",
      sort: true,
    },
    {
      Header: "Region",
      accessor: "region_name",
      sort: true,
    },
    {
      Header: "Status",
      accessor: "status",
      sort: true,
      Cell: ({ row }: any) => (
        <React.Fragment>
          <span
            className={classNames("badge", {
              "badge-soft-success": row.original.status == true,
              "badge-soft-danger": row.original.status == false,
            })}
          >
            {row.original.status ? "active" : "disabled"}
          </span>
        </React.Fragment>
      ),
    },
    {
      Header: "Actions",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* View Icon */}
          <Link to={`/settings/master/branch_detials/${row.original?.id}`} className="action-icon">
            <i className="mdi mdi-eye-outline"></i>
          </Link>

          {/* Edit Icon */}
          <Link
            to="#"
            className="action-icon"
            onClick={() => {
              handleUpdate(row.original);
              toggleResponsiveModal();
            }}
          >
            <i className="mdi mdi-square-edit-outline"></i>
          </Link>

          {/* Delete Icon */}
          <Link to="#" className="action-icon" onClick={() => handleDelete(row.original.id)}>
            <i className="mdi mdi-delete-outline"></i>
          </Link>
        </div>
      ),
    },
  ];

  const handleUpdate = async (item: any) => {
    const updatedOffice = office?.filter((office: any) => office?.value === item.office_type);
    setSelectedOffice(updatedOffice[0]);

    const updatedRegion = regions?.filter((region: any) => region?.value === item.region_id);
    setSelectedRegion(updatedRegion[0]);

    const updatedCountry = allCountries?.find((country: any) => country.name === item.country);
    setSelectedCountry(updatedCountry ? { label: updatedCountry?.name, value: updatedCountry?.name } : null);

    if (updatedCountry) {
      const resStates = await getStateByCountry(updatedCountry?.name)
      setAllStates(resStates);

      const updatedState = resStates?.find((state: any) => state?.name === item?.state);
      setSelectedState(updatedState ? { label: updatedState?.name, value: updatedState?.name } : null);

      if (updatedState) {
        const resCities = await getCityByState(updatedCountry?.name, updatedState?.name)
        setAllCities(resCities);

        const updatedCity = resCities?.find((city: string) => city === item?.city);
        setSelectedCity(updatedCity ? { label: updatedCity, value: updatedCity } : null);
      }
    }

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
        }
      });
  };

  const handleInputChange = (e: any) => {
    const { name, value, checked } = e.target;

    if (!regrexValidation(name, value)) {
      console.error(`Invalid ${name}: ${value}`);
      return;
    }

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });

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
        })
        .catch((err: any) => {
          console.log(err);
        });

      // Clear validation errors
      setValidationErrors({
        branch_name: "",
        address: "",
        city: "",
        country: "",
      });

      setFormData(initialState);

    } catch (validationError) {
      // Handle validation errors
      if (validationError instanceof yup.ValidationError) {
        const errors: any = {};
        validationError.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        console.log(errors);

        setValidationErrors(errors);
      }
    }
  };

  const handleCancelUpdate = () => {
    setIsUpdate(false);
    setFormData(initialState);
  };

  const handleDropDowns = async (selected: any, { name }: any) => {
    setFormData((prev: any) => {
      let updatedFormData = { ...prev };

      switch (name) {
        case "country":
          setSelectedCountry(selected);
          setSelectedState(null);
          setSelectedCity(null);
          updatedFormData.country = selected?.value;
          break;
        case "state":
          setSelectedState(selected);
          setSelectedCity(null);
          updatedFormData.state = selected?.value;
          break;
        case "city":
          setSelectedCity(selected);
          updatedFormData.city = selected?.value;
          break;
        case "region_id":
          setSelectedRegion(selected);
          updatedFormData.region_id = selected?.value;
          break;
        default:
          break;
      }
      return updatedFormData;
    });

    switch (name) {
      case "country":
        const stateData = await getStateByCountry(selected?.value);
        setAllStates(stateData);
        break;
      case "state":
        const cityData = await getCityByState(selectedCountry?.value, selected?.value);
        setAllCities(cityData);
        break;
      default:
        break;
    }
  };

  const handleResetValues = () => {
    setValidationErrors(initialValidationState);
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedRegion(null);
    setFormData(initialState);
    setSelectedOffice("");
    setValidationErrors(initialValidationState);

  };

  const toggleResponsiveModal = () => {
    setResponsiveModal(!responsiveModal);
    setValidationErrors(initialValidationState);
    if (isUpdate) {
      handleCancelUpdate();
    }
  };

  useEffect(() => {
    if (!loading && !error) {
      setResponsiveModal(false);
      setValidationErrors(initialValidationState);
      setFormData(initialState);
      setSelectedRegion(null);
    }
  }, [loading, error]);

  useEffect(() => {
    getAllCountries();
  }, [])

  const Cities = useMemo(() => {
    if (!allCities || allCities.length === 0) return [];

    return allCities.map((city: string) => ({
      label: city,
      value: city,
    }));
  }, [allCities]);

  return (
    <>
      <Row className="justify-content-between px-2">
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} size="lg" dialogClassName="modal-right">
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Branch Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="branch_name">
                    <Form.Label className=""><span className="text-danger fs-4">* </span> Branch Name</Form.Label>
                    <Form.Control type="text" name="branch_name" value={formData.branch_name} onChange={handleInputChange} />
                    {validationErrors.branch_name && (
                      <Form.Text className="text-danger">{validationErrors.branch_name}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="branch_name">
                    <Form.Label className=""><span className="text-danger fs-4">* </span> Email</Form.Label>
                    <Form.Control type="text" name="email" value={formData.email} onChange={handleInputChange} />
                    {validationErrors.email && <Form.Text className="text-danger">{validationErrors.email}</Form.Text>}
                  </Form.Group>
                </Col>

                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="branch_name">
                    <Form.Label className=""><span className="text-danger fs-4">* </span> Phone</Form.Label>
                    <Form.Control type="number" name="phone" value={formData.phone} onChange={handleInputChange} />
                    {validationErrors.phone && <Form.Text className="text-danger">{validationErrors.phone}</Form.Text>}
                  </Form.Group>
                </Col>
                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="branch_name">
                    <Form.Label className=""><span className="text-danger fs-4">* </span> Pincode</Form.Label>
                    <Form.Control type="number" name="pincode" value={formData.pincode} onChange={handleInputChange} />
                    {validationErrors.pincode && <Form.Text className="text-danger">{validationErrors.pincode}</Form.Text>}
                  </Form.Group>
                </Col>

                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="country">
                    <Form.Label><span className="text-danger fs-4">* </span> Branch Country</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="country"
                      options={allCountries?.map((item: any) => {
                        return {
                          label: item.name,
                          value: item?.name,
                          iso: item?.Iso3,
                        };
                      })}
                      value={selectedCountry}
                      onChange={handleDropDowns}
                    />

                    {/* <FormInput
                      type="text"
                      name="country"
                      placeholder="Enter country"
                      key="country"
                      value={formData?.country} // Change to basicInfo
                      onChange={handleInputChange}
                    // disabled={true}
                    /> */}

                    {validationErrors.country && <Form.Text className="text-danger">{validationErrors.country}</Form.Text>}
                  </Form.Group>
                </Col>

                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="state">
                    <Form.Label><span className="text-danger fs-4">* </span> Branch State</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="state"
                      options={allStates?.map((item: any) => {
                        return {
                          label: item.name,
                          value: item?.name,
                          iso: item?.Iso3,
                        };
                      })}
                      value={selectedState}
                      onChange={handleDropDowns}
                      isDisabled={!selectedCountry}
                    />

                    {/* <FormInput
                      type="text"
                      name="state"
                      placeholder="Enter state"
                      key="state"
                      value={formData?.state} // Change to basicInfo
                      onChange={handleInputChange}
                    // disabled={true}
                    /> */}

                    {validationErrors.state && <Form.Text className="text-danger">{validationErrors.state}</Form.Text>}
                  </Form.Group>
                </Col>

                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="city">
                    <Form.Label><span className="text-danger fs-4">* </span> Branch City</Form.Label>
                    {/* <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="city"
                      options={Cities}
                      value={selectedCity}
                      onChange={handleDropDowns}
                      isDisabled={!selectedState}
                    /> */}
                    
                    <FormInput
                      type="text"
                      name="city"
                      placeholder="Enter city"
                      key="city"
                      value={formData?.city} // Change to basicInfo
                      onChange={handleInputChange}
                    // disabled={true}
                    />

                    {validationErrors.city && <Form.Text className="text-danger">{validationErrors.city}</Form.Text>}
                  </Form.Group>
                </Col>

                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="source_id">
                    <Form.Label><span className="text-danger fs-4">* </span> Region</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="region_id"
                      options={regions}
                      value={selectedRegion}
                      onChange={handleDropDowns}
                    />

                    {validationErrors.region_id && <Form.Text className="text-danger">{validationErrors.region_id}</Form.Text>}
                  </Form.Group>
                </Col>
                <Col className="">
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

                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label><span className="text-danger fs-4">* </span> Branch Address</Form.Label>
                    <Form.Control as="textarea" rows={5} name="address" value={formData.address} onChange={handleInputChange} />
                    {validationErrors.address && <Form.Text className="text-danger">{validationErrors.address}</Form.Text>}
                  </Form.Group>
                </Col>

                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="contact_person_email">
                    <Form.Label><span className="text-danger fs-4">* </span> Contact Person Email</Form.Label>
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
                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="contact_person_name">
                    <Form.Label><span className="text-danger fs-4">* </span> Contact Person Name</Form.Label>
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

                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="contact_person_mobile">
                    <Form.Label><span className="text-danger fs-4">* </span> Contact Person Mobile</Form.Label>
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
                <Col md={12} lg={6}>
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

                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="website">
                    <Form.Label>Website</Form.Label>
                    <Form.Control type="url" name="website" value={formData.website} onChange={handleInputChange} />
                    {validationErrors.website && <Form.Text className="text-danger">{validationErrors.website}</Form.Text>}
                  </Form.Group>
                </Col>
                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="social_media">
                    <Form.Label>Social Media</Form.Label>
                    <Form.Control type="url" name="social_media" value={formData.social_media} onChange={handleInputChange} />
                    {validationErrors.social_media && (
                      <Form.Text className="text-danger">{validationErrors.social_media}</Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="account_mail">
                    <Form.Label>Account Mail</Form.Label>
                    <Form.Control type="email" name="account_mail" value={formData.account_mail} onChange={handleInputChange} />
                    {validationErrors.account_mail && (
                      <Form.Text className="text-danger">{validationErrors.account_mail}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={12} lg={6}>
                  <Form.Group className="mb-3" controlId="support_mail">
                    <Form.Label>Support Mail</Form.Label>
                    <Form.Control type="email" name="support_mail" value={formData.support_mail} onChange={handleInputChange} />
                    {validationErrors.support_mail && (
                      <Form.Text className="text-danger">{validationErrors.support_mail}</Form.Text>
                    )}
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
                  isUpdate
                    ? [handleCancelUpdate(), toggleResponsiveModal(), handleResetValues()]
                    : [toggleResponsiveModal(), handleResetValues()]
                }
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
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={() => [toggleResponsiveModal(), handleResetValues()]}>
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
                initialLoading={initialLoading}
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

  const { state, regions, office, initialLoading, loading, error } = useSelector((state: RootState) => ({
    state: state.Branches.branches.data,
    initialLoading: state.Branches.initialLoading,
    loading: state.Branches.loading,
    error: state.Branches.error,
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

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Branches", path: "/settings/master/branches", active: true },
        ]}
        title={"Branches"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            regions={regionsData}
            office={officeData}
            initialLoading={initialLoading}
            loading={loading}
            error={error}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Branches;
