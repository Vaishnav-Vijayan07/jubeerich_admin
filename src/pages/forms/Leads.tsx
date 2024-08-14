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
import { yupResolver } from "@hookform/resolvers/yup";
import makeAnimated from "react-select/animated";

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
  getLeadsTL,
  updateLeads,
} from "../../redux/actions";
import Select, { ActionMeta, OptionsType } from "react-select";
import {
  AUTH_SESSION_KEY,
  showErrorAlert,
  showSuccessAlert,
} from "../../constants";
import { getCountry } from "../../redux/country/actions";
import { getOfficeTypeData } from "../../redux/OfficeType/actions";
import FileUploader from "../../components/FileUploader";
import { Link } from "react-router-dom";
import axios from "axios";
import { getLeads } from "../../helpers";
import moment from "moment";

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
  preferred_country: [],
  office_type: null,
  //   region_id: "",
  //   counsiler_id: "",
  //   branch_id: "",
  updated_by: null,
  remarks: "",
  lead_received_date: new Date().toISOString().split("T")[0],
  ielts: true,
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
  ielts: true,
};

const BasicInputElements = withSwal((props: any) => {
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  const animatedComponents = makeAnimated();
  let userRole: any;
  if (userInfo) {
    userRole = JSON.parse(userInfo)?.role;
  }
  console.log("user role ==>", userRole);

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
  const [selectedCountry, setSelectedCountry] = useState<OptionType[]>([]);
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

  console.log("selected Country ==>", selectedCountry);


  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(
    initialValidationState
  );

  const validationSchema = yup.object().shape({
    full_name: yup
      .string()
      .required("Full name is required")
      .min(3, "Full name must be at least 3 characters long"),
    email: yup.string().required("Email is required").email("Invalid email"),
    phone: yup
      .string()
      .required("Phone is required")
      .matches(/^[0-9]{10}$/, "Phone number must be a 10-digit number"),
    category_id: yup.string().required("Category is required").nullable(),
    source_id: yup.string().required("Source is required").nullable(),
    channel_id: yup.string().required("Channel is required").nullable(),
    city: yup.string().required("City is required"),
    preferred_country: yup
      .array()
      .min(1, "At least one preferred country is required")
      .required("Preferred country is required"),
    office_type: yup.string().required("Office type is required").nullable(),
    lead_received_date: yup.date().required("Date is required"),
    ielts: yup.boolean(),
    remarks: yup.string(),
  });

  console.log("isUpdate ======>", isUpdate);


  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  const handleUpdate = (item: any) => {

    console.log("item:", item);

    //update source dropdown
    const updatedSource = source?.filter(
      (source: any) => source.value == item.source_id
    );
    const updatedOffice = office?.filter(
      (office: any) => office.value == item.office_type
    );
    // const updatedCountry = country?.filter(
    //   (country: any) => country.value == item.preferred_country
    // );
    const updatedCtegory = categories?.filter(
      (category: any) => category.value == item.category_id
    );
    const updatedChannels = channels?.filter(
      (channel: any) => channel.value == item.channel_id
    );

    const updatedCountry = item?.preferredCountries?.map((country: any) => ({
      value: country?.id,
      label: country?.country_name
    }));

    const countryArray = item?.preferredCountries?.map((country: any) => (country?.id));

    // const prefferedCountryIds = item?.preffered_country?.map
    setSelectedSource(updatedSource[0]);
    setSelectedOffice(updatedOffice[0]);
    setSelectedCountry(updatedCountry);
    setSelectedCategory(updatedCtegory[0]);
    setSelectedChannel(updatedChannels[0]);

    setFormData((prev) => ({
      ...prev,
      id: item?.id || "",
      full_name: item?.full_name || "",
      email: item?.email || "",
      phone: item?.phone || "",
      category_id: item?.category_id || null,
      source_id: item?.source_id || "",
      channel_id: item?.channel_id || "",
      city: item?.city || "",
      preferred_country: countryArray,
      office_type: item?.office_type || "",
      // region_id: item?.region_id || "",
      // counsiler_id: item?.counsiler_id || "",
      // branch_id: item?.branch_id || "",
      updated_by: item?.updated_by || "",
      remarks: item?.remarks || "",
      lead_received_date: moment(item?.lead_received_date).format("YYYY-MM-DD") || new Date()?.toISOString().split("T")[0],
      ielts: item?.ielts || false,
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
      await validationSchema.validate(formData, { abortEarly: false });

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
    {
      Header: "Lead Received Date",
      accessor: "lead_received_date",
      sort: false,
      Cell: ({ row }: any) => <span>{moment(row.original.lead_received_date).format("DD/MM/YYYY")}</span>,
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
    ...(user?.role == 3
      ? [
        {
          Header: "Assigned by",
          accessor: "updated_by_user",
          sort: false,
        },
      ]
      : []),
    ...(user?.role == 3 || user?.role == 4
      ? [
        {
          Header: "Assign Type",
          accessor: "assign_type",
          sort: false,
          Cell: ({ row }: any) => {
            const assignType = row.original.assign_type;
          
            // Define display text for each possible assignType
            const displayText: { [key: string]: string } = {
              "direct_assign": "Direct Assigned",
              "auto_assign": "Auto Assigned",
              "null": "",  // Handle the string "null" explicitly
              "undefined": "",  // Handle the string "undefined" explicitly
            };
          
            // Return the corresponding display text or "Unknown" if not found
            return <span>{displayText[assignType] || ""}</span>;
          }
        },
      ]
      : []),
    ...(user?.role == 3 || user?.role == 5
      ? [
        {
          Header: "Assigned counsellor",
          accessor: "counselors",
          sort: false,
          Cell: ({ row }: any) => {
            const counselors = row?.original.counselors;
            return (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {counselors && counselors.length > 0 ? (
                  counselors.map((item: any) => (
                    <li key={item?.counselor_name}>{item?.counselor_name}</li>
                  ))
                ) : (
                  <li>Not assigned</li>
                )}
              </ul>
            );
          },
        },
      ]
      : []),


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

  console.log("form data:", formData);


  const handleResetValues = () => {
    setValidationErrors(initialValidationState); // Clear validation errors
    setFormData(initialState); //clear form data
    setSelectedCountry([]);
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

  const handleDownloadClick = () => {
    const filePath = "/excel/sample.xlsx";
    const link = document.createElement("a");
    link.download = "sample.xlsx";
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
        setSelectedFile([]);
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

  const handleAssignBulk = async (user_ids: any, cre_id: any) => {
    if (user_ids.length > 0) {
      try {
        const { data } = await axios.post("/assign_cres", { user_ids, cre_id });

        if (data.status) {
          if (userRole == 4) {
            console.log("getLeadsTL called bulk====>");

            dispatch(getLeadsTL());
          } else {
            console.log("getLead called bulk==>");

            dispatch(getLead());
          }
          showSuccessAlert("Bulk assignment successful.");
        }
      } catch (error) {
        showErrorAlert(error);
      }
    }
  };

  const handleAutoAssign = async () => {
    if (selectedValues.length > 0) {
      try {
        const { data } = await axios.post("/auto_assign", {
          leads_ids: selectedValues,
        });
        if (data.status) {
          if (userRole == 4) {
            dispatch(getLeadsTL());
          } else {
            dispatch(getLead());
          }
          showSuccessAlert("Bulk assignment successful.");
        }
      } catch (error) {
        showErrorAlert(error);
      }
    }
  };

  useEffect(() => {
    // Check for errors and clear the form
    if (!loading && !error) {
      setResponsiveModal(false);
      setValidationErrors(initialValidationState); // Clear validation errors
      setFormData(initialState); //clear form data
      setSelectedCountry([]);
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

  const handleSelectChange = (
    selectedOptions: OptionType[] | OptionsType<OptionType> | null,
    actionMeta: ActionMeta<OptionType>
  ) => {
    if (Array.isArray(selectedOptions)) {
      setSelectedCountry(selectedOptions);
      // const selectedIdsString = selectedOptions?.map((option) => option.value).join(", ");
      const selectedIdsArray = selectedOptions?.map((option) => parseInt(option.value));
      setFormData((prev: any) => ({
        ...prev,
        preferred_country: selectedIdsArray,
      }));
    }
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
                    <Form.Label><span className="text-danger fs-4">* </span>Full Name</Form.Label>
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
                    <Form.Label><span className="text-danger fs-4">* </span>Email</Form.Label>
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
                    <Form.Label><span className="text-danger fs-4">* </span>Phone</Form.Label>
                    <Form.Control
                      type="number"
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
                    <Form.Label><span className="text-danger fs-4">* </span>Office Type</Form.Label>
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
                      components={animatedComponents}
                      isMulti
                      name="preferred_country"
                      options={country}
                      value={selectedCountry}
                      onChange={handleSelectChange as any}
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
                  <>
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

                    <Button
                      className="btn-sm btn-blue waves-effect waves-light float-end"
                      onClick={handleAutoAssign}
                    >
                      <i className="mdi mdi-plus-circle"></i> Auto Assign
                    </Button>
                  </>
                )}

                <Button
                  className="btn-sm btn-blue waves-effect waves-light float-end"
                  onClick={() => [
                    openModalWithClass("modal-full-width")
                  ]}
                >
                  <i className="mdi mdi-plus-circle"></i> Add lead
                </Button>
              </div>
              <h4 className="header-title mb-4">Manage Leads</h4>
              {userRole == 4 ? <Table
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
              /> : <Table
                columns={columns}
                data={records ? records : []}
                pageSize={5}
                sizePerPageList={sizePerPageList}
                isSortable={true}
                pagination={true}
                isSearchable={true}
                tableClass="table-striped dt-responsive nowrap w-100"
              />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

const Leads = () => {
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  let userRole: any;
  if (userInfo) {
    userRole = JSON.parse(userInfo)?.role;
  }
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
    state: state.Leads.leads,
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
    dispatch(getSource());
    dispatch(getOfficeTypeData());
  }, [dispatch]);

  useEffect(() => {
    if (userRole == 4) {
      dispatch(getLeadsTL());
    } else {
      dispatch(getLead());
    }
  }, [dispatch, userRole])


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
          { label: "Master", path: "/master/leads" },
          { label: "Leads", path: "/master/leads", active: true },
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
export default Leads;
