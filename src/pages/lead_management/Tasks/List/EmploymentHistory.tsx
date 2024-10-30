import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { FormInput } from "../../../../components";
import { baseUrl, showSuccessAlert } from "../../../../constants";
import axios from "axios";
import Swal from "sweetalert2";

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
  const [noticePeriod, setNoticePeriod] = useState<boolean>(false);
  const [terminated, setTerminated] = useState<boolean>(false);
  const [relation, setRelation] = useState<boolean>(false);
  const [forgotDocuments, setForgotDocuments] = useState<boolean>(false);
  const [abroadWork, setAbroadWork] = useState<boolean>(false);

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

      // formBody.append("served_notice_period", JSON.stringify(noticePeriod))
      // formBody.append("terminated_from_company", JSON.stringify(terminated))
      // formBody.append("good_relation_with_employers", JSON.stringify(relation))
      // formBody.append("submitted_forged_documents", JSON.stringify(forgotDocuments))
      // formBody.append("has_abroad_work_evidence", JSON.stringify(abroadWork));

      formBody.append("visaPage", documents.visaPage);
      formBody.append("permitCard", documents.permitCard);
      formBody.append("salaryAccountStatement", documents.salaryAccountStatement);
      formBody.append("supportingDocuments", documents.supportingDocuments);

      const swalResult = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save",
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

        // setNoticePeriod(result?.data?.data?.served_notice_period || false);
        // setTerminated(result?.data?.data?.terminated_from_company || false);
        // setRelation(result?.data?.data?.good_relation_with_employers || false);
        // setForgotDocuments(result?.data?.data?.submitted_forged_documents || false);
        // setAbroadWork(result?.data?.data?.has_abroad_work_evidence || false);
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

  // if (isLoading) {
  //   return (
  //     <Spinner
  //       animation="border"
  //       style={{ position: "absolute", top: "50%", left: "50%" }}
  //     />
  //   );
  // }

  return (
    <>
      <h5 className="mb-1 mt-4 text-uppercase">
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
                // checked={noticePeriod}
                checked={formData?.noticePeriod}
                // onChange={() => setNoticePeriod(true)}
                onChange={(e) => handleChange(e, true)}
                name="noticePeriod"
              />

              <Form.Check
                type="radio"
                id="noticePeriod"
                label="No"
                // checked={!noticePeriod}
                checked={!formData?.noticePeriod}
                // onChange={() => setNoticePeriod(false)}
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
                // checked={terminated}
                checked={formData?.terminated}
                // onChange={() => setTerminated(true)}
                onChange={(e) => handleChange(e, true)}
                name="terminated"
              />

              <Form.Check
                type="radio"
                id="terminated"
                label="No"
                // checked={!terminated}
                checked={!formData?.terminated}
                // onChange={() => setTerminated(false)}
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
                // checked={relation}
                checked={formData?.relation}
                // onChange={() => setRelation(true)}
                onChange={(e) => handleChange(e, true)}
                name="relation"
              />

              <Form.Check
                type="radio"
                id="relation"
                label="No"
                // checked={!relation}
                checked={!formData?.relation}
                // onChange={() => setRelation(false)}
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
                // checked={forgotDocuments}
                checked={formData?.forgotDocuments}
                // onChange={() => setForgotDocuments(true)}
                onChange={(e) => handleChange(e, true)}
                name="forgotDocuments"
              />

              <Form.Check
                type="radio"
                id="forgotDocuments"
                label="No"
                // checked={!forgotDocuments}
                checked={!formData?.forgotDocuments}
                // onChange={() => setForgotDocuments(false)}
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
                // checked={abroadWork}
                checked={formData?.abroadWork}
                // onChange={() => setAbroadWork(true)}
                onChange={(e) => handleChange(e, true)}
                name="abroadWork"
              />

              <Form.Check
                type="radio"
                id="abroadWork"
                label="No"
                // checked={!abroadWork}
                checked={!formData?.abroadWork}
                // onChange={() => setAbroadWork(false)}
                onChange={(e) => handleChange(e, false)}
                name="abroadWork"
              />
            </Col>
          </Form.Group>
        </Col>

        <Col md={6} lg={6} xl={6} xxl={4}>
          <Form.Group className="mb-2" controlId="visaPage">
            <Form.Label>
              <span className="text-danger">* </span>
              Visa Page
            </Form.Label>
            <FormInput type="file" name="visaPage" onChange={(e) => handleFileChange(e)} />
          </Form.Group>
          <div className="d-flex mb-2">
            {documentsName?.visa_page && (
              <a
                href={`${baseUrl}/uploads/experienceHistoryDocs/${documentsName?.visa_page}`}
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
            <Form.Label>
              <span className="text-danger">* </span>
              Permit Card
            </Form.Label>
            <FormInput type="file" name="permitCard" onChange={(e) => handleFileChange(e)} />
          </Form.Group>
          <div className="d-flex mb-2">
            {documentsName?.permit_card && (
              <a
                href={`${baseUrl}/uploads/experienceHistoryDocs/${documentsName?.permit_card}`}
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
            <Form.Label>
              <span className="text-danger">* </span>
              Salary Account Statement
            </Form.Label>
            <FormInput type="file" name="salaryAccountStatement" onChange={(e) => handleFileChange(e)} />
          </Form.Group>
          <div className="d-flex mb-2">
            {documentsName?.salary_account_statement && (
              <a
                href={`${baseUrl}/uploads/experienceHistoryDocs/${documentsName?.salary_account_statement}`}
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
            <Form.Label>
              <span className="text-danger">* </span>
              Supporting Documents
            </Form.Label>
            <FormInput type="file" name="supportingDocuments" onChange={(e) => handleFileChange(e)} />
          </Form.Group>
          <div className="d-flex mb-2">
            {documentsName?.supporting_documents && (
              <a
                href={`${baseUrl}/uploads/experienceHistoryDocs/${documentsName?.supporting_documents}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
              >
                <div className=" p-1">{documentsName?.supporting_documents ? "Supporting Documents" : ""}</div>
              </a>
            )}
          </div>
        </Col>

        <Button className="mt-1" onClick={onSubmit}>
          Save Experience History
        </Button>
      </Row>
    </>
  );
};

export default EmploymentHistory;
