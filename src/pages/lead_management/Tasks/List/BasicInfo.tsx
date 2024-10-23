import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { FormInput } from "../../../../components";
import axios from "axios";
import moment from "moment";
import {
  baseUrl,
  customStyles,
  franchise_id_from_office,
  region_id as regionId, // Aliasing region_id to regionId
  showErrorAlert,
  showSuccessAlert,
} from "../../../../constants";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { withSwal } from "react-sweetalert2";
import validateFields from "../../../../helpers/validateHelper";
import ActionButton from "./ActionButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { refreshData } from "../../../../redux/countryReducer";

const validationErrorsInitialState = {
  full_name: "",
  email: "",
  phone: "",
  city: "",
  preferred_country: "",
  office_type: "",
  remarks: "",
  lead_received_date: "",
  passport_no: "",
  dob: "",
  gender: "",
  marital_status: "",
  nationality: "",
  secondary_number: "",
  state: "",
  country: "",
  address: "",
  emergency_contact_name: "",
  emergency_contact_relationship: "",
  emergency_contact_phone: "",
};

const genderData: any = [
  { value: null, label: "None" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const BasicInfo = withSwal((props: any) => {
  const { swal, studentId, role, officeTypes, regions, franchises, maritalStatus } = props;

  const [basicInfo, setBasicInfo] = useState<any>({
    passport_no: "",
    dob: null, // You might want to use a date type or string based on your needs
    gender: "",
    marital_status: null,
    nationality: "",
    secondary_number: "",
    state: "",
    country: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_relationship: "",
    emergency_contact_phone: "",
    concern_on_medical_condition: false,
    concern_on_medical_condition_details: "",
    criminal_offence: false,
    criminal_offence_details: "",
    errors: {},
  });

  const [policeClearenceDocs, setPoliceClearenceDocs] = useState<any>([
    {
      id: null,
      certificate: null,
      country_name: "",
    },
  ]);

  // Initial state for primaryInfo with empty/default values
  const [primaryInfo, setPrimaryInfo] = useState<any>({
    id: null,
    full_name: "",
    email: "",
    phone: "",
    city: "",
    office_type: null,
    remarks: "",
    franchise_id: null,
    region_id: null,
    errors: {},
  });

  const [loading, setLoading] = useState(false);
  const [selectedOfficeType, setSelectedOfficeType] = useState<any>(null);
  const [selectedGender, setSelectedGender] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [selectedFranchise, setSelectedFranchise] = useState<any>(null);
  const [selectedMaritialStatus, setSelectedMaritialStatus] = useState<any>(null);
  const animatedComponents = makeAnimated();
  const [selectedCountry, setSelectedCountry] = useState<any>([]);
  const [validationErrors, setValidationErrors] = useState(validationErrorsInitialState);

  const dispatch = useDispatch();
  const { refresh } = useSelector((state: RootState) => ({
    refresh: state.refreshReducer.refreshing,
  }));

  const getBasicInfo = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/basicStudentInfo/${studentId}`);
      const { primaryInfo, basicInfo: basicInfoFromApi } = data.data;

      console.log("primaryInfo =>", primaryInfo);
      console.log("basicInfo =>", basicInfoFromApi);
      const { preferredCountries, ...rest } = primaryInfo;

      setBasicInfo(basicInfoFromApi ? basicInfoFromApi : basicInfo);
      setPoliceClearenceDocs(basicInfoFromApi ? basicInfoFromApi.police_clearance_docs : policeClearenceDocs);
      setPrimaryInfo(rest);

      const countries = primaryInfo?.preferredCountries?.map((item: any) => {
        return {
          label: item?.country_name,
          value: item?.id,
        };
      });
      setSelectedCountry(countries);

      const updatedOffice = officeTypes?.filter((office: any) => office.value == primaryInfo?.office_type);

      setSelectedOfficeType(updatedOffice[0]);

      const updatedGender = genderData?.filter((gender: any) => gender.value == basicInfoFromApi?.gender);
      setSelectedGender(updatedGender[0]);

      const updatedMaritialStatus = maritalStatus?.filter((maritalStatus: any) => maritalStatus.value == basicInfoFromApi?.marital_status);

      setSelectedMaritialStatus(updatedMaritialStatus[0]);

      if (primaryInfo?.franchise_id) {
        const franchise = franchises?.filter((item: any) => item.value == primaryInfo?.franchise_id);
        setSelectedFranchise(franchise[0]);
      }

      if (primaryInfo?.region_id) {
        const region = regions?.filter((item: any) => item.value == primaryInfo?.region_id);
        setSelectedRegion(region[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      getBasicInfo();
    }
  }, [studentId, refresh]);

  // handling input data
  const handleInputChange = (e: any, field: any, type: any) => {
    const { value } = e.target;

    if (type === "basic") {
      setBasicInfo((prev: any) => ({
        ...prev,
        [field]: value,
      }));
    } else if (type === "primary") {
      setPrimaryInfo((prev: any) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handlePoliceClearenceDocs = (e: any) => {
    const { value, name } = e.target;

    const file = e.target.files ? e.target.files[0] : null;
    const [itemName, itemIndex] = name.split(".");

    console.log("itemName, itemIndex", itemName, itemIndex);

    const newPoliceClearenceDocs = [...policeClearenceDocs];
    newPoliceClearenceDocs[itemIndex] = {
      ...newPoliceClearenceDocs[itemIndex],
      [itemName]: file ? file : value,
    };

    setPoliceClearenceDocs(newPoliceClearenceDocs);
  };

  // save details api
  const saveStudentBasicInfo = async () => {
    console.log(primaryInfo);
    console.log(basicInfo);

    const basicValidationRules = {
      passport_no: { required: true },
      dob: { required: true },
      gender: { required: true },
      marital_status: { required: true },
      nationality: { required: true },
      secondary_number: { required: true },
      state: { required: true },
      country: { required: true },
      address: { required: true },
    };

    const primaryValidationRules = {
      full_name: { required: true },
      email: { required: true },
      phone: { required: true },
      city: { required: true },
      office_type: { required: true },
      remarks: { required: true },
      franchise_id: { required: primaryInfo?.office_type == 5 },
      region_id: { required: primaryInfo?.office_type == 4 },
    };

    const { isValid: primaryValid, errors: primaryErrors } = validateFields([primaryInfo], primaryValidationRules);
    const { isValid: basicValid, errors: basicErrors } = validateFields([basicInfo], basicValidationRules);

    console.log(basicErrors);
    console.log(primaryErrors);

    if (!basicValid) {
      setBasicInfo((prevState: any) => ({
        ...prevState,
        errors: basicErrors[0] || {}, // Attach errors to specific fields
      }));
    }

    if (!primaryValid) {
      setPrimaryInfo((prevState: any) => ({
        ...prevState,
        errors: primaryErrors[0] || {}, // Attach errors to specific fields
      }));
    }

    // if (!basicValid || !primaryValid) {
    //   return;
    // }

    const formData: any = new FormData();

    const { errors: errorsBasicInfo, ...withOutErrorsBasicInfo } = basicInfo;
    const { errors: errorsPrimaryInfo, ...withOutErrorsPrimaryInfo } = primaryInfo;

    console.log(policeClearenceDocs);

    policeClearenceDocs.forEach((doc: { certificate: any; country_name: any; id?: any }, index: number) => {
      // Start the index at 1
      const adjustedIndex = index + 1; // Increment the index by 1

      if (doc.certificate instanceof File) {
        // New file, so append it as a file upload
        formData.append(`police_clearance_docs[${adjustedIndex}][certificate]`, doc.certificate);
      } else {
        // Existing file path, so append it as a string
        formData.append(`police_clearance_docs[${adjustedIndex}][certificate_path]`, doc.certificate);
      }

      // Append id as adjustedIndex if it is undefined
      if (!doc.id) {
        formData.append(`police_clearance_docs[${adjustedIndex}][id]`, adjustedIndex);
      } else {
        formData.append(`police_clearance_docs[${adjustedIndex}][id]`, doc.id);
      }

      // Append associated country_name
      formData.append(`police_clearance_docs[${adjustedIndex}][country_name]`, doc.country_name);
    });

    Object.keys(withOutErrorsBasicInfo).forEach((key) => {
      formData.append(`basicInfo[${key}]`, basicInfo[key]);
    });

    Object.keys(withOutErrorsPrimaryInfo).forEach((key) => {
      formData.append(`primaryInfo[${key}]`, primaryInfo[key]);
    });

    // Append student_id separately
    formData.append("student_id", studentId);
    // Debug FormData by listing its content

    swal
      .fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save",
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios
            .post("/basicStudentInfo", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              console.log("res: =>", res);
              setLoading(false);
              showSuccessAlert(res.data.message);
              dispatch(refreshData());
              setValidationErrors(validationErrorsInitialState);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
              showErrorAlert(err);
            });
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handleDropDowns = (selected: any, { name }: any, type: "basic" | "primary") => {
    console.log(selected, name, type);

    if (type === "primary") {
      setPrimaryInfo((prev: any) => {
        let updatedPrimary = { ...prev };

        switch (name) {
          case "office_type":
            setSelectedOfficeType(selected);
            updatedPrimary.office_type = selected?.value;
            if (selected?.value === 6) {
              updatedPrimary.region_id = null;
              updatedPrimary.franchise_id = null;
            }
            break;

          case "region_id":
            setSelectedRegion(selected);
            updatedPrimary.region_id = selected?.value;
            updatedPrimary.franchise_id = null;
            break;

          case "franchise_id":
            setSelectedFranchise(selected);
            updatedPrimary.franchise_id = selected?.value;
            updatedPrimary.region_id = null;
            break;

          default:
            break;
        }

        return updatedPrimary;
      });
    } else if (type === "basic") {
      setBasicInfo((prev: any) => {
        let updatedBasic = { ...prev };

        switch (name) {
          case "marital_status":
            setSelectedMaritialStatus(selected);
            updatedBasic.marital_status = selected?.value;
            break;

          case "gender":
            setSelectedGender(selected);
            updatedBasic.gender = selected?.value;
            break;

          default:
            break;
        }

        return updatedBasic;
      });
    }
  };

  const deleteFromApi = async (id: number) => {
    const basicInfoId = basicInfo?.id;

    if (!basicInfoId) {
      console.error("Basic info ID is not available");
      return;
    }

    const result = await swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e55353",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
    });

    if (result.isConfirmed) {
      setLoading(true);

      try {
        const { data } = await axios.delete(`police_clearance_docs/${basicInfoId}`, { data: { itemId: id } });

        if (data.status) {
          showSuccessAlert(data.message);
          dispatch(refreshData());
        } else {
          showErrorAlert(data.message);
        }
      } catch (error) {
        console.error(`Error deleting document with ID ${id}:`, error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddMoreDocs = () => {
    setPoliceClearenceDocs([...policeClearenceDocs, { id: null, certificate: null, country_name: "" }]);
  };

  const handleRemoveItem = (index: number, id: number) => {
    if (id == 0) {
      setPoliceClearenceDocs((prev: any) => prev.filter((_: any, i: any) => i !== index));
    } else {
      deleteFromApi(id);
    }
  };

  if (loading) {
    return <Spinner animation="border" style={{ position: "absolute", top: "100%", left: "45%" }} />;
  }

  return (
    <>
      <>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-account-circle me-1"></i> Primary Info
        </h5>
        <Row>
          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="full_name">
              <Form.Label>
                <span className="text-danger">* </span>Full Name
              </Form.Label>
              <FormInput
                type="text"
                name="full_name"
                placeholder="Enter full name"
                key="full_name"
                value={primaryInfo?.full_name} // Change to primaryInfo
                onChange={(e) => handleInputChange(e, "full_name", "primary")}
              />
              {primaryInfo?.errors?.full_name && <Form.Text className="text-danger">{primaryInfo?.errors?.full_name}</Form.Text>}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>
                <span className="text-danger">* </span>Email Id
              </Form.Label>
              <FormInput
                type="email"
                name="email"
                placeholder="Enter email id"
                value={primaryInfo?.email} // Change to primaryInfo
                key="email"
                onChange={(e) => handleInputChange(e, "email", "primary")}
              />
              {primaryInfo?.errors?.email && <Form.Text className="text-danger">{primaryInfo?.errors?.email}</Form.Text>}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>
                <span className="text-danger">* </span>Phone Number
              </Form.Label>
              <FormInput
                type="phone"
                name="phone"
                placeholder="Enter phone number"
                key="phone"
                value={primaryInfo?.phone} // Change to primaryInfo
                onChange={(e) => handleInputChange(e, "phone", "primary")}
              />
              {primaryInfo?.errors?.phone && <Form.Text className="text-danger">{primaryInfo?.errors?.phone}</Form.Text>}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <FormInput
                type="text"
                name="city"
                placeholder="Enter city"
                key="city"
                value={primaryInfo?.city} // Change to primaryInfo
                onChange={(e) => handleInputChange(e, "city", "primary")}
              />
              {primaryInfo?.errors?.city && <Form.Text className="text-danger">{primaryInfo?.errors?.city}</Form.Text>}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="channel_name">
              <Form.Label>Preferred Country</Form.Label>
              <Select
                className="react-select react-select-container"
                classNamePrefix="react-select"
                components={animatedComponents}
                name="preferred_country"
                value={selectedCountry}
                isDisabled={true}
              />
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="office_type">
              <Form.Label>Office Type</Form.Label>
              <Select
                styles={customStyles}
                className="react-select react-select-container"
                classNamePrefix="react-select"
                name="office_type"
                options={officeTypes}
                value={selectedOfficeType}
                onChange={(selected) => handleDropDowns(selected, { name: "office_type" }, "primary")}
              />
              {primaryInfo?.errors?.office_type && <Form.Text className="text-danger">{primaryInfo?.errors?.office_type}</Form.Text>}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {primaryInfo?.office_type == Number(regionId) && (
            <Col xl={6} xxl={4}>
              <Form.Group className="mb-3" controlId="region_id">
                <Form.Label>
                  <span className="text-danger fs-4">* </span>Region
                </Form.Label>
                <Select
                  styles={customStyles}
                  className="react-select react-select-container"
                  classNamePrefix="react-select"
                  name="region_id"
                  options={regions}
                  value={selectedRegion}
                  onChange={(selected) => handleDropDowns(selected, { name: "region_id" }, "primary")}
                />
                {primaryInfo?.errors?.region_id && <Form.Text className="text-danger">{primaryInfo?.errors?.region_id}</Form.Text>}
              </Form.Group>
            </Col>
          )}

          {primaryInfo?.office_type == franchise_id_from_office && (
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
                  options={franchises}
                  value={selectedFranchise}
                  onChange={(selected) => handleDropDowns(selected, { name: "franchise_id" }, "primary")}
                />
                {primaryInfo?.errors?.franchise_id && <Form.Text className="text-danger">{primaryInfo?.errors?.franchise_id}</Form.Text>}
              </Form.Group>
            </Col>
          )}
        </Row>

        <Row>
          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="passport_no">
              <Form.Label>Passport No</Form.Label>
              <FormInput
                type="text"
                name="passport_no"
                placeholder="Enter passport number"
                key="passport_no"
                value={basicInfo?.passport_no} // Change to basicInfo
                onChange={(e) => handleInputChange(e, "passport_no", "basic")}
              />
              {basicInfo?.errors?.passport_no && <Form.Text className="text-danger">{basicInfo?.errors?.passport_no}</Form.Text>}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="gender">
              <Form.Label>
                <span className="text-danger">*</span> Gender
              </Form.Label>
              <Select
                styles={customStyles}
                className="react-select react-select-container"
                classNamePrefix="react-select"
                name="gender"
                options={genderData}
                value={selectedGender}
                onChange={(selected) => handleDropDowns(selected, { name: "gender" }, "basic")}
              />
              {basicInfo?.errors?.gender && <Form.Text className="text-danger">{basicInfo?.errors?.gender}</Form.Text>}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="marital_status">
              <Form.Label>Marital Status</Form.Label>
              <Select
                className="react-select react-select-container"
                classNamePrefix="react-select"
                name="marital_status"
                styles={customStyles}
                options={maritalStatus}
                value={selectedMaritialStatus}
                onChange={(selected) => handleDropDowns(selected, { name: "marital_status" }, "basic")}
              />
              {basicInfo?.errors?.marital_status && <Form.Text className="text-danger">{basicInfo?.errors?.marital_status}</Form.Text>}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="dob">
              <Form.Label>
                <span className="text-danger">*</span> Date of Birth
              </Form.Label>
              <FormInput
                type="date"
                name="dob"
                placeholder="Select date of birth"
                key="dob"
                value={basicInfo?.dob ? moment(basicInfo.dob).format("YYYY-MM-DD") : ""} // Change to basicInfo
                onChange={(e) => handleInputChange(e, "dob", "basic")}
              />
              {basicInfo?.errors?.dob && <Form.Text className="text-danger">{basicInfo?.errors?.dob}</Form.Text>}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="nationality">
              <Form.Label>Nationality</Form.Label>
              <FormInput
                type="text"
                name="nationality"
                placeholder="Enter nationality"
                key="nationality"
                value={basicInfo?.nationality} // Change to basicInfo
                onChange={(e) => handleInputChange(e, "nationality", "basic")}
              />
              {basicInfo?.errors?.nationality && <Form.Text className="text-danger">{basicInfo?.errors?.nationality}</Form.Text>}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="secondary_number">
              <Form.Label>Secondary number</Form.Label>
              <FormInput
                type="tel"
                name="secondary_number"
                placeholder="Enter secondary number"
                key="secondary_number"
                value={basicInfo?.secondary_number} // Change to basicInfo
                onChange={(e) => handleInputChange(e, "secondary_number", "basic")}
              />
              {basicInfo?.errors?.secondary_number && <Form.Text className="text-danger">{basicInfo?.errors?.secondary_number}</Form.Text>}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="state">
              <Form.Label>State</Form.Label>
              <FormInput
                type="text"
                name="state"
                placeholder="Enter state"
                key="state"
                value={basicInfo?.state} // Change to basicInfo
                onChange={(e) => handleInputChange(e, "state", "basic")}
              />
              {basicInfo?.errors?.state && <Form.Text className="text-danger">{basicInfo?.errors?.state}</Form.Text>}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="country">
              <Form.Label>Country</Form.Label>
              <FormInput
                type="text"
                name="country"
                placeholder="Enter country"
                key="country"
                value={basicInfo?.country} // Change to basicInfo
                onChange={(e) => handleInputChange(e, "country", "basic")}
              />
              {basicInfo?.errors?.country && <Form.Text className="text-danger">{basicInfo?.errors?.country}</Form.Text>}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Current Address</Form.Label>

              <Form.Control
                as="textarea"
                name="address"
                placeholder="Enter address"
                key="address"
                value={basicInfo?.address}
                onChange={(e) => handleInputChange(e, "address", "basic")}
              />
              {basicInfo?.errors?.address && <Form.Text className="text-danger">{basicInfo?.errors?.address}</Form.Text>}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="emergency_contact_name">
              <Form.Label>Primary Contact Name</Form.Label>

              <Form.Control
                type="text"
                name="emergency_contact_name"
                placeholder="Enter Primary Contact Name"
                key="emergency_contact_name"
                value={basicInfo?.emergency_contact_name}
                onChange={(e) => handleInputChange(e, "emergency_contact_name", "basic")}
              />
              {basicInfo?.errors?.emergency_contact_name && (
                <Form.Text className="text-danger">{basicInfo?.errors?.emergency_contact_name}</Form.Text>
              )}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="emergency_contact_relationship">
              <Form.Label>Primary Contact Relationship</Form.Label>

              <Form.Control
                as="select"
                name="emergency_contact_relationship"
                key="emergency_contact_relationship"
                value={basicInfo?.emergency_contact_relationship}
                onChange={(e) => handleInputChange(e, "emergency_contact_relationship", "basic")}
              >
                <option value="" disabled>
                  Select Primary Contact Relationship
                </option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Spouse">Spouse</option>
              </Form.Control>
              {basicInfo?.errors?.emergency_contact_relationship && (
                <Form.Text className="text-danger">{basicInfo?.errors?.emergency_contact_relationship}</Form.Text>
              )}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="emergency_contact_phone">
              <Form.Label>Primary Contact Phone</Form.Label>

              <Form.Control
                type="text"
                name="emergency_contact_phone"
                placeholder="Enter Primary Contact Phone"
                key="emergency_contact_phone"
                value={basicInfo?.emergency_contact_phone}
                onChange={(e) => handleInputChange(e, "emergency_contact_phone", "basic")}
              />
              {basicInfo?.errors?.emergency_contact_phone && (
                <Form.Text className="text-danger">{basicInfo?.errors?.emergency_contact_phone}</Form.Text>
              )}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="remarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                name="remarks"
                placeholder="Enter remarks"
                key="remarks"
                value={primaryInfo?.remarks}
                onChange={(e) => handleInputChange(e, "remarks", "primary")}
              />
              {primaryInfo?.errors?.remarks && <Form.Text className="text-danger">{primaryInfo?.errors?.remarks}</Form.Text>}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Row>
            <h5 className="mb-2 text-uppercase"> Medical Declarations</h5>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Are there any medical conditions or health concerns that we should be aware of? This information is necessary for regulatory
                  compliance and will be treated with the utmost confidentiality
                </Form.Label>
                <div>
                  <Form.Check
                    inline
                    label="Yes"
                    type="radio"
                    name="concern_on_medical_condition"
                    value="yes"
                    checked={basicInfo?.concern_on_medical_condition === true}
                    onChange={() =>
                      setBasicInfo((prev: any) => ({
                        ...prev,
                        concern_on_medical_condition: true,
                      }))
                    }
                  />
                  <Form.Check
                    inline
                    label="No"
                    type="radio"
                    name="concern_on_medical_condition"
                    value="no"
                    checked={basicInfo?.concern_on_medical_condition === false}
                    onChange={() =>
                      setBasicInfo((prev: any) => ({
                        ...prev,
                        concern_on_medical_condition: false,
                      }))
                    }
                  />
                </div>
              </Form.Group>
            </Col>
            {/* {basicInfo?.concern_on_medical_condition && ( */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Please provide details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  name="concern_on_medical_condition_details"
                  placeholder="Enter details"
                  key="concern_on_medical_condition_details"
                  value={basicInfo?.concern_on_medical_condition_details}
                  onChange={(e) => handleInputChange(e, "concern_on_medical_condition_details", "basic")}
                />
              </Form.Group>
            </Col>
            {/* )} */}
          </Row>
        </Row>

        <Row className="mt-2">
          <Row>
            <h5 className="mb-2 text-uppercase">Police Clearence Details</h5>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Have you ever been convicted of a criminal offense? This information is necessary for regulatory compliance and will be treated with
                  the utmost confidentiality
                </Form.Label>
                <div>
                  <Form.Check
                    inline
                    label="Yes"
                    type="radio"
                    name="criminal_offence"
                    value="yes"
                    checked={basicInfo?.criminal_offence === true}
                    onChange={() =>
                      setBasicInfo((prev: any) => ({
                        ...prev,
                        criminal_offence: true,
                      }))
                    }
                  />
                  <Form.Check
                    inline
                    label="No"
                    type="radio"
                    name="criminal_offence"
                    value="no"
                    checked={basicInfo?.criminal_offence === false}
                    onChange={() =>
                      setBasicInfo((prev: any) => ({
                        ...prev,
                        criminal_offence: false,
                      }))
                    }
                  />
                </div>
              </Form.Group>
            </Col>
            {/* {basicInfo?.criminal_offence && ( */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Please provide details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  name="criminal_offence_details"
                  placeholder="Enter details"
                  key="criminal_offence_details"
                  value={basicInfo?.criminal_offence_details}
                  onChange={(e) => handleInputChange(e, "criminal_offence_details", "basic")}
                />
              </Form.Group>
            </Col>
            {/* )} */}
          </Row>
        </Row>

        <Row className="mt-2">
          <Row>
            <Form.Label className="mb-2 ">
              Can you provide Police Clearance Certificate from all those countries (including GCC, Middle East countries) where you lived more than 6
              months in the past 10 years, if applicable?
            </Form.Label>
          </Row>

          {policeClearenceDocs?.map((certificate: any, index: any) => (
            <React.Fragment key={index}>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country Name</Form.Label>
                  <Form.Control
                    type="text"
                    name={`country_name.${index}`}
                    placeholder="Enter Country Name"
                    value={certificate.country_name || ""}
                    onChange={handlePoliceClearenceDocs}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="">
                  <Form.Label>Upload Certificate</Form.Label>
                  <Form.Control type="file" name={`certificate.${index}`} onChange={handlePoliceClearenceDocs} />

                  {console.log(certificate)}
                  {console.log(typeof certificate.certificate)}
                  {certificate.certificate && typeof certificate.certificate === "string" && (
                    <div className="d-flex align-items-center">
                      <i className="mdi mdi-eye text-primary me-2"></i>
                      <a
                        href={`${baseUrl}/uploads/policeClearenceDocuments/${certificate.certificate}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        Download Document
                      </a>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <ActionButton
                label="Remove"
                onClick={() => handleRemoveItem(index, certificate?.id ?? 0)}
                iconClass="mdi mdi-delete"
                colorClass="text-danger"
              />
            </React.Fragment>
          ))}

          <Row>
            <ActionButton label="Add More" onClick={handleAddMoreDocs} iconClass="mdi mdi-plus" />
          </Row>
        </Row>

        <Row>
          <Button variant="primary" className="mt-4" type="submit" onClick={saveStudentBasicInfo} disabled={loading}>
            Save Details
          </Button>
        </Row>
      </>
    </>
  );
});

export default BasicInfo;