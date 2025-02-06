import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";

import moment from "moment";
import useSaveGraduationInfo from "../../../../hooks/useSaveGraduationInfo";
import useRemoveFromApi from "../../../../hooks/useRemoveFromApi";
import ActionButton from "./ActionButton";
import validateFields from "../../../../helpers/validateHelper";
import { baseUrl, showErrorAlert } from "../../../../constants";
import { regrexValidation } from "../../../../utils/regrexValidation";
import { allowedFileTypes } from "./data";

interface GraduationDetailsProps {
  title: string; // Title for the section (Primary/Secondary)
  details: {
    start_date?: string;
    end_date?: string;
    certificate: File | null;
    grading_scale_info: File | null;
    admit_card: File | null;
    backlog_certificate: File | null;
    registration_certificate: File | null;
    transcript: File | null;
    individual_marksheet: File | null;
    percentage: number | string;
    conversion_formula: number | string;
    qualification: string;
    university_name?: string;
    college_name?: string;
    errors: any;
  };
  student_id: string | number;
  hasGraduation: any;
}

const GraduationInfo: React.FC<GraduationDetailsProps> = ({ title, details, student_id, hasGraduation }) => {
  const [graduationDetails, setGraduationDetails] = useState<any>(details);

  const { saveStudentGraduationDetails, loading } = useSaveGraduationInfo(student_id);
  const { removeFromApi } = useRemoveFromApi();

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, index: any) => {
    handleGraduationDetailsChange(e.target.name, e.target.value, index);
  };

  const handleFileChange = (e: any, index: any) => {
    if (e.target.files[0] && !allowedFileTypes.includes(e.target.files[0].type)) {
      showErrorAlert("Only PDF and image files are allowed.");
      return;
    }

    if (e.target.files && e.target.files.length > 0) {
      handleGraduationDetailsChange(e.target.name, e.target.files[0], index);
    }
  };

  const addMoreGraduationForm = () => {
    setGraduationDetails([
      ...graduationDetails,
      {
        qualification: "",
        university_name: "",
        college_name: "",
        start_date: "",
        end_date: "",
        percentage: "",
        conversion_formula: "",
        certificate: null,
        admit_card: null,
        registration_certificate: null,
        backlog_certificate: null,
        grading_scale_info: null,
        transcript: null,
        individual_marksheet: null,
        errors: {},
      },
    ]);
  };

  const removeGraduationForm = (index: any, id: any) => {
    if (id == 0) {
      const updatedGraduationDetails = [...graduationDetails];
      updatedGraduationDetails.splice(index, 1);
      setGraduationDetails(updatedGraduationDetails);
    } else {
      removeFromApi(id, "graduation",student_id);
    }
  };

  // Handlers for graduation details state update
  const handleGraduationDetailsChange = (name: string, value: any, index: any) => {
    // const regexPatterns: Record<string, RegExp> = {
    //   university_name: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
    //   percentage: /^\+?[0-9]{0,4}(\.[0-9]+)?$/
    // };

    // // Check if the field has a validation regex
    // if (regexPatterns[name]) {
    //   if (!regexPatterns[name].test(value)) {
    //     console.error(`Invalid ${name}: ${value}`);
    //     return; // Stop updating if validation fails
    //   }
    // }

    if (!regrexValidation(name, value)) {
      console.error(`Invalid ${name}: ${value}`);
      return; // Stop updating if validation fails
    }

    const newDetails = [...graduationDetails];
    newDetails[index][name] = value;
    setGraduationDetails(newDetails);
  };

  const handleSave = () => {
    const validatioRules = {
      qualification: { required: true, message: "Please choose course type" },
      university_name: { required: false, message: "Please enter university name" },
      college_name: { required: true, message: "Please enter college name" },
      start_date: { required: false, message: "Please select start date" },
      end_date: { required: false, message: "Please select end date" },
      percentage: { required: false, message: "Please enter percentage" },
      // certificate: { required: true },
      // admit_card: { required: true },
      // registration_certificate: { required: false },
      // backlog_certificate: { required: false },
      // grading_scale_info: { required: false },
      // conversion_formula: { required: false },
      // transcript: { required: true },
      // individual_marksheet: { required: false },
    };

    const { isValid, errors } = validateFields(graduationDetails, validatioRules);

    console.log(errors);

    if (!isValid) {
      console.log(errors);
      setGraduationDetails((prevState: any) =>
        prevState.map((exp: any, index: any) => ({
          ...exp,
          errors: errors[index] || {},
        }))
      );
      return;
    }
    saveStudentGraduationDetails(graduationDetails, hasGraduation);
  };

  const renderGraduatonRows = (item: any, index: any) => (
    <>
      <Row key={index}>
        {/* <Col md={4}>
          <Form.Group className="mb-3 form-group" controlId={`${title}_qualification`}>
            <Form.Label>
              <span className="text-danger">*</span> Course Type
            </Form.Label>
            <FormInput
              type="text"
              placeholder="UG/PG.."
              name="qualification"
              value={item?.qualification}
              onChange={(e) => handleFieldChange(e, index)}
            />
            {item?.errors?.qualification && (
              <Form.Text className="text-danger">
                {item.errors.qualification}
              </Form.Text>
            )}
          </Form.Group>
        </Col> */}

        <Col md={4}>
          <Form.Group className="mb-3 form-group" controlId={`${title}_qualification`}>
            <Form.Label>
              <span className="text-danger">*</span> Course Type
            </Form.Label>
            <Form.Select
              name="qualification"
              value={item?.qualification || ""}
              onChange={(e: any) => handleFieldChange(e, index)}
            >
              <option value="">Select Course Type</option>
              <option value="UG">UG</option>
              <option value="PG">PG</option>
              {/* Add more options as needed */}
            </Form.Select>
            {item?.errors?.qualification && <Form.Text className="text-danger">{item.errors.qualification}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3 form-group" controlId={`${title}_university_name`}>
            <Form.Label>University Name</Form.Label>
            <FormInput
              type="text"
              placeholder="Enter University name"
              name="university_name"
              value={item?.university_name}
              onChange={(e) => handleFieldChange(e, index)}
            />
            {item?.errors?.university_name && <Form.Text className="text-danger">{item.errors.university_name}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3 form-group" controlId={`${title}_college_name`}>
            <Form.Label>
              <span className="text-danger">*</span> College Name
            </Form.Label>
            <FormInput
              type="text"
              placeholder="Enter College name"
              name="college_name"
              value={item?.college_name}
              onChange={(e) => handleFieldChange(e, index)}
            />
            {item?.errors?.college_name && <Form.Text className="text-danger">{item.errors.college_name}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3 form-group" controlId={`${title}_start_date`}>
            <Form.Label>Start Date</Form.Label>
            <FormInput
              type="date"
              name="start_date"
              placeholder="Choose start date"
              value={item?.start_date ? moment(item?.start_date).format("YYYY-MM-DD") : ""}
              onChange={(e) => handleFieldChange(e, index)}
            />
            {item?.errors?.start_date && <Form.Text className="text-danger">{item.errors.start_date}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3 form-group" controlId={`${title}_end_date`}>
            <Form.Label>End Date</Form.Label>
            <FormInput
              type="date"
              name="end_date"
              placeholder="Choose end date"
              value={item?.end_date ? moment(item?.end_date).format("YYYY-MM-DD") : ""}
              onChange={(e) => handleFieldChange(e, index)}
            />
            {item?.errors?.end_date && <Form.Text className="text-danger">{item.errors.end_date}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3 form-group">
            <Form.Label>Percentage</Form.Label>
            <FormInput
              type="number"
              name="percentage"
              placeholder="Enter percentage"
              value={item?.percentage}
              onChange={(e) => handleFieldChange(e, index)}
              min={0}
            />
            {item?.errors?.percentage && <Form.Text className="text-danger">{item.errors.percentage}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3 form-group" controlId={`${title}_conversion_formula`}>
            <Form.Label>Conversion Formula</Form.Label>
            <FormInput
              type="text"
              name="conversion_formula"
              value={item?.conversion_formula}
              onChange={(e) => handleFieldChange(e, index)}
            />
            {item?.errors?.conversion_formula && <Form.Text className="text-danger">{item.errors.conversion_formula}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={4} className="d-flex justify-content-between align-items-center" style={{ width: "100% !important" }}>
          <Form.Group className="mb-3 form-group" controlId={`${title}_admit_card`}>
            <Form.Label>Upload Admit Card</Form.Label>
            <Form.Control
              name="admit_card"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, index)}
            />
            {item?.errors?.admit_card && <Form.Text className="text-danger">{item.errors.admit_card}</Form.Text>}
            {typeof item?.admit_card === "string" && (
              <div className="mt-2">
                <a href={`${baseUrl}uploads/graduationDocuments/${item?.admit_card}`} target="_blank" rel="noopener noreferrer">
                  <i className="mdi mdi-download me-1"></i> admit_card
                </a>
              </div>
            )}
          </Form.Group>
        </Col>

        <Col md={4} className="d-flex justify-content-between align-items-center">
          <Form.Group className="mb-3 form-group" controlId={`${title}_certificate`}>
            <Form.Label>Upload Certificate</Form.Label>
            <Form.Control
              name="certificate"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, index)}
            />
            {item?.errors?.certificate && <Form.Text className="text-danger">{item.errors.certificate}</Form.Text>}
            {typeof item?.certificate === "string" && (
              <div className="mt-2">
                <a href={`${baseUrl}uploads/graduationDocuments/${item?.certificate}`} target="_blank" rel="noopener noreferrer">
                  <i className="mdi mdi-download me-1"></i> certificate
                </a>
              </div>
            )}
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex justify-content-between align-items-center">
          <Form.Group className="mb-3 form-group" controlId={`${title}_registration_certificate `}>
            <Form.Label>Upload Registration Certification</Form.Label>
            <Form.Control
              name="registration_certificate"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, index)}
            />
            {item?.errors?.registration_certificate && (
              <Form.Text className="text-danger">{item.errors.registration_certificate}</Form.Text>
            )}
            {typeof item?.registration_certificate === "string" && (
              <div className="mt-2">
                <a
                  href={`${baseUrl}uploads/graduationDocuments/${item?.registration_certificate}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="mdi mdi-download me-1"></i> registration_certificate
                </a>
              </div>
            )}
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex justify-content-between align-items-center">
          <Form.Group className="mb-3 form-group" controlId={`${title}_grading_scale_info`}>
            <Form.Label>Upload Gray Scale Info</Form.Label>
            <Form.Control
              name="grading_scale_info"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, index)}
            />
            {item?.errors?.grading_scale_info && <Form.Text className="text-danger">{item.errors.grading_scale_info}</Form.Text>}
            {typeof item?.grading_scale_info === "string" && (
              <div className="mt-2">
                <a
                  href={`${baseUrl}uploads/graduationDocuments/${item?.grading_scale_info}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="mdi mdi-download me-1"></i> grading_scale_info
                </a>
              </div>
            )}
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex justify-content-between align-items-center">
          <Form.Group className="mb-3 form-group" controlId={`${title}_backlog_certificate`}>
            <Form.Label>Upload Backlog Certificate</Form.Label>
            <Form.Control
              name="backlog_certificate"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, index)}
            />
            {item?.errors?.backlog_certificate && (
              <Form.Text className="text-danger">{item.errors.backlog_certificate}</Form.Text>
            )}
            {typeof item?.backlog_certificate === "string" && (
              <div className="mt-2">
                <a
                  href={`${baseUrl}uploads/graduationDocuments/${item?.backlog_certificate}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="mdi mdi-download me-1"></i> backlog_certificate
                </a>
              </div>
            )}
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex justify-content-between align-items-center">
          <Form.Group className="mb-3 form-group" controlId={`${title}_individual_marksheet`}>
            <Form.Label>Upload Individual Marksheet</Form.Label>
            <Form.Control
              name="individual_marksheet"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, index)}
            />
            {item?.errors?.individual_marksheet && (
              <Form.Text className="text-danger">{item.errors.individual_marksheet}</Form.Text>
            )}
            {typeof item?.individual_marksheet === "string" && (
              <div className="mt-2">
                <a
                  href={`${baseUrl}uploads/graduationDocuments/${item?.individual_marksheet}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="mdi mdi-download me-1"></i> individual_marksheet
                </a>
              </div>
            )}
          </Form.Group>
        </Col>

        <Col md={4} className="d-flex justify-content-between align-items-center">
          <Form.Group className="mb-3 form-group" controlId={`${title}_transcript`}>
            <Form.Label>Upload Transcript</Form.Label>
            <Form.Control
              name="transcript"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileChange(e, index)}
            />
            {item?.errors?.transcript && <Form.Text className="text-danger">{item.errors.transcript}</Form.Text>}
            {typeof item?.transcript === "string" && (
              <div className="mt-2">
                <a href={`${baseUrl}uploads/graduationDocuments/${item?.transcript}`} target="_blank" rel="noopener noreferrer">
                  <i className="mdi mdi-download me-1"></i> transcript
                </a>
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>
      {graduationDetails?.length > 0 && (
        <Row className="mb-2">
          <ActionButton label="Remove" iconClass="mdi mdi-delete" onClick={() => removeGraduationForm(index, item?.id ?? 0)} />
        </Row>
      )}
    </>
  );

  return (
    <>
      <Row className="mb-3 p-2 border-bottom rounded">
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-office-building me-1"></i> {title}
        </h5>

        {graduationDetails?.map((item: any, index: any) => renderGraduatonRows(item, index))}
      </Row>

      <>
        <Row className="mb-0">
          <ActionButton label="Add More" iconClass="mdi mdi-plus" onClick={addMoreGraduationForm} />
          <Button variant="primary" className="mt-0 w-auto" onClick={handleSave}>
            {loading ? "Saving.." : "Save Graduation Info"}
          </Button>
        </Row>
      </>

      {/* <Row className="mb-2">
        <Button variant="primary" className="mt-4" onClick={handleSave}>
          {loading ? "Saving.." : "Save Graduation Info"}
        </Button>
      </Row> */}
    </>
  );
};

export default GraduationInfo;
