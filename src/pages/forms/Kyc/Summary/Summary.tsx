import React, { Suspense, useEffect, useState } from 'react'
import CheckHeadings from '../../../../components/CheckHeadings'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { additionalDocs, applicationFeeCheck, AvailabilityCheck, campusCheck, educationCheck, educationDocs, empHistories, examDocs, fundPlan, gapCheck, graduationCheck, graduationDocs, policeDocs, qualityCheck, visaApproved, visaDeclined, workInfoDocs } from './data'
import { Box, ButtonBase, Collapse, Tab, Tabs } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import CheckQuality from '../../../../components/ApplicationChecks/CheckQuality'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ImmigrationDetails from '../../../../components/ApplicationChecks/DocsQuantity/ImmigrationDetails'
import VisaDeclineDetails from '../../../../components/ApplicationChecks/DocsQuantity/VisaDecline'
import AdditionalDocs from '../../../../components/ApplicationChecks/DocsQuantity/AdditionalDocs'
import FundDetails from '../../../../components/ApplicationChecks/DocsQuantity/FundDetails'
import EducationDetails from '../../../../components/ApplicationChecks/DocsQuantity/EducationDetails'
import ExamData from '../../../../components/ApplicationChecks/DocsQuantity/ExamData'
import GraduationDetails from '../../../../components/ApplicationChecks/DocsQuantity/GraduationInfo'
import WorkInfos from '../../../../components/ApplicationChecks/DocsQuantity/WorkInfos'
import PoliceDocs from '../../../../components/ApplicationChecks/DocsQuantity/PoliceDocs'
import EmpHistories from '../../../../components/ApplicationChecks/DocsQuantity/EmpHistories'
import axios from 'axios'

