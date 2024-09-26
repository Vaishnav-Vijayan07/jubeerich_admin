import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { FormInput } from "../../../../components";
import axios from "axios";
import moment from "moment";
import {
  customStyles,
  showErrorAlert,
  showSuccessAlert,
} from "../../../../constants";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import * as yup from "yup";
import { withSwal } from "react-sweetalert2";

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
};

const initialState = {
  full_name: "",
  email: "",
  phone: "",
  city: "",
  preferred_country: "",
  office_type: "",
  remarks: "",
  lead_received_date: "",
  passport_no: "",
  dob: new Date().toISOString().split("T")[0],
  gender: "",
  marital_status: "",
  nationality: "",
  secondary_number: "",
  state: "",
  country: "",
  address: "",
};

// const BasicInfo = ({
//   studentId,
//   country,
//   Countries,
//   OfficeTypes,
//   MaritalStatus,
//   basicData,
//   getBasicInfoApi,
// }: any) => {

const BasicInfo = withSwal((props: any) => {
  const {
    swal,
    studentId,
    country,
    Countries,
    OfficeTypes,
    MaritalStatus,
    basicData,
    getBasicInfoApi,
    role,
  } = props;

  const [formData, setformData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [selectedOfficeType, setSelectedOfficeType] = useState<any>(null);
  const [selectedGender, setSelectedGender] = useState<any>(null);
  const [selectedMaritialStatus, setSelectedMaritialStatus] =
    useState<any>(null);
  const animatedComponents = makeAnimated();
  const [selectedCountry, setSelectedCountry] = useState<any>([]);
  const [validationErrors, setValidationErrors] = useState(
    validationErrorsInitialState
  );

  console.log("form data =>", formData);

  const genderData: any = [
    { value: null, label: "None" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const ValidationSchema = yup.object().shape({
    full_name: yup.string().required("Name cannot be empty"),
    email: yup
      .string()
      .required("Email cannot be empty")
      .email("Enter a valid email"),
    phone: yup
      .string()
      .required("Password cannot be empty")
      .matches(/^[0-9]+$/, "Phone number must be digits only")
      .max(10, "Enter a valid phone number"),
    city: yup.string().nullable(),
    preferred_country: yup.array().of(yup.string()).nullable(),
    office_type: yup.string().required("Office Type cannot be empty"),
    remarks: yup.string().nullable(),
    lead_received_date: yup.string().required("Date required"),
    passport_no: yup.string().nullable(),
    dob: yup.string().required("DOB is required"),
    gender: yup.string().required("Gender is required"),
    marital_status: yup.string().nullable(),
    nationality: yup.string().nullable(),
    secondary_number: yup
      .string()
      .matches(/^[0-9]+$/, "Phone number must be digits only")
      .max(10, "Enter a valid phone number")
      .nullable(),
    state: yup.string().nullable(),
    country: yup.string().nullable(),
    address: yup.string().nullable(),
  });

  const getBasicInfo = () => {
    setLoading(true);
    setformData(initialState);
    axios
      .get(`getStudentBasicInfo/${studentId}`)
      .then((res) => {
        console.log("res =>", res.data);
        const countries = res?.data?.data?.preferredCountries?.map(
          (item: any) => {
            return {
              label: item?.country_name,
              value: item?.id,
            };
          }
        );
        setSelectedCountry(countries);

        const updatedOffice = OfficeTypes?.filter(
          (office: any) => office.value == res?.data?.data?.office_type
        );
        setSelectedOfficeType(updatedOffice[0]);

        const updatedGender = genderData?.filter(
          (gender: any) => gender.value == res?.data?.data?.gender
        );
        setSelectedGender(updatedGender[0]);

        const updatedMaritialStatus = MaritalStatus?.filter(
          (maritalStatus: any) =>
            maritalStatus.value == res?.data?.data?.marital_status
        );

        setSelectedMaritialStatus(updatedMaritialStatus[0]);

        const modifiedData = {
          ...res.data.data,
          preferred_country: res?.data?.data?.country_ids,
          // dob: moment(res?.data?.dob).format("YYYY-MM-DD")
          dob: moment(res?.data?.data?.dob).format("YYYY-MM-DD"),
        };
        console.log("MODIFIED DATE", modifiedData.dob);

        setformData(modifiedData);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (studentId) {
      getBasicInfo();
    }
  }, [studentId]);

  // handling input data
  const handleInputChange = (e: any) => {
    setformData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // save details api
  const saveStudentBasicInfo = async () => {
    try {
      await ValidationSchema.validate(formData, { abortEarly: false });

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
              .post("saveStudentBasicInfo", {
                passport_no: formData?.passport_no,
                dob: formData?.dob,
                gender: formData?.gender,
                marital_status: formData?.marital_status,
                user_id: studentId,
                full_name: formData?.full_name,
                email: formData?.email,
                phone: formData?.phone,
                preferred_country: formData?.preferred_country,
                office_type: formData?.office_type,
                remarks: formData?.remarks,
                nationality: formData?.nationality,
                secondary_number: formData?.secondary_number,
                state: formData?.state,
                country: formData?.country,
                address: formData?.address,
                // counsiler_id: null,
                // branch_id: formData?.,
              })
              .then((res) => {
                console.log("res: =>", res);
                setLoading(false);
                showSuccessAlert(res.data.message);
                getBasicInfoApi();
                setValidationErrors(validationErrorsInitialState);
              })
              .catch((err) => {
                console.log(err);
                setLoading(false);
                showErrorAlert("Error occured");
              });
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

  const handleDropDowns = (selected: any, { name }: any) => {
    setformData((prev) => ({
      ...prev,
      [name]: selected.value,
    }));

    switch (name) {
      case "office_type":
        setSelectedOfficeType(selected);
        break;
      case "gender":
        setSelectedGender(selected);
        break;
      case "marital_status":
        setSelectedMaritialStatus(selected);
        break;
      case "channel_id":
        // setSelectedChannel(selected);
        break;
      default:
        break;
    }
  };

  const handleSelectChange = (selectedOptions: any, actionMeta: any) => {
    if (Array.isArray(selectedOptions)) {
      setSelectedCountry(selectedOptions);
      // const selectedIdsString = selectedOptions?.map((option) => option.value).join(", ");
      const selectedIdsArray = selectedOptions?.map((option) => option.value);
      setformData((prev: any) => ({
        ...prev,
        preferred_country: selectedIdsArray,
      }));
    }
  };

  if (loading) {
    return (
      <Spinner
        animation="border"
        style={{ position: "absolute", top: "100%", left: "45%" }}
      />
    );
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
                defaultValue={formData?.full_name}
                value={formData?.full_name}
                onChange={handleInputChange}
              />
              {validationErrors.full_name && (
                <Form.Text className="text-danger">
                  {validationErrors.full_name}
                </Form.Text>
              )}
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
                value={formData.email}
                key="email"
                onChange={handleInputChange}
              />
              {validationErrors.email && (
                <Form.Text className="text-danger">
                  {validationErrors.email}
                </Form.Text>
              )}
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

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <FormInput
                type="text"
                name="city"
                placeholder="Enter city"
                key="city"
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

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="channel_name">
              <Form.Label>Preffered Country</Form.Label>
              <Select
                className="react-select react-select-container"
                classNamePrefix="react-select"
                components={animatedComponents}
                isMulti
                name="preferred_country"
                options={[{ value: null, label: "None" }, ...country]}
                value={selectedCountry}
                onChange={handleSelectChange as any}
                isDisabled={role == 7 ? true : false}
              />
              {validationErrors.preferred_country && (
                <Form.Text className="text-danger">
                  {validationErrors.preferred_country}
                </Form.Text>
              )}
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
                options={[{ value: null, label: "None" }, ...OfficeTypes]}
                value={selectedOfficeType}
                onChange={handleDropDowns}
              />
              {validationErrors.office_type && (
                <Form.Text className="text-danger">
                  {validationErrors.office_type}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
          {/* </Row>
            <Row> */}
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
                value={formData?.passport_no}
                defaultValue={formData?.passport_no}
                onChange={handleInputChange}
              />
              {validationErrors.passport_no && (
                <Form.Text className="text-danger">
                  {validationErrors.passport_no}
                </Form.Text>
              )}
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
                onChange={handleDropDowns}
              />
              {validationErrors.gender && (
                <Form.Text className="text-danger">
                  {validationErrors.gender}
                </Form.Text>
              )}
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
                options={[{ value: null, label: "None" }, ...MaritalStatus]}
                value={selectedMaritialStatus}
                onChange={handleDropDowns}
              />
              {validationErrors.marital_status && (
                <Form.Text className="text-danger">
                  {validationErrors.marital_status}
                </Form.Text>
              )}
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
                defaultValue={moment(formData?.dob).format("YYYY-MM-DD")}
                value={moment(formData?.dob).format("YYYY-MM-DD")}
                onChange={handleInputChange}
              />
              {validationErrors.dob && (
                <Form.Text className="text-danger">
                  {validationErrors.dob}
                </Form.Text>
              )}
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
                defaultValue={formData?.nationality}
                value={formData?.nationality}
                onChange={handleInputChange}
              />
              {validationErrors.nationality && (
                <Form.Text className="text-danger">
                  {validationErrors.nationality}
                </Form.Text>
              )}
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
                defaultValue={formData?.secondary_number}
                value={formData?.secondary_number}
                onChange={handleInputChange}
              />
              {validationErrors.secondary_number && (
                <Form.Text className="text-danger">
                  {validationErrors.secondary_number}
                </Form.Text>
              )}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="state">
              <Form.Label>State</Form.Label>
              <FormInput
                type="tel"
                name="state"
                placeholder="Enter state"
                key="state"
                defaultValue={formData?.state}
                value={formData?.state}
                onChange={handleInputChange}
              />
              {validationErrors.state && (
                <Form.Text className="text-danger">
                  {validationErrors.state}
                </Form.Text>
              )}
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
                defaultValue={formData?.country}
                value={formData?.country}
                onChange={handleInputChange}
              />
              {validationErrors.country && (
                <Form.Text className="text-danger">
                  {validationErrors.country}
                </Form.Text>
              )}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>

              <Form.Control
                as="textarea"
                name="address"
                placeholder="Enter address"
                key="address"
                value={formData.address}
                onChange={handleInputChange}
              />
              {validationErrors.address && (
                <Form.Text className="text-danger">
                  {validationErrors.address}
                </Form.Text>
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

          <Button
            variant="primary"
            className="mt-4"
            type="submit"
            onClick={saveStudentBasicInfo}
            disabled={loading}
          >
            Save Details
          </Button>
        </Row>
      </>
    </>
  );
});

export default BasicInfo;
