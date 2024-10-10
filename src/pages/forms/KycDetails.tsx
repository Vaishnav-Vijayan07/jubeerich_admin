import React from "react";
import PageTitle from "../../components/PageTitle";
import { Button, Card, Col, Row } from "react-bootstrap";
import profileImg from "../../assets/images/users/user-2.jpg";
import { Link } from "react-router-dom";

const KycDetails = () => {
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

  return (
    <div>
      <PageTitle
        breadCrumbItems={[
          { label: "KYC Details", path: "/kyc_details" },
          { label: "KYC Details", path: "/kyc_details/:id", active: true },
        ]}
        title={"KYC Details"}
      />
      <Row>
        <Col md={3} lg={3} className="">
          <Card className="text-center">
            <Card.Body>
              <img src={profileImg} className="rounded-circle avatar-lg img-thumbnail" alt="" />
              <h4 className="mb-0">Geneva McKnight</h4>

              <div className="text-center mt-3">
                <p className="text-muted mb-2 font-13">
                  <strong>Full Name :</strong>
                  <span className="ms-2">Geneva D. McKnight</span>
                </p>

                <p className="text-muted mb-2 font-13">
                  <strong>Mobile :</strong>
                  <span className="ms-2">(123) 123 1234</span>
                </p>

                <p className="text-muted mb-2 font-13">
                  <strong>Email :</strong>
                  <span className="ms-2 ">user@email.domain</span>
                </p>

                <p className="text-muted mb-1 font-13">
                  <strong>Address :</strong>
                  <span className="ms-2">123 Maple Street, Springfield, IL 62704</span>
                </p>
              </div>
              <ul className="social-list list-inline mt-3 mb-0">
                <li className="list-inline-item">
                  <Link to="#" className="social-list-item border-primary text-primary">
                    <i className="mdi mdi-facebook"></i>
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link to="#" className="social-list-item border-danger text-danger">
                    <i className="mdi mdi-google"></i>
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link to="#" className="social-list-item border-info text-info">
                    <i className="mdi mdi-twitter"></i>
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link to="#" className="social-list-item border-secondary text-secondary">
                    <i className="mdi mdi-github"></i>
                  </Link>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9} lg={9}>
          <Card>
            <Card.Body>
              <h4 className="header-title">KYC Details</h4>
              <h5
                className="mb-4 mt-4 text-uppercase bg-secondary text-white"
                style={{
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow
                  padding: "10px", // Padding for better visual spacing
                  borderRadius: "5px", // Optional: Rounded corners for a softer look
                }}
              >
                <i className="mdi mdi-account-circle me-1 text-white"></i> PERSONAL DETAILS
              </h5>

              <div className="text-start mt-2">
                {fields.map((field, index) => (
                  <p key={index} className={`mb-0 p-2 ps-2 font-15 ${index % 2 === 0 ? "bg-light" : ""}`}>
                    <strong>{field.label}:</strong>
                    <span className="ms-2">{field.value}</span>
                  </p>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h5
                className="mb-4 mt-2 text-uppercase bg-secondary text-white"
                style={{
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow
                  padding: "10px", // Padding for better visual spacing
                  borderRadius: "5px", // Optional: Rounded corners for a softer look
                }}
              >
                <i className="mdi mdi-account-circle me-1"></i> PASSPORT INFORMATION
              </h5>

              <div className="text-start mt-2">
                {passportFields.map((field, index) => (
                  <p
                    key={index}
                    className={`mb-2 font-15 ${index % 2 === 0 ? "bg-light" : ""}`}
                    style={{ padding: "10px", borderRadius: "4px" }} // Optional: inline styles for padding and rounded corners
                  >
                    <strong>{field.label}:</strong>
                    <span className="ms-2">{field.value}</span>
                  </p>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h5
                className="mb-4 mt-2 text-uppercase bg-secondary text-white"
                style={{
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow
                  padding: "10px", // Padding for better visual spacing
                  borderRadius: "5px", // Optional: Rounded corners for a softer look
                }}
              >
                <i className="mdi mdi-account-circle me-1"></i> EDUCATIONAL QUALIFICATION
              </h5>
              <div className="text-start mt-2 ps-1">
                <h5 className="font-weight-bold text-danger">Qualifications:</h5>
                {qualifications.map((qual, index) => (
                  <div
                    key={index}
                    className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`}
                    style={{ padding: "10px", borderRadius: "4px" }} // Optional: inline styles for padding and rounded corners
                  >
                    <p className="mb-1 font-15">
                      <strong>Qualification:</strong>
                      <span className="ms-2">{qual.level}</span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>Name of the College & University:</strong>
                      <span className="ms-2">{qual.college}</span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>Start Date:</strong>
                      <span className="ms-2">{qual.startDate}</span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>End Date:</strong>
                      <span className="ms-2">{qual.endDate}</span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>Percentage:</strong>
                      <span className="ms-2">{qual.percentage}</span>
                    </p>
                  </div>
                ))}

                <h5 className="font-weight-bold text-danger">Periods of Gap:</h5>
                {gaps.map((gap, index) => (
                  <div
                    key={index}
                    className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`}
                    style={{ padding: "10px", borderRadius: "4px" }} // Optional: inline styles for padding and rounded corners
                  >
                    <p className="mb-1 font-15">
                      <strong>Period of Gap:</strong>
                      <span className="ms-2">{gap.period}</span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>Reason:</strong>
                      <span className="ms-2">{gap.reason}</span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>Supporting Documents:</strong>
                      <span className="ms-2">{gap.documents}</span>
                    </p>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h5
                className="mb-4 mt-2 text-uppercase bg-secondary text-white"
                style={{
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow
                  padding: "10px", // Padding for better visual spacing
                  borderRadius: "5px", // Optional: Rounded corners for a softer look
                }}
              >
                <i className="mdi mdi-account-circle me-1"></i> WORK EXPERIENCE
              </h5>

              <div className="text-start mt-2 ps-1">
                {experiences.map((exp, index) => (
                  <div
                    key={index}
                    className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`}
                    style={{ padding: "10px", borderRadius: "4px" }} // Optional: inline styles for padding and rounded corners
                  >
                    <p className="mb-1 font-15">
                      <strong>Name of Company:</strong>
                      <span className="ms-2">{exp.company}</span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>Start and End Date:</strong>
                      <span className="ms-2">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>Designation:</strong>
                      <span className="ms-2">{exp.designation}</span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>Work Experience Certificate Available:</strong>
                      <span className="ms-2">{exp.certificateAvailable}</span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>Bank Statement Attached:</strong>
                      <span className="ms-2">{exp.bankStatementAttached}</span>
                    </p>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h5
                className="mb-4 mt-2 text-uppercase bg-secondary text-white"
                style={{
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow
                  padding: "10px", // Padding for better visual spacing
                  borderRadius: "5px", // Optional: Rounded corners for a softer look
                }}
              >
                <i className="mdi mdi-account-circle me-1"></i> FAMILY INFORMATION
              </h5>

              <div className="text-start mt-2 ps-1">
                {familyFields.map((field, index) => (
                  <p
                    key={index}
                    className={`mb-2 font-15 ${index % 2 === 0 ? "bg-light" : ""}`}
                    style={{ padding: "10px", borderRadius: "4px" }} // Optional: inline styles for padding and rounded corners
                  >
                    <strong>{field.label}:</strong>
                    <span className="ms-2">{field.value}</span>
                  </p>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default KycDetails;
