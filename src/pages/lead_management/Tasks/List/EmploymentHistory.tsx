import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { FormInput } from "../../../../components";
import { baseUrl, showErrorAlert, showSuccessAlert } from "../../../../constants";
import axios from "axios";
import Swal from "sweetalert2";
import { allowedFileTypes } from "./data";

const initialDocumentState = {
  visaPage: "",
  permitCard: "",
  salaryAccountStatement: "",
  supportingDocuments: "",
};

const initialDocumentNameState = {
  visa_page: "",
  permit_card: "",
  salary_account_statement: "",
  supporting_documents: "",
};

const EmploymentHistory = (props: any) => {
  const { studentId } = props;
  const [formData, setFormData] = useState({
    noticePeriod: false,
    terminated: false,
    relation: false,
    forgotDocuments: false,
    abroadWork: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [documents, setDocuments] = useState(initialDocumentState);
  const [documentsName, setDocumentsName] = useState(initialDocumentNameState);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const { name } = e.target;

    if (file && !allowedFileTypes.includes(file.type)) {
      showErrorAlert("Only PDF and image files are allowed.");
      return;
    }

    setDocuments((prevDocs) => ({
      ...prevDocs,
      [name]: file,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, value: any) => {
    const { name } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = async () => {
    try {
      console.log("formData", formData);
      console.log("Docs", documents);

      const formBody = new FormData();

      formBody.append("served_notice_period", JSON.stringify(formData?.noticePeriod));
      formBody.append("terminated_from_company", JSON.stringify(formData?.terminated));
      formBody.append("good_relation_with_employers", JSON.stringify(formData?.relation));
      formBody.append("submitted_forged_documents", JSON.stringify(formData?.forgotDocuments));
      formBody.append("has_abroad_work_evidence", JSON.stringify(formData?.abroadWork));

      formBody.append("visaPage", documents.visaPage);
      formBody.append("permitCard", documents.permitCard);
      formBody.append("salaryAccountStatement", documents.salaryAccountStatement);
      formBody.append("supportingDocuments", documents.supportingDocuments);

      const swalResult = await Swal.fire({
        title: "Confirm Action",
        text: `Do you want to save employment histories?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, Save`,
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
      });

      if (swalResult.isConfirmed) {
        const result = await axios.post(`/employment_history/${studentId}`, formBody, {
          headers: {
            "content-type": "multipart/form-data",
          },
        });

        if (result) {
          showSuccessAlert("Employment Data Saved Successffully");
          setDocuments(initialDocumentState);
          setDocumentsName(initialDocumentNameState);
          getEmploymentHistories();
        }
      }
    } catch (error) {
      console.log(error);
      showSuccessAlert("Something went wrong");
      setDocuments(initialDocumentState);
      setDocumentsName(initialDocumentNameState);
    }
  };

  const getEmploymentHistories = async () => {
    try {
      setIsLoading(true);

      const result = await axios.get(`/employment_history/${studentId}`);
      if (result) {
        setFormData((prev: any) => ({
          ...prev,
          noticePeriod: result?.data?.data?.served_notice_period || false,
          terminated: result?.data?.data?.terminated_from_company || false,
          relation: result?.data?.data?.good_relation_with_employers || false,
          forgotDocuments: result?.data?.data?.submitted_forged_documents || false,
          abroadWork: result?.data?.data?.has_abroad_work_evidence || false,
        }));
        setDocumentsName(result?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEmploymentHistories();
  }, [studentId]);

  return (
    <>
      <h5 className="mb-1 text-uppercase">
        <i className="mdi mdi-account-circle me-1"></i>Employment History
      </h5>
      <Row className="mt-3">
        <Col className="mb-2" md={12} lg={12} xl={12} xxl={6}>
          <Form.Group className="mb-2" controlId="noticePeriod">
            <Form.Label>
              <span className="text-danger">* </span>
              Have you served notice period as per the requirement of your employer during your last resignation
            </Form.Label>
            <Col className="d-flex gap-2 ps-3">
              <Form.Check
                type="radio"
                id="noticePeriod"
                label="Yes"
                checked={formData?.noticePeriod}
                onChange={(e) => handleChange(e, true)}
                name="noticePeriod"
              />

              <Form.Check
                type="radio"
                id="noticePeriod"
                label="No"
                checked={!formData?.noticePeriod}
                onChange={(e) => handleChange(e, false)}
                name="noticePeriod"
              />
            </Col>
          </Form.Group>
        </Col>

        <Col className="mb-2" md={12} lg={12} xl={12} xxl={6}>
          <Form.Group className="mb-2" controlId="terminated">
            <Form.Label>
              <span className="text-danger">* </span>
              Did you get terminated from any organization/company
            </Form.Label>
            <Col className="d-flex gap-2 ps-3">
              <Form.Check
                type="radio"
                id="terminated"
                label="Yes"
                checked={formData?.terminated}
                onChange={(e) => handleChange(e, true)}
                name="terminated"
              />

              <Form.Check
                type="radio"
                id="terminated"
                label="No"
                checked={!formData?.terminated}
                onChange={(e) => handleChange(e, false)}
                name="terminated"
              />
            </Col>
          </Form.Group>
        </Col>

        <Col className="mb-2" md={12} lg={12} xl={12} xxl={6}>
          <Form.Group className="mb-2" controlId="relation">
            <Form.Label>
              <span className="text-danger">* </span>
              Are you in very good and friendly relation with all of your previous/current employers
            </Form.Label>
            <Col className="d-flex gap-2 ps-3">
              <Form.Check
                type="radio"
                id="relation"
                label="Yes"
                checked={formData?.relation}
                onChange={(e) => handleChange(e, true)}
                name="relation"
              />

              <Form.Check
                type="radio"
                id="relation"
                label="No"
                checked={!formData?.relation}
                onChange={(e) => handleChange(e, false)}
                name="relation"
              />
            </Col>
          </Form.Group>
        </Col>

        <Col className="mb-2" md={12} lg={12} xl={12} xxl={6}>
          <Form.Group className="mb-2" controlId="forgotDocuments">
            <Form.Label>
              <span className="text-danger">* </span>
              Is there any forged experience or any other documents submitted to us
            </Form.Label>
            <Col className="d-flex gap-2 ps-3">
              <Form.Check
                type="radio"
                id="forgotDocuments"
                label="Yes"
                checked={formData?.forgotDocuments}
                onChange={(e) => handleChange(e, true)}
                name="forgotDocuments"
              />

              <Form.Check
                type="radio"
                id="forgotDocuments"
                label="No"
                checked={!formData?.forgotDocuments}
                onChange={(e) => handleChange(e, false)}
                name="forgotDocuments"
              />
            </Col>
          </Form.Group>
        </Col>

        <Col className="mb-2" md={12} lg={12} xl={12} xxl={6}>
          <Form.Group className="mb-2" controlId="abroadWork">
            <Form.Label>
              <span className="text-danger">* </span>
              For any abroad work experiences do you still have the visa page, permit card, salary account statement, and all
              other supporting evidence to prove the same
            </Form.Label>
            <Col className="d-flex gap-2 ps-3">
              <Form.Check
                type="radio"
                id="abroadWork"
                label="Yes"
                checked={formData?.abroadWork}
                onChange={(e) => handleChange(e, true)}
                name="abroadWork"
              />

              <Form.Check
                type="radio"
                id="abroadWork"
                label="No"
                checked={!formData?.abroadWork}
                onChange={(e) => handleChange(e, false)}
                name="abroadWork"
              />
            </Col>
          </Form.Group>
        </Col>
      </Row>

      {formData?.abroadWork && (
        <Row>
          <Col md={6} lg={6} xl={6} xxl={4}>
            <Form.Group className="mb-2" controlId="visaPage">
              <Form.Label>Visa Page</Form.Label>
              <FormInput type="file" accept="image/*,application/pdf" name="visaPage" onChange={(e) => handleFileChange(e)} />
            </Form.Group>
            <div className="d-flex mb-2">
              {documentsName?.visa_page && (
                <a
                  href={`${baseUrl}uploads/experienceHistoryDocs/${documentsName?.visa_page}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                >
                  <div className=" p-1">{documentsName?.visa_page ? "Visa Page" : ""}</div>
                </a>
              )}
            </div>
          </Col>
          <Col md={6} lg={6} xl={6} xxl={4}>
            <Form.Group className="mb-2" controlId="permitCard">
              <Form.Label>Permit Card</Form.Label>
              <FormInput type="file" accept="image/*,application/pdf" name="permitCard" onChange={(e) => handleFileChange(e)} />
            </Form.Group>
            <div className="d-flex mb-2">
              {documentsName?.permit_card && (
                <a
                  href={`${baseUrl}uploads/experienceHistoryDocs/${documentsName?.permit_card}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                >
                  <div className=" p-1">{documentsName?.permit_card ? "Permit Card" : ""}</div>
                </a>
              )}
            </div>
          </Col>

          <Col md={6} lg={6} xl={6} xxl={4}>
            <Form.Group className="mb-2" controlId="salaryAccountStatement">
              <Form.Label>Salary Account Statement</Form.Label>
              <FormInput
                type="file"
                accept="image/*,application/pdf"
                name="salaryAccountStatement"
                onChange={(e) => handleFileChange(e)}
              />
            </Form.Group>
            <div className="d-flex mb-2">
              {documentsName?.salary_account_statement && (
                <a
                  href={`${baseUrl}uploads/experienceHistoryDocs/${documentsName?.salary_account_statement}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                >
                  <div className=" p-1">{documentsName?.salary_account_statement ? "Salary Account Statement" : ""}</div>
                </a>
              )}
            </div>
          </Col>

          <Col md={6} lg={6} xl={6} xxl={4}>
            <Form.Group className="mb-2" controlId="supportingDocuments">
              <Form.Label>Supporting Documents</Form.Label>
              <FormInput
                type="file"
                accept="image/*,application/pdf"
                name="supportingDocuments"
                onChange={(e) => handleFileChange(e)}
              />
            </Form.Group>
            <div className="d-flex mb-2">
              {documentsName?.supporting_documents && (
                <a
                  href={`${baseUrl}uploads/experienceHistoryDocs/${documentsName?.supporting_documents}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                >
                  <div className=" p-1">{documentsName?.supporting_documents ? "Supporting Documents" : ""}</div>
                </a>
              )}
            </div>
          </Col>
        </Row>
      )}

      <Row>
        <Button className="mt-1 w-auto" onClick={onSubmit}>
          Save Experience History
        </Button>
      </Row>
    </>
  );
};

export default EmploymentHistory;
