import React, { useEffect, useState } from 'react'
import { Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { baseUrl } from '../../../../../constants';
import { boolean } from 'yup';
import axios from 'axios';
import { FormInput } from '../../../../../components';
import { Visa_Types } from '../data';
import { fundTypeOptions } from '../FundPlan/FundPlanRows';

const DocumentsOverview = (props: any) => {
    const { studentId } = props
    console.log('studentId', studentId);


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [visaApprovals, setVisaApprovals] = useState<any>([]);
    const [visaDeclines, setVisaDeclines] = useState<any>([]);
    const [fundPlan, setFundPlan] = useState<any>([]);
    const [educationDocs, setEducationDocs] = useState<any>([]);
    const [workInfoDocs, setWorkInfoDocs] = useState<any>([]);
    const [examDocs, setExamDocs] = useState<any>([]);
    const [policeDocs, setPoliceDocs] = useState<any>([]);
    const [empHistories, setEmpHistories] = useState<any>([]);
    const [additionalDocs, setAdditionalDocs] = useState<any>({
        passport_doc: "",
        updated_cv: "",
        profile_assessment_doc: "",
        pte_cred: "",
        lor: "",
        sop: "",
        gte_form: ""
    });

    const fetchAllDocs = async () => {
        try {
            setIsLoading(true)
            const result = await axios.get(`/fetch_all_user_docs/${studentId}`);
            console.log(result?.data?.data);

            if (result?.data?.status) {
                setAdditionalDocs(result?.data?.data?.additional_docs)
                setVisaApprovals(result?.data?.data?.previousVisaApprovals)
                setVisaDeclines(result?.data?.data?.previousVisaDeclines)
                setFundPlan(result?.data?.data?.fundPlan)
                setEducationDocs(result?.data?.data?.educationDetails)
                setWorkInfoDocs(result?.data?.data?.userWorkInfos)
                setExamDocs(result?.data?.data?.exams)
                setPoliceDocs(result?.data?.data?.basic_info_details?.police_clearance_docs)
                setEmpHistories(result?.data?.data?.userEmploymentHistories)
                setIsLoading(false)
            }

        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAllDocs();
    }, [])

    const formatVisaName = (name: any) => {
        let res;
        if (name) {
            res = Visa_Types.filter((data: any) => data?.value == name)
            return res?.[0]?.label
        }
    }

    const formatFundName = (name: any) => {
        let res;
        if (name) {
            res = fundTypeOptions.filter((data: any) => data?.value == name)
            return res?.[0]?.label
        }
    }


    if (isLoading) {
        return <Spinner animation="border" style={{ position: "absolute", top: "100%", left: "50%" }} />;
    }

    return (
        <>
            <Row>
                <h5 className="mb-4 text-uppercase">
                    <i className="mdi mdi-account-circle me-1"></i>Documents Overview
                </h5>
                {!isLoading && (
                    <Row>
                        <Card>
                            {/* Additional Documents */}
                            <Row className='ms-4'>
                                <Form.Label className='fs-4'>Additional Documents</Form.Label>
                                <Col md={6} lg={6} xl={6} xxl={4} className='mt-3'>
                                    <div className="d-flex">
                                        {additionalDocs?.passport_doc && (
                                            <a
                                                href={`${baseUrl}/uploads/studentAdditionalDocs/${additionalDocs?.passport_doc}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                            >
                                                <div className=" p-1">{additionalDocs?.passport_doc ? "Passport Document" : ""}</div>
                                            </a>
                                        )}
                                    </div>
                                </Col>

                                <Col md={6} lg={6} xl={6} xxl={4} className='mt-3'>
                                    <div className="d-flex">
                                        {additionalDocs?.updated_cv && (
                                            <a
                                                href={`${baseUrl}/uploads/studentAdditionalDocs/${additionalDocs?.updated_cv}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                            >
                                                <div className=" p-1">{additionalDocs?.updated_cv ? "Updated CV" : ""}</div>
                                            </a>
                                        )}
                                    </div>
                                </Col>

                                <Col md={6} lg={6} xl={6} xxl={4} className='mt-3'>
                                    <div className="d-flex">
                                        {additionalDocs?.profile_assessment_doc && (
                                            <a
                                                href={`${baseUrl}/uploads/studentAdditionalDocs/${additionalDocs?.profile_assessment_doc}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                            >
                                                <div className=" p-1">
                                                    {additionalDocs?.profile_assessment_doc ? "Profile Assessment Certificate" : ""}
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                </Col>

                                <Col md={6} lg={6} xl={6} xxl={4} className='mt-3'>
                                    <div className="d-flex">
                                        {additionalDocs?.lor && (
                                            <a
                                                href={`${baseUrl}/uploads/studentAdditionalDocs/${additionalDocs?.lor}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                            >
                                                <div className=" p-1">{additionalDocs?.lor ? "PTE Account Credentials" : ""}</div>
                                            </a>
                                        )}
                                    </div>
                                </Col>

                                <Col md={6} lg={6} xl={6} xxl={4} className='mt-3'>
                                    <div className="d-flex">
                                        {additionalDocs?.sop && (
                                            <a
                                                href={`${baseUrl}/uploads/studentAdditionalDocs/${additionalDocs?.sop}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                            >
                                                <div className=" p-1">{additionalDocs?.sop ? "PTE Account Credentials" : ""}</div>
                                            </a>
                                        )}
                                    </div>
                                </Col>

                                <Col md={6} lg={6} xl={6} xxl={4} className='mt-3'>
                                    <div className="d-flex">
                                        {additionalDocs?.gte_form && (
                                            <a
                                                href={`${baseUrl}/uploads/studentAdditionalDocs/${additionalDocs?.gte_form}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                            >
                                                <div className=" p-1">{additionalDocs?.gte_form ? "PTE Account Credentials" : ""}</div>
                                            </a>
                                        )}
                                    </div>
                                </Col>
                            </Row>

                            {/* Visa Approvals */}
                            <Row className='ms-4 mt-3'>
                                <Form.Label className='fs-4'>Previous Visa Approval</Form.Label>
                                {visaApprovals && visaApprovals.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                        <Col md={6} lg={6} xl={6} xxl={4} className='mt-3'>
                                            <Form.Group className="mb-2" controlId="visa_type">
                                                <Form.Label>
                                                    Visa Type
                                                </Form.Label>
                                                <FormInput type="text" name="visa_type" value={formatVisaName(data?.visa_type)} disabled={true} />
                                            </Form.Group>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/studentAdditionalDocs/${data?.approved_letter}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{data?.approved_letter ? "Approved Letter" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                    </Row>
                                ))}
                            </Row>

                            {/* Visa Declines */}
                            <Row className='ms-4 mt-3'>
                                <Form.Label className='fs-4'>Previous Visa Declines</Form.Label>
                                {visaDeclines && visaDeclines.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                        <Col md={6} lg={6} xl={6} xxl={4} className='mt-3'>
                                            <Form.Group className="mb-2" controlId="visa_type">
                                                <Form.Label>
                                                    Visa Type
                                                </Form.Label>
                                                <FormInput type="text" name="visa_type" value={formatVisaName(data?.visa_type)} disabled={true} />
                                            </Form.Group>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/${data?.declined_letter}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{data?.declined_letter ? "Declined Letter" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                    </Row>
                                ))}
                            </Row>

                            {/* Fund Plans */}
                            <Row className='ms-4 mt-3'>
                                <Form.Label className='fs-4'>Fund Plans</Form.Label>
                                {fundPlan && fundPlan.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                        <Col md={6} lg={6} xl={6} xxl={4} className='mt-3'>
                                            <Form.Group className="mb-2" controlId="type">
                                                <Form.Label>
                                                    Type
                                                </Form.Label>
                                                <FormInput type="text" name="type" value={formatFundName(data?.type)} disabled={true} />
                                            </Form.Group>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/fundDocuments/${data?.supporting_document}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{data?.supporting_document ? "Supporting Document" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                    </Row>
                                ))}
                            </Row>

                            {/* Education Details */}
                            <Row className='ms-4 mt-3'>
                                <Form.Label className='fs-4'>Education Details</Form.Label>
                                {educationDocs && educationDocs.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                        <Col md={6} lg={6} xl={6} xxl={4} className='mt-3'>
                                            <Form.Group className="mb-2" controlId="type">
                                                <Form.Label>
                                                    Qualification
                                                </Form.Label>
                                                <FormInput type="text" name="type" value={data?.qualification} disabled={true} />
                                            </Form.Group>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/educationDocuments/${data?.mark_sheet}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{data?.mark_sheet ? "Mark Sheet" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/educationDocuments/${data?.admit_card}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{data?.admit_card ? "Admit Card" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/educationDocuments/${data?.certificate}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{data?.certificate ? "Certificate" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                    </Row>
                                ))}
                            </Row>

                            {/* Work Info */}
                            <Row className='ms-4 mt-3'>
                                <Form.Label className='fs-4'>Work Info</Form.Label>
                                {workInfoDocs && workInfoDocs.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                        <Col md={6} lg={6} xl={6} xxl={4} className='mt-3'>
                                            <Form.Group className="mb-2" controlId="type">
                                                <Form.Label>
                                                    Company
                                                </Form.Label>
                                                <FormInput type="text" name="type" value={data?.company} disabled={true} />
                                            </Form.Group>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/workDocuments/${data?.bank_statement}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{data?.bank_statement ? "Bank Statement" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/educationDocuments/${data?.job_offer_document}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{data?.job_offer_document ? "Job Offer Document" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/educationDocuments/${data?.experience_certificate}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{data?.experience_certificate ? "Experience Certificate" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/educationDocuments/${data?.appointment_document}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{data?.appointment_document ? "Appointment Document" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/educationDocuments/${data?.payslip_document}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{data?.payslip_document ? "Payslip Document" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                    </Row>
                                ))}
                            </Row>

                            {/* Exam Details */}
                            <Row className='ms-4 mt-3'>
                                <Form.Label className='fs-4'>Exam Details</Form.Label>
                                {examDocs && examDocs.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                        <Col md={6} lg={6} xl={6} xxl={4} className='mt-3'>
                                            <Form.Group className="mb-2" controlId="exam_type">
                                                <Form.Label>
                                                    Exam Type
                                                </Form.Label>
                                                <FormInput type="text" name="exam_type" value={data?.exam_type} disabled={true} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6} lg={6} xl={6} xxl={4} className='mt-3'>
                                            <Form.Group className="mb-2" controlId="overall_score">
                                                <Form.Label>
                                                    Overall Score
                                                </Form.Label>
                                                <FormInput type="text" name="overall_score" value={data?.overall_score} disabled={true} />
                                            </Form.Group>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/workDocuments/${data?.score_card}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{data?.score_card ? "Score Card" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                    </Row>
                                ))}
                            </Row>
                            
                            {/* Police Documents */}
                            <Row className='ms-4 mt-3'>
                                <Form.Label className='fs-4'>Police Documents</Form.Label>
                                {policeDocs && policeDocs.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                        <Col md={6} lg={6} xl={6} xxl={4} className='mt-3'>
                                            <Form.Group className="mb-2" controlId="country_name">
                                                <Form.Label>
                                                    Country
                                                </Form.Label>
                                                <FormInput type="text" name="country_name" value={data?.country_name} disabled={true} />
                                            </Form.Group>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/workDocuments/${data?.certificate}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{data?.certificate ? "Certificate" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                    </Row>
                                ))}
                            </Row>

                            {/* Employement Histories */}
                            <Row className='ms-4 mt-3'>
                                <Form.Label className='fs-4'>Employement Histories</Form.Label>
                                {empHistories && (
                                    <Row className='ms-3'>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/workDocuments/${empHistories?.visa_page}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{empHistories?.visa_page ? "Visa Page" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/workDocuments/${empHistories?.permit_card}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{empHistories?.permit_card ? "Permit Card" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/workDocuments/${empHistories?.permit_card}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{empHistories?.permit_card ? "Permit Card" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/workDocuments/${empHistories?.permit_card}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{empHistories?.permit_card ? "Permit Card" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/workDocuments/${empHistories?.salary_account_statement}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{empHistories?.salary_account_statement ? "Salary Statement" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                        <Col className='mt-4' style={{ paddingTop: "1rem" }}>
                                            <div className="d-flex">
                                                <a
                                                    href={`${baseUrl}/uploads/workDocuments/${empHistories?.supporting_documents}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                                                >
                                                    <div className=" p-1">{empHistories?.supporting_documents ? "Supporting Documents" : "No File Uploaded"}</div>
                                                </a>
                                            </div>
                                        </Col>
                                    </Row>
                                )}
                            </Row>
                        </Card>
                    </Row>
                )}
            </Row>
        </>
    );
}

export default DocumentsOverview