const Summary = () => {
    const [tabValue, setTabValue] = useState("educational_qualification");
    const [visaTabValue, setVisaTabValue] = useState("previous_visa_approval");
    const [quantityTabValue, setQuantityTabValue] = useState("additional_docs");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [summaryData, setSummaryData] = useState<any>(null);
    const navigate = useNavigate();

    const viewSummary = async() => {
        try {
            const { data } = await axios.get('/view_summary/1');
            console.log('DATA',data?.data);
            setSummaryData(data?.data)
            
        } catch (error) {
            console.log("Something went wrong");
        }
    }

    const educationCheckStyles = {
        backgroundColor: '#F0F0F080',
        maxWidth: "256px",
        width: "256px",
        height: '160px',
        maxHeight: '160px'
    }

    const tabsStyle = {
        "& .MuiTabs-indicator": {
            display: "none",
        },
        minHeight: "35px",
    };

    const individualTabStyle = {
        "&.Mui-selected": {
            color: "#FFFFFF",
            backgroundColor: "#6658DD",
            borderRadius: "0 0 8px 8px",
            height: '1px'
        },
        backgroundColor: "#E0DEF8",
        marginBottom: "0.6rem",
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 500,
        borderRadius: "0 0 8px 8px",
        marginRight: "20px",
        height: '35px',
        minHeight: "35px",
        padding: "0 12px", 
        textTransform: "none",
    };

    const tabsStyleCustom = {
        "& .MuiTab-root": {
            minWidth: "auto",
        },
        "& .MuiTabs-indicator": {
            display: "none",
        },
        minHeight: "35px",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: "8px",
        width: "100%",
        overflowY: "visible",
        overflowX: "hidden",
    };

    const individualTabStyleCustom = {
        "&.Mui-selected": {
            color: "#FFFFFF",
            backgroundColor: "#6658DD",
            borderRadius: "0px 0px 8px 8px",
            height: '1px'
        },
        backgroundColor: "#E0DEF8",
        marginBottom: "0.6rem",
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 500,
        borderRadius: "0px 0px 8px 8px",
        marginRight: "20px",
        height: '35px',
        minHeight: "35px",
        padding: "0 12px", 
        textTransform: "none",
    };

    const styles = {
        h5: { fontWeight: "600px", fontSize: "16px" },
        p: { fontWeight: "500px", fontSize: "14px" },
    };

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
        navigate(`?tab=${newValue}`);
    };

    const handleChangeVisaTab = (event: React.SyntheticEvent, newValue: string) => {
        setVisaTabValue(newValue);
        navigate(`?tab=${newValue}`);
    };

    const handleChangeQualityTab = (event: React.SyntheticEvent, newValue: string) => {
        setQuantityTabValue(newValue);
        navigate(`?tab=${newValue}`);
    };

    useEffect(() => {
        viewSummary()
    }, [])
    
    return (
        <>
            <Row className='mt-3'>
                <Col md={1} className="pe-0 ps-0" style={{ minHeight: "51px", maxHeight: "51px" }}>
                    <Button
                        className="h-100 w-100"
                        style={{
                            boxShadow: "0px 0px 17px -1px rgba(205,207,207,1)",
                            backgroundColor: "#FFFFFF",
                            color: "#343A40",
                            border: "none",
                            borderRadius: "8px",
                        }}
                    >
                        <span className='font-18 fw-semibold'>
                            <ArrowBackIosIcon />
                        </span>
                    </Button>
                </Col>
                <Col md={11} className="pe-0" style={{ minHeight: "51px", maxHeight: "51px" }}>
                    <Button
                        className="h-100 w-100 d-flex jsutify-content-start align-items-center"
                        style={{
                            boxShadow: "0px 0px 17px -1px rgba(205,207,207,1)",
                            backgroundColor: "#eefff2",
                            color: "#009a29",
                            border: "none",
                            borderRadius: "8px",
                        }}
                    >
                        <span className='font-18 fw-semibold'>
                            Summary
                        </span>
                    </Button>
                </Col>
            </Row>

            {/* Availability Check */}
            <Row className='mt-4'>
                <CheckHeadings title={"Program Availability Check"} />
            </Row>
            <Row className="mt-1">
                <Card className="basic-card bodrer rounded-4">
                    <Card.Body>
                        <Row>
                            <Col md={2} className="d-flex flex-column align-content-center text-center program-availability-col">
                                <h5 style={styles?.h5}>Country</h5>
                                <p style={styles?.p}>{summaryData?.AvailabilityCheck?.country || "N/A"}</p>
                            </Col>

                            <Col md={2} className="d-flex flex-column align-content-center text-center program-availability-col">
                                <h5 style={styles?.h5}>University</h5>
                                <p style={styles?.p}>{summaryData?.AvailabilityCheck?.university || "N/A"}</p>
                            </Col>

                            <Col md={2} className="d-flex flex-column align-content-center text-center program-availability-col">
                                <h5 style={styles?.h5}>Intake applying for</h5>
                                <p style={styles?.p}>{summaryData?.AvailabilityCheck?.intake || "N/A"}</p>
                            </Col>

                            <Col md={2} className="d-flex flex-column align-content-center text-center program-availability-col">
                                <h5 style={styles?.h5}>Course Link</h5>
                                <p style={styles?.p}>
                                    <a href={summaryData?.AvailabilityCheck?.course_link} target="_blank" rel="noopener noreferrer">
                                        {summaryData?.AvailabilityCheck?.course_link || "N/A"}
                                    </a>
                                </p>
                            </Col>

                            <Col md={2} className="d-flex flex-column align-content-center text-center program-availability-col">
                                <h5 style={styles?.h5}>Stream</h5>
                                <p style={styles?.p}>{summaryData?.AvailabilityCheck?.stream}</p>
                            </Col>

                            <Col md={2} className="d-flex flex-column align-content-center text-center">
                                <h5 style={styles?.h5}>Program</h5>
                                <p style={styles?.p}>{summaryData?.AvailabilityCheck?.program}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Row>

            {/* Campus Check  */}
            <Row className='mt-2'>
                <CheckHeadings title={"Campus Check"} />
            </Row>
            <Row className="mt-1">
                <Card className="basic-card bodrer rounded-4">
                    <Card.Body>
                        <Row className="mt-1 mb-2">
                            <Col md={6}>
                                <h5 style={styles.h5} >Campus</h5>
                                <p style={styles.p}>{summaryData?.campusCheck?.university}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Row>


            {/* Entry Requirement Check */}
            <Row className='mt-2'>
                <CheckHeadings title={"Entry Requirement Check"} />
            </Row>

            <Row className="mt-1">
                <Card className="bodrer rounded-4">
                    <Card.Body style={{ paddingTop: '0px' }}>
                        <Row>
                            <Tabs
                                value={tabValue}
                                onChange={handleChange}
                                textColor="secondary"
                                variant="scrollable"
                                aria-label="secondary tabs example"
                                sx={{ ...tabsStyle }}
                            >
                                <Tab value="educational_qualification" label="Educational Qualififcation" sx={{ ...individualTabStyle }} />
                                <Tab value="graduation_qualifications" label="Graduation Qualifications" sx={{ ...individualTabStyle }} />
                                <Tab value="gap_periods" label="Gap Periods" sx={{ ...individualTabStyle }} />
                            </Tabs>

                            <Box sx={{ p: 4 }}>
                                {tabValue == "educational_qualification" && (
                                    <Suspense fallback={null}>
                                        {summaryData?.educationCheck?.length > 0 && (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                                {summaryData?.educationCheck?.map((data: any) => (
                                                    <div style={{ ...educationCheckStyles }}>
                                                        <div className='ps-2 pt-2'>
                                                            <p className='fs-14 fw-semibold' style={{ lineHeight: '18px' }}>School Name: {data?.school_name}</p>
                                                            <p className='fs-14 fw-semibold'>Start Date: {data?.start_date}</p>
                                                            <p className='fs-14 fw-semibold'>End Date: {data?.end_date}</p>
                                                            <p className='fs-14 fw-semibold'>Percentage: {data?.percentage}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Suspense>
                                )}

                                {tabValue == "graduation_qualifications" && (
                                    <Suspense fallback={null}>
                                        {summaryData?.graduationCheck?.length > 0 && (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                                {summaryData?.graduationCheck?.map((data: any) => (
                                                    <div style={{ ...educationCheckStyles }}>
                                                        <div className='ps-2 pt-2'>
                                                            <p className='fs-14 fw-semibold' style={{ lineHeight: '18px' }}>College Name: {data?.school_name}</p>
                                                            <p className='fs-14 fw-semibold'>Start Date: {data?.start_date}</p>
                                                            <p className='fs-14 fw-semibold'>End Date: {data?.end_date}</p>
                                                            <p className='fs-14 fw-semibold'>Percentage: {data?.percentage}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Suspense>
                                )}

                                {tabValue == "gap_periods" && (
                                    <Suspense fallback={null}>
                                        {summaryData?.gapCheck?.length > 0 && (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                                {summaryData?.gapCheck?.map((data: any) => (
                                                    <div style={{ ...educationCheckStyles }}>
                                                        <div className='ps-2 pt-2'>
                                                            <p className='fs-14 fw-semibold' style={{ lineHeight: '18px' }}>School Name: {data?.reason}</p>
                                                            <p className='fs-14 fw-semibold'>Start Date: {data?.from}</p>
                                                            <p className='fs-14 fw-semibold'>End Date: {data?.to}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Suspense>
                                )}
                            </Box>
                        </Row>
                    </Card.Body>
                </Card>
            </Row>

            {/* Document Quality Check */}
            <Row className='mt-2'>
                <CheckHeadings title={"Document Quality Check"} />
            </Row>
            <Row className="mt-1">
                <Card className="basic-card bodrer rounded-4">
                    <Card.Body className="d-flex gap-2 justify-content-center">
                        <Col md={4} className="doc-quantity-item">
                            <CheckQuality
                                id={"formatting"}
                                type={"format"}
                                label={"Formatting"}
                                name={"formatting"}
                                onChange={() => { }}
                                checked={summaryData?.qualityCheck.formatting}
                            />
                        </Col>
                        <Col md={4} className="doc-quantity-item">
                            <CheckQuality
                                id={"clarity"}
                                type={"clarity"}
                                label={"Clarity"}
                                name={"clarity"}
                                onChange={() => { }}
                                checked={summaryData?.qualityCheck.clarity}
                            />
                        </Col>
                        <Col md={4} className="doc-quantity-item">
                            <CheckQuality
                                id={"scanning"}
                                type={"scan"}
                                label={"Scanning"}
                                name={"scanning"}
                                onChange={() => { }}
                                checked={summaryData?.qualityCheck.scanning}
                            />
                        </Col>
                    </Card.Body>
                </Card>
            </Row>

            {/* Document Quantity Check */}
            <Row className='mt-2'>
                <CheckHeadings title={"Document Quantity Check"} />
            </Row>

            <Row className="mt-1">
                <Card className="bodrer rounded-4">
                    <Card.Body style={{ paddingTop: '0px', paddingBottom: '1rem' }}>
                        <Row>
                            <Tabs
                                value={quantityTabValue}
                                onChange={handleChangeQualityTab}
                                textColor="secondary"
                                variant="scrollable"
                                aria-label="secondary tabs example"
                                sx={{ ...tabsStyle }}
                            >
                                {quantityTabValue == 'additional_docs' && <Tab value="additional_docs" label="Additional Documents" sx={{ ...individualTabStyleCustom }} />}
                                {quantityTabValue == 'previous_visa_approval' && <Tab value="previous_visa_approval" label="Previous Visa Approval" sx={{ ...individualTabStyleCustom }} />}
                                {quantityTabValue == 'previous_visa_declines' && <Tab value="previous_visa_declines" label="Previous Visa Declines" sx={{ ...individualTabStyleCustom }} />}
                                {quantityTabValue == 'fund_plan' && <Tab value="fund_plan" label="Fund Plans" sx={{ ...individualTabStyleCustom }} />}
                                {quantityTabValue == 'education_details' && <Tab value="education_details" label="Education Details" sx={{ ...individualTabStyleCustom }} />}
                                {quantityTabValue == 'exam_details' && <Tab value="exam_details" label="Exam Details" sx={{ ...individualTabStyleCustom }} />}
                                {quantityTabValue == 'police_documents' && <Tab value="police_documents" label="Police Documents" sx={{ ...individualTabStyleCustom }} />}
                                {quantityTabValue == 'emp_histories' && <Tab value="emp_histories" label="Employment Histories" sx={{ ...individualTabStyleCustom }} />}
                            </Tabs>

                            <Box>
                                {quantityTabValue == "additional_docs" && (
                                    <Suspense fallback={null}>
                                        <div className='p-2'>
                                            <AdditionalDocs AdditionalDocsData={summaryData?.additionalDocs || {}} />
                                        </div>
                                    </Suspense>
                                )}

                                {quantityTabValue == "previous_visa_approval" && (
                                    <Suspense fallback={null}>
                                        <div className='p-2'>
                                            {/* <VisaDeclineDetails VisaData={visaApproved || []} /> */}
                                            <ImmigrationDetails VisaData={summaryData?.visaApproved || []} />
                                        </div>
                                    </Suspense>
                                )}

                                {quantityTabValue == "previous_visa_declines" && (
                                    <Suspense fallback={null}>
                                        <div className='p-3'>
                                            {/* <VisaDeclineDetails VisaData={visaDeclined || []} /> */}
                                            <ImmigrationDetails VisaData={summaryData?.visaDeclined || []} />
                                        </div>
                                    </Suspense>
                                )}

                                {quantityTabValue == "fund_plan" && (
                                    <Suspense fallback={null}>
                                        <div className='p-3'>
                                            <FundDetails Fundinfo={summaryData?.fundPlan || []} />
                                        </div>
                                    </Suspense>
                                )}

                                {quantityTabValue == "education_details" && (
                                    <Suspense fallback={null}>
                                        <div className='p-3'>
                                            <EducationDetails EducationInfo={summaryData?.educationDocs || []} />
                                            <GraduationDetails GraduationInfo={summaryData?.graduationDocs || []} />
                                        </div>
                                    </Suspense>
                                )}

                                {quantityTabValue == "exam_details" && (
                                    <Suspense fallback={null}>
                                        <div className='p-3'>
                                            <ExamData Exams={examDocs || []} />
                                        </div>
                                    </Suspense>
                                )}

                                {quantityTabValue == "work_info" && (
                                    <Suspense fallback={null}>
                                        <div className='p-3'>
                                            <WorkInfos WorkInfo={summaryData?.workInfoDocs || []} />
                                        </div>
                                    </Suspense>
                                )}

                                {quantityTabValue == "police_documents" && (
                                    <Suspense fallback={null}>
                                        <div className='p-3'>
                                            <PoliceDocs PoliceDocs={policeDocs || []} />
                                        </div>
                                    </Suspense>
                                )}

                                {quantityTabValue == "emp_histories" && (
                                    <Suspense fallback={null}>
                                        <div className='p-3'>
                                            <EmpHistories userEmploymentHistories={summaryData?.empHistories || {}} />
                                        </div>
                                    </Suspense>
                                )}
                            </Box>
                        </Row>
                        <Row>
                            <Col md={4} className='ms-1'>
                                <button type="button" className="btn btn-primary w-25" onClick={() => setIsOpen((prev: any) => !prev)}>View</button>
                            </Col>
                        </Row>
                        <Row className='me-0'>
                            {isOpen && <div className="mt-2">
                                <Tabs
                                    value={quantityTabValue}
                                    onChange={handleChangeQualityTab}
                                    textColor="secondary"
                                    variant="scrollable"
                                    scrollButtons={false}
                                    aria-label="secondary tabs example"
                                    sx={{ ...tabsStyle }}
                                >
                                    <Tab value="additional_docs" label="Additional Documents" sx={{ ...individualTabStyleCustom }} />
                                    <Tab value="previous_visa_approval" label="Previous Visa Approval" sx={{ ...individualTabStyleCustom }} />
                                    <Tab value="previous_visa_declines" label="Previous Visa Declines" sx={{ ...individualTabStyleCustom }} />
                                    <Tab value="fund_plan" label="Fund Plans" sx={{ ...individualTabStyleCustom }} />
                                    <Tab value="education_details" label="Education Details" sx={{ ...individualTabStyleCustom }} />
                                    <Tab value="exam_details" label="Exam Details" sx={{ ...individualTabStyleCustom }} />
                                    <Tab value="work_info" label="Work Info" sx={{ ...individualTabStyleCustom }} />
                                    <Tab value="police_documents" label="Police Documents" sx={{ ...individualTabStyleCustom }} />
                                    <Tab value="emp_histories" label="Employment Histories" sx={{ ...individualTabStyleCustom }} />
                                </Tabs>

                            </div>}
                        </Row>
                    </Card.Body>
                </Card>
            </Row>

            {/* Previous Immigration Check */}
            <Row className='mt-2'>
                <CheckHeadings title={"Previous Immigration Check"} />
            </Row>

            <Row className="mt-1">
                <Card className="bodrer rounded-4">
                    <Card.Body style={{ paddingTop: '0px', paddingBottom: '1rem' }}>
                        <Row>
                            <Tabs
                                value={visaTabValue}
                                onChange={handleChangeVisaTab}
                                textColor="secondary"
                                variant="scrollable"
                                aria-label="secondary tabs example"
                                sx={{ ...tabsStyle }}
                            >
                                <Tab value="previous_visa_approval" label="Previous Visa Approval" sx={{ ...individualTabStyle }} />
                                <Tab value="previous_visa_declines" label="Previous Visa Declines" sx={{ ...individualTabStyle }} />
                            </Tabs>

                            <Box>
                                {visaTabValue == "previous_visa_approval" && (
                                    <Suspense fallback={null}>
                                        <div className='p-2'>
                                            <ImmigrationDetails VisaData={visaApproved} />
                                        </div>
                                    </Suspense>
                                )}

                                {visaTabValue == "previous_visa_declines" && (
                                    <Suspense fallback={null}>
                                        <div className='p-3'>
                                            <ImmigrationDetails VisaData={visaDeclined} />
                                        </div>
                                    </Suspense>
                                )}
                            </Box>
                        </Row>
                    </Card.Body>
                </Card>
            </Row>

            {/* Application Fee Check */}
            <Row>
                <Col md={6}>
                    <CheckHeadings title="Application Fee Check" />
                </Col>
            </Row>
            <Row className="mt-1">
                <Card className="basic-card bodrer rounded-4">
                    <Card.Body className="d-flex gap-2 align-items-center">
                        <div className="d-flex justify-content-between align-items-center application-fee-col p-2">
                            <div className="fs-14 fw-semibold text-dark">Application Fee Check</div>
                            <div className="application-fee-col-amount-col p-1 d-flex align-items-center justify-content-center">
                                <span>{applicationFeeCheck?.fee} /-</span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Row>
        </>
    )
}

export default Summary