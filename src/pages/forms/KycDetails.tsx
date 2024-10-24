import React, { useEffect, useMemo, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { Accordion, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import profileImg from "../../assets/images/users/user-2.jpg";
import { Link, useParams } from "react-router-dom";
import { icons } from "../../assets/images/icons";
import axios from "axios";
import moment from "moment";
import { fdValue, fundTypeOptions, savingsValue } from "../lead_management/Tasks/List/FundPlan/FundPlanRows";
import { Visa_Types } from "../lead_management/Tasks/List/data";
import { showErrorAlert } from "../../constants";

const KycDetails = () => {
  const { id } = useParams();
  console.log('id', id);

  const fields = [
    { label: "Student Name", value: "Geneva D. McKnight" },
    { label: "Mobile", value: "(123) 123 1234" },
    { label: "Email", value: "user@email.domain" },
    { label: "DOB", value: "16/02/1994" },
    { label: "Current Address", value: "123 Maple Street, Springfield, IL 62704" },
    { label: "Primary Point of Contact", value: "Father - James McKnight" },
    { label: "Marital Status", value: "Single" },
    { label: "Source of Lead", value: "Online Ad" },
    { label: "Preferred Course", value: "Master of Business Administration (MBA)" },
    { label: "Preferred Institute", value: "Harvard Business School" },
    { label: "Intake Applying For", value: "Fall 2025" },
    { label: "Course Link", value: "https://www.harvard.edu/mba" },
    { label: "Counselor Name", value: "Sarah Johnson" },
    { label: "Branch", value: "Chicago Branch" },
    { label: "New/Duplicate Application", value: "New Application" },
  ];

  const passportFields = [
    { label: "Number of passport/s", value: "2" },
    { label: "Passport Number/s", value: "A12345678, B98765432" },
    { label: "Date/s of expiry", value: "01/01/2025, 15/06/2024" },
    { label: "Do you have all your original passports in hand?", value: "Yes" },
    { label: "If not, reason for the same", value: "N/A" },
    { label: "Any visa stamping/ immigration history in the current and previous passport?", value: "Yes" },
    { label: "Name change (if any) when compared to other documents", value: "No" },
  ];

  const familyFields = [
    { label: "Father’s Name", value: "John McKnight" },
    { label: "Occupation of Father", value: "Engineer" },
    { label: "Nature of Occupation", value: "Self-employed" },
    { label: "Name of the Organization/ Business", value: "Tech Solutions" },
    { label: "Annual Income of Father", value: "$80,000" },
    { label: "Income Tax payee or not?", value: "Yes" },
    { label: "Mother’s Name", value: "Jane McKnight" },
    { label: "Occupation of Mother", value: "Teacher" },
    { label: "Nature of Occupation", value: "Salaried" },
    { label: "Name of the Organization/ Business", value: "Springfield High School" },
    { label: "Annual Income of Mother", value: "$50,000" },
    { label: "Income Tax payee or not?", value: "Yes" },
    { label: "No. of Siblings", value: "2" },
    { label: "Occupation of Siblings", value: "Doctor, Artist" },
    { label: "Annual Income of Siblings", value: "$100,000, $30,000" },
    { label: "Income Tax payee or not?", value: "Yes, No" },
    { label: "If Married, Name of Spouse", value: "Michael Smith" },
    { label: "Occupation of Spouse", value: "Consultant" },
    { label: "Name of the company in which your Spouse is currently working", value: "Global Corp" },
    { label: "Location in which your Spouse is working", value: "New York, NY" },
    { label: "Annual income of spouse", value: "$90,000" },
    { label: "Income Tax payee or not?", value: "Yes" },
    { label: "Is your spouse accompanying along with you during studies?", value: "Yes" },
    { label: "No. of children, Gender and their age", value: "1, Male, 5 years" },
    { label: "No. of Siblings", value: "2" },
    { label: "Are your kids accompanying along with you during studies?", value: "No" },
    { label: "Do you have any relatives/friends from Govt. service, Police, Political party, Media?", value: "Yes" },
  ];

  const qualifications = [
    {
      level: "10th Std",
      college: "Springfield High School",
      startDate: "01/09/2005",
      endDate: "31/05/2006",
      percentage: "85%",
    },
    {
      level: "12th Std",
      college: "Springfield College",
      startDate: "01/09/2007",
      endDate: "31/05/2008",
      percentage: "88%",
    },
    {
      level: "Bachelor's Degree",
      college: "State University",
      startDate: "01/09/2009",
      endDate: "31/05/2013",
      percentage: "75%",
    },
    {
      level: "Master's Degree",
      college: "National University",
      startDate: "01/09/2014",
      endDate: "31/05/2016",
      percentage: "90%",
    },
  ];

  const gaps = [
    {
      period: "01/06/2006 - 31/08/2007",
      reason: "Family Relocation",
      documents: "Relocation Letter",
    },
    {
      period: "01/06/2013 - 31/08/2014",
      reason: "Health Issues",
      documents: "Medical Certificates",
    },
  ];

  const experiences = [
    {
      company: "Tech Solutions Inc.",
      startDate: "01/01/2018",
      endDate: "31/12/2020",
      designation: "Software Engineer",
      certificateAvailable: "Yes",
      bankStatementAttached: "Yes",
    },
    {
      company: "Creative Designs Ltd.",
      startDate: "01/02/2021",
      endDate: "31/08/2023",
      designation: "Senior Designer",
      certificateAvailable: "Yes",
      bankStatementAttached: "No",
    },
  ];

  const otherWorkInformationFields = [
    {
      label: "Have you served notice period as per the requirement of your employer during your last resignation?",
      value: "Yes",
    },
    { label: "Did you get terminated from any organization/company?", value: "No" },
    { label: "Are you in very good and friendly relation with all of your previous/current employers?", value: "Yes" },
    { label: "Is there any forged experience or any other documents submitted to us?", value: "No" },
    {
      label:
        "For any abroad work experiences do you still have the visa page, permit card, salary account statement and all other supporting evidences to prove the same?",
      value: "Yes",
    },
  ];

  const financialDetails = [
    {
      typeOfFunds: "Education loan",
      ownOrSponsored: "Sponsored",
      relationWithSponsor: "Father",
      sponsorshipAmount: "$20,000",
      bankName: "ABC Bank",
    },
    {
      typeOfFunds: "Savings",
      ownOrSponsored: "Own",
      relationWithSponsor: "N/A",
      sponsorshipAmount: "$5,000",
      bankName: "XYZ Bank",
    },
    {
      typeOfFunds: "Fixed Deposit (FD)",
      ownOrSponsored: "Sponsored",
      relationWithSponsor: "Uncle",
      sponsorshipAmount: "$10,000",
      bankName: "DEF Bank",
    },
    {
      typeOfFunds: "Salary",
      ownOrSponsored: "Own",
      relationWithSponsor: "N/A",
      sponsorshipAmount: "$15,000",
      bankName: "GHI Bank",
    },
  ];

  const previousVisaDecline = [
    {
      countryName: "United Kingdom",
      courseAndInstitute: "Bachelor of Science - University of London",
      reasonForRejection: "Insufficient financial documentation",
    },
    {
      countryName: "Canada",
      courseAndInstitute: "Master of Computer Science - University of Toronto",
      reasonForRejection: "Lack of study purpose clarity",
    },
    {
      countryName: "Australia",
      courseAndInstitute: "Diploma in Business Management - Melbourne Institute of Technology",
      reasonForRejection: "Incorrect visa application form",
    },
  ];

  const previousTravelHistory = [
    {
      countryName: "France",
      periodOfStay: "01/05/2019 - 15/05/2019",
      purposeOfTravel: "Vacation",
    },
    {
      countryName: "India",
      periodOfStay: "01/01/2021 - 01/02/2021",
      purposeOfTravel: "Family Visit",
    },
    {
      countryName: "Japan",
      periodOfStay: "01/08/2022 - 20/08/2022",
      purposeOfTravel: "Business Conference",
    },
  ];

  const englishProficiencyData = [
    {
      testType: "IELTS",
      dateOfExam: "15/08/2023",
      scores: {
        Listening: "8.0",
        Speaking: "7.5",
        Reading: "8.0",
        Writing: "7.0",
        Overall: "7.5",
      },
    },
    {
      testType: "PTE",
      dateOfExam: "22/09/2023",
      scores: {
        Listening: "75",
        Speaking: "70",
        Reading: "72",
        Writing: "68",
        Overall: "72",
      },
    },
    {
      testType: "OET",
      dateOfExam: "30/10/2023",
      scores: {
        Listening: "B",
        Speaking: "B",
        Reading: "B",
        Writing: "B",
        Overall: "B",
      },
    },
  ];

  const previousVisaApproval = [
    {
      countryName: "Canada",
      courseAndInstitute: "Computer Science at University of Toronto",
      durationOfStay: "1 year",
      visaType: "Study Permit",
    },
    {
      countryName: "Australia",
      courseAndInstitute: "Business Management at University of Sydney",
      durationOfStay: "2 years",
      visaType: "Student Visa",
    },
    {
      countryName: "UK",
      courseAndInstitute: "MBA at London Business School",
      durationOfStay: "1 year",
      visaType: "Tier 4 Student Visa",
    },
    {
      countryName: "USA",
      courseAndInstitute: "Engineering at MIT",
      durationOfStay: "4 years",
      visaType: "F-1 Student Visa",
    },
  ];

  const policeClearance = [
    {
      convicted: "No",
      countries: "USA, Canada, UAE",
      duration: "USA (2 years), Canada (1 year), UAE (3 years)",
    },
    {
      convicted: "Yes",
      countries: "India, Australia",
      duration: "India (5 years), Australia (8 months)",
    },
  ];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any>({});
  const [fundDetails, setFundDetails] = useState<any>([]);
  const [examDetails, setExamDetails] = useState<any>([]);
  const [policeClearence, setPoliceClearence] = useState<any>([]);
  const [educationDetails, setEducationDetails] = useState<any>([]);
  const [gapDetails, setGapDetails] = useState<any>([]);
  const [experienceDetails, setExperienceDetails] = useState<any>([]);
  const [visaDeclineDetails, setVisaDeclineDetails] = useState<any>([]);
  const [visaApprovalDetails, setVisaApprovalDetails] = useState<any>([]);
  const [travelHistoryDetails, setTravelHistoryDetails] = useState<any>([]);
  const [siblingsInfo, setSiblingsInfo] = useState<any>([]);
  const [childrensInfo, setChildrensInfo] = useState<any>([]);
  const [preferredCourses, setPreferredCourses] = useState<any>([]);
  const [preferredCampus, setPreferredCampus] = useState<any>([]);
  const [clearenceCountries, setClearenceCountries] = useState<any>([]);
  const [passportsInfo, setPassportsInfo] = useState<any>([]);
  const [notFound, setNotFound] = useState<boolean>(false);

  const medicalDeclaration = "Yes, I have asthma and a mild allergy to pollen.";

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      let { data } = await axios.get(`/kyc_details/${id}`, {
        timeout: 4000
      });

      if (data) {
        setResponse(data);
        setFundDetails(data?.fundPlan);
        setExamDetails(data?.exams);
        setPoliceClearence(data?.basicInfoDetails?.police_clearance_docs);
        setEducationDetails(data?.educationDetails);
        setGapDetails(data?.gapReasons);
        setExperienceDetails(data?.workInfos);
        setVisaDeclineDetails(data?.previousVisaDeclines);
        setVisaApprovalDetails(data?.previousVisaApprovals);
        setTravelHistoryDetails(data?.travelHistories);
        setSiblingsInfo(data?.familyDetails?.[0]?.siblings_info);
        setChildrensInfo(data?.familyDetails?.[0]?.children_info);
        setPassportsInfo(data?.passportDetails?.[0]?.passports);

        const filteredCourses = data?.studyPreferences?.[0]?.studyPreferenceDetails
          .map((item: any) => item?.preferred_courses?.course_name)
          .filter(Boolean)
          .join(', ');

        const filteredCampus = data?.studyPreferences?.[0]?.studyPreferenceDetails
          .map((item: any) => item?.preferred_campus?.campus_name)
          .filter(Boolean)
          .join(', ');

        const filteredPoliceCountries = data?.basicInfoDetails?.police_clearance_docs
          ?.map((doc: any) => doc?.country_name)
          .filter(Boolean)
          .join(', ');

        if (preferredCourses) setPreferredCourses(filteredCourses);
        if (filteredCampus) setPreferredCampus(filteredCampus);
        if (filteredPoliceCountries) setClearenceCountries(filteredPoliceCountries);

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setNotFound(true);
      showErrorAlert('Something went wrong');
    }
  }

  const personalDetails = useMemo(() => response ? [
    { label: "Student Name", value: response?.personalDetails?.full_name || 'N/A' },
    { label: "Mobile", value: response?.personalDetails?.phone || 'N/A' },
    { label: "Email", value: response?.personalDetails?.email || 'N/A' },
    { label: "DOB", value: response?.basicInfoDetails?.dob || 'N/A' },
    { label: "Current Address", value: response?.basicInfoDetails?.address || 'N/A' },
    { label: "Primary Point of Contact", value: `${response?.basicInfoDetails?.emergency_contact_name} - ${response?.basicInfoDetails?.emergency_contact_relationship}` || 'N/A' },
    { label: "Marital Status", value: response?.basicInfoDetails?.marital_status_details?.marital_status_name || 'N/A' },
    { label: "Source of Lead", value: response?.leadSource?.source_name || 'N/A' },
    { label: "Preferred Course", value: preferredCourses },
    { label: "Preferred Institute", value: preferredCampus },
    { label: "Course Link", value: "https://www.harvard.edu/mba" }, //
    { label: "Counselor Name", value: response?.assignedCounselor || 'N/A' },
    { label: "Branch", value: response?.branches || 'N/A' },
  ] : [], [response]);

  const familyDetails = useMemo(() => response ? [
    { label: "Father’s Name", value: response?.familyDetails?.[0]?.father?.name || 'N/A' },
    { label: "Occupation of Father", value: response?.familyDetails?.[0]?.father?.occupation || 'N/A' },
    { label: "Nature of Occupation", value: response?.familyDetails?.[0]?.father?.nature_of_occupation || 'N/A' },
    { label: "Name of the Organization/ Business", value: response?.familyDetails?.[0]?.father?.organization || 'N/A' },
    { label: "Annual Income of Father", value: response?.familyDetails?.[0]?.father?.annual_income || 'N/A' },
    { label: "Income Tax payee or not?", value: (response?.familyDetails?.[0]?.father?.income_tax_payer) ? 'Yes' : 'No' },
    { label: "Mother’s Name", value: response?.familyDetails?.[0]?.mother?.name || 'N/A' },
    { label: "Occupation of Mother", value: response?.familyDetails?.[0]?.mother?.occupation || 'N/A' },
    { label: "Nature of Occupation", value: response?.familyDetails?.[0]?.mother?.nature_of_occupation || 'N/A' },
    { label: "Name of the Organization/ Business", value: response?.familyDetails?.[0]?.mother?.organization || 'N/A' },
    { label: "Annual Income of Mother", value: response?.familyDetails?.[0]?.mother?.annual_income || 'N/A' },
    { label: "Income Tax payee or not?", value: (response?.familyDetails?.[0]?.mother?.income_tax_payer) ? 'Yes' : 'No' },
    { label: "If Married, Name of Spouse", value: response?.familyDetails?.[0]?.spouse?.name || 'N/A' },
    { label: "Occupation of Spouse", value: response?.familyDetails?.[0]?.spouse?.occupation || 'N/A' },
    { label: "Name of the company in which your Spouse is currently working", value: response?.familyDetails?.[0]?.spouse?.organization || 'N/A' },
    { label: "Location in which your Spouse is working", value: response?.familyDetails?.[0]?.spouse?.name || 'N/A' },
    { label: "Annual income of spouse", value: response?.familyDetails?.[0]?.spouse?.annual_income || 'N/A' },
    { label: "Income Tax payee or not?", value: response?.familyDetails?.[0]?.spouse?.income_tax_payer ? 'Yes' : 'No' },
    { label: "Is your spouse accompanying along with you during studies?", value: (response?.familyDetails?.[0]?.accompanying_spouse) ? 'Yes' : 'No' },
    { label: "No. of children", value: response?.familyDetails?.[0]?.number_of_children || 'N/A' },
    { label: "No. of Siblings", value: response?.familyDetails?.[0]?.number_of_siblings || 'N/A' },
    { label: "Are your kids accompanying along with you during studies?", value: (response?.familyDetails?.[0]?.accompanying_child) ? 'Yes' : 'No' },
    { label: "Do you have any relatives/friends from Govt. service, Police, Political party, Media?", value: response?.familyDetails?.[0]?.relatives_info || 'N/A' },
  ] : [], [response]);

  const passportDetails = useMemo(() =>
    response ?
      response?.passportDetails?.map((data: any) => [
        { label: "Number of passport/s", value: data?.number_of_passports || 'N/A' },
        { label: "Do you have all your original passports in hand?", value: (data?.original_passports_in_hand) ? 'Yes' : 'No' },
        { label: "If not, reason for the same", value: data?.missing_passport_reason || 'N/A' },
        { label: "Any visa stamping/ immigration history in the current and previous passport?", value: (data?.visa_immigration_history) ? 'Yes' : 'No' },
        { label: "Name change (if any) when compared to other documents", value: data?.name_change || 'N/A' },
      ])
      : [],
    [response]
  );

  const employementHistoriesDetails = useMemo(() => response ? [
    {
      label: "Have you served notice period as per the requirement of your employer during your last resignation?",
      value: (response?.userEmploymentHistories?.served_notice_period) ? 'Yes' : 'No',
    },
    { label: "Did you get terminated from any organization/company?", value: (response?.userEmploymentHistories?.terminated_from_company) ? 'Yes' : 'No' },
    { label: "Are you in very good and friendly relation with all of your previous/current employers?", value: (response?.userEmploymentHistories?.good_relation_with_employers) ? 'Yes' : 'No' },
    { label: "Is there any forged experience or any other documents submitted to us?", value: (response?.userEmploymentHistories?.submitted_forged_documents) ? 'Yes' : 'No' },
    {
      label:
        "For any abroad work experiences do you still have the visa page, permit card, salary account statement and all other supporting evidences to prove the same?",
      value: (response?.userEmploymentHistories?.has_abroad_work_evidence) ? 'Yes' : 'No',
    }] : [], [response]);

  console.log(response);

  useEffect(() => {
    fetchDetails();
  }, [])

  const formatFundName = (name: any) => {
    if (!name) return '';
    const selected: any = fundTypeOptions.filter((data: any) => name == data?.value);
    return selected?.[0]?.label || ''
  }

  const formatVisaTypeName = (name: any) => {
    if (!name) return '';
    const selected: any = Visa_Types.filter((data: any) => name == data?.value);
    return selected?.[0]?.label || ''
  }


  // if (isLoading) {
  //   return (
  //     <Spinner
  //       animation="border"
  //       style={{ position: "absolute", top: "50%", left: "50%" }}
  //     />
  //   );
  // }

  if (notFound) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <h2 className="fs-2 text-muted">No Data Found</h2>
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        breadCrumbItems={[
          { label: "KYC Details", path: "/kyc_details" },
          { label: "KYC Details", path: "/kyc_details/:id", active: true },
        ]}
        title={"KYC Details"}
      />
      <Row className="p-2 pb-0">
        <Card>
          <Card.Body>
            <Row className="mt-1">
              <h4 className="text-secondary mt-0">Basic Details</h4>
            </Row>
            <div className="mb-2 grid-container">
              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Name</p>
                <div className="d-flex align-items-start" style={{ gap: "5px" }}>
                  <img src={icons.user} alt="date" className="me-1" height="16" />
                  <h5 className="m-0 font-size-14">{response?.personalDetails?.full_name}</h5>
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Phone Number</p>
                <div className="d-flex align-items-center outline-none" style={{ gap: "5px" }}>
                  <img src={icons.apple} alt="phone" className="me-1" width="16" />
                  <input
                    type="tel"
                    value={response?.personalDetails?.phone}
                    style={{
                      border: "none",
                      outline: "none",
                      width: "100%",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Email</p>
                <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                  <img src={icons.email} alt="email" className="me-1" width="17" />
                  <input
                    type="text"
                    value={response?.personalDetails?.email}
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: "16px",
                      fontWeight: 600,
                      width: "100%",
                    }}
                  />
                </div>
              </div>
              <br className="grid-br" />
              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Source</p>
                <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                  <img src={icons.cloud} alt="source icon" className="me-1" width="16" />
                  <h5 className="m-0 font-size-14">{response?.leadSource?.source_name}</h5>
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Channel</p>
                <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                  <img src={icons.information} alt="cahnnel icon" className="me-1" width="16" />
                  <h5 className="m-0 font-size-14">{response?.channel_name?.channel_name}</h5>
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">City</p>
                <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                  <img src={icons.business} alt="comapny icon" className="me-1" width="16" />
                  <h5 className="m-0 font-size-14">{response?.personalDetails?.city}</h5>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Row>
      <Accordion defaultActiveKey="0" className="custom-accordion">
        <Row>
          <Col md={6} lg={6}>
            <Card>
              <Card.Body>
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="mt-0 text-white">
                    <h5 className="text-uppercase text-white">
                      <i className="mdi mdi-account-circle me-1 text-white"></i> PERSONAL DETAILS
                    </h5>
                  </Accordion.Header>

                  <Accordion.Body>
                    <div className="text-start mt-2">
                      {personalDetails?.map((field: any, index: any) => (
                        <p key={index} className={`mb-0 p-2 ps-2 font-15 ${index % 2 === 0 ? "bg-light" : ""}`}>
                          <strong>{field?.label}:</strong>
                          <span className="ms-2">{field?.value}</span>
                        </p>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Accordion.Item eventKey="1">
                  <Accordion.Header className="mt-0 text-white">
                    <h5 className="text-uppercase text-white">
                      <i className="mdi mdi-account-multiple me-1"></i> FAMILY INFORMATION
                    </h5>
                  </Accordion.Header>

                  <Accordion.Body>
                    <div className="text-start mt-2 ps-1">
                      {familyDetails?.map((field, index) => (
                        <p
                          key={index}
                          className={`mb-2 font-15 ${index % 2 === 0 ? "bg-light" : ""}`}
                          style={{ padding: "10px", borderRadius: "4px" }}
                        >
                          <strong>{field?.label}:</strong>
                          <span className="ms-2">{field?.value}</span>
                        </p>
                      ))}

                      <h5 className="font-weight-bold text-danger mt-3">Siblings Info:</h5>

                      {siblingsInfo?.map((data: any, index: any) => (
                        <div
                          key={index}
                          className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`}
                          style={{ padding: "10px", borderRadius: "4px" }}
                        >
                          <p className="mb-1 font-15">
                            <strong>No. of Sibling:</strong>
                            <span className="ms-2">{data?.name || 'N/A'}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Occupation of Sibling:</strong>
                            <span className="ms-2">{data?.occupation || 'N/A'}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Annual Income of Sibling:</strong>
                            <span className="ms-2">{data?.annual_income || 'N/A'}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Income Tax payee or not?</strong>
                            <span className="ms-2">{(data?.income_tax_payer) ? 'Yes' : 'No'}</span>
                          </p>
                        </div>
                      ))}

                      <h5 className="font-weight-bold text-danger mt-3">Childrens Info:</h5>

                      {childrensInfo?.map((data: any, index: any) => (
                        <div
                          key={index}
                          className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`}
                          style={{ padding: "10px", borderRadius: "4px" }}
                        >
                          <p className="mb-1 font-15">
                            <strong>Name:</strong>
                            <span className="ms-2">{data?.name || 'N/A'}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Age:</strong>
                            <span className="ms-2">{data?.age || 'N/A'}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Gender:</strong>
                            <span className="ms-2">{data?.gender || 'N/A'}</span>
                          </p>
                        </div>
                      ))}

                    </div>

                  </Accordion.Body>
                </Accordion.Item>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Accordion.Item eventKey="2">
                  <Accordion.Header className="mt-0 text-white">
                    <h5 className="text-uppercase text-white">
                      <i className="mdi mdi-currency-usd me-1"></i> FUND PLAN
                    </h5>
                  </Accordion.Header>

                  <Accordion.Body>
                    <div className="text-start mt-2 ps-1">

                      {fundDetails?.map((data: any, index: any) => (
                        <div
                          key={index}
                          className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`}
                          style={{ padding: "10px", borderRadius: "4px" }}
                        >
                          <p className="mb-1 font-15">
                            <strong>Type of funds:</strong>
                            <span className="ms-2">{formatFundName(data?.type)}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Own funds/sponsored funds?</strong>
                            <span className="ms-2">{data?.fund_origin || 'N/A'}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Relation with sponsor:</strong>
                            <span className="ms-2">{data?.relation_with_sponsor || 'N/A'}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Sponsorship amount:</strong>
                            <span className="ms-2">{data?.sponsorship_amount || 'N/A'}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Name of the bank:</strong>
                            <span className="ms-2">{data?.name_of_bank || 'N/A'}</span>
                          </p>

                          {(data?.type == fdValue || data?.type == savingsValue) && <div>
                            <h5 className="font-weight-bold text-danger pt-2">Other Information:</h5>

                            <div className="text-start mt-2">
                              <p className={`mb-0 p-2 ps-2 font-15 bg-light`}>
                                <strong>
                                  {"If FD or Savings does the funds have min 6 months back up and proper source to prove?"}:
                                </strong>
                                <span className="ms-2">{(data?.has_min_6_months_backup) ? 'Yes' : 'No'}</span>
                              </p>

                              <p className={`mb-0 p-2 ps-2 font-15`}>
                                <strong>{"Explain the source of funds for FD/Savings etc"}:</strong>
                                <span className="ms-2">{data?.source_of_funds || 'N/A'}</span>
                              </p>
                            </div>
                          </div>}
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Accordion.Item eventKey="3">
                  <Accordion.Header className="mt-0 text-white">
                    <h5 className="text-uppercase text-white">
                      <i className="mdi mdi-book-open me-1"></i> ENGLISH LANGUAGE PROFICIENCY
                    </h5>
                  </Accordion.Header>

                  <Accordion.Body>
                    <div className="text-start mt-2 ps-1">

                      {examDetails?.map((test: any, index: number) => (
                        <div
                          key={index}
                          className={`mb-3 ${index % 2 == 0 ? "bg-light" : ""}`}
                          style={{ padding: "10px", borderRadius: "4px" }}
                        >
                          <p className="mb-1 font-15">
                            <strong>Type of Test:</strong>
                            <span className="ms-2">{test?.exam_type}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Date of Exam:</strong>
                            <span className="ms-2">{(test?.exam_date) ? moment(test?.exam_date).format('DD/MM/YYYY') : 'N/A'}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Listening Score (L):</strong>
                            <span className="ms-2">{test?.listening_score}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Speaking Score (S):</strong>
                            <span className="ms-2">{test?.speaking_score}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Reading Score (R):</strong>
                            <span className="ms-2">{test?.reading_score}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Writing Score (W):</strong>
                            <span className="ms-2">{test?.writing_score}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Overall Score (O.V):</strong>
                            <span className="ms-2">{test?.overall_score}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Accordion.Item eventKey="1">
                  <Accordion.Header className="mt-0 text-white">
                    <h5 className="text-uppercase text-white">
                      <i className="mdi mdi-medical-bag me-1"></i> MEDICAL DECLARATION
                    </h5>
                  </Accordion.Header>

                  <Accordion.Body>
                    <div className="text-start mt-1 ps-1">
                      <h5 className="font-weight-bold text-danger">Medical Declaration:</h5>
                      <div className={`mb-3 bg-light`} style={{ padding: "10px", borderRadius: "4px" }}>
                        <p className="mb-1 font-15">
                          <strong>Are there any medical conditions or health concerns that we should be aware of?</strong>
                        </p>
                        <p className="font-15">
                          <span className="ms-2">{(response?.basicInfoDetails?.concern_on_medical_condition) ? 'Yes' : "No"}</span>
                        </p>
                      </div>
                      <p className="font-15">
                        <em>
                          This information is necessary for regulatory compliance and will be treated with the utmost
                          confidentiality.
                        </em>
                      </p>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Accordion.Item eventKey="11">
                  <Accordion.Header className="mt-0 text-white">
                    <h5 className="text-uppercase text-white">
                      <i className="mdi mdi-shield-alert me-1"></i> POLICE CLEARANCE CERTIFICATE
                    </h5>
                  </Accordion.Header>

                  <Accordion.Body>
                    <div className="text-start mt-1 ps-1">
                      <h5 className="font-weight-bold text-danger">Police Clearance Information:</h5>

                      <div
                        className={`mb-3 bg-light`}
                        style={{ padding: "10px", borderRadius: "4px" }}
                      >
                        <p className="mb-1 font-15">
                          <strong>Have you ever been convicted of a criminal offense?</strong>
                          <span className="ms-2">{(response?.basicInfoDetails?.criminal_offence) ? 'Yes' : 'No'}</span>
                        </p>
                        <p className="mb-1 font-15">
                          <strong>Countries for Police Clearance Certificate:</strong>
                          <span className="ms-2">{clearenceCountries}</span>
                        </p>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card>
              <Card.Body>
                <Accordion.Item eventKey="5">
                  <Accordion.Header className="mt-0 text-white">
                    <h5 className="text-uppercase text-white">
                      <i className="mdi mdi-school me-1"></i> EDUCATIONAL QUALIFICATION
                    </h5>
                  </Accordion.Header>

                  <Accordion.Body>
                    <div className="text-start mt-2 ps-1">
                      <h5 className="font-weight-bold text-danger">Qualifications:</h5>

                      {educationDetails?.map((qual: any, index: number) => (
                        <div
                          key={index}
                          className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`}
                          style={{ padding: "10px", borderRadius: "4px" }}
                        >
                          <p className="mb-1 font-15">
                            <strong>Qualification:</strong>
                            <span className="ms-2">{qual?.qualification}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Name of the College & University:</strong>
                            <span className="ms-2">{qual?.school_name}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Start Date:</strong>
                            <span className="ms-2">{qual?.start_date ? moment(qual?.start_date).format('DD/MM/YYYY') : 'N/A'}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>End Date:</strong>
                            <span className="ms-2">{qual?.end_date ? moment(qual?.end_date).format('DD/MM/YYYY') : 'N/A'}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Percentage:</strong>
                            <span className="ms-2">{qual?.percentage}</span>
                          </p>
                        </div>
                      ))}


                      <h5 className="font-weight-bold text-danger">Periods of Gap:</h5>

                      {gapDetails?.map((gap: any, index: any) => (
                        <div
                          key={index}
                          className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`}
                          style={{ padding: "10px", borderRadius: "4px" }}
                        >
                          <p className="mb-1 font-15">
                            <strong>Period of Gap:</strong>
                            <span className="ms-2">{`${(gap?.start_date) ? moment(gap?.start_date).format('DD/MM/YYYY') : 'N/A'} - ${(gap?.end_date) ? moment(gap?.end_date).format('DD/MM/YYYY') : 'N/A'}`}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Reason:</strong>
                            <span className="ms-2">{gap?.reason}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Supporting Documents:</strong>
                            <span className="ms-2">{gap?.type.toUpperCase()}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Accordion.Item eventKey="6">
                  <Accordion.Header className="mt-0 text-white">
                    <h5 className="text-uppercase text-white">
                      <i className="mdi mdi-passport me-1"></i> PASSPORT INFORMATION
                    </h5>
                  </Accordion.Header>

                  <Accordion.Body>
                    <div className="text-start mt-2">

                      {passportDetails?.[0]?.map((field: any, index: number) => (
                        <p
                          key={index}
                          className={`mb-2 font-15 ${index % 2 == 0 ? "bg-light" : ""}`}
                          style={{ padding: "10px", borderRadius: "4px" }}
                        >
                          <strong>{field?.label}:</strong>
                          <span className="ms-2">{field?.value}</span>
                        </p>
                      ))}

                      <h5 className="font-weight-bold text-danger pt-2">Passport Details:</h5>

                      {passportsInfo?.map((data: any, index: any) => (
                        <div
                          key={index}
                          className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`}
                          style={{ padding: "10px", borderRadius: "4px" }}
                        >
                          <p className="mb-1 font-15">
                            <strong>Passport Number:</strong>
                            <span className="ms-2">{data?.passport_number || 'N/A'}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Date of Expiry:</strong>
                            <span className="ms-2">{(data?.date_of_expiry) ? moment(data?.date_of_expiry).format('DD/MM/YYYY') : 'N/A'}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Accordion.Item eventKey="7">
                  <Accordion.Header className="mt-0 text-white">
                    <h5 className="text-uppercase text-white">
                      <i className="mdi mdi-briefcase me-1"></i> WORK EXPERIENCE
                    </h5>
                  </Accordion.Header>

                  <Accordion.Body>
                    <div className="text-start mt-2 ps-1">
                      {experienceDetails?.map((exp: any, index: number) => (
                        <div
                          key={index}
                          className={`mb-3 ${index % 2 == 0 ? "bg-light" : ""}`}
                          style={{ padding: "10px", borderRadius: "4px" }}
                        >
                          <p className="mb-1 font-15">
                            <strong>Name of Company:</strong>
                            <span className="ms-2">{exp?.company}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Start and End Date:</strong>
                            <span className="ms-2">
                              {(exp?.from) ? moment(exp?.from).format('DD/MM/YYYY') : 'N/A'} - {(exp?.to) ? moment(exp?.from).format('DD/MM/YYYY') : 'N/A'}
                            </span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Designation:</strong>
                            <span className="ms-2">{exp?.designation}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Work Experience Certificate Available:</strong>
                            <span className="ms-2">{(exp?.experience_certificate && exp?.experience_certificate?.trim() !== '') ? 'Yes' : 'No'}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Bank Statement Attached:</strong>
                            <span className="ms-2">{(exp?.bank_statement && exp?.bank_statement?.trim() != '') ? 'Yes' : 'No'}</span>
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="text-start mt-2 ps-1">
                      <h5 className="font-weight-bold text-danger">Other Information:</h5>

                      {employementHistoriesDetails?.map((info: any, index: number) => (
                        <div
                          key={index}
                          className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`}
                          style={{ padding: "10px", borderRadius: "4px" }}
                        >
                          <p className="mb-1 font-15">
                            <strong>{info?.label}</strong>
                            <span className="ms-2">{info?.value}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Accordion.Item eventKey="8">
                  <Accordion.Header className="mt-0 text-white">
                    <h5 className="text-uppercase text-white">
                      <i className="mdi mdi-cancel me-1"></i> PREVIOUS VISA DECLINE
                    </h5>
                  </Accordion.Header>

                  <Accordion.Body>
                    <div className="text-start mt-1 ps-1">
                      <h5 className="font-weight-bold text-danger">Previous Visa Decline (If Any):</h5>

                      {visaDeclineDetails?.map((visa: any, index: any) => (
                        <div
                          key={index}
                          className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`}
                          style={{ padding: "10px", borderRadius: "4px" }}
                        >
                          <p className="mb-1 font-15">
                            <strong>Country Name:</strong>
                            <span className="ms-2">{visa?.declined_country?.country_name}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Course and Institute Applied For:</strong>
                            <span className="ms-2">{visa?.declined_course?.course_name} - {visa?.declined_university_applied?.university_name}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Reason for Rejection:</strong>
                            <span className="ms-2">{visa?.rejection_reason}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Accordion.Item eventKey="9">
                  <Accordion.Header className="mt-0 text-white">
                    <h5 className="text-uppercase text-white">
                      <i className="mdi mdi-check-circle me-1"></i> PREVIOUS VISA APPROVAL
                    </h5>
                  </Accordion.Header>

                  <Accordion.Body>
                    <div className="text-start mt-1 ps-1">
                      <h5 className="font-weight-bold text-danger">Previous Visa Approval (If Any):</h5>

                      {visaApprovalDetails?.map((visa: any, index: any) => (
                        <div
                          key={index}
                          className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`}
                          style={{ padding: "10px", borderRadius: "4px" }}
                        >
                          <p className="mb-1 font-15">
                            <strong>Country Name:</strong>
                            <span className="ms-2">{visa.approved_country?.country_name}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Course and Institute Applied For:</strong>
                            <span className="ms-2">{visa?.approved_course?.course_name} - {visa?.approved_university_applied?.university_name}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Visa Type:</strong>
                            <span className="ms-2">{formatVisaTypeName(visa?.visa_type)}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Accordion.Item eventKey="10">
                  <Accordion.Header className="mt-0 text-white">
                    <h5 className="text-uppercase text-white">
                      <i className="mdi mdi-airplane me-1"></i> PREVIOUS TRAVEL HISTORY
                    </h5>
                  </Accordion.Header>

                  <Accordion.Body>
                    <div className="text-start mt-1 ps-1">
                      <h5 className="font-weight-bold text-danger">Previous Travel History (If Any):</h5>

                      {travelHistoryDetails?.map((travel: any, index: number) => (
                        <div
                          key={index}
                          className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`}
                          style={{ padding: "10px", borderRadius: "4px" }}
                        >
                          <p className="mb-1 font-15">
                            <strong>Country Name:</strong>
                            <span className="ms-2">{travel?.travelHistoryCountry?.country_name}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Period of Stay:</strong>
                            <span className="ms-2">{travel?.start_date ? moment(travel?.start_date).format('DD/MM/YYYY') : 'N/A'} - {travel?.end_date ? moment(travel?.end_date).format('DD/MM/YYYY') : 'N/A'}</span>
                          </p>
                          <p className="mb-1 font-15">
                            <strong>Purpose of Travel:</strong>
                            <span className="ms-2">{travel?.purpose_of_travel}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Accordion>

      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="remarks">
            <Form.Label className="fs-9">Remarks</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="remarks"
              // value={remarks}
              // onChange={handleRemarksChange}
              placeholder="Enter remarks here"
            />
          </Form.Group>
        </Col>

        <div className="d-flex justify-content-end gap-3">
          <Button variant="danger">Reject</Button>
          <Button variant="success">
            Proceed to application
          </Button>
        </div>
      </Row>
    </div>
  );
};

export default KycDetails;
