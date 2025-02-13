import * as yup from "yup";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Card, Form, Button, Modal, Image, Spinner } from "react-bootstrap";
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
import {
  addAdminUsers,
  addFranchiseUsers,
  deleteAdminUsers,
  getAdminUsers,
  getBranches,
  getFranchiseUsers,
  updateAdminUsers,
  updateFranchiseUsers,
} from "../../redux/actions";
import Select, { ActionMeta, OptionsType } from "react-select";
import { AUTH_SESSION_KEY, baseUrl, franchise_counsellor_id } from "../../constants";
import { MyInitialState, OptionType, TableRecords, initialState, initialValidationState, sizePerPageList } from "./data";
import { APICore } from "../../helpers/api/apiCore";
import { Link } from "react-router-dom";
import { getCountry } from "../../redux/country/actions";

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, BranchesData, CountriesData, RolesData, error, loading, user } = props;

  console.log("user ==>", user.franchise_id);

  const [modal, setModal] = useState<boolean>(false);
  const [className, setClassName] = useState<string>("");

  const api = new APICore();
  const loggedInUser = api.getLoggedInUser();

  //Table data
  const records: TableRecords[] = state;
  const [isUpdate, setIsUpdate] = useState(false);
  //Input data
  const [formData, setFormData] = useState<MyInitialState>(initialState);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<OptionType[]>([]);

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
    address: yup.string().required("Address is required"),
    username: yup.string().required("Username is required").min(4, "Username must be at least 4 characters long"),
    password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters long"),
    // branch_ids: yup.string().nullable().required("Branch is required").min(1, "At least one branch must be selected"),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  //handling update logic
  const handleUpdate = (item: any) => {
    if (item?.country_id) {
      setFormData((prev) => ({
        ...prev,
        country_id: item.country_id,
      }));
    }

    const selectedPowerIds = item?.branches?.map((item: any) => ({
      value: item.id?.toString(),
      label: item.branch_name,
    }));

    setSelectedBranch(selectedPowerIds);

    setFormData((prev) => ({
      ...prev,
      id: item.id,
      employee_id: item.employee_id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      username: item.username,
      // password: item.password,
      updated_by: item.updated_by,
      branch_ids: item?.branch_ids,
      role_id: item?.role_id,
      profile_image_path: item?.profile_image_path,
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
          dispatch(deleteAdminUsers(id));
          // swal.fire("Deleted!", "Your item has been deleted.", "success");
        }
      });
  };

  //handle onchange function
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (name == "role_id" && value !== "7") {
      setFormData((prevData) => ({
        ...prevData,
        country_id: undefined,
      }));
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBranchChange = (
    selectedOptions: OptionType[] | OptionsType<OptionType> | null,
    actionMeta: ActionMeta<OptionType>
  ) => {
    if (Array.isArray(selectedOptions)) {
      setSelectedBranch(selectedOptions);
      const selectedIdsString = selectedOptions?.map((option) => option.value).join(", ");
      setFormData((prev) => ({
        ...prev,
        branch_ids: selectedIdsString,
      }));
    }
  };

  //handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData.country_id);

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
            if (isUpdate) {
              // Handle update logic
              if (userInfo) {
                const { user_id } = JSON.parse(userInfo);
                try {
                  dispatch(
                    updateFranchiseUsers(
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
                      franchise_counsellor_id,
                      selectedImage,
                      formData.branch_ids,
                      formData?.country_id,
                      user.franchise_id
                    )
                  );
                } catch (err) {
                  console.error("error updating", err);
                }
              }
            } else {
              // Handle add logic
              if (userInfo) {
                try {
                  const { user_id } = JSON.parse(userInfo);
                  dispatch(
                    addFranchiseUsers(
                      formData.employee_id,
                      formData.name,
                      formData.email,
                      formData.phone,
                      formData.address,
                      formData.username,
                      formData.password,
                      // formData.updated_by,
                      user_id,
                      franchise_counsellor_id,
                      selectedImage,
                      formData.branch_ids,
                      formData?.country_id,
                      user.franchise_id
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

      // if (isUpdate) {
      //   // Handle update logic
      //   if (userInfo) {
      //     const { user_id } = JSON.parse(userInfo);
      //     try {
      //       await dispatch(
      //         updateAdminUsers(
      //           formData.id,
      //           formData.employee_id,
      //           formData.name,
      //           formData.email,
      //           formData.phone,
      //           formData.address,
      //           formData.username,
      //           formData.password,
      //           // formData.updated_by,
      //           user_id,
      //           formData.role_id,
      //           selectedImage,
      //           formData.branch_ids,
      //           formData?.country_id
      //         )
      //       );
      //     } catch (err) {
      //       console.error("error updating", err);
      //     }
      //   }
      // } else {
      //   // Handle add logic
      //   if (userInfo) {
      //     try {
      //       const { user_id } = JSON.parse(userInfo);
      //       await dispatch(
      //         addAdminUsers(
      //           formData.employee_id,
      //           formData.name,
      //           formData.email,
      //           formData.phone,
      //           formData.address,
      //           formData.username,
      //           formData.password,
      //           // formData.updated_by,
      //           user_id,
      //           formData.role_id,
      //           selectedImage,
      //           formData.branch_ids,
      //           formData?.country_id
      //         )
      //       );
      //     } catch (err) {
      //       console.error("error adding", err);
      //       console.error(err);
      //     }
      //   }
      // }
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
      Header: "ID",
      accessor: "id",
      sort: true,
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
      sort: false,
    },
    {
      Header: "Email",
      accessor: "email",
      sort: false,
    },
    {
      Header: "User Name",
      accessor: "username",
      sort: false,
    },
    {
      Header: "Phone",
      accessor: "phone",
      sort: false,
    },
    {
      Header: "Role",
      accessor: "role",
      sort: false,
    },
    {
      Header: "Country",
      accessor: "country_name",
      sort: false,
    },
    // {
    //   Header: "Branch",
    //   accessor: "branches",
    //   sort: false,
    //   Cell: ({ row }: any) => (
    //     <ul className="list-unstyled list-inline">
    //       {row.original.branches?.map((item: any) => (
    //         <li className="mb-1">{item.branch_name}</li>
    //       ))}
    //     </ul>
    //   ),
    // },
    // {
    //   Header: "Image",
    //   accessor: "profile_image_path",
    //   Cell: ({ row }: any) => (
    //     <div className="d-flex justify-content-center align-items-center gap-2">
    //       {row.original.profile_image_path ? (
    //         <img
    //           src={`${baseUrl}${row.original.profile_image_path}`}
    //           alt="Profile Image"
    //           width={100}
    //           height={100}
    //           className="object-fit-contain"
    //         />
    //       ) : (
    //         <img
    //           src={profilePic}
    //           alt="Profile Image"
    //           width={100}
    //           height={100}
    //           className="object-fit-contain"
    //         />
    //       )}
    //     </div>
    //   ),
    // },
    // {
    //   Header: "Status",
    //   accessor: "status",
    //   sort: false,
    // },
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

          {/* Delete Icon */}
          <FeatherIcons
            stroke="#dc3545"
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
    setFormData(initialState);
    setSelectedBranch([]);
    setSelectedImage(null);
  };

  //image upload
  // const handleImageChange = (event: any) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     const image = event.target.files[0] as File;
  //     setSelectedImage(image);
  //   } else {
  //     setSelectedImage(null);
  //   }
  // };

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
    setSelectedImage(null);
  };

  useEffect(() => {
    // Check for errors and clear the form
    if (!loading && !error) {
      handleCancelUpdate();
      setModal(false);
      setValidationErrors(initialValidationState);
      setFormData(initialState);
      setSelectedBranch([]);
      setSelectedImage(null);
    }
  }, [loading, error]);

  console.log(CountriesData);

  return (
    <>
      <Row className="justify-content-between px-2">
        <Modal show={modal} onHide={toggle} dialogClassName={className}>
          <h6 className="fw-medium px-3 m-0 py-2 font-13 text-uppercase bg-light">
            <span className="d-block py-1">User Management</span>
          </h6>
          <Modal.Body>
            <div className="alert alert-warning" role="alert">
              <strong>Hi {loggedInUser?.name}, </strong> Enter user details.
            </div>
            <Row>
              <Col className="bg-white">
                <Form onSubmit={onSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="employee_id">
                        <Form.Label>Employee ID</Form.Label>
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
                        <Form.Label>Name</Form.Label>
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
                        <Form.Label>Email</Form.Label>
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
                        <Form.Label>Phone</Form.Label>
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
                          <Form.Label>Username</Form.Label>
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
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="text"
                            name="password"
                            placeholder="Enter password"
                            value={formData.password ?? ""}
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
                        <Form.Label>Address</Form.Label>
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
                    {/* <Col md={6}>
                      <Form.Group className="mb-3" controlId="branch_ids">
                        <Form.Label>Branch</Form.Label>
                        <Select
                          closeMenuOnSelect={false}
                          components={animatedComponents}
                          isMulti
                          options={BranchesData}
                          value={selectedBranch}
                          onChange={handleBranchChange as any}
                        />

                        {validationErrors.branch_ids && <Form.Text className="text-danger">{validationErrors.branch_ids}</Form.Text>}
                      </Form.Group>
                    </Col> */}
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="role_id">
                        <Form.Label>Country</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="country_id"
                          value={formData.country_id}
                          onChange={handleInputChange}
                        >
                          <option value="" disabled selected>
                            Choose..
                          </option>
                          {CountriesData?.map((item: any) => (
                            <option value={item?.value} key={item?.value}>
                              {item.label}
                            </option>
                          ))}
                        </Form.Select>

                        {validationErrors.role_id && <Form.Text className="text-danger">{validationErrors.role_id}</Form.Text>}
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="profileImage">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                        {selectedImage && (
                          <div className="mt-3">
                            <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ maxWidth: "100px" }} />
                          </div>
                        )}
                        {!selectedImage && isUpdate && (
                          <div className="mt-3">
                            <img src={`${baseUrl}${formData.profile_image_path}`} alt="Selected" style={{ maxWidth: "100px" }} />
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row> */}
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

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button
                className="btn-sm btn-blue waves-effect waves-light float-end"
                onClick={() => openModalWithClass("modal-right")}
              >
                <i className="mdi mdi-plus-circle"></i> Add Users
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
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

const FranchiseCounsellors = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [branchData, setBranchData] = useState([]);
  const [countryData, setCountryData] = useState([]);

  //Fetch data from redux store
  const { state, error, loading, initialLoading, user } = useSelector((state: RootState) => ({
    state: state.FranchiseUsers.adminUsers,
    user: state.Auth.user,
    error: state.FranchiseUsers.error,
    loading: state.FranchiseUsers.loading,
    initialLoading: state.FranchiseUsers.initialLoading,
  }));

  const Branch = useSelector((state: RootState) => state?.Branches?.branches?.data);

  const Countries = useSelector((state: RootState) => state?.Country.countries);

  const RolesData = useSelector((state: RootState) => ({
    state: state.Roles.roles,
  }));

  useEffect(() => {
    dispatch(getFranchiseUsers());
    dispatch(getBranches());
    dispatch(getCountry());
    dispatch(getRoles());
  }, []);

  useEffect(() => {
    if (Branch) {
      const branchArray = Branch?.map((branch: any) => ({
        value: branch.id.toString(),
        label: branch.branch_name,
      }));
      setBranchData(branchArray);
    }
  }, [Branch]);

  useEffect(() => {
    if (Countries) {
      const countryArray = Countries?.map((country: any) => ({
        value: country.id.toString(),
        label: country.country_name,
      }));
      setCountryData(countryArray);
    }
  }, [Countries]);

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
          // { label: "Counsellor Management", path: "/user_management/counsellor_creation" },
          {
            label: "Counsellors",
            path: "/user_management/counsellor_creation",
            active: true,
          },
        ]}
        title={"Counsellors"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            error={error}
            BranchesData={branchData}
            CountriesData={countryData}
            loading={loading}
            RolesData={RolesData?.state}
            user={user}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default FranchiseCounsellors;
