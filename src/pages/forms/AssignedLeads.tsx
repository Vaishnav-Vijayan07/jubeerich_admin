import * as yup from "yup";
import React, { useEffect, useMemo, useState } from "react";
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
  addLeads,
  deleteLeads,
  getCategory,
  getChannel,
  getLead,
  getLeadAssigned,
  updateLeads,
} from "../../redux/actions";
import Select from "react-select";
import {
  AUTH_SESSION_KEY,
  showErrorAlert,
  showSuccessAlert,
} from "../../constants";
import { getCountry } from "../../redux/country/actions";
import { getOfficeTypeData } from "../../redux/OfficeType/actions";
import FileUploader from "../../components/FileUploader";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { getLeads } from "../../helpers";

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
  full_name: "",
  email: "",
  phone: "",
  category_id: null,
  source_id: null,
  channel_id: null,
  city: "",
  preferred_country: null,
  office_type: null,
  //   region_id: "",
  //   counsiler_id: "",
  //   branch_id: "",
  updated_by: null,
  remarks: "",
  lead_received_date: new Date().toISOString().split("T")[0],
  ielts: false,
};

const initialValidationState = {
  full_name: "",
  email: "",
  phone: "",
  category_id: "",
  source_id: "",
  channel_id: "",
  city: "",
  preferred_country: "",
  office_type: "",
  //   region_id: "",
  //   counsiler_id: "",
  //   branch_id: "",
  updated_by: "",
  remarks: "",
  lead_received_date: "",
  ielts: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    swal,
    state,
    country,
    source,
    categories,
    user,
    cres,
    // regions,
    office,
    channels,
    error,
    loading,
  } = props;

  //fetch token from session storage

  //Table data
  const records: TableRecords[] = state;

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(
    null
  );
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedOffice, setSelectedOffice] = useState<any>(null);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [formData, setFormData] = useState(initialState);
  const [uploadModal, setUploadModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<any>([]);

  const [className, setClassName] = useState<string>("");
  const [scroll, setScroll] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(
    initialValidationState
  );

  const { pathname } = useLocation();

  const validationSchema = yup.object().shape({
    full_name: yup
      .string()
      .required("Full name is required")
      .min(3, "Full name must be at least 3 characters long"),
    email: yup.string().required("Email is required").email("Invalid email"),
    phone: yup.string().required("Phone is required"),
    category_id: yup.string().required("Category is required"),
    source_id: yup.string().required("Source is required"),
    channel_id: yup.string().required("Channel is required"),
    city: yup.string().required("City is required"),
    preferred_country: yup.string().required("Preferred country is required"),
    office_type: yup.string().required("Office type is required"),
    lead_received_date: yup.date().required("Date is required"),
    ielts: yup.boolean(),
    remarks: yup.string(),
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
    const updatedSource = source?.filter(
      (source: any) => source.value == item.source_id
    );
    const updatedOffice = office?.filter(
      (office: any) => office.value == item.office_type
    );
    const updatedCountry = country?.filter(
      (country: any) => country.value == item.preferred_country
    );
    const updatedCtegory = categories?.filter(
      (category: any) => category.value == item.category_id
    );
    const updatedChannels = channels?.filter(
      (channel: any) => channel.value == item.channel_id
    );
    setSelectedSource(updatedSource[0]);
    setSelectedOffice(updatedOffice[0]);
    setSelectedCountry(updatedCountry[0]);
    setSelectedCategory(updatedCtegory[0]);
    setSelectedChannel(updatedChannels[0]);

    setFormData((prev) => ({
      ...prev,
      id: item?.id || "",
      full_name: item?.full_name || "",
      email: item?.email || "",
      phone: item?.phone || "",
      category_id: item?.category_id || "",
      source_id: item?.source_id || "",
      channel_id: item?.channel_id || "",
      city: item?.city || "",
      preferred_country: item?.preferred_country || "",
      office_type: item?.office_type || "",
      // region_id: item?.region_id || "",
      // counsiler_id: item?.counsiler_id || "",
      // branch_id: item?.branch_id || "",
      updated_by: item?.updated_by || "",
      remarks: item?.remarks || "",
      lead_received_date: item?.lead_received_date || "",
      ielts: item?.ielts || "",
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
          dispatch(deleteLeads(id));
          if (isUpdate) {
            setFormData(initialState);
          }
        }
      });
  };

  //handle onchange function
  const handleInputChange = (e: any) => {
    const { name, value, checked } = e.target;
    if (name == "ielts") {
      setFormData((prevData) => ({
        ...prevData,
        ielts: checked,
      }));
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDropDowns = (selected: any, { name }: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selected.value,
    }));

    switch (name) {
      case "source_id":
        setSelectedSource(selected);
        break;
      case "category_id":
        setSelectedCategory(selected);
        break;
      case "preferred_country":
        setSelectedCountry(selected);
        break;
      case "office_type":
        setSelectedOffice(selected);
        break;
      case "channel_id":
        setSelectedChannel(selected);
        break;
      default:
        break;
    }
  };

  //handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);

    // Validate the form using yup
    try {
      // await validationSchema.validate(formData, { abortEarly: false });

      //   // Validation passed, handle form submission

      if (user) {
        const { user_id } = user;
        if (isUpdate) {
          // Handle update logic
          dispatch(
            updateLeads(
              formData?.id,
              formData.full_name,
              formData.email,
              formData.phone,
              formData.category_id,
              formData.source_id,
              formData.channel_id,
              formData.city,
              formData.preferred_country,
              formData.office_type,
              null,
              null,
              null,
              user_id,
              formData.remarks,
              formData.lead_received_date,
              formData.ielts
            )
          );
          setIsUpdate(false);
        } else {
          // Handle add logic
          console.log("here leads");

          dispatch(
            addLeads(
              formData.full_name,
              formData.email,
              formData.phone,
              formData.category_id,
              formData.source_id,
              formData.channel_id,
              formData.city,
              formData.preferred_country,
              formData.office_type,
              null,
              null,
              null,
              user_id,
              formData.remarks,
              formData.lead_received_date,
              formData.ielts
            )
          );
        }
      }

      //   // ... Rest of the form submission logic ...
    } catch (validationError) {
      // Handle validation errors
      console.log("throw");

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
      Header: "Name",
      accessor: "full_name",
      sort: true,
    },
    {
      Header: "Email",
      accessor: "email",
      sort: true,
    },
    {
      Header: "City",
      accessor: "city",
      sort: false,
    },
    {
      Header: "Country",
      accessor: "preferredCountries",
      sort: false,
      Cell: ({ row }: any) => <ul style={{ listStyle: "none" }}>{row.original.preferredCountries.map((item: any) => (
        <li>{item?.country_name}</li>
      ))}</ul>,

    },
    {
      Header: "Office",
      accessor: "office_type_name",
      sort: false,
    },
    {
      Header: "Source",
      accessor: "source_name",
      sort: false,
    },
    ...(user?.role == 4
      ? [
        {
          Header: "Assigned CRE",
          accessor: "cre_name",
          sort: false,
        },
      ]
      : []),
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
              handleUpdate(row.original);
              openModalWithClass("modal-full-width");
            }}
          >
            <i className="mdi mdi-square-edit-outline"></i>
          </Link>

          {/* Delete Icon */}
          <Link
            to="#"
            className="action-icon"
            onClick={() => handleDelete(row.original.id)}
          >
            <i className="mdi mdi-delete"></i>
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
    setSelectedCategory(null);
    setSelectedChannel(null);
    setSelectedOffice(null);
    setSelectedSource(null);
  };

  const toggleResponsiveModal = () => {
    setResponsiveModal(!responsiveModal);
    setValidationErrors(initialValidationState);
    if (isUpdate) {
      handleCancelUpdate();
    }
  };

  const handleSelectedValues = (values: any) => {
    setSelectedValues(values);
  };

  const handleAssignBulk = async (user_ids: any, cre_id: any) => {
    if (user_ids.length > 0) {
      try {
        const { data } = await axios.post("/assign_cres", { user_ids, cre_id });

        if (data.status) {
          dispatch(getLeadAssigned());
          showSuccessAlert("Bulk assignment successful.");
        }
      } catch (error) {
        showErrorAlert(error);
      }
    }
  };

  const handleDownloadClick = () => {
    const filePath = "/excel/jubeerich.xlsx";
    const link = document.createElement("a");
    link.download = "Student.xlsx";
    link.href = process.env.REACT_APP_CLIENT_URL + filePath;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadRjectedData = (file: any) => {
    const filePath = file;
    const link = document.createElement("a");
    link.download = "rejected.xlsx";
    link.href = process.env.REACT_APP_API_URL + filePath;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOnFileUpload = (files: any) => {
    setSelectedFile(files);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || selectedFile.length < 1 || !selectedFile[0]) {
      showErrorAlert("Please select a file.");
      return;
    }

    // Get the file extension
    const fileExtension = selectedFile[0].name.split(".").pop()?.toLowerCase();

    // Check if the file extension is '.xlsx'
    if (fileExtension !== "xlsx") {
      showErrorAlert("Please select a valid .xlsx file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile[0]);
    setIsLoading(true);

    try {
      const { data } = await axios.post(`/excel_import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(data);
      if (data.status) {
        showSuccessAlert(data.message);
        dispatch(getLead());
        setIsLoading(false);
        setSelectedFile([]);
        toggleUploadModal();
      } else {
        showErrorAlert(data.message);
        console.log("data.invalidFileLink", data.invalidFileLink);

        downloadRjectedData(data.invalidFileLink);
        setIsLoading(false);
      }
    } catch (err) {
      console.log("error ==>", err);

      showErrorAlert(err);
      setSelectedFile([]);
      setIsLoading(false);
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

  const toggleUploadModal = () => {
    setUploadModal(!uploadModal);
  };

  const toggle = () => {
    setModal(!modal);
  };

  const openModalWithClass = (className: string) => {
    setClassName(className);
    setScroll(false);
    toggle();
  };

  return (
    <>
      <Row className="justify-content-between px-2">
        {/* <Col lg={5} className="bg-white p-3"> */}

        <Modal
          show={modal}
          onHide={toggle}
          dialogClassName={className}
          // size={size}
          scrollable={scroll}
        >
          <Form onSubmit={onSubmit} key={"lead-form"}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Lead Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                    />
                    {validationErrors.full_name && (
                      <Form.Text className="text-danger">
                        {validationErrors.full_name}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {validationErrors.email && (
                      <Form.Text className="text-danger">
                        {validationErrors.email}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    {validationErrors.phone && (
                      <Form.Text className="text-danger">
                        {validationErrors.phone}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Source</Form.Label>
                    <Select
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="source_id"
                      options={source}
                      value={selectedSource}
                      onChange={handleDropDowns}
                    />
                    {validationErrors.source_id && (
                      <Form.Text className="text-danger">
                        {validationErrors.source_id}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Category</Form.Label>
                    <Select
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="category_id"
                      options={categories}
                      value={selectedCategory}
                      onChange={handleDropDowns}
                    />
                    {validationErrors.category_id && (
                      <Form.Text className="text-danger">
                        {validationErrors.category_id}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Channel</Form.Label>
                    <Select
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="channel_id"
                      options={channels}
                      value={selectedChannel}
                      onChange={handleDropDowns}
                    />
                    {validationErrors.channel_id && (
                      <Form.Text className="text-danger">
                        {validationErrors.channel_id}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Office</Form.Label>
                    <Select
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="office_type"
                      options={office}
                      value={selectedOffice}
                      onChange={handleDropDowns}
                    />
                    {validationErrors.office_type && (
                      <Form.Text className="text-danger">
                        {validationErrors.office_type}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Country</Form.Label>
                    <Select
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="preferred_country"
                      options={country}
                      value={selectedCountry}
                      onChange={handleDropDowns}
                    />
                    {validationErrors.preferred_country && (
                      <Form.Text className="text-danger">
                        {validationErrors.preferred_country}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                      type="text"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                    />
                    {validationErrors.remarks && (
                      <Form.Text className="text-danger">
                        {validationErrors.remarks}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                    {validationErrors.city && (
                      <Form.Text className="text-danger">
                        {validationErrors.city}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6} lg={4}>
                  <Form.Group className="mb-3" controlId="lead_received_date">
                    <Form.Label>Lead Received Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="lead_received_date"
                      value={formData?.lead_received_date}
                      onChange={handleInputChange}
                    />
                    {validationErrors.lead_received_date && (
                      <Form.Text className="text-danger">
                        {validationErrors.lead_received_date}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6} lg={4}>
                  <Form.Group className="mb-3" controlId="source_id">
                    <Form.Label>IELTS</Form.Label>
                    <Form.Check
                      type="switch"
                      id="active-switch"
                      name="ielts"
                      onChange={handleInputChange}
                      checked={formData.ielts}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1 ms-2"
                onClick={() =>
                  isUpdate ? [handleCancelUpdate(), toggle()] : toggle()
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

        {user?.role == 2 && (
          <Modal
            show={uploadModal}
            onHide={toggleUploadModal}
            dialogClassName="modal-dialog-centered"
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <p className="text-muted mb-1 font-small">
                *Please upload the Excel file following the example format.
              </p>
              <FileUploader
                onFileUpload={handleOnFileUpload}
                showPreview={true}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
              <div className="d-flex gap-2 justify-content-end mt-2">
                <Button
                  className="btn-sm btn-blue waves-effect waves-light"
                  onClick={handleDownloadClick}
                >
                  <i className="mdi mdi-download-circle"></i> Download Sample
                </Button>
                <Button
                  className="btn-sm btn-success waves-effect waves-light"
                  onClick={handleFileUpload}
                  disabled={isLoading}
                >
                  <i className="mdi mdi-upload"></i> Upload File
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        )}

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <div className="d-flex flex-wrap gap-2 justify-content-end">
                {user.role == 2 && (
                  <Button
                    className="btn-sm btn-blue waves-effect waves-light"
                    onClick={toggleUploadModal}
                  >
                    <i className="mdi mdi-upload"></i> Import Leads
                  </Button>
                )}

                {user?.role == 4 && (
                  <Dropdown className="btn-group">
                    <Dropdown.Toggle
                      disabled={selectedValues?.length > 0 ? false : true}
                      variant="light"
                      className="table-action-btn btn-sm btn-blue"
                    >
                      <i className="mdi mdi-account-plus"></i> Assign CRE's
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      style={{ maxHeight: "150px", overflow: "auto" }}
                    >
                      {cres?.map((item: any) => (
                        <Dropdown.Item
                          key={item.id}
                          onClick={() =>
                            handleAssignBulk(selectedValues, item.id)
                          }
                        >
                          {item.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                )}

                {/* <Button
                  className="btn-sm btn-blue waves-effect waves-light float-end"
                  onClick={() => [
                    openModalWithClass("modal-full-width"),
                    handleResetValues(),
                  ]}
                >
                  <i className="mdi mdi-plus-circle"></i> Add lead
                </Button> */}
              </div>
              <h4 className="header-title mb-4">Manage Leads</h4>
              <Table
                columns={columns}
                data={records ? records : []}
                pageSize={5}
                sizePerPageList={sizePerPageList}
                isSortable={true}
                pagination={true}
                isSelectable={true}
                isSearchable={true}
                tableClass="table-striped dt-responsive nowrap w-100"
                onSelect={handleSelectedValues}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

const AssignedLeads = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    user,
    state,
    cres,
    error,
    loading,
    initialLoading,
    country,
    source,
    categories,
    // regions,
    channels,
    office,
  } = useSelector((state: RootState) => ({
    user: state.Auth.user,
    state: state.Leads.assignedLeads,
    cres: state.Leads.allCres,
    error: state.Leads.error,
    loading: state.Leads.loading,
    initialLoading: state.Leads.initialloading,
    country: state.Country.countries,
    source: state.Source.sources.data,
    categories: state.Category.category.data,
    channels: state.Channels.channels.data,
    office: state.OfficeTypes.officeTypes,
  }));

  useEffect(() => {
    dispatch(getCountry());
    dispatch(getCategory());
    dispatch(getChannel());
    dispatch(getLeadAssigned());
    dispatch(getSource());
    dispatch(getOfficeTypeData());
  }, [dispatch]);

  const countryData = useMemo(() => {
    if (!country) return [];
    return country.map((item: any) => ({
      value: item.id.toString(),
      label: item.country_name,
    }));
  }, [country]);

  const sourceData = useMemo(() => {
    if (!source) return [];
    return source.map((item: any) => ({
      value: item.id.toString(),
      label: item.source_name,
    }));
  }, [source]);

  const categoriesData = useMemo(() => {
    if (!categories) return [];
    return categories.map((item: any) => ({
      value: item.id.toString(),
      label: item.category_name,
    }));
  }, [categories]);

  const channelsData = useMemo(() => {
    if (!channels) return [];
    return channels.map((item: any) => ({
      value: item.id.toString(),
      label: item.channel_name,
    }));
  }, [channels]);

  const officeData = useMemo(() => {
    if (!office) return [];
    return office?.map((item: any) => ({
      value: item.id.toString(),
      label: item.office_type_name,
    }));
  }, [office]);

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
          { label: "Assigned Leads", path: "/master/university", active: true },
        ]}
        title={"Leads"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            country={countryData || []}
            source={sourceData || []}
            categories={categoriesData || []}
            user={user || null}
            cres={cres || []}
            // regions={regionsData || []}
            channels={channelsData || []}
            office={officeData || []}
            error={error}
            loading={loading}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default AssignedLeads;
