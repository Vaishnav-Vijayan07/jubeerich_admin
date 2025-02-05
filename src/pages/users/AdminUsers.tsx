import * as yup from "yup";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Row, Col, Card, Form, Button, Modal, Spinner, ButtonGroup, ToggleButton } from "react-bootstrap";
import Table from "../../components/Table";
import { withSwal } from "react-sweetalert2";
import FeatherIcons from "feather-icons-react";
import { yupResolver } from "@hookform/resolvers/yup";
import profilePic from "../../assets/images/users/user_circle_icon.png";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getRoles } from "../../redux/users/roles/actions";
import { addAdminUsers, getAdminUsers, getBranches, updateAdminUsers } from "../../redux/actions";
import Select, { OptionsType } from "react-select";
import {
  AUTH_SESSION_KEY,
  baseUrl,
  branch_counsellor_id,
  counsellor_id,
  counsellor_tl_id,
  country_manager_id,
  cre_id,
  franchise_counsellor_id,
  franchise_manager_id,
  regional_manager_id,
  showErrorAlert,
  showSuccessAlert,
} from "../../constants";
import { MyInitialState, OptionType, TableRecords, initialState, initialValidationState, sizePerPageList } from "./data";
import { APICore } from "../../helpers/api/apiCore";
import { Link } from "react-router-dom";
import { getCountry } from "../../redux/country/actions";
import { getRegion } from "../../redux/regions/actions";
import { getFranchise } from "../../redux/franchise/actions";
import { regrexValidation } from "../../utils/regrexValidation";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { approvalTypes, assignTypes } from "../forms/data";
import LeadAssignTable from "./LeadAssignTable";
const HistoryTable = React.lazy(() => import('../../components/HistoryTable'));

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, BranchesData, franchiseData, CountriesData, RolesData, regionData, error, loading, initialLoading, refetchUsers } =
    props;

  const [modal, setModal] = useState<boolean>(false);
  const [className, setClassName] = useState<string>("");
  const [historyModal, setHistoryModal] = useState<boolean>(false);

  const api = new APICore();
  const loggedInUser = api.getLoggedInUser();

  //Table data
  const records: TableRecords[] = state;
  const [isUpdate, setIsUpdate] = useState(false);
  //Input data
  const [formData, setFormData] = useState<MyInitialState>(initialState);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<OptionType[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const animatedComponents = makeAnimated();
  const [radioValue, setRadioValue] = useState<boolean>(true);
  const radios = [
    { name: "Active", value: "true" },
    { name: "Disable", value: "false" },
  ];
  const [openAssignTable, setOpenAssignTable] = useState<boolean>(false);
  const [approvalType, setApprovalType] = useState<any>('');
  const [leadsData, setLeadsData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(initialValidationState);

  const validationSchema = yup.object().shape({
    employee_id: yup.string().required("Employee id is required"),
    name: yup.string().required("Name is required").min(2, "Name must be at least 3 characters long"),
    email: yup.string().required("Email is required").email("Invalid email format"),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Phone number must be a valid 10-digit number"),
    // address: yup.string().required("Address is required").nullable(),
    username: yup.string().required("Username is required").min(4, "Username must be at least 4 characters long"),
    role_id: yup.string().nullable().required("Role is required"),
    password: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .when([], {
        is: () => !isUpdate,
        then: yup.string().required("Password is required").min(8, "Password must be at least 8 characters long").nullable(),
        otherwise: yup.string().nullable().min(8, "Password must be at least 8 characters long"),
      }),
    branch_id: yup
      .string()
      .nullable()
      .when("role_id", (roleId, schema) => {
        if (roleId == counsellor_tl_id || roleId == branch_counsellor_id) {
          return schema.required("Branch is required").nullable();
        }
        return schema.nullable();
      }),
    franchise_id: yup
      .string()
      .nullable()
      .when("role_id", (roleId, schema) => {
        if (roleId == franchise_counsellor_id || roleId == franchise_manager_id) {
          return schema.required("Franchise is required").nullable();
        }
        return schema.nullable();
      }),
    country_ids: yup
      .array()
      .nullable()
      .when("role_id", (roleId, schema) => {
        if (roleId == country_manager_id || roleId == counsellor_id) {
          return schema
            .required("Region is required")
            .min(1, "At least one country is required")
            .of(yup.string().required("Country ID must be a valid string"));
        }
        return schema.nullable();
      }),
    region_id: yup
      .string()
      .nullable()
      .when("role_id", (roleId, schema) => {
        if (roleId == regional_manager_id) {
          return schema.required("Region is required").nullable();
        }
        return schema.nullable();
      }),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  //handling update logic
  const handleUpdate = (item: any) => {
    const selectedPowerIds = item?.branches?.map((item: any) => ({
      value: item.id?.toString(),
      label: item.branch_name,
    }));

    // const countryArray = item?.countries?.map((country: any) => country?.id);
    const countryArray = item?.countries?.map((country: any) => country?.value);
    const updatedRole = RolesData?.filter((role: any) => role?.value == item?.role_id);
    setSelectedRole(updatedRole[0]);

    setSelectedBranch(selectedPowerIds);
    setRadioValue(item?.status);

    setFormData((prev) => ({
      ...prev,
      id: item.id,
      employee_id: item.employee_id,
      name: item.name,
      email: item.email.trim(),
      phone: item.phone,
      address: item.address,
      username: item.username,
      password: null,
      updated_by: item.updated_by,
      branch_ids: item?.branch_ids,
      role_id: item?.role_id,
      region_id: item?.region_id,
      branch_id: item?.branch_id,
      country_ids: countryArray,
      profile_image_path: item?.profile_image_path,
      franchise_id: item?.franchise_id,
      status: item?.status,
    }));

    setSelectedCountry(item?.countries);
    setIsUpdate(true);
  };

  //handle onchange function
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (!regrexValidation(name, value)) {
      console.error(`Invalid ${name}: ${value}`);
      return; // Stop updating if validation fails
    }

    if (name == "role_id" && value !== counsellor_id) {
      setFormData((prevData) => ({
        ...prevData,
        country_id: undefined,
      }));
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value == "" ? null : value,
    }));
  };

  const dispatchUpdateLead = () => {
    if (userInfo) {
      const { user_id } = JSON.parse(userInfo);

      dispatch(
        updateAdminUsers(
          formData.id,
          formData.employee_id,
          formData.name,
          formData.email,
          formData.phone,
          formData.address,
          formData.username,
          formData.password,
          // formData.updated_by,
          user_id,
          formData.role_id,
          selectedImage,
          formData.branch_ids,
          formData?.country_ids,
          formData.role_id == regional_manager_id ? formData.region_id : null,
          formData.role_id == counsellor_tl_id || formData.role_id == branch_counsellor_id
            ? formData.branch_id
            : null,
          formData?.franchise_id || null,
          radioValue
        )
      );
    }
  }

  const reAssignLeads = async(selectedItems: any, assignType: any) => {
    try {
      const { data } = await axios.post('/reassign_leads', { id: formData?.id, type: assignType, assigned_data: selectedItems });
      if(data){
        showSuccessAlert('Leads Successfully Re-Assigned');
        setOpenAssignTable(false);
      }
    } catch (error) {
      console.log('error', error);
      showErrorAlert(error)
    }
  }

  const checkUserHasLeads = async(user_id: any, checkType: any) => {
    try {
      let params = '';

      if(checkType == approvalTypes.delete_cre){
        params = `?check_type=${assignTypes.CRE}`
      } 
      else {
        params = `?check_type=${assignTypes.Counsellor}`
      }

      const { data } = await axios.get(`/check_user_leads/${user_id}${params}`);

      if(data?.leadCount){
        setModal(!modal);
        setOpenAssignTable(true);
        setApprovalType(checkType);
        setLeadsData(data?.leadsData);
        setUserData(data?.userData);
      } else {
        dispatchUpdateLead();
      }
    } catch (error) {
      console.log('error', error);
      showErrorAlert(error)
    }
  }

  const updateSelectedUser = (selectedItems: any, assignType: any) => {
    dispatchUpdateLead();
    reAssignLeads(selectedItems, assignType);
  }

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
          text: `Do you want to ${isUpdate ? "update" : "create"} this user?`,
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
              if (userInfo) {
                const { user_id } = JSON.parse(userInfo);
                try {

                  if(formData.role_id == cre_id && !radioValue){
                    checkUserHasLeads(formData?.id, approvalTypes.delete_cre);
                  } 
                  else if(formData?.role_id == counsellor_id && !radioValue){
                    checkUserHasLeads(formData?.id, approvalTypes.delete_counselor);
                  } 
                  else {
                    dispatchUpdateLead();
                    // dispatch(
                    //   updateAdminUsers(
                    //     formData.id,
                    //     formData.employee_id,
                    //     formData.name,
                    //     formData.email,
                    //     formData.phone,
                    //     formData.address,
                    //     formData.username,
                    //     formData.password,
                    //     // formData.updated_by,
                    //     user_id,
                    //     formData.role_id,
                    //     selectedImage,
                    //     formData.branch_ids,
                    //     formData?.country_ids,
                    //     formData.role_id == regional_manager_id ? formData.region_id : null,
                    //     formData.role_id == counsellor_tl_id || formData.role_id == branch_counsellor_id
                    //       ? formData.branch_id
                    //       : null,
                    //     formData?.franchise_id || null,
                    //     radioValue
                    //   )
                    // );
                  }
                } catch (err) {
                  console.error("error updating", err);
                }
              }
            } else {
              // Handle add logic
              if (userInfo) {
                try {
                  const { user_id } = JSON.parse(userInfo);
                  console.count("dispatched trigger");

                  dispatch(
                    addAdminUsers(
                      formData.employee_id,
                      formData.name,
                      formData.email,
                      formData.phone,
                      formData.address,
                      formData.username,
                      formData.password,
                      user_id,
                      formData.role_id,
                      selectedImage,
                      formData.branch_ids,
                      formData?.country_ids,
                      formData.role_id == regional_manager_id ? formData.region_id : null,
                      formData.role_id == counsellor_tl_id || formData.role_id == branch_counsellor_id
                        ? formData.branch_id
                        : null,
                      formData?.franchise_id || null,
                      radioValue
                    )
                  );
                } catch (err) {
                  console.error("error adding", err);
                  console.error(err);
                }
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
      Header: "No.",
      accessor: "id",
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
      sort: false,
    },
    {
      Header: "Employee ID",
      accessor: "employee_id",
      sort: true,
      Cell: ({ row }: any) => {
        const isImage = row.original.profile_image_path ? true : false;
        return (
          <>
            <div className="table-user">
              <img
                src={isImage ? `${baseUrl}${row.original.profile_image_path}` : profilePic}
                alt=""
                className="me-2 rounded-circle"
              />
              <Link to="#" className="text-body fw-semibold">
                {row.original.employee_id}
              </Link>
            </div>
          </>
        );
      },
    },
    {
      Header: "Name",
      accessor: "name",
      sort: true,
    },
    {
      Header: "Email",
      accessor: "email",
      sort: true,
    },
    {
      Header: "User Name",
      accessor: "username",
      sort: true,
    },
    {
      Header: "Phone",
      accessor: "phone",
      sort: false,
    },
    {
      Header: "Role",
      accessor: "role",
      sort: true,
    },
    {
      Header: "Country",
      accessor: "countries",
      sort: false,
      Cell: ({ row }: any) => (
        <ul style={{ listStyle: "none" }}>
          {row.original.countries?.map((item: any) => (
            <li>{item?.label}</li>
          ))}
        </ul>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      sort: false,
      Cell: ({ row }: any) => (
        <>
          <span style={{ fontSize: "10px" }} className={`badge rounded-pill ${row.original.status ? "bg-success" : "bg-danger"}`}>
            {row.original.status ? "Active" : "Disabled"}
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
          <FeatherIcons
            stroke="#28a745"
            icon="edit"
            size="15"
            className="cursor-pointer text-secondary"
            onClick={() => {
              handleUpdate(row.original);
              openModalWithClass("modal-right");
            }}
          />
        </div>
      ),
    },
  ];

  //handle cancel update section
  const handleCancelUpdate = () => {
    setIsUpdate(false);
    setFormData(initialState);
    setSelectedBranch([]);
    setSelectedCountry([]);
    setSelectedImage(null);
    setRadioValue(true);
  };

  //toggle modal
  const toggle = () => {
    setModal(!modal);
    if (isUpdate) {
      setValidationErrors(initialValidationState);
      // clear form data
      setFormData(initialState);
      setSelectedBranch([]);
      setSelectedImage(null);
      setIsUpdate(false);
    }
  };

  // Opens modal with custom class
  const openModalWithClass = (className: string) => {
    setClassName(className);
    toggle();
  };

  const handleResetValues = () => {
    setFormData(initialState);
    setValidationErrors(initialValidationState);
    setSelectedBranch([]);
    setSelectedCountry([]);
    setSelectedImage(null);
    setSelectedRole(null);
    setSelectedRole(null);
    setRadioValue(true);
  };

  useEffect(() => {
    // Check for errors and clear the form
    if (!loading && !error) {
      handleCancelUpdate();
      setModal(false);
      setValidationErrors(initialValidationState);
      setFormData(initialState);
      setSelectedBranch([]);
      setSelectedRole(null);
      setSelectedCountry([]);
      setSelectedImage(null);
    }
  }, [loading, error]);

  const handleStatusChange = (selectedOptions: OptionType[] | OptionsType<OptionType> | null) => {
    if (Array.isArray(selectedOptions)) {
      setSelectedCountry(selectedOptions);
      const selectedIdsArray = selectedOptions?.map((option) => option.value);
      setFormData((prev: any) => ({
        ...prev,
        country_ids: selectedIdsArray,
      }));
    }
  };

  const handleRoleChanges = (selected: any) => {
    setSelectedCountry([]);
    setSelectedBranch([]);

    setSelectedRole(selected);
    setFormData((prev) => ({
      ...prev,
      role_id: selected.value,
      country_ids: [],
      branch_id: "",
      region_id: "",
      franchise_id: "",
    }));
  };

  const toggleHistoryModal = () => {
    setHistoryModal(!historyModal);
  };

  useEffect(() => {
    if (openAssignTable) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // Clean up on component unmount
    };
  }, [openAssignTable]);

  return (
    <>
      <Row className="justify-content-between px-2">
        <Modal show={modal} onHide={toggle} dialogClassName={className}>
          <h6 className="fw-medium px-3 m-0 py-2 font-13 text-uppercase bg-light">
            <span className="d-block py-1">User Management</span>
          </h6>
          <Modal.Body style={{ overflowY: "auto" }}>
            <div className="alert alert-warning" role="alert">
              <strong>Hi {loggedInUser?.name}, </strong> Enter user details.
            </div>
            <div className="w-100 d-flex justify-content-end px-4">
              <div className="float-end" style={{ width: "20%" }}>
                <Row>
                  <ButtonGroup className="mb-2">
                    {radios.map((radio, idx) => (
                      <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant={radioValue ? "outline-success" : "outline-danger"}
                        name="status"
                        value={radio.value}
                        checked={radioValue.toString() == radio.value.toString()}
                        onChange={() => setRadioValue((prev) => !prev)}
                      >
                        {radio.name}
                      </ToggleButton>
                    ))}
                  </ButtonGroup>
                </Row>
              </div>
            </div>
            <Row>
              <Col className="bg-white">
                <Form onSubmit={onSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="employee_id">
                        <Form.Label>
                          <span className="text-danger fs-4">* </span> Employee ID
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="employee_id"
                          placeholder="Enter employee id"
                          value={formData.employee_id}
                          onChange={handleInputChange}
                        />
                        {validationErrors.employee_id && (
                          <Form.Text className="text-danger">{validationErrors.employee_id}</Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="name">
                        <Form.Label>
                          <span className="text-danger fs-4">* </span> Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                        {validationErrors.name && <Form.Text className="text-danger">{validationErrors.name}</Form.Text>}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="email">
                        <Form.Label>
                          <span className="text-danger fs-4">* </span> Email
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="email"
                          placeholder="Enter email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {validationErrors.email && <Form.Text className="text-danger">{validationErrors.email}</Form.Text>}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="phone">
                        <Form.Label>
                          <span className="text-danger fs-4">* </span> Phone
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                        {validationErrors.phone && <Form.Text className="text-danger">{validationErrors.phone}</Form.Text>}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Row>
                        <Form.Group className="mb-3" controlId="username">
                          <Form.Label>
                            <span className="text-danger fs-4">* </span> Username
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={handleInputChange}
                          />
                          {validationErrors.username && (
                            <Form.Text className="text-danger">{validationErrors.username}</Form.Text>
                          )}
                        </Form.Group>
                      </Row>

                      <Row>
                        <Form.Group className="mb-3" controlId="password">
                          <Form.Label>
                            <span className="text-danger fs-4">* </span> Password
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="password"
                            placeholder="Enter password"
                            value={formData?.password ?? ""}
                            onChange={handleInputChange}
                          />
                          {validationErrors.password && (
                            <Form.Text className="text-danger">{validationErrors.password}</Form.Text>
                          )}
                        </Form.Group>
                      </Row>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="address">
                        <Form.Label>
                          <span className="text-danger fs-4">* </span> Address
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          placeholder="Enter adress"
                          className="py-2"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                        {validationErrors.address && <Form.Text className="text-danger">{validationErrors.address}</Form.Text>}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="role_id">
                        <Form.Label>
                          <span className="text-danger fs-4">* </span> Role
                        </Form.Label>
                        <Select
                          className="react-select react-select-container"
                          classNamePrefix="react-select"
                          name="region_id"
                          options={RolesData}
                          value={selectedRole}
                          onChange={handleRoleChanges}
                        />

                        {validationErrors.role_id && <Form.Text className="text-danger">{validationErrors.role_id}</Form.Text>}
                      </Form.Group>
                    </Col>
                    {(formData?.role_id == counsellor_id || formData.role_id == country_manager_id) && (
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="role_id">
                          <Form.Label>
                            <span className="text-danger fs-4">* </span> Country
                          </Form.Label>
                          <Select
                            className="react-select react-select-container"
                            classNamePrefix="react-select"
                            components={animatedComponents}
                            name="country_ids"
                            value={selectedCountry}
                            options={CountriesData}
                            isMulti={true}
                            onChange={handleStatusChange as any}
                          />
                          {validationErrors.country_ids && (
                            <Form.Text className="text-danger">{validationErrors.country_ids}</Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                    )}

                    {formData?.role_id == regional_manager_id && (
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="region_id">
                          <Form.Label>
                            <span className="text-danger fs-4">* </span> Region
                          </Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            name="region_id"
                            value={formData.region_id}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled selected>
                              Choose..
                            </option>
                            {regionData?.map((item: any) => (
                              <option value={item?.value} key={item?.value}>
                                {item.label}
                              </option>
                            ))}
                          </Form.Select>

                          {validationErrors.region_id && (
                            <Form.Text className="text-danger">{validationErrors.region_id}</Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                    )}

                    {(formData?.role_id == franchise_manager_id || formData?.role_id == franchise_counsellor_id) && (
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="franchise_id">
                          <Form.Label>
                            <span className="text-danger fs-4">* </span> Franchise
                          </Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            name="franchise_id"
                            value={formData.franchise_id}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled selected>
                              Choose..
                            </option>
                            {franchiseData?.map((item: any) => (
                              <option value={item?.value} key={item?.value}>
                                {item.label}
                              </option>
                            ))}
                          </Form.Select>

                          {validationErrors.franchise_id && (
                            <Form.Text className="text-danger">{validationErrors.franchise_id}</Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                    )}

                    {(formData?.role_id == counsellor_tl_id || formData.role_id == branch_counsellor_id) && (
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="region_id">
                          <Form.Label>
                            <span className="text-danger fs-4">* </span> Branch
                          </Form.Label>
                          <Form.Select
                            aria-label="Default select example"
                            name="branch_id"
                            value={formData.branch_id}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled selected>
                              Choose..
                            </option>
                            {BranchesData?.map((item: any) => (
                              <option value={item?.value} key={item?.value}>
                                {item.label}
                              </option>
                            ))}
                          </Form.Select>

                          {validationErrors.branch_id && (
                            <Form.Text className="text-danger">{validationErrors.branch_id}</Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                    )}
                  </Row>

                  <div className="text-end">
                    <Button variant="primary" id="button-addon2" className="mt-1 ms-2 me-2" onClick={() => [handleResetValues()]}>
                      Clear
                    </Button>
                    <Button
                      variant="danger"
                      id="button-addon2"
                      disabled={loading}
                      className="mt-1 waves-effect waves-light me-2"
                      onClick={() => {
                        if (isUpdate) {
                          handleCancelUpdate();
                          toggle();
                        } else {
                          toggle();
                          handleResetValues();
                        }
                      }}
                    >
                      {!isUpdate ? "Close" : "Cancel"}
                    </Button>

                    <Button
                      type="submit"
                      variant="success"
                      id="button-addon2"
                      className="waves-effect waves-light mt-1"
                      disabled={loading}
                    >
                      {isUpdate ? "Update" : "Submit"}
                    </Button>
                  </div>
                  {/* )} */}
                </Form>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>

        <Modal show={historyModal} onHide={toggleHistoryModal} centered dialogClassName={"modal-full-width"} scrollable>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body style={{ margin: "0 !important", padding: "0 !important" }}>
            <HistoryTable apiUrl={"admin_user"} />
          </Modal.Body>
        </Modal>

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button
                className="btn-sm btn-blue waves-effect waves-light float-end"
                onClick={() => openModalWithClass("modal-right")}
              >
                <i className="mdi mdi-plus-circle"></i> Add Users
              </Button>

              <Button className="btn-sm btn-secondary waves-effect waves-light float-end me-2" onClick={toggleHistoryModal}>
              <i className="mdi mdi-history"></i> View History
              </Button>
              <h4 className="header-title mb-4">Manage Users</h4>
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

      {approvalType == approvalTypes.delete_cre && openAssignTable && (
        <LeadAssignTable
          isOpenModal={openAssignTable}
          toggleModal={setOpenAssignTable}
          responseData={leadsData}
          options={userData}
          refetchUsers={refetchUsers}
          updateSelectedUser={updateSelectedUser}
          approvalType={approvalTypes.delete_cre}
          heading={'Assign Leads Management'}
        />
      )}

      {approvalType == approvalTypes.delete_counselor && openAssignTable && (
        <LeadAssignTable
          isOpenModal={openAssignTable}
          toggleModal={setOpenAssignTable}
          responseData={leadsData}
          options={userData}
          refetchUsers={refetchUsers}
          updateSelectedUser={updateSelectedUser}
          approvalType={approvalTypes.delete_counselor}
          heading={'Assign Leads Management'}
        />
      )}
    </>
  );
});

const AdminUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [branchData, setBranchData] = useState([]);
  const [franchiseData, setFranchiseData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [roleData, setRoleData] = useState([]);

  const { state, error, loading, initialLoading, Branch, Franchises, Countries, Regions, RolesData } = useSelector(
    (state: RootState) => ({
      state: state.Users.adminUsers,
      error: state.Users.error,
      loading: state.Users.loading,
      initialLoading: state.Users.initialLoading,
      Branch: state?.Branches?.branches?.data,
      Franchises: state?.Franchise?.franchiseUsers,
      Countries: state?.Country.countries,
      Regions: state.Region.regions,
      RolesData: state.Roles.roles,
    })
  );

  useEffect(() => {
    dispatch(getAdminUsers());
    dispatch(getBranches());
    dispatch(getCountry());
    dispatch(getRoles());
    dispatch(getRegion());
    dispatch(getFranchise());
  }, []);

  // Helper function to format data
  const formatData = (data: any, valueKey: string, labelKey: string) => {
    return data?.map((item: any) => ({
      value: item[valueKey]?.toString(),
      label: item[labelKey],
    }));
  };

  // Set state based on formatted data
  useEffect(() => {
    if (Regions) setRegionData(formatData(Regions, "id", "region_name"));
  }, [Regions]);

  useEffect(() => {
    if (RolesData) setRoleData(formatData(RolesData, "id", "role_name"));
  }, [RolesData]);

  useEffect(() => {
    if (Branch) setBranchData(formatData(Branch, "id", "branch_name"));
  }, [Branch]);

  useEffect(() => {
    if (Franchises) setFranchiseData(formatData(Franchises, "id", "name"));
  }, [Franchises]);

  useEffect(() => {
    if (Countries) setCountryData(formatData(Countries, "id", "country_name"));
  }, [Countries]);

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          // { label: "User Management", path: "/user_management/user_creation" },
          {
            label: "Admin Users",
            path: "/user_management/user_creation",
            active: true,
          },
        ]}
        title={"Admin Users"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            error={error}
            BranchesData={branchData}
            CountriesData={countryData}
            loading={loading}
            RolesData={roleData}
            regionData={regionData}
            franchiseData={franchiseData}
            initialLoading={initialLoading}
            refetchUsers={() => dispatch(getAdminUsers())}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default AdminUsers;
