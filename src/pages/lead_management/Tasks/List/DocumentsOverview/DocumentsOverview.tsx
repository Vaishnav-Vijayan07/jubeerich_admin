import React, { useEffect, useState } from 'react'
import { Badge, Card, Col, Form, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';
import { baseUrl } from '../../../../../constants';
import { boolean } from 'yup';
import axios from 'axios';
import { FormInput } from '../../../../../components';
import { Visa_Types } from '../data';
import { fundTypeOptions } from '../FundPlan/FundPlanRows';
import { Link } from 'react-router-dom';
import noFile from '../../../../../assets/images/icons/file_not_found.svg'

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

    const getFileType = (fileName: string) => {
        if (!fileName) return ''
        const parts = fileName.split(".");
        const ext = parts.pop();
        return ext ? ext.toLowerCase() : '';
    }
    
    const getFileName = (fileName: string) => {
        if (!fileName) return '';
        const parts = fileName.split(".");
        const extension = parts.pop();
        let name = parts.join(".");
    
        const hyphenCount = (name.match(/-/g) || []).length;
    
        if (hyphenCount === 3) {
            const hyphenIndex = name.indexOf("-");
            if (hyphenIndex !== -1) {
                name = name.slice(hyphenIndex + 1).trim();
            }
        }
    
        if (name.length > 25) {
            name = name.slice(0, 25) + "...";
        }
    
        return name;
    }
    
    

    const FileDisplay = (props: any) => {
        const { fileName, filePath } = props

        return (
            <>
                <Card className="mb-1 mt-1 shadow-none border">
                    <div className="p-2">
                        <Row className="align-items-center">
                            {fileName && <Col className="col-auto">
                                <div className="avatar-sm">
                                    <span className="avatar-title badge-soft-primary text-primary rounded">.{getFileType(fileName)}</span>
                                </div>
                            </Col>}

                            {fileName && <Col className="ps-0">
                                <Link to="#" className="text-muted fw-bold">
                                    {getFileName(fileName)}
                                </Link>
                                <br />
                            </Col>}

                            {!fileName && <Col className="d-flex-col justify-content-end col-auto">
                                <img src={noFile} alt="date logo" width={37.3} className="" />
                                <span className='ms-1'>File Not Uploaded</span>
                            </Col>}

                            {fileName && <Col className="col-auto">
                                <a
                                    href={`${baseUrl}/uploads/${filePath}/${fileName}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    id="btn-download"
                                    className="btn btn-link font-16 text-muted"
                                >
                                    <i className="dripicons-download"></i>
                                </a>
                            </Col>}
                        </Row>
                    </div>
                </Card>
            </>
        )
    }

    // if (isLoading) {
    //     return <Spinner animation="border" style={{ position: "absolute", top: "100%", left: "50%" }} />;
    // }

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
                                <span className='border bg-secondary rounded-2'>
                                    <Form.Label className='fs-4 mt-1 text-white'>Additional Documents</Form.Label>
                                </span>
                                <Row className='ms-3'>
                                    <Col md={6} lg={6} xl={6} xxl={4} >
                                        <div className="d-flex">
                                            <Col className='mt-2'>
                                                <Form.Group className="mb-2" controlId="visa_type">
                                                    <Form.Label>
                                                        Visa Type
                                                    </Form.Label>
                                                    <FileDisplay fileName={additionalDocs?.passport_doc} filePath={'studentAdditionalDocs'} />
                                                </Form.Group>
                                            </Col>
                                        </div>
                                    </Col>

                                    <Col md={6} lg={6} xl={6} xxl={4} >
                                        <div className="d-flex">
                                            <Col className='mt-2'>
                                                <Form.Group className="mb-2" controlId="updated_cv">
                                                    <Form.Label>
                                                        Updated CV
                                                    </Form.Label>
                                                    <FileDisplay fileName={additionalDocs?.updated_cv} filePath={'studentAdditionalDocs'} />
                                                </Form.Group>
                                            </Col>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='ms-3'>
                                    <Col md={6} lg={6} xl={6} xxl={4} >
                                        <div className="d-flex">
                                            <Col className='mt-2'>
                                                <Form.Group className="mb-2" controlId="updated_cv">
                                                    <Form.Label>
                                                        Profile Assessment
                                                    </Form.Label>
                                                    <FileDisplay fileName={additionalDocs?.profile_assessment_doc} filePath={'studentAdditionalDocs'} />
                                                </Form.Group>
                                            </Col>
                                        </div>
                                    </Col>

                                    <Col md={6} lg={6} xl={6} xxl={4} >
                                        <div className="d-flex">
                                            <Col className='mt-2'>
                                                <Form.Group className="mb-2" controlId="lor">
                                                    <Form.Label>
                                                        Letter of recommendation
                                                    </Form.Label>
                                                    <FileDisplay fileName={additionalDocs?.lor} filePath={'studentAdditionalDocs'} />
                                                </Form.Group>
                                            </Col>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='ms-3'>
                                    <Col md={6} lg={6} xl={6} xxl={4} >
                                        <div className="d-flex">
                                            <Col className='mt-2'>
                                                <Form.Group className="mb-2" controlId="sop">
                                                    <Form.Label>
                                                        Statement of Purpose
                                                    </Form.Label>
                                                    <FileDisplay fileName={additionalDocs?.sop} filePath={'studentAdditionalDocs'} />
                                                </Form.Group>
                                            </Col>
                                        </div>
                                    </Col>

                                    <Col md={6} lg={6} xl={6} xxl={4} >
                                        <div className="d-flex">
                                            <Col className='mt-2'>
                                                <Form.Group className="mb-2" controlId="gte_form">
                                                    <Form.Label>
                                                        Application/GTE Form
                                                    </Form.Label>
                                                    <FileDisplay fileName={additionalDocs?.gte_form} filePath={'studentAdditionalDocs'} />
                                                </Form.Group>
                                            </Col>
                                        </div>
                                    </Col>
                                </Row>
                            </Row>

                            {/* Visa Approvals */}

                            <Row className='ms-4 mt-2'>
                                <span className='border bg-secondary rounded-2'>
                                    <Form.Label className='fs-4 mt-1 text-white' >Previous Visa Approval</Form.Label>
                                </span>
                                {visaApprovals && visaApprovals.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                        <Row  className='mt-3'>
                                            <Form.Group className="mb-2" controlId="visa_type">
                                                <Form.Label>
                                                    {`Visa Type`} - {formatVisaName(data?.visa_type)} 
                                                </Form.Label>
                                            </Form.Group>
                                        </Row>
                                        <Row >
                                            <Col md={6} lg={6} xl={6} xxl={4}>
                                            <Form.Group className="mb-2" controlId="approved_letter">
                                                <Form.Label>
                                                    Approved Letter
                                                </Form.Label>
                                                <FileDisplay fileName={data?.approved_letter} filePath={''} />
                                            </Form.Group>
                                            </Col>
                                        </Row>
                                        <hr className='mt-3' />
                                    </Row>
                                ))}
                            </Row>

                            {/* Visa Declines */}
                            <Row className='ms-4 mt-2'>
                                <span className='border bg-secondary rounded-2'>
                                    <Form.Label className='fs-4 mt-1 text-white' >Previous Visa Declines</Form.Label>
                                </span>
                                {visaDeclines && visaDeclines.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                        <Row className='mt-3'>
                                            <Form.Group className="mb-2" controlId="visa_type">
                                                <Form.Label>
                                                   {`Visa Type`} - {formatVisaName(data?.visa_type)}
                                                </Form.Label>
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                        <Col md={6} lg={6} xl={6} xxl={4}>
                                            <Form.Group className="mb-1" controlId="declined_letter">
                                                <Form.Label>
                                                    Declined Letter
                                                </Form.Label>
                                                <FileDisplay fileName={data?.declined_letter} filePath={''} />
                                            </Form.Group>
                                            </Col>
                                        </Row>
                                        <hr className='mt-3' />
                                    </Row>
                                ))}
                            </Row>

                            {/* Fund Plans */}

                            <Row className='ms-4 mt-3'>
                                <span className='border bg-secondary rounded-2'>

                                    <Form.Label className='fs-4 mt-1 text-white' >Fund Plans</Form.Label>
                                </span>
                                {fundPlan && fundPlan.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                        <Row md={6} lg={6} xl={6} xxl={4} className='mt-2'>
                                            <Form.Group className="mb-2" controlId="type">
                                                <Form.Label>
                                                    {'Type'} - {formatFundName(data?.type)}
                                                </Form.Label>
                                            </Form.Group>
                                        </Row>
                                        <Row >
                                        <Col md={6} lg={6} xl={6} xxl={4}>
                                            <Form.Group className="mb-2" controlId="supporting_document">
                                                <Form.Label>
                                                    Supporting Document
                                                </Form.Label>
                                                <FileDisplay fileName={data?.supporting_document} filePath={'fundDocuments'}/>
                                            </Form.Group>
                                            </Col>
                                        </Row>
                                        <hr className='mt-3' />
                                    </Row>
                                ))}
                            </Row>

                            {/* Education Details */}
                            
                            <Row className='ms-4 mt-3'>
                                <span className='border bg-secondary rounded-2'>

                                    <Form.Label className='fs-4 mt-1 text-white' >Education Details</Form.Label>
                                </span>
                                {educationDocs && educationDocs.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                            <Col className='mt-3'>
                                                <Form.Group className="mb-2" controlId="type">
                                                    <Form.Label>
                                                        {'Qualification'} - {data?.qualification}
                                                    </Form.Label>
                                                </Form.Group>
                                            </Col>
                                        <Row>
                                            <Col >
                                                <Form.Group className="mb-2" controlId="mark_sheet">
                                                    <Form.Label>
                                                        Mark Sheet
                                                    </Form.Label>
                                                    <FileDisplay fileName={data?.mark_sheet} filePath={'educationDocuments'} />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-2" controlId="admit_card">
                                                    <Form.Label>
                                                        Admit Card
                                                    </Form.Label>
                                                    <FileDisplay fileName={data?.admit_card} filePath={'educationDocuments'} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                        <Col md={6} lg={6} xl={6} xxl={4}>
                                                <Form.Group className="mb-2" controlId="certificate">
                                                    <Form.Label>
                                                        Admit Card
                                                    </Form.Label>
                                                    <FileDisplay fileName={data?.certificate} filePath={'educationDocuments'} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <hr className='mt-3' />
                                    </Row>
                                ))}
                            </Row>

                            {/* Work Info */}

                            <Row className='ms-4 mt-3'>
                                <span className='border bg-secondary rounded-2'>
                                    <Form.Label className='fs-4 mt-1 text-white' >Work Info</Form.Label>
                                </span>
                                {workInfoDocs && workInfoDocs.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                            <Col md={6} lg={6} xl={6} xxl={4} className='mt-2'>
                                                <Form.Group className="mb-2" controlId="type">
                                                    <Form.Label>
                                                        {'Company'} - {data?.company}
                                                    </Form.Label>
                                                </Form.Group>
                                            </Col>
                                        <Row>
                                            <Col>
                                                <Form.Group className="mb-2" controlId="bank_statement">
                                                    <Form.Label>
                                                        Bank Statement
                                                    </Form.Label>
                                                    <FileDisplay fileName={data?.bank_statement} filePath={'workDocuments'} />
                                                </Form.Group>
                                            </Col>
                                            <Col >
                                                <Form.Group className="mb-2" controlId="job_offer_document">
                                                    <Form.Label>
                                                        Job Offer Document
                                                    </Form.Label>
                                                    <FileDisplay fileName={data?.job_offer_document} filePath={'workDocuments'} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col style={{ paddingTop: "1rem" }}>
                                                <Form.Group className="mb-2" controlId="experience_certificate">
                                                    <Form.Label>
                                                        Experience Certificate
                                                    </Form.Label>
                                                    <FileDisplay fileName={data?.experience_certificate} filePath={'workDocuments'} />
                                                </Form.Group>
                                            </Col>
                                            <Col style={{ paddingTop: "1rem" }}>
                                                <Form.Group className="mb-2" controlId="appointment_document">
                                                    <Form.Label>
                                                        Appointment Letter
                                                    </Form.Label>
                                                    <FileDisplay fileName={data?.appointment_document} filePath={'workDocuments'} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                        <Col md={6} lg={6} xl={6} xxl={4} style={{ paddingTop: "1rem" }}>
                                                <Form.Group className="mb-2" controlId="payslip_document">
                                                    <Form.Label>
                                                        Pay Slip
                                                    </Form.Label>
                                                    <FileDisplay fileName={data?.payslip_document} filePath={'workDocuments'} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <hr className='mt-3' />
                                    </Row>
                                ))}
                            </Row>

                            {/* Exam Details */}

                            <Row className='ms-4 mt-3'>
                                <span className='border bg-secondary rounded-2 mb-3'>
                                    <Form.Label className='fs-4 mt-1 text-white' >Exam Details</Form.Label>
                                </span>
                                {examDocs && examDocs.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                        <Row >
                                            <Form.Group className="mb-2" controlId="exam_type">
                                                <Form.Label>
                                                    {'Exam Type'} - {data?.exam_type}
                                                </Form.Label>
                                            </Form.Group>
                                        </Row>
                                        <Row >
                                            <Form.Group className="mb-2" controlId="overall_score">
                                                <Form.Label>
                                                    {'Overall Score'} - {data?.overall_score}
                                                </Form.Label>
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                        <Col md={6} lg={6} xl={6} xxl={4}>                                            
                                            <Form.Group className="mb-2" controlId="score_card">
                                                <Form.Label>
                                                    Score Card
                                                </Form.Label>
                                                <FileDisplay fileName={data?.score_card} filePath={'examDocuments'} />
                                            </Form.Group>
                                            </Col>
                                        </Row>
                                        <hr className='mt-3' />
                                    </Row>
                                ))}
                            </Row>

                            {/* Police Documents */}

                            <Row className='ms-4 mt-3'>
                                <span className='border bg-secondary rounded-2'>

                                    <Form.Label className='fs-4 mt-1 text-white' >Police Documents</Form.Label>
                                </span>
                                {policeDocs && policeDocs.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                        <Row className='mt-2'>
                                            <Form.Group className="mb-2" controlId="country_name">
                                                <Form.Label>
                                                    {'Country'} - {data?.country_name}
                                                </Form.Label>
                                            </Form.Group>
                                        </Row>
                                        <Row >
                                        <Col md={6} lg={6} xl={6} xxl={4}>  
                                            <Form.Group className="mb-2" controlId="score_card">
                                                <Form.Label>
                                                    Police Clearence Certificate
                                                </Form.Label>
                                                <FileDisplay fileName={data?.certificate} filePath={'policeClearenceDocuments'} />
                                            </Form.Group>
                                            </Col>
                                        </Row>
                                        <hr className='mt-3' />
                                    </Row>
                                ))}
                            </Row>

                            {/* Employement Histories */}

                            <Row className='ms-4 mt-3'>
                                <span className='border bg-secondary rounded-2 mb-3'>
                                    <Form.Label className='fs-4 mt-1 text-white' >Employement Histories</Form.Label>
                                </span>
                                {empHistories && (
                                    <Row className='ms-3'>
                                        <Row>
                                            <Col>
                                                <Form.Group className="mb-2" controlId="visa_page">
                                                    <Form.Label>
                                                        Visa Page
                                                    </Form.Label>
                                                    <FileDisplay fileName={empHistories?.visa_page} filePath={'experienceHistoryDocs'} />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-2" controlId="permit_card">
                                                    <Form.Label>
                                                        Permit Card
                                                    </Form.Label>
                                                    <FileDisplay fileName={empHistories?.permit_card} filePath={'experienceHistoryDocs'} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Form.Group className="mb-2" controlId="salary_account_statement">
                                                    <Form.Label>
                                                        Salary Account Statement
                                                    </Form.Label>
                                                    <FileDisplay fileName={empHistories?.salary_account_statement} filePath={'experienceHistoryDocs'} />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-2" controlId="supporting_documents">
                                                    <Form.Label>
                                                        Supporting Documents
                                                    </Form.Label>
                                                    <FileDisplay fileName={empHistories?.supporting_documents} filePath={'experienceHistoryDocs'} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
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