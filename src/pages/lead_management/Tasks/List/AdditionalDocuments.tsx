import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { FormInput } from "../../../../components";
import { Button } from "react-bootstrap";
import axios from "axios";
import { baseUrl, showErrorAlert, showSuccessAlert } from "../../../../constants";
import swal from "sweetalert2";
import SkeletonComponent from "./StudyPreference/LoadingSkeleton";
import { allowedFileTypes } from "./data";
import * as yup from "yup";

const initialDocumentState = {
  passport_doc: "",
  updated_cv: "",
  profile_assessment_doc: "",
  pte_cred: "",
  lor: "",
  sop: "",
  gte_form: "",
};

const AdditionalDocuments = (props: any) => {
  const { studentId } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [documents, setDocuments] = useState({
    passport_doc: "",
    updated_cv: "",
    profile_assessment_doc: "",
    pte_cred: "",
    lor: "",
    sop: "",
    gte_form: "",
  });

  const [documentsName, setDocumentsName] = useState({
    passport_doc: "",
    updated_cv: "",
    profile_assessment_doc: "",
    pte_cred: "",
    lor: "",
    sop: "",
    gte_form: "",
  });

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

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("passport_doc", documents.passport_doc);
      formData.append("updated_cv", documents.updated_cv);
      formData.append("profile_assessment_doc", documents?.profile_assessment_doc);
      formData.append("pte_cred", documents?.pte_cred);
      formData.append("lor", documents?.lor);
      formData.append("sop", documents?.sop);
      formData.append("gte_form", documents?.gte_form);

      const result = await swal.fire({
        title: "Confirm Action",
        text: `Do you want to save the additional documents?`,
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

      if (result.isConfirmed) {
        const res = await axios.post(`${baseUrl}api/additional_docs/${studentId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res?.data?.status) {
          console.log(res);
          showSuccessAlert("Document Updated Succesfully");
          setDocuments(initialDocumentState);
          getAdditionalDoc();
        }
      }
    } catch (error) {
      console.log(error);
      showErrorAlert("Internal Server Error");
      setIsLoading(false);
    } finally {
      props.getPercentage();
    }
  };

  const deleteAdditionalDoc = async (fieldName: any) => {
    try {
      const result = await swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save",
      });

      if (result.isConfirmed) {
        const res = await axios.delete(`${baseUrl}api/additional_docs/${studentId}/${fieldName}`);
        if (res) {
          showSuccessAlert("Document Deleted Succesfully");
          getAdditionalDoc();
        }
      }
    } catch (error) {
      console.log(error);
      showErrorAlert("Internal Server Error");
      setIsLoading(false);
    }
  };

  const getAdditionalDoc = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${baseUrl}api/additional_docs/${studentId}`);
      if (res?.status) {
        console.log("Data ====>>>>>>>", res?.data?.data);

        setDocumentsName(res?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      getAdditionalDoc();
    }
  }, [studentId]);

  return (
    <>
      {isLoading ? (
        <SkeletonComponent />
      ) : (
        <Row className="bg-light py-4 mb-3 ps-3">
          <h5 className="mb-4 text-uppercase">
            <i className="mdi mdi-account-circle me-1"></i>Additional Documents
          </h5>
          {!isLoading && (
            <Row>
              <Row>
                <Col md={6} lg={6} xl={6} xxl={4}>
                  <Form.Group className="mb-2" controlId="passport_doc">
                    <Form.Label>Upload Passport</Form.Label>
                    <FormInput
                      type="file"
                      accept="image/*,application/pdf"
                      name="passport_doc"
                      onChange={(e) => handleFileChange(e)}
                    />
                  </Form.Group>
                  <div className="d-flex">
                    {documentsName?.passport_doc && (
                      <div className="d-flex align-items-center">
                        <i className="mdi mdi-eye text-primary me-2"></i>
                        <a
                          href={`${documentsName?.passport_doc}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          Passport
                        </a>
                      </div>
                    )}
                    {documentsName?.passport_doc && (
                      <i onClick={() => deleteAdditionalDoc("passport_doc")} className="mdi mdi-delete mt-1 ps-1"></i>
                    )}
                  </div>
                </Col>

                <Col md={6} lg={6} xl={6} xxl={4}>
                  <Form.Group className="mb-2" controlId="updated_cv">
                    <Form.Label>Upload Updated CV</Form.Label>
                    <FormInput
                      type="file"
                      accept="image/*,application/pdf"
                      name="updated_cv"
                      onChange={(e) => handleFileChange(e)}
                    />
                  </Form.Group>
                  <div className="d-flex">
                    {documentsName?.updated_cv && (
                      <div className="d-flex align-items-center">
                        <i className="mdi mdi-eye text-primary me-2"></i>
                        <a
                          href={`${documentsName?.updated_cv}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          Updated CV
                        </a>
                      </div>
                    )}
                    {documentsName?.updated_cv && (
                      <i onClick={() => deleteAdditionalDoc("updated_cv")} className="mdi mdi-delete mt-1 ps-1"></i>
                    )}
                  </div>
                </Col>

                <Col md={6} lg={6} xl={6} xxl={4}>
                  <Form.Group className="mb-2 mt-3" controlId="profile_assessment_doc">
                    <Form.Label>Profile Assessment Document</Form.Label>
                    <FormInput
                      type="file"
                      accept="image/*,application/pdf"
                      name="profile_assessment_doc"
                      onChange={(e) => handleFileChange(e)}
                    />
                  </Form.Group>
                  <div className="d-flex">
                    {documentsName?.profile_assessment_doc && (
                      <div className="d-flex align-items-center">
                        <i className="mdi mdi-eye text-primary me-2"></i>
                        <a
                          href={`${documentsName?.profile_assessment_doc}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          Profile Assessment Document
                        </a>
                      </div>
                    )}
                    {documentsName?.profile_assessment_doc && (
                      <i onClick={() => deleteAdditionalDoc("profile_assessment_doc")} className="mdi mdi-delete mt-1 ps-1"></i>
                    )}
                  </div>
                </Col>

                <Col md={6} lg={6} xl={6} xxl={4}>
                  <Form.Group className="mb-2 mt-3" controlId="lor">
                    <Form.Label>Letter of Recommendation</Form.Label>
                    <FormInput type="file" accept="image/*,application/pdf" name="lor" onChange={(e) => handleFileChange(e)} />
                  </Form.Group>
                  <div className="d-flex align-items-center">
                    {documentsName?.lor && (
                      <div className="d-flex align-items-center">
                        <i className="mdi mdi-eye text-primary me-2"></i>
                        <a
                          href={`${documentsName?.lor}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          Letter of recommendation
                        </a>
                      </div>
                    )}
                    {documentsName?.lor && (
                      <i onClick={() => deleteAdditionalDoc("lor")} className="mdi mdi-delete mt-1 ps-1"></i>
                    )}
                  </div>
                </Col>

                <Col md={6} lg={6} xl={6} xxl={4}>
                  <Form.Group className="mb-2 mt-3" controlId="sop">
                    <Form.Label>Statement of Purpose</Form.Label>
                    <FormInput type="file" accept="image/*,application/pdf" name="sop" onChange={(e) => handleFileChange(e)} />
                  </Form.Group>
                  <div className="d-flex">
                    {documentsName?.sop && (
                      <div className="d-flex align-items-center">
                        <i className="mdi mdi-eye text-primary me-2"></i>
                        <a
                          href={`${documentsName?.sop}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          SOP
                        </a>
                      </div>
                    )}
                    {documentsName?.sop && (
                      <i onClick={() => deleteAdditionalDoc("sop")} className="mdi mdi-delete mt-1 ps-1"></i>
                    )}
                  </div>
                </Col>

                <Col md={6} lg={6} xl={6} xxl={4}>
                  <Form.Group className="mb-2 mt-3" controlId="gte_form">
                    <Form.Label>Application/GTE Form</Form.Label>
                    <FormInput
                      type="file"
                      accept="image/*,application/pdf"
                      name="gte_form"
                      onChange={(e) => handleFileChange(e)}
                    />
                  </Form.Group>
                  <div className="d-flex">
                    {documentsName?.gte_form && (
                      <div className="d-flex align-items-center">
                        <i className="mdi mdi-eye text-primary me-2"></i>
                        <a
                          href={`${documentsName?.gte_form}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          GTE Form
                        </a>
                      </div>
                    )}
                    {documentsName?.gte_form && (
                      <i onClick={() => deleteAdditionalDoc("gte_form")} className="mdi mdi-delete mt-1 ps-1"></i>
                    )}
                  </div>
                </Col>

                <Button className="w-auto ms-2" onClick={handleSubmit}>
                  Save
                </Button>
              </Row>
            </Row>
          )}
        </Row>
      )}
    </>
  );
};

export default AdditionalDocuments;
