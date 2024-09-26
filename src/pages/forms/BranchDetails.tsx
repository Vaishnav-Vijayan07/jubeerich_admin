import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Table from "../../components/Table";
import axios from "axios";
import {
  AUTH_SESSION_KEY,
  baseUrl,
  branch_counsellor_id,
  counsellor_id,
  counsellor_tl_id,
  regional_manager_id,
  showErrorAlert,
} from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import {
  addAdminUsers,
  deleteAdminUsers,
  getBranchCounsellors,
  getBranchCounsellorsTL,
  updateAdminUsers,
} from "../../redux/actions";
import Select from "react-select/src/Select";
import { OptionType } from "../users/data";
import { getCountry } from "../../redux/country/actions";
import { RootState } from "../../redux/store";
import { withSwal } from "react-sweetalert2";
import * as yup from "yup";
import { getBranches } from "../../helpers";

export const initialState = {
  id: "",
  employee_id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  username: "",
  password: "",
  updated_by: "",
  role_id: branch_counsellor_id,
  country_id: undefined,
  branch_ids: "",
  profile_image_path: "",
  region_id: "",
};

export const initialValidationState = {
  employee_id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  username: "",
  password: "",
  role_id: "",
  country_id: "",
  branch_ids: "",
  region_id: "",
  branch_id: "",
};

