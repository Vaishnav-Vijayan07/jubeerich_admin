import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { FormInput } from "../../../../components";
import { Button } from "react-bootstrap";
import axios from "axios";
import { baseUrl, showErrorAlert, showSuccessAlert } from "../../../../constants";
import swal from "sweetalert2";
import SkeletonComponent from "./StudyPreference/LoadingSkeleton";
import { allowedFileTypes } from "./data";
import * as yup from 'yup';

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
        <Row>
          <h5 className="mb-4 text-uppercase">
            <i className="mdi mdi-account-circle me-1"></i>Additional Documents
          </h5>
          {!isLoading && (
            <Row>
              <Card>
                <Row>
                  <Col md={6} lg={6} xl={6} xxl={4}>
                    <Form.Group className="mb-2" controlId="passport_doc">
                      <Form.Label>
                         Upload Passport
                      </Form.Label>
                      <FormInput type="file" name="passport_doc" onChange={(e) => handleFileChange(e)} />
                    </Form.Group>
                    <div className="d-flex">
                      {documentsName?.passport_doc && (
                        <a
                          href={`${baseUrl}uploads/studentAdditionalDocs/${documentsName?.passport_doc}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                        >
                          <div className=" p-1">{documentsName?.passport_doc ? "Passport Document" : ""}</div>
                        </a>
                      )}
                      {documentsName?.passport_doc && (
                        <i onClick={() => deleteAdditionalDoc("passport_doc")} className="mdi mdi-delete mt-1 ps-1"></i>
                      )}
                    </div>
                  </Col>

                  <Col md={6} lg={6} xl={6} xxl={4}>
                    <Form.Group className="mb-2" controlId="updated_cv">
                      <Form.Label>
                         Upload Updated CV
                      </Form.Label>
                      <FormInput type="file" name="updated_cv" onChange={(e) => handleFileChange(e)} />
                    </Form.Group>
                    <div className="d-flex">
                      {documentsName?.updated_cv && (
                        <a
                          href={`${baseUrl}uploads/studentAdditionalDocs/${documentsName?.updated_cv}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                        >
                          <div className=" p-1">{documentsName?.updated_cv ? "Updated CV" : ""}</div>
                        </a>
                      )}
                      {documentsName?.updated_cv && (
                        <i onClick={() => deleteAdditionalDoc("updated_cv")} className="mdi mdi-delete mt-1 ps-1"></i>
                      )}
                    </div>
                  </Col>

                  <Col md={6} lg={6} xl={6} xxl={4}>
                    <Form.Group className="mb-2 mt-3" controlId="profile_assessment_doc">
                      <Form.Label>
                         Profile Assessment Document
                      </Form.Label>
                      <FormInput type="file" name="profile_assessment_doc" onChange={(e) => handleFileChange(e)} />
                    </Form.Group>
                    <div className="d-flex">
                      {documentsName?.profile_assessment_doc && (
                        <a
                          href={`${baseUrl}uploads/studentAdditionalDocs/${documentsName?.profile_assessment_doc}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                        >
                          <div className=" p-1">
                            {documentsName?.profile_assessment_doc ? "Profile Assessment Certificate" : ""}
                          </div>
                        </a>
                      )}
                      {documentsName?.profile_assessment_doc && (
                        <i onClick={() => deleteAdditionalDoc("profile_assessment_doc")} className="mdi mdi-delete mt-1 ps-1"></i>
                      )}
                    </div>
                  </Col>

                  <Col md={6} lg={6} xl={6} xxl={4}>
                    <Form.Group className="mb-2 mt-3" controlId="lor">
                      <Form.Label>
                         Letter of recommendation
                      </Form.Label>
                      <FormInput type="file" name="lor" onChange={(e) => handleFileChange(e)} />
                    </Form.Group>
                    <div className="d-flex">
                      {documentsName?.lor && (
                        <a
                          href={`${baseUrl}uploads/studentAdditionalDocs/${documentsName?.lor}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                        >
                          <div className=" p-1">{documentsName?.lor ? "PTE Account Credentials" : ""}</div>
                        </a>
                      )}
                      {documentsName?.lor && (
                        <i onClick={() => deleteAdditionalDoc("lor")} className="mdi mdi-delete mt-1 ps-1"></i>
                      )}
                    </div>
                  </Col>

                  <Col md={6} lg={6} xl={6} xxl={4}>
                    <Form.Group className="mb-2 mt-3" controlId="sop">
                      <Form.Label>
                         Statement of Purpose
                      </Form.Label>
                      <FormInput type="file" name="sop" onChange={(e) => handleFileChange(e)} />
                    </Form.Group>
                    <div className="d-flex">
                      {documentsName?.sop && (
                        <a
                          href={`${baseUrl}uploads/studentAdditionalDocs/${documentsName?.sop}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                        >
                          <div className=" p-1">{documentsName?.sop ? "PTE Account Credentials" : ""}</div>
                        </a>
                      )}
                      {documentsName?.sop && (
                        <i onClick={() => deleteAdditionalDoc("sop")} className="mdi mdi-delete mt-1 ps-1"></i>
                      )}
                    </div>
                  </Col>

                  <Col md={6} lg={6} xl={6} xxl={4}>
                    <Form.Group className="mb-2 mt-3" controlId="gte_form">
                      <Form.Label>
                         Application/GTE Form
                      </Form.Label>
                      <FormInput type="file" name="gte_form" onChange={(e) => handleFileChange(e)} />
                    </Form.Group>
                    <div className="d-flex">
                      {documentsName?.gte_form && (
                        <a
                          href={`${baseUrl}uploads/studentAdditionalDocs/${documentsName?.gte_form}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                        >
                          <div className=" p-1">{documentsName?.gte_form ? "PTE Account Credentials" : ""}</div>
                        </a>
                      )}
                      {documentsName?.gte_form && (
                        <i onClick={() => deleteAdditionalDoc("gte_form")} className="mdi mdi-delete mt-1 ps-1"></i>
                      )}
                    </div>
                  </Col>

                  <Button className="mt-3" onClick={handleSubmit}>
                    Save
                  </Button>
                </Row>
              </Card>
            </Row>
          )}
        </Row>
      )}
    </>
  );
};

export default AdditionalDocuments;
