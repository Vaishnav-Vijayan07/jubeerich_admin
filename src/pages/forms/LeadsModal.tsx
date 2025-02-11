import * as yup from "yup";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { withSwal } from "react-sweetalert2";
import { AppDispatch, RootState } from "../../redux/store";
import { addLeads, updateLeads } from "../../redux/actions";
import {
  AUTH_SESSION_KEY,
  branch_counsellor_id,
  corporate_id_from_office,
  counsellor_id,
  counsellor_tl_id,
  country_manager_id,
  cre_id,
  cre_tl_id,
  customStyles,
  franchise_counsellor_id,
  franchise_id_from_office,
  franchise_manager_id,
  it_team_id,
  region_id,
  region_id_from_office,
  regional_manager_id,
} from "../../constants";
import { initialState, initialValidationState, OptionType } from "./data";
import moment from "moment";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { regrexValidation } from "../../utils/regrexValidation";
import { APICore } from "../../helpers/api/apiCore";

const LeadsModal = withSwal((props: any) => {
  const {
    swal,
    country,
    source,
    leadTypes,
    user,
    office,
    channels,
    error,
    loading,
    regionData,
    franchisees,
    region,
    flags,
    toggle,
    modal,
    handleUpdateData,
    clearLeadModal,
    setModal,
    isAssignedLeads = false,
    initialLoading,
    clearError
  } = props;
  const api = new APICore();
  const loggedInUser = api.getLoggedInUser();

  const [sourceData, setSourceData] = useState<any>(source);
  const [channelData, setChannelData] = useState<any>(channels);
  const [selectedCountry, setSelectedCountry] = useState<OptionType[]>();
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedOffice, setSelectedOffice] = useState<any>(null);
  const [selectedFlag, setSelectedFlag] = useState<any>(null);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [selectedFileName, setSelectedFileName] = useState<any>([]);
  const [activeRegion, setActiveRegion] = useState<any>(null);
  const [isFranchiseActive, setIsFranchiseActive] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [validationErrors, setValidationErrors] = useState(initialValidationState);
  const [scroll, setScroll] = useState<boolean>(false);
  const [selectExam, setSelectExam] = useState<boolean>(false);
  const [languageForm, setLanguageForm] = useState<any[]>([{ id: "", exam_type: "", marks: "" }]);
  const [formData, setFormData] = useState(initialState);
  const languageFormInitialState = [{ id: "", exam_type: "", marks: "", exam_date: "" }];
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isOfficeDisable, setIsOfficeDisable] = useState<any>(false);
  
  const { existLeadId } = useSelector(
    (state: RootState) => ({
      existLeadId: state.Leads.existLeadId,
    })
  );

  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  
  let loggedUserCountries: any;
  let role_id: any;
  if (userInfo) {
    let { countries, role } = JSON.parse(userInfo);
    loggedUserCountries = countries;
    role_id = role;
  }

  const validationSchema = yup.object().shape({
    full_name: yup.string().min(3, 'Min 3 characters').max(100, 'Max 100 characters').required("Name is required"),
    preferred_country: yup.array().min(1, "At least one country must be selected").nullable(),
    email: yup.string().email("Invalid email"),
    phone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number must be a 10-digit number")
      .required("Phone is required"),
    lead_type_id: yup.string().required("Lead type is required").nullable(),
    source_id: yup.string().required("Source is required").nullable(),
    channel_id: yup.string().required("Channel is required").nullable(),
    office_type: yup.string().required("Office type is required").nullable(),
    lead_received_date: yup.date().nullable(),
    zipcode: yup
      .string()
      .matches(/^[0-9]*$/, "Zipcode must be numbers only").nullable(),
    franchise_id: yup
      .string()
      .nullable()
      .when("office_type", (officeType, schema) => {
        if (officeType === franchise_id_from_office) {
          return schema.required("Franchise is required").nullable();
        }
        return schema.nullable();
      }),
    region_id: yup
      .string()
      .nullable()
      .when("office_type", (officeType, schema) => {
        if (officeType === region_id_from_office) {
          return schema.required("Region is required").nullable();
        }
        return schema.nullable();
      }),
  });

  useEffect(() => {
    if (Object.entries(handleUpdateData).length) {
      handleUpdate(handleUpdateData);
    }
  }, [handleUpdateData]);

  useEffect(() => {
    handleCancelUpdate();
  }, [clearLeadModal]);

  useEffect(() => {
    setValidationErrors(initialValidationState);
  }, [clearError]);

  const filteredOffice = useMemo(() => {
    if (!loggedInUser || !office?.length) return null;

    if ([cre_tl_id, cre_id, counsellor_id].includes(loggedInUser?.role.toString())) {
      return office?.find((data: any) => data?.value == corporate_id_from_office);
    } else if ([regional_manager_id, counsellor_tl_id, branch_counsellor_id].includes(loggedInUser?.role.toString())) {
      return office?.find((data: any) => data?.value == region_id_from_office);
    } else if ([franchise_manager_id, franchise_counsellor_id].includes(loggedInUser?.role.toString())) {
      return office?.find((data: any) => data?.value == franchise_id_from_office);
    }
    return null;
  }, [loggedInUser, office]);

  useEffect(() => {
    if (filteredOffice) {
      setOfficeType(filteredOffice);
    }
  }, [filteredOffice]);

  useEffect(() => {
    const rolesWithOfficeDisable = [
      cre_tl_id,
      cre_id,
      counsellor_id,
      regional_manager_id,
      counsellor_tl_id,
      branch_counsellor_id,
      franchise_manager_id,
      franchise_counsellor_id,
    ];

    if (rolesWithOfficeDisable.includes(loggedInUser?.role.toString())) {
      setIsOfficeDisable(true);
    }
  }, [loggedInUser]);

  const setOfficeType = (data: any) => {
    setSelectedOffice(data);

    if (data?.value?.toString() == franchise_id_from_office) {
      setIsFranchiseActive(true);
    } else if (data?.value?.toString() == region_id_from_office) {
      setActiveRegion(true);
    }

    setFormData((prev: any) => ({
      ...prev,
      office_type: data?.value,
    }));
  };
  
  const formattedCountries = useMemo(() => {
    if ([counsellor_id, country_manager_id].includes(role_id?.toString())) {
      return country?.filter((data: any) => 
        loggedUserCountries.includes(data?.value?.toString())
      ) || [];
    }
    return country || [];
  }, [country]);

  const handleUpdate = (item: any) => {
    //update source dropdown
    const updatedSource = source?.filter((source: any) => source.value == item?.source_id);
    const updatedOffice = office?.filter((office: any) => office.value == item?.office_type);
    const updatedRegion = region?.filter((region: any) => region.value == item?.region_id);

    // const updatedFlag = flags?.filter((flag: any) => flag.value == item?.flag_id);
    const updatedFlag = Array.isArray(item?.flag_details)
      ? item?.flag_details?.map((flag: any) => ({
          value: flag?.id,
          label: flag?.flag_name,
        }))
      : [];

    const updatedCtegory = leadTypes?.filter((category: any) => category.value == item?.lead_type_id);

    const updatedChannels = channels?.filter((channel: any) => channel.value == item.channel_id);

    const updatedCountry = item?.preferredCountries?.map((country: any) => ({
      value: country?.id,
      label: country?.country_name,
    }));

    const countryArray = item?.preferredCountries?.map((country: any) => country?.id);
    const flagArray = Array.isArray(item?.flag_details) ? item?.flag_details?.map((flag: any) => flag?.id) : [];

    const { value } = updatedOffice[0];
    const { franchise_id, region_id: region_id_from_item } = item;

    if (franchise_id && value == franchise_id_from_office) {
      setIsFranchiseActive(true);
      setActiveRegion(false);
      const franchiseValue = franchisees.find((item: any) => item.value == franchise_id);
      setSelectedFranchisee(franchiseValue);
    }

    if (region_id_from_item && value == region_id) {
      setActiveRegion(true);
      setIsFranchiseActive(false);
      const regionValue = regionData.find((item: any) => item.value == region_id);
      setSelectedRegion(regionValue);
    }

    setSelectedSource(updatedSource[0]);
    setSelectedOffice(updatedOffice[0]);
    // setSelectedFlag(updatedFlag[0]);
    setSelectedFlag(updatedFlag);
    setSelectedRegion(updatedRegion[0]);
    setSelectedCountry(updatedCountry);
    setSelectedCategory(updatedCtegory[0]);
    setSelectedChannel(updatedChannels[0]);

    setFormData((prev) => ({
      ...prev,
      id: item?.id || "",
      full_name: item?.full_name || "",
      email: item?.email || "",
      phone: item?.phone || "",
      lead_type_id: item?.lead_type_id || null,
      source_id: item?.source_id || "",
      channel_id: item?.channel_id || "",
      city: item?.city || "",
      preferred_country: countryArray,
      office_type: item?.office_type || "",
      updated_by: item?.updated_by || "",
      remarks: item?.remarks || "",
      lead_received_date: moment(item?.lead_received_date).format("YYYY-MM-DD") || new Date()?.toISOString().split("T")[0],
      ielts: item?.ielts || false,
      exam: item?.exam || "",
      zipcode: item?.zipcode,
      branch_id: item?.branch_id || "",
      region_id: item?.region_id || "",
      franchise_id: item?.franchise_id || "",
      // flag: item?.flag_id || "",
      flag: flagArray || [],
    }));

    setIsUpdate(true);

    if (item?.exam_details?.length) {
      setSelectExam(true);
      setLanguageForm(item?.exams);
    }

    if (item?.exam_documents?.length) {
      setSelectedFileName(item?.exam_documents);
    }

    const emptyFile = new File([], "empty.txt", {
      type: "text/plain",
    });

    if (Array.isArray(item?.exam_documents)) {
      for (let i = 0; i < item?.exam_documents.length; i++) {
        setSelectedFile((prevFile: any) => [...prevFile, emptyFile]);
      }
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let countries: any;

    if (isUpdate) {
      countries = selectedCountry?.map((data: any) => data?.value);
    }

    let selectedFlagIds = selectedFlag?.map((data: any) => data?.value) || [];

    console.log("selectedFlag", selectedFlagIds);
    let exam_details = languageForm.length ? languageForm : [];
    try {
      console.log("VAL", formData?.preferred_country);
      await validationSchema.validate(formData, { abortEarly: false });
      swal
        .fire({
          title: "Confirm Action",
          text: `Do you want to ${isUpdate ? "update" : "create"} this lead?`,
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
            if (user) {
              const { user_id } = user;
              if (isUpdate) {
                // Handle update logic
                dispatch(
                  updateLeads(
                    isAssignedLeads,
                    formData?.id,
                    formData.full_name,
                    formData.email,
                    formData.phone,
                    formData.lead_type_id,
                    formData.source_id,
                    formData.channel_id,
                    formData.city,
                    // JSON.stringify(formData.preferred_country),
                    JSON.stringify(countries),
                    formData.office_type,
                    // formData.flag ? formData.flag : null,
                    JSON.stringify(selectedFlagIds),
                    formData.region_id ? formData.region_id : null,
                    null,
                    user.role == regional_manager_id ? formData.branch_id : null,
                    user_id,
                    formData.remarks,
                    formData.lead_received_date,
                    formData.ielts,
                    formData.zipcode,
                    exam_details[0]?.exam_type ? JSON.stringify(exam_details) : null,
                    selectedFile,
                    formData.franchise_id ? formData.franchise_id : null
                  )
                );
              } else {
                dispatch(
                  addLeads(
                    isAssignedLeads,
                    formData.full_name,
                    formData.email,
                    formData.phone,
                    formData.lead_type_id,
                    formData.source_id,
                    formData.channel_id,
                    formData.city,
                    JSON.stringify([formData.preferred_country]),
                    formData.office_type,
                    // formData.flag ? formData.flag : null,
                    JSON.stringify(selectedFlagIds),
                    formData.region_id ? formData.region_id : null,
                    null,
                    null,
                    user_id,
                    formData.remarks,
                    formData.lead_received_date,
                    formData.ielts,
                    formData.zipcode,
                    exam_details[0]?.exam_type ? JSON.stringify(exam_details) : null,
                    selectedFile,
                    formData.franchise_id ? formData.franchise_id : null,
                    navigate
                  )
                );
              }
            }
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    } catch (validationError) {
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

  const handleInputChange = (e: any) => {
    const { name, value, checked } = e.target;

    if (!regrexValidation(name, value)) {
      console.error(`Invalid ${name}: ${value}`);
      return; // Stop updating if validation fails
    }

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
    // Update form data for all dropdowns except franchise_id and region_id
    if (name !== "franchise_id" && name !== "region_id") {
      setFormData((prev) => ({
        ...prev,
        [name]: selected.value,
      }));
    }

    // Handle specific dropdown selections
    switch (name) {
      case "source_id":
        setSelectedSource(selected);
        setSelectedChannel(null);
        let filteredChannel = channels.filter((data: any) => data.source_id == selected.value);
        setChannelData(filteredChannel);
        break;
      case "lead_type_id":
        setSelectedSource(null);
        setSelectedChannel(null);
        setSelectedCategory(selected);
        let filteredSource = source.filter((data: any) => data.lead_type == selected.value);
        setSourceData(filteredSource);
        break;
      case "preferred_country":
        setSelectedCountry(selected);
        break;
      case "office_type":
        const { value } = selected;
        if (value !== franchise_id_from_office && value !== region_id) {
          setFormData((prev: any) => ({
            ...prev,
            region_id: null,
            franchise_id: null,
          }));
          setIsFranchiseActive(false);
          setActiveRegion(false);
        }

        if (value == franchise_id_from_office) {
          setIsFranchiseActive(true);
          setActiveRegion(false);
        }

        if (value == region_id) {
          setActiveRegion(true);
          setIsFranchiseActive(false);
        }

        setSelectedOffice(selected);
        break;
      case "flag":
        setSelectedFlag(selected);
        break;
      case "channel_id":
        setSelectedChannel(selected);

        break;
      case "region_id":
        setSelectedRegion(selected);
        setFormData((prev: any) => ({
          ...prev,
          region_id: selected.value,
          franchise_id: null, // Reset franchise_id when region_id changes
        }));
        break;
      case "franchise_id":
        setSelectedFranchisee(selected);
        setFormData((prev: any) => ({
          ...prev,
          region_id: null, // Reset region_id when franchise_id changes
          franchise_id: selected.value,
        }));
        break;
      default:
        break;
    }
  };

  // const handleAddLanguageForm = () => {
  //   setLanguageForm((prevData) => [...prevData, { exam_type: "", marks: "" }]);
  // };

  // const handleLanguageInputChange = (index: number, e: any) => {
  //   const { name, value } = e.target;

  //   const newFields = [...languageForm];
  //   newFields[index][name] = value;
  //   setLanguageForm(newFields);
  // };

  // const handleLanguageMarkInputChange = (index: number, e: any) => {
  //   const { name, value } = e.target;

  //   const newFields = [...languageForm];
  //   newFields[index][name] = value.replace(/[^0-9]/g, "");
  //   setLanguageForm(newFields);
  // };

  // const handleRemoveLanguageForm = async (index: number, e: any, exam_type: string) => {
  //   let existExamId = languageForm[index]?.id;

  //   const payload = {
  //     id: formData?.id,
  //     exam_type: exam_type,
  //   };

  //   try {
  //     swal
  //       .fire({
  //         title: "Are you sure?",
  //         text: "This action cannot be undone.",
  //         icon: "warning",
  //         showCancelButton: true,
  //         confirmButtonColor: "#3085d6",
  //         cancelButtonColor: "#d33",
  //         confirmButtonText: "Yes, Delete",
  //       })
  //       .then((result: any) => {
  //         if (result.isConfirmed) {
  //           if (!existExamId) {
  //             const removeFields = languageForm.filter((data: any, i: number) => i !== index);
  //             const removeFiles = selectedFile.filter((data: any, i: number) => i !== index);
  //             setLanguageForm(removeFields);
  //             setSelectedFile(removeFiles);
  //           } else {
  //             axios
  //               .delete("/exams", { data: payload })
  //               .then((res: any) => {
  //                 const removeFields = languageForm.filter((data: any, i: number) => i !== index);
  //                 const removeFiles = selectedFile.filter((data: any, i: number) => i !== index);
  //                 setLanguageForm(removeFields);
  //                 setSelectedFile(removeFiles);
  //                 showSuccessAlert(res?.data?.message);
  //               })
  //               .catch((err: any) => {
  //                 console.log(err);
  //                 showErrorAlert("Error occured");
  //               });
  //           }
  //         }
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleFileChange = (index: number, e: any) => {
    let file = e.target.files[0];

    if (selectedFile.length) {
      selectedFile.splice(index, 1, file);
      setSelectedFile([...selectedFile]);
    } else {
      setSelectedFile((prevData: any) => [...prevData, file]);
    }
  };

  const handleCancelUpdate = () => {
    if (isUpdate) {
      setIsUpdate(false);
      handleResetValues();
    }
  };

  const handleResetValues = () => {
    setValidationErrors(initialValidationState); // Clear validation errors
    setFormData(initialState); //clear form data
    setSelectedCountry([]);
    setSelectedCategory(null);
    setSelectedChannel(null);
    // setSelectedOffice(null);
    setSelectedFlag(null);
    setSelectedRegion(null);
    setSelectedSource(null);
    setLanguageForm(languageFormInitialState);
    setSelectedFile([]);
    setSelectedFileName([]);
    setActiveRegion(false);
    setIsFranchiseActive(false);
    setSelectExam(false);
    if (filteredOffice) {
      setOfficeType(filteredOffice);
    } else if (loggedInUser?.role == it_team_id) {
      setOfficeType(filteredOffice);
    }
  };

  useEffect(() => {
    if (!loading && !error) {
      setModal(false);
      if (!filteredOffice) {
        setValidationErrors(initialValidationState); // Clear validation errors
        setFormData(initialState); //clear form data
      }
    }
  }, [loading, error]);

  return (
    <>
      <Modal show={modal} onHide={toggle} dialogClassName={"modal-full-width"} scrollable={scroll}>
        <Form onSubmit={onSubmit} key={"lead-form"}>
          <Modal.Header closeButton>
            <h4 className="modal-title">Lead Management</h4>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4} lg={4}>
                <Form.Group className="mb-3" controlId="channel_name">
                  <Form.Label>
                    <span className="text-danger fs-4">* </span>Full Name
                  </Form.Label>
                  <Form.Control type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} />
                  {validationErrors.full_name && <Form.Text className="text-danger">{validationErrors.full_name}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={4} lg={4}>
                <Form.Group className="mb-3 mt-1" controlId="channel_name">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="text" name="email" maxLength={100} value={formData.email} onChange={handleInputChange} />
                  {validationErrors.email && <Form.Text className="text-danger">{validationErrors.email}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={4} lg={4}>
                <Form.Group className="mb-3" controlId="phone">
                  <Form.Label>
                    <span className="text-danger fs-4">* </span>Phone
                  </Form.Label>
                  <Form.Control type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
                  {validationErrors.phone && <Form.Text className="text-danger">{validationErrors.phone}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={4} lg={4}>
                <Form.Group className="mb-3" controlId="lead_type_id">
                  <Form.Label>
                    <span className="text-danger fs-4">* </span>Lead Type
                  </Form.Label>
                  <Select
                    styles={customStyles}
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    name="lead_type_id"
                    options={leadTypes}
                    value={selectedCategory}
                    onChange={handleDropDowns}
                  />
                  {validationErrors.lead_type_id && <Form.Text className="text-danger">{validationErrors.lead_type_id}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={4} lg={4}>
                <Form.Group className="mb-3" controlId="channel_name">
                  <Form.Label>
                    <span className="text-danger fs-4">* </span>Source
                  </Form.Label>
                  <Select
                    className="react-select react-select-container"
                    styles={customStyles}
                    classNamePrefix="react-select"
                    name="source_id"
                    options={sourceData}
                    value={selectedSource}
                    onChange={handleDropDowns}
                    isDisabled={!selectedCategory}
                  />
                  {validationErrors.source_id && <Form.Text className="text-danger">{validationErrors.source_id}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={4} lg={4}>
                <Form.Group className="mb-3" controlId="channel_name">
                  <Form.Label>
                    <span className="text-danger fs-4">* </span>Channel
                  </Form.Label>
                  <Select
                    styles={customStyles}
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    name="channel_id"
                    options={channelData}
                    value={selectedChannel}
                    onChange={handleDropDowns}
                    isDisabled={!selectedSource}
                  />
                  {validationErrors.channel_id && <Form.Text className="text-danger">{validationErrors.channel_id}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={4} lg={4}>
                <Form.Group className="mb-3" controlId="channel_name">
                  <Form.Label><span className="text-danger fs-4">* </span> Country</Form.Label>
                  <Select
                    styles={customStyles}
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    name="preferred_country"
                    // options={country}
                    options={formattedCountries}
                    value={selectedCountry}
                    isMulti={isUpdate ? true : false} // Enable multi-select
                    onChange={handleDropDowns}
                  />
                  {validationErrors.preferred_country && <Form.Text className="text-danger">{validationErrors.preferred_country}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={4} lg={4}>
                <Form.Group className="mb-3 mt-1" controlId="channel_name">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control type="text" name="remarks" value={formData.remarks} onChange={handleInputChange} />
                  {validationErrors.remarks && <Form.Text className="text-danger">{validationErrors.remarks}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={4} lg={4}>
                <Form.Group className="mb-3 mt-1" controlId="channel_name">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" name="city" value={formData.city} onChange={handleInputChange} />
                  {validationErrors.city && <Form.Text className="text-danger">{validationErrors.city}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={4} lg={4}>
                <Form.Group className="mb-3 mt-1" controlId="lead_received_date">
                  <Form.Label>Lead Received Date</Form.Label>
                  <Form.Control type="date" name="lead_received_date" value={formData?.lead_received_date} onChange={handleInputChange} />
                  {validationErrors.lead_received_date && <Form.Text className="text-danger">{validationErrors.lead_received_date}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={4} lg={4}>
                <Form.Group className="mb-3 mt-1" controlId="channel_name">
                  <Form.Label>
                    Zipcode
                  </Form.Label>
                  <Form.Control maxLength={6} type="text" name="zipcode" value={formData.zipcode} onChange={handleInputChange} />
                  {validationErrors.zipcode && <Form.Text className="text-danger">{validationErrors.zipcode}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={4} lg={4}>
                <Form.Group className="mb-3 mt-1" controlId="flag">
                  <Form.Label>
                    {/* <span className="text-danger fs-4">* </span> Flag */}
                    Flag
                  </Form.Label>
                  <Select
                    styles={customStyles}
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    name="flag"
                    options={flags}
                    value={selectedFlag}
                    isMulti={true}
                    onChange={handleDropDowns}
                  />
                  {validationErrors.flag && <Form.Text className="text-danger">{validationErrors.flag}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={4} lg={4}>
                <Form.Group className="mb-3" controlId="channel_name">
                  <Form.Label>
                    <span className="text-danger fs-4">* </span>Office Type
                  </Form.Label>
                  <Select
                    styles={customStyles}
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    name="office_type"
                    options={office}
                    value={selectedOffice}
                    onChange={handleDropDowns}
                    isDisabled={isOfficeDisable}
                  />
                  {validationErrors.office_type && <Form.Text className="text-danger">{validationErrors.office_type}</Form.Text>}
                </Form.Group>
              </Col>

              {activeRegion && (
                <Col md={4} lg={4}>
                  <Form.Group className="mb-3" controlId="region_id">
                    <Form.Label>
                      <span className="text-danger fs-4">* </span>Region
                    </Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="region_id"
                      options={regionData}
                      value={selectedRegion}
                      onChange={handleDropDowns}
                    />
                    {validationErrors.region_id && <Form.Text className="text-danger">{validationErrors.region_id}</Form.Text>}
                  </Form.Group>
                </Col>
              )}

              {isFranchiseActive && (
                <Col md={4} lg={4}>
                  <Form.Group className="mb-3" controlId="franchise_id">
                    <Form.Label>
                      <span className="text-danger fs-4">* </span>Franchisee
                    </Form.Label>
                    <Select
                      styles={customStyles}
                      className="react-select react-select-container"
                      classNamePrefix="react-select"
                      name="franchise_id"
                      options={[{ value: null, label: "None" }, ...franchisees]}
                      value={selectedFranchisee}
                      onChange={handleDropDowns}
                    />
                    {validationErrors.franchise_id && <Form.Text className="text-danger">{validationErrors.franchise_id}</Form.Text>}
                  </Form.Group>
                </Col>
              )}

            </Row>
            {existLeadId &&
              <Row className="mt-2">
                <h5>
                  Lead with same email or phone already exist, check
                  <Link to={`/leads/manage/${existLeadId}`}> here</Link>
                </h5>
              </Row>
            }
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" id="button-addon2" className="mt-1 ms-2" onClick={() => [handleResetValues()]}>
              Clear
            </Button>
            <Button
              variant="danger"
              id="button-addon2"
              className="mt-1"
              onClick={() => {
                if (isUpdate) {
                  handleCancelUpdate();
                  toggle();
                  setLanguageForm(languageFormInitialState);
                  setSelectedFile([]);
                  setSelectedFileName([]);
                  handleResetValues();
                } else {
                  toggle();
                  setLanguageForm(languageFormInitialState);
                  setSelectedFile([]);
                  setSelectedFileName([]);
                  handleResetValues();
                }
              }}
            >
              {isUpdate ? "Cancel" : "Close"}
            </Button>
            <Button type="submit" variant="success" id="button-addon2" className="mt-1" disabled={loading}>
              {isUpdate ? "Update Lead" : "Create Lead"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
});

export default LeadsModal;