const BranchDetails = withSwal((props: any) => {
  const { swal } = props;
  const { branchId } = useParams();
  const [branchDetails, setBranchDetails] = useState<any>({});
  const [tableData, setTableData] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>(initialState);
  const [validationErrors, setValidationErrors] = useState(initialValidationState);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<OptionType[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any[]>([]);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [countryData, setCountryData] = useState([]);
  const [isTL, setIsTL] = useState<boolean>(false);
  const dispatch = useDispatch();
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

    const {
        adminUsers: state,
        error,
        loading,
        initialLoading,
        countries: Countries,
        branchesData: Branch,
        branchCounsellor: CounsellorData,
        branchCounsellorTL: CounsellorTLData
    } = useSelector((state: RootState) => ({
        adminUsers: state.Users.adminUsers,
        error: state.Users.error,
        loading: state.Users.loading,
        initialLoading: state.Users.initialLoading,
        countries: state.Country.countries,
        branchesData: state.Branches?.branches?.data,
        branchCounsellor: state.Users?.branchCounsellor,
        branchCounsellorTL: state.Users?.branchCounsellorTL
    }));
    
    const BranchesData = useMemo(() => {
        if (!Branch) return [];
        return Branch.map((item: any) => ({
            value: item.id.toString(),
            label: item.branch_name,
        }));
    }, [Branch]);

  const columns = [
    {
      Header: "No",
      accessor: "id",
      sort: true,
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
    },
    {
      Header: "ID",
      accessor: "employee_id",
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
      Header: "Name",
      accessor: "name",
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
              handleUpdate(row.original);
              toggleModal();
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
    role_id: yup.string().nullable().required("Role is required"),
  });

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

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCancelUpdate = () => {
    setIsUpdate(false);
    setFormData(initialState);
    setSelectedBranch([]);
    setSelectedCountry([]);
    setSelectedImage(null);
  };

  const handleUpdate = (item: any) => {
    const {
      role_id,
      country_id,
      branches,
      countries,
      id,
      employee_id,
      name,
      email,
      phone,
      address,
      username,
      updated_by,
      branch_ids,
      region_id,
      branch_id,
      profile_image_path,
    } = item;

    console.log(role_id);
    console.log(counsellor_tl_id);

    // Check if the role_id matches the counsellor_tl_id
    if (role_id === counsellor_tl_id) {
      setIsTL(true);
    }

    // Update formData with country_id if it exists
    if (country_id) {
      setFormData((prev: any) => ({
        ...prev,
        country_id,
      }));
    }

    // Map branches to get the power ids (for selectedBranch)
    const selectedPowerIds = branches?.map((branch: any) => ({
      value: branch.id?.toString(),
      label: branch.branch_name,
    }));

    // Map countries to get country IDs
    const countryArray = countries?.map((country: any) => country?.id);

    // Update selected branches
    setSelectedBranch(selectedPowerIds);

    // Set the form data with the updated values
    setFormData((prev: any) => ({
      ...prev,
      id,
      employee_id,
      name,
      email,
      phone,
      address,
      username,
      updated_by,
      branch_ids,
      role_id,
      region_id,
      branch_id,
      country_ids: countryArray,
      profile_image_path,
    }));

    // Update selected countries and set the update flag
    setSelectedCountry(countries);
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
          dispatch(deleteAdminUsers(id));
          swal.fire("Deleted!", "Your item has been deleted.", "success");
        }
      });
  };

  const handleInputPhoneChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormData((prevData: any) => ({
        ...prevData,
        phone: value?.toString().replace(/\D/g, "").slice(0, 10),
      }));
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (name == "role_id" && value !== counsellor_id) {
      setFormData((prevData: any) => ({
        ...prevData,
        country_id: undefined,
      }));
    }

    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleResetValues = () => {
    setFormData(initialState);
    setValidationErrors(initialValidationState);
    setSelectedBranch([]);
    setSelectedCountry([]);
    setSelectedImage(null);
    setIsTL(false);
  };

  const getBranchDetails = async () => {
    try {
      let { data } = await axios.get(`${baseUrl}/api/branches/${branchId}`);
      setBranchDetails(data?.data);
    } catch (error) {
      console.log(error);
      showErrorAlert(error);
    }
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
            if (isUpdate) {
              if (userInfo) {
                const { user_id } = JSON.parse(userInfo);
                try {
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
                      user_id,
                      // formData.role_id,
                      isTL ? counsellor_tl_id : formData.role_id,
                      selectedImage,
                      formData.branch_ids,
                      formData?.country_id,
                      formData.role_id == regional_manager_id ? formData.region_id : null,
                      branchId,
                      formData.role_id == branch_counsellor_id ? formData.country_ids : null
                    )
                  );
                  handleResetValues();
                  toggleModal();
                } catch (err) {
                  setTableData([]);
                  console.error("error updating", err);
                }
              }
            } else {
              if (userInfo) {
                try {
                  const { user_id } = JSON.parse(userInfo);
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
                      // formData.role_id,
                      isTL ? counsellor_tl_id : formData.role_id,
                      selectedImage,
                      formData.branch_ids,
                      formData?.country_id,
                      formData.role_id == regional_manager_id ? formData.region_id : null,
                      branchId,
                      formData.role_id == branch_counsellor_id ? formData.country_ids : null
                    )
                  );
                  handleResetValues();
                  toggleModal();
                } catch (err) {
                  setTableData([]);
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

  useEffect(() => {
    dispatch(getCountry());
    getBranchDetails();
    dispatch(getBranchCounsellors(branchId));
    dispatch(getBranchCounsellorsTL(branchId));
  }, [branchId]);

    useEffect(() => {
        setTableData([...CounsellorTLData, ...CounsellorData])
    }, [CounsellorTLData, CounsellorData])

    // useEffect(() => {
    //     setTableData([
    //         ...(CounsellorTLData || []),
    //         ...(CounsellorData || [])
    //     ]);
    // }, [CounsellorTLData, CounsellorData]);
    
    useEffect(() => {
        if (Countries) {
            const countryArray = Countries?.map((country: any) => ({
                value: country.id.toString(),
                label: country.country_name,
            }));
            setCountryData(countryArray);
        }
    }, [Countries]);


  return (
    <>
      <Card>
        <Card.Body>
          <Row>
            <Col md={4} lg={4} className="border border-2">
              <Card className="text-center">
                <Card.Body>
                  <div className="d-flex justify-content-center">
                    <h4>Branch Details</h4>
                  </div>
                  <div className="text-start mt-3">
                    <p className="text-muted mb-2 font-13">
                      <strong>Branch Name :</strong>
                      <span className="ms-2">{branchDetails?.branch_name}</span>
                    </p>
                    <p className="text-muted mb-2 font-13">
                      <strong>Mobile :</strong>
                      <span className="ms-2">{branchDetails?.phone}</span>
                    </p>
                    <p className="text-muted mb-2 font-13">
                      <strong>Email :</strong>
                      <span className="ms-2 ">{branchDetails?.email}</span>
                    </p>
                    <p className="text-muted mb-1 font-13">
                      <strong>Address :</strong>
                      <span className="ms-2">{branchDetails?.address}</span>
                    </p>
                    <p className="text-muted mb-1 font-13">
                      <strong>Pincode :</strong>
                      <span className="ms-2">{branchDetails?.pincode}</span>
                    </p>
                    <p className="text-muted mb-1 font-13">
                      <strong>City :</strong>
                      <span className="ms-2">{branchDetails?.city}</span>
                    </p>
                    <p className="text-muted mb-1 font-13">
                      <strong>State :</strong>
                      <span className="ms-2">{branchDetails?.state}</span>
                    </p>
                    <p className="text-muted mb-1 font-13">
                      <strong>Country :</strong>
                      <span className="ms-2">{branchDetails?.country}</span>
                    </p>
                    <p className="text-muted mb-1 font-13">
                      <strong>Website :</strong>
                      <span className="ms-2">{branchDetails?.website}</span>
                    </p>
                    <p className="text-muted mb-1 font-13">
                      <strong>Support Email :</strong>
                      <span className="ms-2">{branchDetails?.support_mail}</span>
                    </p>
                  </div>

                  <div className="d-flex justify-content-end pt-2 pe-3">
                    <Button className="btn btn-primary" onClick={() => [setShowModal(true), setIsTL(true)]}>
                      Add Branch Counsellor TL
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={8} lg={8}>
              <div className="d-flex justify-content-end pb-2">
                <Button className="btn btn-primary me-2" onClick={() => setShowModal(true)}>
                  Add Branch Counsellor
                </Button>
                {/* <Button className='btn btn-primary' onClick={() => [setShowModal(true), setIsTL(true)]}>Add Branch Counsellor TL</Button> */}
              </div>

              {loading && <Spinner animation="border" style={{ position: "absolute", top: "50%", left: "70%" }} />}

              {!loading && (
                <Table
                  columns={columns}
                  data={tableData ? tableData : []}
                  pageSize={10}
                  sizePerPageList={sizePerPageList}
                  isSortable={true}
                  pagination={true}
                  isSearchable={true}
                  tableClass="table-striped dt-responsive nowrap w-100"
                />
              )}
            </Col>
          </Row>

          {/* Modal */}
          <Row className="justify-content-between px-2">
            <Modal show={showModal} onHide={toggleModal} dialogClassName={"modal-right"}>
              <h6 className="fw-medium px-3 m-0 py-2 font-13 text-uppercase bg-light">
                <span className="d-block py-1">Add Branch Counsellor {isTL ? "TL" : ""}</span>
              </h6>
              <Modal.Body>
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
                              onChange={handleInputPhoneChange}
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
                                value={formData.password}
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
                            {validationErrors.address && (
                              <Form.Text className="text-danger">{validationErrors.address}</Form.Text>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
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
                              {countryData?.map((item: any) => (
                                <option value={item?.value} key={item?.value}>
                                  {item.label}
                                </option>
                              ))}
                            </Form.Select>

                            {validationErrors.role_id && (
                              <Form.Text className="text-danger">{validationErrors.role_id}</Form.Text>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                      <div className="text-end">
                        <Button
                          variant="primary"
                          id="button-addon2"
                          className="mt-1 ms-2 me-2"
                          onClick={() => [handleResetValues()]}
                        >
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
                              setIsTL(false);
                              toggleModal();
                            } else {
                              toggleModal();
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
                    </Form>
                  </Col>
                </Row>
              </Modal.Body>
            </Modal>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
});

export default BranchDetails;
