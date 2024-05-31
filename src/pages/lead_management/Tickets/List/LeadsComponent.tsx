import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Row, Col } from "react-bootstrap";
import * as yup from "yup";
import { withSwal } from "react-sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { FormInput } from "../../../../components";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { addLeads, updateLeads } from "../../../../redux/actions";
import { Country } from "country-state-city";
import { OptionType, initialState, initialValidationState } from "./leadsData";
import LeadTable from "./LeadTable";
import { RootState } from "../../../../redux/store";
import { ModalComponent } from "./ModalComponent";
import axios from "axios";
import { APICore } from "../../../../helpers/api/apiCore";
import DatePicker from "react-datepicker";
import moment from "moment";

// Function to convert country data
const convertCountryData = () => {
  const countries = Country.getAllCountries();

  const formattedCountries = countries.map((country) => ({
    label: country.name,
    value: country.name,
  }));

  return formattedCountries;
};

const LeadCompontents = withSwal((props: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const dispatch = useDispatch();

  const api = new APICore();
  const loggedInUser = api.getLoggedInUser();
  const { leadsData, CategoryData, ChannelData, SourceData, BranchData, statusData, UsersData, FlagData } = props;
  const [standard, setStandard] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState([]);

  //formatt country data
  const formattedCountryData = convertCountryData();

  //Fetch branch_id from redux store
  const branch_id = useSelector((state: RootState) => state?.Branches?.branch_id);
  //States
  const [formData, setFormData] = useState(initialState);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<OptionType | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<OptionType | null>(null);
  const [selectedSource, setSelectedSource] = useState<OptionType | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<OptionType | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(null);
  const [selectedFlag, setSelectedFlag] = useState<OptionType | null>(null);
  const [validationErrors, setValidationErrors] = useState(initialValidationState);
  const [modal, setModal] = useState<boolean>(false);
  const [className, setClassName] = useState<string>("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);

  const [alternatePhoneNumber, setAlternatePhoneNumber] = useState("");
  const [ogPhoneNumber, setOgPhoneNumber] = useState("");
  const [alternatePhoneNumberError, setAlternatePhoneNumberError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<OptionType | null>(null);

  //toggle modal
  const toggle = () => {
    setModal(!modal);
    if (isUpdate) {
      handleClearForm();
      setIsUpdate(false);
    }
  };

  // Opens modal with custom class
  const openModalWithClass = (className: string) => {
    setClassName(className);
    toggle();
  };

  console.log("formData", formData);

  // form validation schema
  const validationSchema = yup.object().shape({
    // phone: yup.string().nullable().required("Phone number is required"),
    phone: yup
      .string()
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(5, "Please enter atleast 5 digits"),
    // category_id: yup.string().nullable().required("Category is required"),
    source_id: yup.string().nullable().required("Source is required"),
    channel_id: yup.string().nullable().required("Channel is required"),
    lead_received_date: yup.string().nullable().required("Lead received date is required"),
    // branch: yup.string().nullable().required("Branch is required"),
  });

  const phoneValidationSchema = yup
    .string()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(5, "");

  const branchId = useSelector((state: RootState) => state?.Branches?.branch_id);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    let sanitizedValue = value.replace(/[0-9]/g, ""); // Allow only text (non-numeric) input
    setFormData((prevData) => ({
      ...prevData,
      [name]: name == "name" || name == "enquiry" ? sanitizedValue : value,
    }));
  };

  const handleClearForm = () => {
    setFormData(initialState);
    setSelectedBranch(null);
    setSelectedCategory(null);
    setSelectedChannel(null);
    setSelectedCountry(null);
    setSelectedSource(null);
    setSelectedUser(null);
    setSelectedFlag(null);
    setPhoneNumber("");
    setAlternatePhoneNumber("");

    setPhoneNumberError(null);
    setAlternatePhoneNumberError(null);
    setValidationErrors(initialValidationState);
    setSelectedDate(null);
  };

  const handleSelectChange = (selected: any, fieldName: string) => {
    switch (fieldName) {
      case "category_id":
        setSelectedCategory(selected);
        break;
      case "source_id":
        setSelectedSource(selected);
        break;
      case "channel_id":
        setSelectedChannel(selected);
        break;
      case "branch":
        setSelectedBranch(selected);
        break;
      case "country":
        setSelectedCountry(selected);
        break;
      case "user_id":
        setSelectedUser(selected);
        break;
      case "flag_id":
        setSelectedFlag(selected);
        break;
      default:
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [`${fieldName}`]: selected.value,
    }));
  };

  const handleUpdate = (item: any) => {
    // Define a generic function to update the selected option
    const updateSelectedOption = (data: OptionType[] | undefined, itemValue: any, setSelected: React.Dispatch<React.SetStateAction<OptionType | null>>) => {
      const updatedOption: OptionType | null = data?.find((option) => option.value == itemValue) || null;
      setSelected(updatedOption);
    };

    // Update each dropdown using the generic function
    updateSelectedOption(formattedCountryData, item.country, setSelectedCountry);
    updateSelectedOption(CategoryData, item.category_id, setSelectedCategory);
    updateSelectedOption(SourceData, item.source_id, setSelectedSource);
    updateSelectedOption(ChannelData, item.channel_id, setSelectedChannel);
    updateSelectedOption(BranchData, item.branch, setSelectedBranch);
    updateSelectedOption(UsersData, item.user_id, setSelectedUser);
    updateSelectedOption(FlagData, item.flag_id, setSelectedFlag);
    setPhoneNumber(item?.phone);
    setOriginalPhoneNumber(item?.phone);
    setAlternatePhoneNumber(item?.alternate_phone);
    setOgPhoneNumber(item?.alternate_phone);
    setSelectedDate(item?.lead_received_date);

    // Update the form data and other state as needed
    setFormData({
      id: item?.id,
      name: item?.name,
      email: item.email,
      phone: item.phone,
      alternate_phone: item.alternate_phone,
      enquiry: item.enquiry,
      status: item.status,
      category_id: item.category_id,
      source_id: item.source_id,
      channel_id: item.channel_id,
      user_id: item.user_id,
      branch: item.branch,
      proposal_no: item.proposal_no,
      proposal_amount: item.proposal_amount,
      proposal: item.proposal,
      company_name: item.company_name,
      country: item.country,
      flag_id: item.flag_id,
      lead_received_date: item.lead_received_date,
    });

    setIsUpdate(true);
  };

  //submitting the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      await phoneValidationSchema.validate(phoneNumber);

      // Validation passed, handle form submission
      if (isUpdate) {
        // Handle update logic
        dispatch(
          updateLeads(
            formData.id,
            formData.name,
            formData.email,
            formData.phone,
            formData.alternate_phone,
            formData.enquiry,
            formData.status,
            formData.category_id,
            formData.source_id,
            formData.channel_id,
            formData.user_id,
            // formData.branch,
            branchId,
            formData.proposal_no,
            formData.proposal_amount,
            formData.proposal,
            formData.company_name,
            formData.country,
            formData.flag_id,
            branch_id,
            formData.lead_received_date
          )
        );
        setIsUpdate(false);
      } else {
        // Handle add logic
        dispatch(
          addLeads(
            formData.name,
            formData.email,
            formData.phone,
            formData.alternate_phone,
            formData.enquiry,
            formData.status,
            formData.category_id,
            formData.source_id,
            formData.channel_id,
            formData.user_id,
            // formData.branch,
            branchId,
            formData.proposal_no,
            formData.proposal_amount,
            formData.proposal,
            formData.company_name,
            formData.country,
            formData.flag_id,
            branch_id,
            formData.lead_received_date
          )
        );
      }

      handleClearForm();

      //close modal
      toggle();

      // ... Rest of the form submission logic ...
    } catch (validationError) {
      // Handle validation errors
      console.log("validationError", validationError);
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

  const validatePhoneNumber = async (numberType: any, phone: any) => {
    try {
      // await phoneValidationSchema.validate(phone);
      const response = await axios.get(`/leads/check-mobilenumber/${phone}`);

      if (response?.data.status) {
        // Phone number is valid
        if (numberType === "primary") {
          setPhoneNumberError("");
          setFormData((prev) => ({
            ...prev,
            phone: phone,
          }));
        } else if (numberType === "alternate") {
          setAlternatePhoneNumberError("");
          setFormData((prev) => ({
            ...prev,
            alternate_phone: phone,
          }));
        }
      } else {
        // Phone number is not valid
        if (numberType === "primary") {
          setPhoneNumberError(response.data.message);
          setValidationErrors((prev) => ({
            ...prev,
            phone: "",
          }));
        } else if (numberType === "alternate") {
          setAlternatePhoneNumberError(response.data.message);
          console.log("response.data.message", response.data.message);

          setValidationErrors((prev) => ({
            ...prev,
            alternate_phone: "",
          }));
        }
      }
    } catch (error) {
      // Error occurred while validating
      return false;
    }
  };

  useEffect(() => {
    if (phoneNumber && phoneNumber !== originalPhoneNumber) {
      validatePhoneNumber("primary", phoneNumber);
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (alternatePhoneNumber && alternatePhoneNumber !== ogPhoneNumber) {
      validatePhoneNumber("alternate", alternatePhoneNumber);
    }
  }, [alternatePhoneNumber]);

  useEffect(() => {
    if (!loggedInUser.power_names?.includes("Add Leads", "Monitor")) {
      const userId = UsersData?.filter((item: any) => loggedInUser.user_id == item.value)[0];
      setFormData((prev) => ({
        ...prev,
        user_id: userId?.value,
      }));

      const selectedUser = UsersData?.filter((item: any) => loggedInUser.user_id == item.value)[0];
      setSelectedUser(selectedUser);
    }
  }, [UsersData]);

  // console.log("loggedInUser", loggedInUser);

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    setFormData((prev) => ({
      ...prev,
      lead_received_date: moment(date).format("YYYY-MM-DD"),
    }));
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={() => openModalWithClass("modal-right")}>
            <i className="mdi mdi-plus-circle"></i> Add Leads
          </Button>
          <h4 className="header-title mb-4">Manage Leads</h4>

          <LeadTable
            handleUpdate={handleUpdate}
            statusData={statusData}
            openModalWithClass={openModalWithClass}
            leadsData={leadsData}
            UsersData={UsersData}
            setStandard={setStandard}
            setSelectedLead={setSelectedLead}
          />

          <Modal show={modal} onHide={toggle} dialogClassName={className}>
            <h6 className="fw-medium px-3 m-0 py-2 font-13 text-uppercase bg-light">
              <span className="d-block py-1">Lead Manaement</span>
            </h6>
            <Modal.Body>
              <div className="alert alert-warning" role="alert">
                <strong>Hello {loggedInUser?.name},</strong> Enter the lead details .
              </div>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <FormInput label="Name" type="text" name="name" placeholder="Enter name" value={formData.name} onChange={handleInputChange} />
                      {validationErrors.name && <Form.Text className="text-danger">{validationErrors.name}</Form.Text>}
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3">
                      <FormInput label="Email address" type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleInputChange} />
                      {validationErrors.email && <Form.Text className="text-danger">{validationErrors.email}</Form.Text>}
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Label>
                        Phone Number <span className="text-danger">*</span>
                      </Form.Label>
                      <FormInput
                        type="tel"
                        name="phone"
                        placeholder="Enter phone"
                        value={phoneNumber}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/[^0-9-]/g, "");
                          setPhoneNumber(inputValue);
                        }}
                      />
                      {phoneNumberError && <Form.Text className="text-danger">{phoneNumberError}</Form.Text>}
                      {validationErrors.phone && <Form.Text className="text-danger">{validationErrors.phone}</Form.Text>}
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Label>Alternate Phone Number</Form.Label>
                      <FormInput
                        type="tel"
                        name="phone"
                        placeholder="Enter phone"
                        value={alternatePhoneNumber}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/[^0-9-]/g, "");
                          setAlternatePhoneNumber(inputValue);
                        }}
                      />
                      {alternatePhoneNumberError && <Form.Text className="text-danger">{alternatePhoneNumberError}</Form.Text>}
                      {validationErrors.alternate_phone && <Form.Text className="text-danger">{validationErrors.alternate_phone}</Form.Text>}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <FormInput label="Enquiry" type="text" name="enquiry" placeholder="Enter enquiry" value={formData.enquiry} onChange={handleInputChange} />
                      {validationErrors.enquiry && <Form.Text className="text-danger">{validationErrors.enquiry}</Form.Text>}
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3">
                      <FormInput label="Company name" type="text" name="company_name" placeholder="Enter details" value={formData.company_name} onChange={handleInputChange} />
                      {validationErrors.company_name && <Form.Text className="text-danger">{validationErrors.company_name}</Form.Text>}
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Group controlId="country">
                        <Form.Label>Country</Form.Label>
                        <Select
                          className="react-select react-select-container"
                          name="country"
                          classNamePrefix="react-select"
                          options={formattedCountryData}
                          value={selectedCountry}
                          // onChange={handleCountryChange}
                          onChange={(e) => handleSelectChange(e, "country")}
                        />
                        {validationErrors.country && <Form.Text className="text-danger">{validationErrors.country}</Form.Text>}
                      </Form.Group>
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Group controlId="flag_id">
                        <Form.Label>Flags</Form.Label>
                        <Select
                          className="react-select react-select-container"
                          name="flag_id"
                          classNamePrefix="react-select"
                          options={FlagData}
                          value={selectedFlag}
                          // onChange={handleFlagChange}
                          onChange={(e) => handleSelectChange(e, "flag_id")}
                        />
                        {validationErrors.flag_id && <Form.Text className="text-danger">{validationErrors.flag_id}</Form.Text>}
                      </Form.Group>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Group controlId="category_id">
                        <Form.Label>Category</Form.Label>
                        <Select
                          className="react-select react-select-container"
                          name="category_id"
                          classNamePrefix="react-select"
                          options={CategoryData}
                          value={selectedCategory}
                          // onChange={handleSelectChange}
                          onChange={(e) => handleSelectChange(e, "category_id")}
                        />
                        {validationErrors.category_id && <Form.Text className="text-danger">{validationErrors.category_id}</Form.Text>}
                      </Form.Group>
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Group controlId="source_id">
                        <Form.Label>
                          Source <span className="text-danger">*</span>
                        </Form.Label>
                        <Select
                          className="react-select react-select-container"
                          classNamePrefix="react-select"
                          name="source_id"
                          options={SourceData}
                          value={selectedSource}
                          // onChange={handleSourceChange}
                          onChange={(e) => handleSelectChange(e, "source_id")}
                        />
                        {validationErrors.source_id && <Form.Text className="text-danger">{validationErrors.source_id}</Form.Text>}
                      </Form.Group>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Group controlId="channel_id">
                        <Form.Label>
                          Channel <span className="text-danger">*</span>
                        </Form.Label>
                        <Select
                          className="react-select react-select-container"
                          name="channel_id"
                          classNamePrefix="react-select"
                          options={ChannelData}
                          value={selectedChannel}
                          // onChange={handleChannelChange}
                          onChange={(e) => handleSelectChange(e, "channel_id")}
                        />
                        {validationErrors.channel_id && <Form.Text className="text-danger">{validationErrors.channel_id}</Form.Text>}
                      </Form.Group>
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Group controlId="user_id">
                        <Form.Label>Users</Form.Label>
                        <Select
                          className="react-select react-select-container"
                          name="user_id"
                          classNamePrefix="react-select"
                          options={UsersData}
                          value={selectedUser}
                          // onChange={handleUserChange}
                          onChange={(e) => handleSelectChange(e, "user_id")}
                          isDisabled={loggedInUser.power_names?.includes("Add Leads", "Monitor") ? false : true}
                        />

                        {validationErrors.user_id && <Form.Text className="text-danger">{validationErrors.user_id}</Form.Text>}
                      </Form.Group>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Group controlId="lead_received_date">
                        <Form.Label>
                          Lead Received date <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="w-100 lead-date-picker">
                          <DatePicker selected={selectedDate} onChange={handleDateChange} placeholderText="Choose a date" className="w-100" />
                        </div>

                        {validationErrors.lead_received_date && <Form.Text className="text-danger">{validationErrors.lead_received_date}</Form.Text>}
                      </Form.Group>
                    </div>
                  </Col>
                </Row>

                <div className="text-end">
                  <Button variant="danger" className="waves-effect waves-light me-1" onClick={() => [toggle(), handleClearForm()]}>
                    close
                  </Button>
                  <Button variant="success" type="submit" className="waves-effect waves-light">
                    Submit
                  </Button>
                </div>

                <div className="mb-3"></div>
                <div className="mb-3"></div>
              </Form>
            </Modal.Body>
          </Modal>

          <ModalComponent setStandard={setStandard} standard={standard} selectedLead={selectedLead} />
        </Card.Body>
      </Card>
    </>
  );
});

export default LeadCompontents;
