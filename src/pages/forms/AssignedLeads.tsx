import * as yup from "yup";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  getAdminUsers,
  getCategory,
  getChannel,
  getLead,
  getLeadAssigned,
  getStatus,
  updateLeads,
} from "../../redux/actions";
import Select, { ActionMeta, OptionsType } from "react-select";
import {
  AUTH_SESSION_KEY,
  customStyles,
  region_id,
  showErrorAlert,
  showSuccessAlert,
} from "../../constants";
import { getCountry } from "../../redux/country/actions";
import { getOfficeTypeData } from "../../redux/OfficeType/actions";
import FileUploader from "../../components/FileUploader";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { getLeads } from "../../helpers";
import { city, examtypes } from "./data";
import moment from "moment";
import makeAnimated from "react-select/animated";
import { getRegion } from "../../redux/regions/actions";

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
  exam: "",
  zipcode: "",
  region_id: "",

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
  zipcode: "",
  region_id: "",
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
    status,
    userData,
    counsellors,
    region,
  } = props;

  console.log('Region from state', region);
  

  const [tableData, setTableData] = useState([]);
  
  //fetch token from session storage

  //Table data
  // const records: TableRecords[] = state;
  let records: TableRecords[] = state;

  useEffect(() => {
    setTableData(state);
  }, [records])

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  // const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(
  //   null
  // );
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
  const [selectedStatus, setSelectedStatus] = useState<any>(null);
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<any>(null);
  const [selectedAssignedBy, setSelectedAssignedBy] = useState<any>(null);
  const [selectedCounsellor, setSelectedCounsellor] = useState<any>(null);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<any>(null);
  const [selectedCREFilter, setSelectedCREFilter] = useState<any>(null);
  const [selectExam, setSelectExam] = useState<boolean>(false);
  const [languageForm, setLanguageForm] = useState<any[]>([{ exam_name: '', marks: '' }]);
  const [selectedFileName, setSelectedFileName] = useState<any>([]);
  const fileInputRef = useRef<any>(null);
  const [activeRegion, setActiveRegion] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const [className, setClassName] = useState<string>("");
  const [scroll, setScroll] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    source: '',
    city: '',
    CRE: '',
    counsiler_id: '',
    status_id: '',
    preferredCountries: '',
    updated_by: '',
    lead_received_date: '',
    followup_date: '',
  })

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(
    initialValidationState
  );

  const animatedComponents = makeAnimated();

  const { pathname } = useLocation();

  const validationSchema = yup.object().shape({
    full_name: yup
      .string()
      .required("Name is required"),
    email: yup.string().required("Email is required").email("Invalid email"),
    phone: yup.string().required("Phone is required"),
    category_id: yup.string().required("Category is required"),
    source_id: yup.string().required("Source is required"),
    channel_id: yup.string().required("Channel is required"),
    city: yup.string().required("City is required"),
    // preferred_country: yup.string().required("Preferred country is required"),
    preferred_country: yup
    .array()
    .min(1, "At least one preferred country is required")
    .required("Preferred country is required"),
    office_type: yup.string().required("Office type is required"),
    lead_received_date: yup.date().required("Date is required"),
    // ielts: yup.boolean(),
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
    // const updatedCountry = country?.filter(
    //   (country: any) => country.value == item.preferred_country
    // );
    const updatedCtegory = categories?.filter(
      (category: any) => category.value == item.category_id
    );
    const updatedChannels = channels?.filter(
      (channel: any) => channel.value == item.channel_id
    );

    const updatedRegion = region?.filter(
      (region: any) => region.value == item.region_id
    );


    const updatedCountry = item?.preferredCountries?.map((country: any) => ({
      value: country?.id,
      label: country?.country_name
    }));

    const countryArray = item?.preferredCountries?.map((country: any) => (country?.id));

    console.log('updatedRegion',updatedRegion[0]);
    

    setSelectedSource(updatedSource[0]);
    setSelectedOffice(updatedOffice[0]);
    // setSelectedCountry(updatedCountry[0]);
    setSelectedCountry(updatedCountry);
    setSelectedRegion(updatedRegion[0]);
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
      preferred_country: countryArray,
      office_type: item?.office_type || "",
      // region_id: item?.region_id || "",
      // counsiler_id: item?.counsiler_id || "",
      // branch_id: item?.branch_id || "",
      updated_by: item?.updated_by || "",
      remarks: item?.remarks || "",
      lead_received_date: moment(item?.lead_received_date).format("YYYY-MM-DD") || new Date()?.toISOString().split("T")[0],
      ielts: item?.ielts || "",
      exam: item?.exam || "",
      zipcode: item?.zipcode,
      region_id: item?.region_id || "",
    }));

    setIsUpdate(true);

    if (item?.exam_details?.length) {
      setSelectExam(true)
      setLanguageForm(item?.exam_details)
    }

    if (item?.exam_documents?.length) {
      console.log('File', item?.exam_documents);

      // setSelectedFile(item?.exam_documents)
      setSelectedFileName(item?.exam_documents)
    }


    const emptyFile = new File([], "empty.txt", {
      type: "text/plain",
    });

    if (Array.isArray(item?.exam_documents)) {
      for (let i = 0; i < item?.exam_documents.length; i++) {
        setSelectedFile((prevFile: any) => ([
          ...prevFile, emptyFile
        ]))
      }
    }

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
      case "region_id":
        setSelectedRegion(selected);
        break; 
      default:
        break;
    }
  };

  //handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let exam_details = languageForm.length ? languageForm : [];

    console.log('FORM DATA',formData);
    console.log('EXAM DATA',exam_details);
    console.log('EXAM FILE',selectedFile);

    // Validate the form using yup
    try {
      await validationSchema.validate(formData, { abortEarly: false });

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
              // formData.preferred_country,
              JSON.stringify(formData.preferred_country),
              formData.office_type,
              // null, // Region Nulled
              formData.region_id ? formData.region_id : null,
              null,
              null,
              user_id,
              formData.remarks,
              formData.lead_received_date,
              formData.ielts,
              formData.zipcode,
              exam_details[0]?.exam_name ? JSON.stringify(exam_details) : null,
              selectedFile
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
              // formData.preferred_country,
              JSON.stringify(formData.preferred_country),
              formData.office_type,
              // null, // Region Nulled
              formData.region_id ? formData.region_id : null,
              null,
              null,
              user_id,
              formData.remarks,
              formData.lead_received_date,
              formData.ielts,
              formData.zipcode,
              exam_details[0]?.exam_name ? JSON.stringify(exam_details) : null,
              selectedFile
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
      Cell: ({ row }: any) => <span>{row.original.lead_received_date && moment(row.original.lead_received_date).format("DD/MM/YYYY")}</span>,
    },
    {
      Header: "Followup Date",
      accessor: "followup_date",
      sort: false,
      Cell: ({ row }: any) => <span>{row.original.followup_date && moment(row.original.followup_date).format("DD/MM/YYYY")}</span>,
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
    {
      Header: "Status",
      accessor: "status",
      sort: false,
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
    // setSelectedCountry(null);
    setSelectedCountry([]);
    setSelectedCategory(null);
    setSelectedChannel(null);
    setSelectedOffice(null);
    setSelectedSource(null);
    setSelectedRegion(null);
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
      // setSelectedCountry(null);
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

  useEffect(() => {
    applyFilter()
  }, [filters])
  

  const applyFilter = () => {
  
    let filteredData: any = [...state];

    if (filters.source) {
      filteredData = filteredData.filter((data: any) => data.source_id == filters.source);
    }

    if (filters.city) {
      filteredData = filteredData.filter((data: any) => data.city == filters.city);
    }

    if (filters.CRE) {
      filteredData = filteredData.filter((data: any) => data.assigned_cre == filters.CRE);
    }
    
    if (filters.status_id) {
      filteredData = filteredData.filter((data: any) => data.status_id == filters.status_id);
    }

    if (filters.updated_by) {
      filteredData = filteredData.filter((data: any) => data.updated_by == filters.updated_by);
    }

    if (filters.counsiler_id) {
      filteredData = filteredData.filter((data: any) => data.counsiler_id == filters.counsiler_id);
      // filteredData = filteredData.filter((data: any) =>
      //   data.counselors.some((counselor: any) => counselor.id == filters.counsiler_id)
      // );
    }

    if (filters.preferredCountries) {
      filteredData = filteredData.filter((data: any) =>
        data.preferredCountries.some((preferredCountry: any) => preferredCountry.id == filters.preferredCountries)
      );
    }

    if (filters.lead_received_date) {
      filteredData = filteredData.filter((data: any) => {
        const itemDate = new Date(data.lead_received_date).toDateString();
        const filterDate = new Date(filters.lead_received_date).toDateString();
        return itemDate === filterDate;
      });
    }

    if (filters.followup_date) {
      filteredData = filteredData.filter((data: any) => {
        const itemDate = new Date(data.followup_date).toDateString();
        const filterDate = new Date(filters.followup_date).toDateString();
        return itemDate === filterDate;
      });
    }

    setTableData(filteredData);
  };

  const handleFilterChange = (selected: any, { name }: any) => {

    setFilters(prevFilters => ({
        ...prevFilters,
        [name]: selected?.value,
    }));

    switch (name) {
        case "status_id":
            setSelectedStatus(selected);
            break;
        case "source_id":
            setSelectedSourceFilter(selected);
            break;
        case "updated_by":
            setSelectedAssignedBy(selected);
            break;
        case "counsiler_id":
            setSelectedCounsellor(selected);
            break;
        case "preferredCountries":
            setSelectedCountryFilter(selected);
            break;
        case "CRE":
          setSelectedCREFilter(selected);
            break;
        default:
            break;
      }
  };

  const handleFilterDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFilters({
      source: '',
      city: '',
      CRE: '',
      counsiler_id: '',
      status_id: '',
      preferredCountries: '',
      updated_by: '',
      lead_received_date: '',
      followup_date: '',
    })
    setSelectedStatus(null);
    setSelectedSourceFilter(null);
    setSelectedAssignedBy(null);
    setSelectedCounsellor(null);
    setSelectedCountryFilter(null);
    setSelectedCREFilter(null)
  }

  const handleLanguageInputChange = (index: number, e: any) => {
    const { name, value } = e.target;

    const newFields = [...languageForm];
    newFields[index][name] = value;
    setLanguageForm(newFields);
  }

  const handleRemoveLanguageForm = async (index: number, e: any, exam_name: string) => {
    const payload = {
      id: formData?.id,
      exam_name: exam_name
    }
    console.log('PAYLOAD', payload);

    try {
      swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete",
      })
        .then((result: any) => {
          if (result.isConfirmed) {
            axios.delete('/exams', { data: payload }).then((res: any) => {
              const removeFields = languageForm.filter((data: any, i: number) => i !== index);
              const removeFiles = selectedFile.filter((data: any, i: number) => i !== index);
              setLanguageForm(removeFields);
              setSelectedFile(removeFiles);
              showSuccessAlert(res.data.message);
            }).catch((err: any) => {
              console.log(err);
              showErrorAlert("Error occured");
            })
          }
        })
    } catch (error) {
      console.log(error);
    }

  }

  const handleFileChange = (index: number, e: any) => {
    let file = e.target.files[0];

    if (!(isUpdate) && selectedFile.length) {
      const filteredFile = selectedFile.filter((data: any, i: number) => i !== index);
      setSelectedFile(filteredFile);
    } else if (isUpdate && selectedFile.length) {
      selectedFile.splice(index, 1, file);

      setSelectedFile([...selectedFile]);
    } else {
      setSelectedFile((prevData: any) => [...prevData, file]);
    }
  }

  const handleAddLanguageForm = () => {
    setLanguageForm((prevData) => ([...prevData, { exam_name: '', marks: '' }]))
  }

  const handleSelectChange = (
    selectedOptions: OptionType[] | OptionsType<OptionType> | null,
    actionMeta: ActionMeta<OptionType>
  ) => {
    if (Array.isArray(selectedOptions)) {
      setSelectedCountry(selectedOptions);
      const selectedIdsArray = selectedOptions?.map((option) => parseInt(option.value));
      setFormData((prev: any) => ({
        ...prev,
        preferred_country: selectedIdsArray,
      }));
    }
  };

  useEffect(() => {
    if (selectedOffice?.value == region_id) {
      setActiveRegion(true);
    } else {
      setActiveRegion(false);
      setSelectedRegion(null);
    }
  }, [selectedOffice])

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
              {/* <Row>
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
                      options={[{ value: null, label: "None" }, ...source]}
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
                      options={[{ value: null, label: "None" }, ...categories]}
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
                      options={[{ value: null, label: "None" }, ...channels]}
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
                
                <Col md={4} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Country</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      // components={animatedComponents}
                      isMulti
                      name="preferred_country"
                      options={[{ value: null, label: "None" }, ...country]}
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

                <Col md={4} lg={4}>
                  <Form.Group className="mb-3" controlId="zipcode">
                    <Form.Label><span className="text-danger fs-4">* </span>Zipcode</Form.Label>
                    <Form.Control
                      type="text"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleInputChange}
                    />
                    {validationErrors.zipcode && (
                      <Form.Text className="text-danger">
                        {validationErrors.zipcode}
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
                      options={[{ value: null, label: "None" }, ...office]}
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

                {activeRegion && <Col md={4} lg={4}>
                  <Form.Group className="mb-3" controlId="region_id">
                    <Form.Label><span className="text-danger fs-4">* </span>Region</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="region_id"
                      options={[{ value: null, label: "None" }, ...region]}
                      value={selectedRegion}
                      onChange={handleDropDowns}
                    />
                    {validationErrors.region_id && (
                      <Form.Text className="text-danger">
                        {validationErrors.region_id}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>}
                

                <Col md={4} lg={4} className="mt-2">
                  <Form.Group className="mb-3" controlId="source_id">
                    <Form.Label>Have you ever participated in any language exams ?</Form.Label>
                    <div className="d-flex justify-content-start align-items-center mt-1">
                      <div className="d-flex justify-content-start align-items-start me-2">
                        <Form.Check
                          type="radio"
                          id="active-switch"
                          name="ielts"
                          onClick={() => setSelectExam(true)}
                          checked={selectExam}
                        />
                        <span className="ps-1 fw-bold">Yes</span>
                      </div>
                      <div className="d-flex justify-content-start align-items-start">
                        <Form.Check
                          type="radio"
                          id="active-switch"
                          name="ielts"
                          onClick={() => setSelectExam(false)}
                          checked={!selectExam}
                        />
                        <span className="ps-1 fw-bold">No</span>
                      </div>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                {selectExam && languageForm.map((data, index) => (
                  <Row key={index}>
                    <Col md={4} lg={4}>
                      <Form.Group className="mb-3" controlId="exam_name">
                        <Form.Label>Exam Type</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="exam_name"
                          value={data.exam_name}
                          onChange={(e) => handleLanguageInputChange(index, e)}
                        >
                          <option value="">
                            Choose..
                          </option>
                          {examtypes?.map((item: any) => (
                            <option
                              value={item?.name}
                              key={item?.name}
                              onClick={(e) => handleLanguageInputChange(index, e)}
                            >
                              {item.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4} lg={4}>
                      <Form.Group className="mb-3" controlId="marks">
                        <Form.Label>Exam Score</Form.Label>
                        <Form.Control
                          type="text"
                          name="marks"
                          value={data.marks}
                          onChange={(e) => {
                            handleLanguageInputChange(index, e)
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col className="d-flex justify-content-between">
                      <Form name="exam_documents" encType="multipart/form-data">
                        <Form.Group className="mb-3" controlId="profileImage">
                          <Form.Label>Upload File</Form.Label>
                          <Form.Control name="exam_documents" type="file" onChange={(event) => { handleFileChange(index, event) }} ref={fileInputRef} />
                          {selectedFileName[index]?.exam_documents && <p style={{ padding: '0%' }} className="mt-2">{selectedFileName[index].exam_documents}</p>}
                        </Form.Group>
                      </Form>
                      <i className="mdi mdi-delete-outline mt-3 pt-1 fs-3 ps-1" onClick={(e) => handleRemoveLanguageForm(index, e, data.exam_name)}></i>
                      {selectExam && <i className="mdi mdi-plus-circle-outline mt-3 pt-1 fs-3 ps-1" onClick={handleAddLanguageForm}></i>}
                    </Col>
                  </Row>
                ))}
              </Row> */}

              <Row>
                <Col md={4} lg={4}>
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

                <Col md={4} lg={4}>
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

                <Col md={4} lg={4}>
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

                <Col md={4} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Source</Form.Label>
                    <Select
                      className="react-select react-select-container"
                      styles={customStyles}
                      classNamePrefix="react-select"
                      name="source_id"
                      options={[{ value: null, label: "None" }, ...source]}
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

                <Col md={4} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Category</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="category_id"
                      options={[{ value: null, label: "None" }, ...categories]}
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

                <Col md={4} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Channel</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="channel_id"
                      options={[{ value: null, label: "None" }, ...channels]}
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

                <Col md={4} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label>Country</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      components={animatedComponents}
                      isMulti
                      name="preferred_country"
                      options={[{ value: null, label: "None" }, ...country]}
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

                <Col md={4} lg={4}>
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

                <Col md={4} lg={4}>
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

                <Col md={4} lg={4}>
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

                <Col md={4} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label><span className="text-danger fs-4">* </span>Zipcode</Form.Label>
                    <Form.Control
                      type="text"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleInputChange}
                    />
                    {validationErrors.zipcode && (
                      <Form.Text className="text-danger">
                        {validationErrors.zipcode}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={4} lg={4}>
                  <Form.Group className="mb-3" controlId="channel_name">
                    <Form.Label><span className="text-danger fs-4">* </span>Office Type</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="office_type"
                      options={[{ value: null, label: "None" }, ...office]}
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

                {activeRegion && <Col md={4} lg={4}>
                  <Form.Group className="mb-3" controlId="region_id">
                    <Form.Label><span className="text-danger fs-4">* </span>Region</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="region_id"
                      options={[{ value: null, label: "None" }, ...region]}
                      value={selectedRegion}
                      onChange={handleDropDowns}
                    />
                    {validationErrors.region_id && (
                      <Form.Text className="text-danger">
                        {validationErrors.region_id}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>}

                <Col md={4} lg={4} className="mt-2">
                  <Form.Group className="mb-3" controlId="source_id">
                    <Form.Label>Have you ever participated in any language exams ?</Form.Label>
                    <div className="d-flex justify-content-start align-items-center mt-1">
                      <div className="d-flex justify-content-start align-items-start me-2">
                        <Form.Check
                          type="radio"
                          id="active-switch"
                          name="ielts"
                          onClick={() => setSelectExam(true)}
                          checked={selectExam}
                        />
                        <span className="ps-1 fw-bold">Yes</span>
                      </div>
                      <div className="d-flex justify-content-start align-items-start">
                        <Form.Check
                          type="radio"
                          id="active-switch"
                          name="ielts"
                          onClick={() => setSelectExam(false)}
                          checked={!selectExam}
                        />
                        <span className="ps-1 fw-bold">No</span>
                      </div>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                {selectExam && languageForm.map((data, index) => (
                  <Row key={index}>
                    <Col md={4} lg={4}>
                      <Form.Group className="mb-3" controlId="exam_name">
                        <Form.Label>Exam Type</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          name="exam_name"
                          value={data.exam_name}
                          onChange={(e) => handleLanguageInputChange(index, e)}
                        >
                          <option value="">
                            Choose..
                          </option>
                          {examtypes?.map((item: any) => (
                            <option
                              value={item?.name}
                              key={item?.name}
                              onClick={(e) => handleLanguageInputChange(index, e)}
                              defaultValue={item.name === formData.exam ? item.name : undefined}
                            >
                              {item.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4} lg={4}>
                      <Form.Group className="mb-3" controlId="marks">
                        <Form.Label>Exam Score</Form.Label>
                        <Form.Control
                          type="text"
                          name="marks"
                          value={data.marks}
                          onChange={(e) => {
                            handleLanguageInputChange(index, e)
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col className="d-flex justify-content-between">
                      <Form name="exam_documents" encType="multipart/form-data">
                        <Form.Group className="mb-3" controlId="profileImage">
                          <Form.Label>Upload File</Form.Label>
                          <Form.Control name="exam_documents" type="file" onChange={(event) => { handleFileChange(index, event) }} ref={fileInputRef} />
                          {selectedFileName[index]?.exam_documents && <p style={{ padding: '0%' }} className="mt-2">{selectedFileName[index].exam_documents}</p>}
                        </Form.Group>
                      </Form>
                      <i className="mdi mdi-delete-outline mt-3 pt-1 fs-3 ps-1" onClick={(e) => handleRemoveLanguageForm(index, e, data.exam_name)}></i>
                      {selectExam && <i className="mdi mdi-plus-circle-outline mt-3 pt-1 fs-3 ps-1" onClick={handleAddLanguageForm}></i>}
                    </Col>
                  </Row>
                ))}
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
                disabled={loading}
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

        <Col lg={12} className="p-0 form__card">
          <Card>
            <Card.Body>
              <h4 className="header-title mb-3">Filters</h4>
              <Row className="mb-3">
                <Col lg={3} md={4} sm={6} xs={12}>

                  <Form.Group className="mb-3" controlId="status_id">
                    <Form.Label>Status</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container select-wrapper"
                      classNamePrefix="react-select"
                      name="status_id"
                      options={[{ value: null, label: "All" }, ...status]}
                      value={selectedStatus}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>

                {user?.role == 3 || user?.role == 5 ? <Col lg={3} md={4} sm={6} xs={12}>
                  <Form.Group className="mb-3" controlId="updated_by">
                    <Form.Label>Assigned By</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container select-wrapper"
                      classNamePrefix="react-select"
                      name="updated_by"
                      options={[{ value: null, label: "All" }, ...userData]}
                      value={selectedAssignedBy}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col> : ""}

                {user?.role == 3 || user?.role == 5 ? <Col lg={3} md={4} sm={6} xs={12}>
                  <Form.Group className="mb-3" controlId="counsiler_id">
                    <Form.Label>Counsellors</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container select-wrapper"
                      classNamePrefix="react-select"
                      name="counsiler_id"
                      options={[{ value: null, label: "All" }, ...counsellors]}
                      value={selectedCounsellor}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col> : ""}

                <Col lg={3} md={4} sm={6} xs={12}>
                  <Form.Group className="mb-3" controlId="preferredCountries">
                    <Form.Label>Country</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container select-wrapper"
                      classNamePrefix="react-select"
                      name="preferredCountries"
                      options={[{ value: null, label: "All" }, ...country]}
                      value={selectedCountryFilter}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>

                <Col lg={3} md={4} sm={6} xs={12}>
                  <Form.Group className="mb-3" controlId="CRE">
                    <Form.Label>CRE</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container select-wrapper"
                      classNamePrefix="react-select"
                      name="CRE"
                      options={[{ value: null, label: "All" }, ...cres]}
                      value={selectedCREFilter}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>


                <Col lg={3} md={4} sm={6} xs={12}>
                  <Form.Group className="mb-3" controlId="source_id">
                    <Form.Label>Source</Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container select-wrapper"
                      classNamePrefix="react-select"
                      name="source"
                      options={[{ value: null, label: "All" }, ...source]}
                      value={selectedSourceFilter}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>

                <Col lg={3} md={4} sm={6} xs={12}>
                  <Form.Group controlId="lead_received_date" className="cust-date mb-3">
                    <Form.Label>Lead Received Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="lead_received_date"
                      value={filters.lead_received_date}
                      onChange={(e: any) => handleFilterDateChange(e)}
                    />
                  </Form.Group>
                </Col>

                <Col lg={3} md={4} sm={6} xs={12}>
                  <Form.Group controlId="followup_date" className="cust-date mb-3">
                    <Form.Label>Followup Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="followup_date"
                      value={filters.followup_date}
                      onChange={(e: any) => handleFilterDateChange(e)}
                    />
                  </Form.Group>
                </Col>

                <Col lg={3} md={4} sm={6} xs={12} style={{ alignSelf: "center" }}>
                  <Form.Group className="align-items-center">
                    <Button style={{ margin: "auto" }} variant="primary" onClick={handleClear}>Clear</Button>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>

          </Card>
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
              <div className="d-flex flex-wrap justify-content-end">
              </div>
              <Table
                columns={columns}
                // data={records ? records : []}
                data={tableData ? tableData : []}
                pageSize={10}
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
  const [counsellors, setCounsellors] = useState([])

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
    status,
    users,
    region
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
    status: state.Status.status.data,
    users: state.Users.adminUsers,
    region: state.Region.regions
  }));

  useEffect(() => {
    dispatch(getCountry());
    dispatch(getCategory());
    dispatch(getChannel());
    dispatch(getLeadAssigned());
    dispatch(getSource());
    dispatch(getOfficeTypeData());
    dispatch(getStatus());
    dispatch(getOfficeTypeData());
    dispatch(getAdminUsers());
    dispatch(getRegion());
    fetchAllCounsellors()
  }, [dispatch]);

  const fetchAllCounsellors = () => {
    axios.get("/get_all_counsellors").then((res) => {
      console.log('Counsillers', res.data.data);
      setCounsellors(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const CREData = useMemo(() => {
    if (!cres) return [];
    return cres.map((item: any) => ({
      value: item.id.toString(),
      label: item.name,
    }));
  }, [country]);

  const countryData = useMemo(() => {
    if (!country) return [];
    return country.map((item: any) => ({
      value: item.id.toString(),
      label: item.country_name,
    }));
  }, [country]);

  const statusData = useMemo(() => {
    if (!status) return [];
    return status.map((item: any) => ({
      value: item.id.toString(),
      label: item.status_name,
    }));
  }, [status]);

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

  const userData = useMemo(() => {
    if (!users) return [];
    return users?.map((item: any) => ({
      value: item.id.toString(),
      label: item.name,
    }));
  }, [users]);

  const regionData = useMemo(() => {
    if (!region) return [];
    return region?.map((item: any) => ({
      value: item.id.toString(),
      label: item.region_name,
    }));
  }, [region]);


  const counsellorsData = useMemo(() => {
    if (!users) return [];
    return users?.map((item: any) => ({
      value: item.id.toString(),
      label: item.name,
    }));
  }, [users]);

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
            cres={CREData || []}
            status={statusData || []}
            counsellors={counsellorsData || []}
            channels={channelsData || []}
            office={officeData || []}
            error={error}
            loading={loading}
            userData={userData}
            region={regionData}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default AssignedLeads;
