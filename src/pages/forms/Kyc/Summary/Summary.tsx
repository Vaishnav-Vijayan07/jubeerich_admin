import React, { Suspense, useEffect, useRef, useState } from 'react'
import CheckHeadings from '../../../../components/CheckHeadings'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { Box, Tab, Tabs } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import CheckQuality from '../../../../components/ApplicationChecks/CheckQuality'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ImmigrationDetails from '../../../../components/ApplicationChecks/DocsQuantity/ImmigrationDetails'
import AdditionalDocs from '../../../../components/ApplicationChecks/DocsQuantity/AdditionalDocs'
import FundDetails from '../../../../components/ApplicationChecks/DocsQuantity/FundDetails'
import EducationDetails from '../../../../components/ApplicationChecks/DocsQuantity/EducationDetails'
import ExamData from '../../../../components/ApplicationChecks/DocsQuantity/ExamData'
import GraduationDetails from '../../../../components/ApplicationChecks/DocsQuantity/GraduationInfo'
import WorkInfos from '../../../../components/ApplicationChecks/DocsQuantity/WorkInfos'
import PoliceDocs from '../../../../components/ApplicationChecks/DocsQuantity/PoliceDocs'
import EmpHistories from '../../../../components/ApplicationChecks/DocsQuantity/EmpHistories'
import axios from 'axios';
import Collapse from 'react-bootstrap/Collapse';
import SummaryRemarks from './SummaryRemarks'

const Summary = () => {
    const { id } = useParams();
    const [tabValue, setTabValue] = useState("educational_qualification");
    const [visaTabValue, setVisaTabValue] = useState("previous_visa_approval");
    const [quantityTabValue, setQuantityTabValue] = useState("additional_docs");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [summaryData, setSummaryData] = useState<any>(null);
    const navigate = useNavigate();
    const [isRemarksHide, setIsRemarksVisible] = useState<any>({
        availability_check: true,
        campus_check: true,
        entry_requirement: true,
        quality_check: true,
        quantity_check: true,
        immigration_check: true,
        application_fee_check: true
    });

    const qualityCheckRef = useRef<HTMLDivElement>(null);
    const entryRequirementRef = useRef<HTMLDivElement>(null);
    const quantityCheckRef = useRef<HTMLDivElement>(null);
    const immigrationRef = useRef<HTMLDivElement>(null);
    const applicationFeeRef = useRef<HTMLDivElement>(null);
    const campusRef = useRef<HTMLDivElement>(null);
    const availabilityRef = useRef<HTMLDivElement>(null);
    const [qualityCheckHeight, setQualityCheckHeight] = useState(0);
    const [entryRequirementHeight, setEntryRequirementHeight] = useState(0);
    const [quantityCheckHeight, setQuantityCheckHeight] = useState(0);
    const [immigrationHeight, setImmigrationHeight] = useState(0);
    const [applicationFeeHeight, setApplicationFeeHeight] = useState(0);
    const [campusHeight, setCampusHeight] = useState(0);
    const [availabilityHeight, setAvailabilityHeight] = useState(0);

    const remarksType = {
        availability_check: 'availability_check',
        campus_check: 'campus_check',
        entry_requirement: 'entry_requirement',
        quality_check: 'quality_check',
        quantity_check: 'quantity_check',
        immigration_check: 'immigration_check',
        application_fee_check: 'application_fee_check'
    };

    const viewSummary = async () => {
        try {
            const { data } = await axios.get(`/view_summary/${id}`);
            setSummaryData(data?.data)

        } catch (error) {
            console.log("Something went wrong");
        }
    }

    const tabTypes = {
        entry_requirement: 'entry_requirement',
        visa: 'visa',
        quantity: 'quantity'
    }

    const entryRequirementTabsData = [
        {
            value: "educational_qualification",
            label: "Educational Qualififcation"
        },
        {
            value: "graduation_qualifications",
            label: "Graduation Qualifications"
        },
        {
            value: "gap_periods",
            label: "Gap Periods"
        }
    ];

    const quantityTabItems = [
        { value: "additional_docs", label: "Additional Documents" },
        { value: "previous_visa_approval", label: "Previous Visa Approval" },
        { value: "previous_visa_declines", label: "Previous Visa Declines" },
        { value: "fund_plan", label: "Fund Plans" },
        { value: "education_details", label: "Education Details" },
        { value: "exam_details", label: "Exam Details" },
        { value: "work_info", label: "Work Info" },
        { value: "police_documents", label: "Police Documents" },
        { value: "emp_histories", label: "Employment Histories" },
    ];

    const immigrationTabsData = [
        { value: 'previous_visa_approval', label: 'Previous Visa Approval' },
        { value: 'previous_visa_declines', label: 'Previous Visa Declines' },
    ];

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

    const buttonStyle = {
        backgroundColor: "#009A29",
        color: "#FFFFFF",
        borderRadius: "8px",
        width: '80px',
        height: '30px',
        border: 'none'
    }

    const backButtonStyle = {
        boxShadow: "0px 0px 10px rgba(205,207,207,0.5)",
        backgroundColor: "#FFFFFF",
        color: "#343A40",
        border: "none",
        borderRadius: "8px",
        minHeight: "40px",
    }

    const summaryHeaderStyle = {
        boxShadow: "0px 0px 17px -1px rgba(205,207,207,1)",
        backgroundColor: "#eefff2",
        color: "#009a29",
        border: "none",
        borderRadius: "8px",
    }

    const remarkPanelStyle: React.CSSProperties = {
        position: "absolute",
        top: 0,
        // right: isRemarksHide ? "0" : "1200px",
        height: "100%",
        width: "50px",
        backgroundColor: "#6f42c1",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "right 0.6s ease-in-out",
        borderTopLeftRadius: "8px",
        borderBottomLeftRadius: "8px",
    }

    const remarkButtonStyle: React.CSSProperties = {
        position: "absolute",
        top: "50%",
        // left: isRemarksHide ? "-20px" : "35px",
        transform: "translateY(-50%)",
        backgroundColor: "#ddd",
        color: "#6f42c1",
        border: "none",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
    }

    const contentStyleActive: React.CSSProperties = {
        opacity: 1,
        transition: "all 0.6s ease-in-out",
        transform: 'translateX(0)',
        pointerEvents: 'all'
    };

    const contentStyleNonActive: React.CSSProperties = {
        opacity: 0,
        transition: "all 0.6s ease-in-out",
        transform: 'translateX(-20px)',
        pointerEvents: 'none'
    };

    const getRemarkSectionPosition = (type: string) => {
        switch (type) {
            case remarksType.availability_check:
                return isRemarksHide.availability_check;
            case remarksType.campus_check:
                return isRemarksHide.campus_check;
            case remarksType.entry_requirement:
                return isRemarksHide.entry_requirement;
            case remarksType.quality_check:
                return isRemarksHide.quality_check;
            case remarksType.quantity_check:
                return isRemarksHide.quantity_check;
            case remarksType.immigration_check:
                return isRemarksHide.immigration_check;
            case remarksType.application_fee_check:
                return isRemarksHide.application_fee_check;
            default:
                break;
        }
    }

    const getRemarkButtonPosition = (type: string) => {
        switch (type) {
            case remarksType.availability_check:
                return isRemarksHide.availability_check;
            case remarksType.campus_check:
                return isRemarksHide.campus_check;
            case remarksType.entry_requirement:
                return isRemarksHide.entry_requirement;
            case remarksType.quality_check:
                return isRemarksHide.quality_check;
            case remarksType.quantity_check:
                return isRemarksHide.quantity_check;
            case remarksType.immigration_check:
                return isRemarksHide.immigration_check;
            case remarksType.application_fee_check:
                return isRemarksHide.application_fee_check;
            default:
                break;
        }
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: string, type: string) => {
        switch (type) {
            case tabTypes.visa:
                setVisaTabValue(newValue);
                break;
            case tabTypes.quantity:
                setQuantityTabValue(newValue);
                break;
            case tabTypes.entry_requirement:
                setTabValue(newValue);
                break;
            default:
                break;
        }
    }

    const toggleRemarks = (type: string) => {
        switch (type) {
            case remarksType.availability_check:
                setIsRemarksVisible((prev: any) => ({ ...prev, availability_check: !prev.availability_check }));
                break;
            case remarksType.campus_check:
                setIsRemarksVisible((prev: any) => ({ ...prev, campus_check: !prev.campus_check }));
                break;
            case remarksType.entry_requirement:
                setIsRemarksVisible((prev: any) => ({ ...prev, entry_requirement: !prev.entry_requirement }));
                break;
            case remarksType.quality_check:
                setIsRemarksVisible((prev: any) => ({ ...prev, quality_check: !prev.quality_check }));
                break;
            case remarksType.quantity_check:
                setIsRemarksVisible((prev: any) => ({ ...prev, quantity_check: !prev.quantity_check }));
                break;
            case remarksType.immigration_check:
                setIsRemarksVisible((prev: any) => ({ ...prev, immigration_check: !prev.immigration_check }));
                break;
            case remarksType.application_fee_check:
                setIsRemarksVisible((prev: any) => ({ ...prev, application_fee_check: !prev.application_fee_check }));
                break;
            default:
                break;
        }
    };

    const updateHeights = () => {
        // For quality check section
        if (qualityCheckRef.current instanceof HTMLElement) {
            const height = qualityCheckRef.current.offsetHeight;
            setQualityCheckHeight(height);
        }

        // For entry requirement section
        if (entryRequirementRef.current instanceof HTMLElement) {
            const height = entryRequirementRef.current.offsetHeight;
            setEntryRequirementHeight(height);
        }

        // For quantity check section
        if (quantityCheckRef.current instanceof HTMLElement) {
            const height = quantityCheckRef.current.offsetHeight;
            setQuantityCheckHeight(height);
        }

        // For immigration check section
        if (immigrationRef.current instanceof HTMLElement) {
            const height = immigrationRef.current.offsetHeight;
            setImmigrationHeight(height);
        }

        // For application fee check section
        if (applicationFeeRef.current instanceof HTMLElement) {
            const height = applicationFeeRef.current.offsetHeight;
            setApplicationFeeHeight(height);
        }

        // For campus check section
        if (campusRef.current instanceof HTMLElement) {
            const height = campusRef.current.offsetHeight;
            setCampusHeight(height);
        }

        // For availability check section
        if (availabilityRef.current instanceof HTMLElement) {
            const height = availabilityRef.current.offsetHeight;
            setAvailabilityHeight(height);
        }
    };

    const RemarkSection = ({ type }: any) => {
        return (
            <>
                <button
                    onClick={() => toggleRemarks(type)}
                    className="toggle-btn"
                    style={{ ...remarkButtonStyle, left: getRemarkButtonPosition(type) ? "-20px" : "35px" }}
                >
                    <i className={`mdi ${getRemarkButtonPosition(type) ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'}`}></i>
                </button>
                <p className='remark-button-section cursor-pointer'>
                    Remarks
                </p>
            </>
        )
    }

    useEffect(() => {
        viewSummary()
    }, [])

    useEffect(() => {
        updateHeights();
        window.addEventListener('resize', updateHeights);

        // Also update heights when tab changes
        if (tabValue || quantityTabValue || visaTabValue || isOpen) {
            updateHeights();
        }

        return () => window.removeEventListener('resize', updateHeights);
    }, [summaryData, isRemarksHide, tabValue, quantityTabValue, visaTabValue, isOpen]);

    return (
        <>
            <div style={{ marginLeft: '20px', marginRight: '20px' }}>

                {/* Header Portion */}
                <Row className='mt-3'>
                    <Col md={1} className="pe-2" style={{ width: "90px", marginRight: '10px' }}>
                        <Button
                            onClick={() => navigate(-1)}
                            className="h-100 w-100 d-flex justify-content-center align-items-center"
                            style={{ ...backButtonStyle }}
                        >
                            <ArrowBackIosIcon className='ms-1' style={{ fontSize: "20px" }} />
                        </Button>
                    </Col>
                    <Col md={11} className="pe-0" style={{ minHeight: "51px", maxHeight: "51px", paddingLeft: '0px' }}>
                        <Button
                            className="h-100 w-100 d-flex jsutify-content-start align-items-center"
                            style={{ ...summaryHeaderStyle }}
                        >
                            <span className=' ps-3 font-18 fw-semibold'>
                                Summary
                            </span>
                        </Button>
                    </Col>
                </Row>

                {/* Availability Check */}
                {/* <Row className='mt-4'>
                    <CheckHeadings title={"Program Availability Check"} />
                </Row>
                <Row className="mt-1">
                    <Card className="rounded-4">
                        {isRemarksHide.availability_check ? (
                            <Card.Body ref={availabilityRef}>
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
                        ) : (
                            <Card.Body style={{ height: `${availabilityHeight}px` }}>
                                <Row>
                                    <Col md={6} className='ms-4'>
                                        <SummaryRemarks remarks={summaryData?.remarks?.availability_check} />
                                    </Col>
                                </Row>
                            </Card.Body>
                        )}
                        <div
                            className={`remarks-panel ${isRemarksHide ? "visible" : ""}`}
                            style={{ ...remarkPanelStyle, right: getRemarkSectionPosition(remarksType.availability_check) ? "0" : "96%" }}
                        >
                            <RemarkSection type={remarksType.availability_check} />
                        </div>
                    </Card>
                </Row> */}

                <Row className='mt-4'>
                    <CheckHeadings title={"Program Availability Check"} />
                </Row>
                <Row className="mt-1">
                    <Card className="rounded-4 position-relative" style={{ overflow: "hidden" }}>
                        <Card.Body
                            ref={availabilityRef}
                            style={{
                                ...contentStyleNonActive,
                                ...(isRemarksHide.availability_check && contentStyleActive),
                                position: 'absolute',
                                width: '100%',
                                // display: isRemarksHide.availability_check ? 'block' : 'none'
                            }}
                        >
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

                        <Card.Body
                            style={{
                                minHeight: `${availabilityHeight}px`,
                                paddingTop: '0px',
                                ...contentStyleNonActive,
                                ...(!isRemarksHide.availability_check && contentStyleActive)
                            }}
                        >
                            <Row>
                                <Col md={12} className='ms-4'>
                                    <SummaryRemarks remarks={summaryData?.remarks?.availability_check} height={availabilityHeight}/>
                                </Col>
                            </Row>
                        </Card.Body>

                        <div
                            className={`remarks-panel ${isRemarksHide ? "visible" : ""}`}
                            style={{
                                ...remarkPanelStyle,
                                right: getRemarkSectionPosition(remarksType.availability_check) ? "0" : "96%"
                            }}
                        >
                            <RemarkSection type={remarksType.availability_check} />
                        </div>
                    </Card>
                </Row>

                {/* Campus Check  */}
                {/* <Row className='mt-2'>
                    <CheckHeadings title={"Campus Check"} />
                </Row>
                <Row className="mt-1">
                    <Card className="rounded-4 position-relative" style={{ overflow: "hidden" }}>
                        {isRemarksHide?.campus_check ? (
                            <Card.Body ref={campusRef} style={isRemarksHide?.campus_check ? { ...contentStyleActive } : { ...contentStyleNonActive }}>
                                <Row className="mt-1 mb-2">
                                    <Col md={6}>
                                        <h5 style={styles.h5}>Campus</h5>
                                        <p style={styles.p}>{summaryData?.campusCheck?.university}</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        ) : (
                            <Card.Body style={{ height: `${campusHeight}px` }}>
                                    <Row className="mt-1 mb-2" >
                                        <Col md={6} className='ms-4'>
                                            <SummaryRemarks remarks={summaryData?.remarks?.campus_check} />
                                        </Col>
                                    </Row>
                            </Card.Body>
                        )}

                        <div
                            className={`remarks-panel ${isRemarksHide ? "visible" : ""}`}
                            style={{ ...remarkPanelStyle, right: getRemarkSectionPosition(remarksType.campus_check) ? "0" : "96%" }}
                        >
                            <RemarkSection type={remarksType.campus_check} />
                        </div>
                    </Card>
                </Row> */}

                <Row className='mt-2'>
                    <CheckHeadings title={"Campus Check"} />
                </Row>
                <Row className="mt-1">
                    <Card className="rounded-4 position-relative" style={{ overflow: "hidden" }}>
                        <Card.Body
                            ref={campusRef}
                            style={{
                                ...contentStyleNonActive,
                                ...(isRemarksHide?.campus_check && contentStyleActive),
                                position: 'absolute',
                                width: '100%',
                                // display: isRemarksHide?.campus_check ? 'block' : 'none'
                            }}
                        >
                            <Row className="mt-1 mb-2">
                                <Col md={6}>
                                    <h5 style={styles.h5}>Campus</h5>
                                    <p style={styles.p}>{summaryData?.campusCheck?.university}</p>
                                </Col>
                            </Row>
                        </Card.Body>

                        <Card.Body
                            style={{
                                minHeight: `${campusHeight}px`,
                                paddingTop: '0px',
                                ...contentStyleNonActive,
                                ...(!isRemarksHide?.campus_check && contentStyleActive)
                            }}
                        >
                            <Row className="mt-1 mb-2">
                                <Col md={12} className='ms-4'>
                                    <SummaryRemarks remarks={summaryData?.remarks?.campus_check} height={campusHeight} />
                                </Col>
                            </Row>
                        </Card.Body>

                        <div
                            className={`remarks-panel ${isRemarksHide ? "visible" : ""}`}
                            style={{
                                ...remarkPanelStyle,
                                right: getRemarkSectionPosition(remarksType.campus_check) ? "0" : "96%"
                            }}
                        >
                            <RemarkSection type={remarksType.campus_check} />
                        </div>
                    </Card>
                </Row>

                {/* Entry Requirement Check */}
                {/* <Row className='mt-2'>
                    <CheckHeadings title={"Entry Requirement Check"} />
                </Row>
                <Row className="mt-1">
                    <Card className="rounded-4">

                        {isRemarksHide?.entry_requirement ? (
                            <Card.Body style={{ paddingTop: '0px' }} ref={entryRequirementRef}>
                                <Row>
                                    <Tabs
                                        value={tabValue}
                                        onChange={(event, newValue) => handleTabChange(event, newValue, tabTypes.entry_requirement)}
                                        textColor="secondary"
                                        variant="scrollable"
                                        aria-label="secondary tabs example"
                                        sx={{ ...tabsStyle }}
                                    >

                                        {entryRequirementTabsData.map((tab) => (
                                            <Tab
                                                key={tab.value}
                                                value={tab.value}
                                                label={tab.label}
                                                sx={{ ...individualTabStyle }}
                                            />
                                        ))}
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
                        ) : (
                            <Card.Body style={{ height: `${entryRequirementHeight}px`, paddingTop: '0px' }}>
                                <Row>
                                    <Col md={6} className='ms-4'>
                                        <SummaryRemarks remarks={summaryData?.remarks?.entry_requirement_check} />
                                    </Col>
                                </Row>
                            </Card.Body>
                        )}
                        <div
                            className={`remarks-panel ${isRemarksHide ? "visible" : ""}`}
                            style={{ ...remarkPanelStyle, right: getRemarkSectionPosition(remarksType.entry_requirement) ? "0" : "96%" }}
                        >
                            <RemarkSection type={remarksType.entry_requirement} />
                        </div>
                    </Card>
                </Row> */}

                <Row className='mt-2'>
                    <CheckHeadings title={"Entry Requirement Check"} />
                </Row>
                <Row className="mt-1">
                    <Card className="rounded-4 position-relative" style={{ overflow: "hidden" }}>
                        <Card.Body
                            ref={entryRequirementRef}
                            style={{
                                paddingTop: '0px',
                                ...contentStyleNonActive,
                                ...(isRemarksHide?.entry_requirement && contentStyleActive),
                                position: 'absolute',
                                width: '100%',
                                // display: isRemarksHide?.entry_requirement ? 'block' : 'none'
                            }}
                        >
                            <Row>
                                <Tabs
                                    value={tabValue}
                                    onChange={(event, newValue) => handleTabChange(event, newValue, tabTypes.entry_requirement)}
                                    textColor="secondary"
                                    variant="scrollable"
                                    aria-label="secondary tabs example"
                                    sx={{ ...tabsStyle }}
                                >
                                    {entryRequirementTabsData.map((tab) => (
                                        <Tab
                                            key={tab.value}
                                            value={tab.value}
                                            label={tab.label}
                                            sx={{ ...individualTabStyle }}
                                        />
                                    ))}
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

                        <Card.Body
                            style={{
                                minHeight: `${entryRequirementHeight}px`,
                                paddingTop: '0px',
                                ...contentStyleNonActive,
                                ...(!isRemarksHide?.entry_requirement && contentStyleActive)
                            }}
                        >
                            <Row>
                                <Col md={12} className='ms-4'>
                                    <SummaryRemarks remarks={summaryData?.remarks?.entry_requirement_check} height={entryRequirementHeight} />
                                </Col>
                            </Row>
                        </Card.Body>

                        <div
                            className={`remarks-panel ${isRemarksHide ? "visible" : ""}`}
                            style={{
                                ...remarkPanelStyle,
                                right: getRemarkSectionPosition(remarksType.entry_requirement) ? "0" : "96%"
                            }}
                        >
                            <RemarkSection type={remarksType.entry_requirement} />
                        </div>
                    </Card>
                </Row>

                {/* Document Quality Check */}
                {/* <Row className='mt-2'>
                    <CheckHeadings title={"Document Quality Check"} />
                </Row>
                <Row className="mt-1">
                    <Card className="rounded-4">
                        {isRemarksHide?.quality_check ? (
                            <Card.Body ref={qualityCheckRef} className="d-flex gap-2 justify-content-center">
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
                        ) : (
                            <Card.Body style={{ height: `${qualityCheckHeight}px`, paddingTop: '0px' }}>
                                <Row>
                                    <Col md={6} className='ms-4'>
                                        <SummaryRemarks remarks={summaryData?.remarks?.quality_check} />
                                    </Col>
                                </Row>
                            </Card.Body>
                        )}
                        <div
                            className={`remarks-panel ${isRemarksHide ? "visible" : ""}`}
                            style={{ ...remarkPanelStyle, right: getRemarkSectionPosition(remarksType.quality_check) ? "0" : "96%" }}
                        >
                            <RemarkSection type={remarksType.quality_check} />
                        </div>
                    </Card>
                </Row> */}

                <Row className='mt-2'>
                    <CheckHeadings title={"Document Quality Check"} />
                </Row>
                <Row className="mt-1">
                    <Card className="rounded-4 position-relative" style={{ overflow: "hidden" }}>
                        <Card.Body
                            ref={qualityCheckRef}
                            style={{
                                ...contentStyleNonActive,
                                ...(isRemarksHide?.quality_check && contentStyleActive),
                                position: 'absolute',
                                width: '100%',
                                // display: isRemarksHide?.quality_check ? 'block' : 'none'
                            }}
                            className="d-flex gap-2 justify-content-center"
                        >
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

                        <Card.Body
                            style={{
                                minHeight: `${qualityCheckHeight}px`,
                                paddingTop: '0px',
                                ...contentStyleNonActive,
                                ...(!isRemarksHide?.quality_check && contentStyleActive)
                            }}
                        >
                            <Row>
                                <Col md={12} className='ms-4'>
                                    <SummaryRemarks remarks={summaryData?.remarks?.quality_check} height={qualityCheckHeight}/>
                                </Col>
                            </Row>
                        </Card.Body>

                        <div
                            className={`remarks-panel ${isRemarksHide ? "visible" : ""}`}
                            style={{
                                ...remarkPanelStyle,
                                right: getRemarkSectionPosition(remarksType.quality_check) ? "0" : "96%"
                            }}
                        >
                            <RemarkSection type={remarksType.quality_check} />
                        </div>
                    </Card>
                </Row>

                {/* Document Quantity Check */}
                {/* <Row className='mt-2'>
                    <CheckHeadings title={"Document Quantity Check"} />
                </Row>
                <Row className="mt-1">
                    <Card className="bodrer rounded-4">
                        {isRemarksHide?.quantity_check ? (
                            <Card.Body style={{ paddingTop: '0px', paddingBottom: '1rem' }} ref={quantityCheckRef}>
                                <Row>
                                    <Tabs
                                        value={quantityTabValue}
                                        onChange={(event, newValue) => handleTabChange(event, newValue, tabTypes.quantity)}
                                        textColor="secondary"
                                        variant="scrollable"
                                        aria-label="secondary tabs example"
                                        sx={{ ...tabsStyle }}
                                    >
                                        {quantityTabItems.map((tab) =>
                                            quantityTabValue === tab.value && (
                                                <Tab
                                                    key={tab.value}
                                                    value={tab.value}
                                                    label={tab.label}
                                                    sx={{ ...individualTabStyleCustom }}
                                                />
                                            )
                                        )}

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
                                                    <ImmigrationDetails VisaData={summaryData?.visaApproved || []} />
                                                </div>
                                            </Suspense>
                                        )}

                                        {quantityTabValue == "previous_visa_declines" && (
                                            <Suspense fallback={null}>
                                                <div className='p-3'>
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
                                                    <ExamData Exams={summaryData?.examDocs || []} />
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
                                                    <PoliceDocs PoliceDocs={summaryData?.policeDocs || []} />
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
                                        <button style={{ ...buttonStyle }} type="button" className="w-25" onClick={() => {
                                            setIsOpen((prev: any) => {
                                                const newState = !prev;
                                                if (!newState) updateHeights();
                                                return newState;
                                            });
                                        }} aria-controls="example-collapse-text" aria-expanded={isOpen}>View All <i className={`mdi ${isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'}`}></i></button>
                                    </Col>
                                </Row>
                                <Collapse in={isOpen}>
                                    <Row className='me-0' id="example-collapse-text">
                                        <div className="mt-2">
                                            <Tabs
                                                value={quantityTabValue}
                                                onChange={(event, newValue) => handleTabChange(event, newValue, tabTypes.quantity)}
                                                textColor="secondary"
                                                variant="scrollable"
                                                scrollButtons={false}
                                                aria-label="secondary tabs example"
                                                sx={{ ...tabsStyle }}
                                            >

                                                {quantityTabItems.map((tab) =>
                                                    <Tab
                                                        key={tab.value}
                                                        value={tab.value}
                                                        label={tab.label}
                                                        sx={{ ...individualTabStyleCustom }}
                                                    />
                                                )}

                                            </Tabs>

                                        </div>
                                    </Row>
                                </Collapse>
                            </Card.Body>
                        ) : (
                            <Card.Body style={{ paddingTop: '0px', paddingBottom: '1rem', height: `${quantityCheckHeight}px` }}>
                                <Row>
                                    <Col md={6} className='ms-4'>
                                        <SummaryRemarks remarks={summaryData?.remarks?.quantity_check} />
                                    </Col>
                                </Row>
                            </Card.Body>
                        )}

                        <div
                            className={`remarks-panel ${isRemarksHide ? "visible" : ""}`}
                            style={{ ...remarkPanelStyle, right: getRemarkSectionPosition(remarksType.quantity_check) ? "0" : "96%" }}
                        >
                            <RemarkSection type={remarksType.quantity_check} />
                        </div>
                    </Card>
                </Row> */}

                <Row className='mt-2'>
                    <CheckHeadings title={"Document Quantity Check"} />
                </Row>
                <Row className="mt-1">
                    <Card className="border rounded-4 position-relative" style={{ overflow: "hidden" }}>
                        <Card.Body
                            ref={quantityCheckRef}
                            style={{
                                paddingTop: '0px',
                                paddingBottom: '1rem',
                                ...contentStyleNonActive,
                                ...(isRemarksHide?.quantity_check && contentStyleActive),
                                position: 'absolute',
                                width: '100%',
                                // display: isRemarksHide?.quantity_check ? 'block' : 'none'
                            }}
                        >
                            <Row>
                                <Tabs
                                    value={quantityTabValue}
                                    onChange={(event, newValue) => handleTabChange(event, newValue, tabTypes.quantity)}
                                    textColor="secondary"
                                    variant="scrollable"
                                    aria-label="secondary tabs example"
                                    sx={{ ...tabsStyle }}
                                >
                                    {quantityTabItems.map((tab) =>
                                        quantityTabValue === tab.value && (
                                            <Tab
                                                key={tab.value}
                                                value={tab.value}
                                                label={tab.label}
                                                sx={{ ...individualTabStyleCustom }}
                                            />
                                        )
                                    )}
                                </Tabs>

                                <Box>
                                    {quantityTabValue == "additional_docs" && (
                                        <Suspense fallback={null}>
                                            <div className='p-2 pe-5'>
                                                <AdditionalDocs AdditionalDocsData={summaryData?.additionalDocs || {}} />
                                            </div>
                                        </Suspense>
                                    )}

                                    {quantityTabValue == "previous_visa_approval" && (
                                        <Suspense fallback={null}>
                                            <div className='p-2'>
                                                <ImmigrationDetails VisaData={summaryData?.visaApproved || []} />
                                            </div>
                                        </Suspense>
                                    )}

                                    {quantityTabValue == "previous_visa_declines" && (
                                        <Suspense fallback={null}>
                                            <div className='p-3'>
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
                                                <ExamData Exams={summaryData?.examDocs || []} />
                                            </div>
                                        </Suspense>
                                    )}

                                    {quantityTabValue == "work_info" && (
                                        <Suspense fallback={null}>
                                            <div className='p-0 pe-4'>
                                                <WorkInfos WorkInfo={summaryData?.workInfoDocs || []} />
                                            </div>
                                        </Suspense>
                                    )}

                                    {quantityTabValue == "police_documents" && (
                                        <Suspense fallback={null}>
                                            <div className='p-2 pe-5'>
                                                <PoliceDocs PoliceDocs={summaryData?.policeDocs || []} />
                                            </div>
                                        </Suspense>
                                    )}

                                    {quantityTabValue == "emp_histories" && (
                                        <Suspense fallback={null}>
                                            <div className='p-1 pt-2 pe-5'>
                                                <EmpHistories userEmploymentHistories={summaryData?.empHistories || {}} />
                                            </div>
                                        </Suspense>
                                    )}
                                </Box>
                            </Row>
                            <Row>
                                <Col md={4} className='ms-1'>
                                    <button
                                        style={{ ...buttonStyle }}
                                        type="button"
                                        className="w-25"
                                        onClick={() => {
                                            setIsOpen((prev: any) => {
                                                const newState = !prev;
                                                setTimeout(() => {
                                                    updateHeights();
                                                }, 200);
                                                return newState;
                                            });
                                        }}
                                        aria-controls="example-collapse-text"
                                        aria-expanded={isOpen}
                                    >
                                        View All <i className={`mdi ${isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'}`}></i>
                                    </button>
                                </Col>
                            </Row>
                            <Collapse in={isOpen}>
                                <Row className='me-4' id="example-collapse-text">
                                    <div className="mt-2">
                                        <Tabs
                                            value={quantityTabValue}
                                            onChange={(event, newValue) => handleTabChange(event, newValue, tabTypes.quantity)}
                                            textColor="secondary"
                                            variant="scrollable"
                                            scrollButtons={false}
                                            aria-label="secondary tabs example"
                                            sx={{ ...tabsStyle }}
                                        >
                                            {quantityTabItems.map((tab) =>
                                                <Tab
                                                    key={tab.value}
                                                    value={tab.value}
                                                    label={tab.label}
                                                    sx={{ ...individualTabStyleCustom }}
                                                />
                                            )}
                                        </Tabs>
                                    </div>
                                </Row>
                            </Collapse>
                        </Card.Body>

                        <Card.Body
                            style={{
                                paddingTop: '0px',
                                paddingBottom: '1rem',
                                minHeight: `${quantityCheckHeight}px`,
                                ...contentStyleNonActive,
                                ...(!isRemarksHide?.quantity_check && contentStyleActive)
                            }}
                        >
                            <Row>
                                <Col md={12} className='ms-4'>
                                    <SummaryRemarks remarks={summaryData?.remarks?.quantity_check} height={quantityCheckHeight} />
                                </Col>
                            </Row>
                        </Card.Body>

                        <div
                            className={`remarks-panel ${isRemarksHide ? "visible" : ""}`}
                            style={{
                                ...remarkPanelStyle,
                                right: getRemarkSectionPosition(remarksType.quantity_check) ? "0" : "96%"
                            }}
                        >
                            <RemarkSection type={remarksType.quantity_check} />
                        </div>
                    </Card>
                </Row>

                {/* Previous Immigration Check */}
                {/* <Row className='mt-2'>
                    <CheckHeadings title={"Previous Immigration Check"} />
                </Row>
                <Row className="mt-1">
                    <Card className="bodrer rounded-4">
                        {isRemarksHide?.immigration_check ? (
                            <Card.Body style={{ paddingTop: '0px', paddingBottom: '1rem' }} ref={immigrationRef}>
                                <Row>
                                    <Tabs
                                        value={visaTabValue}
                                        onChange={(event, newValue) => handleTabChange(event, newValue, tabTypes.visa)}
                                        textColor="secondary"
                                        variant="scrollable"
                                        aria-label="secondary tabs example"
                                        sx={{ ...tabsStyle }}
                                    >
                                        {immigrationTabsData.map((tab) => (
                                            <Tab
                                                key={tab.value}
                                                value={tab.value}
                                                label={tab.label}
                                                sx={{ ...individualTabStyle }}
                                            />
                                        ))}
                                    </Tabs>

                                    <Box>
                                        {visaTabValue == "previous_visa_approval" && (
                                            <Suspense fallback={null}>
                                                <div className='p-2'>
                                                    <ImmigrationDetails VisaData={summaryData?.visaApproved} />
                                                </div>
                                            </Suspense>
                                        )}

                                        {visaTabValue == "previous_visa_declines" && (
                                            <Suspense fallback={null}>
                                                <div className='p-3'>
                                                    <ImmigrationDetails VisaData={summaryData?.visaDeclined} />
                                                </div>
                                            </Suspense>
                                        )}
                                    </Box>
                                </Row>
                            </Card.Body>
                        ) : (
                            <Card.Body style={{ paddingTop: '0px', height: `${immigrationHeight}px` }}>
                                <Row>
                                    <Col md={6} className='ms-4'>
                                        <SummaryRemarks remarks={summaryData?.remarks?.immigration_check} />
                                    </Col>
                                </Row>
                            </Card.Body>
                        )}
                        <div
                            className={`remarks-panel ${isRemarksHide ? "visible" : ""}`}
                            style={{ ...remarkPanelStyle, right: getRemarkSectionPosition(remarksType.immigration_check) ? "0" : "96%" }}
                        >
                            <RemarkSection type={remarksType.immigration_check} />
                        </div>
                    </Card>
                </Row> */}

                <Row className='mt-2'>
                    <CheckHeadings title={"Previous Immigration Check"} />
                </Row>
                <Row className="mt-1">
                    <Card className="border rounded-4 position-relative" style={{ overflow: "hidden" }}>
                        <Card.Body
                            ref={immigrationRef}
                            style={{
                                paddingTop: '0px',
                                paddingBottom: '1rem',
                                ...contentStyleNonActive,
                                ...(isRemarksHide?.immigration_check && contentStyleActive),
                                position: 'absolute',
                                width: '100%',
                                // display: isRemarksHide?.immigration_check ? 'block' : 'none'
                            }}
                        >
                            <Row>
                                <Tabs
                                    value={visaTabValue}
                                    onChange={(event, newValue) => handleTabChange(event, newValue, tabTypes.visa)}
                                    textColor="secondary"
                                    variant="scrollable"
                                    aria-label="secondary tabs example"
                                    sx={{ ...tabsStyle }}
                                >
                                    {immigrationTabsData.map((tab) => (
                                        <Tab
                                            key={tab.value}
                                            value={tab.value}
                                            label={tab.label}
                                            sx={{ ...individualTabStyle }}
                                        />
                                    ))}
                                </Tabs>

                                <Box>
                                    {visaTabValue == "previous_visa_approval" && (
                                        <Suspense fallback={null}>
                                            <div className='p-2'>
                                                <ImmigrationDetails VisaData={summaryData?.visaApproved} />
                                            </div>
                                        </Suspense>
                                    )}

                                    {visaTabValue == "previous_visa_declines" && (
                                        <Suspense fallback={null}>
                                            <div className='p-3'>
                                                <ImmigrationDetails VisaData={summaryData?.visaDeclined} />
                                            </div>
                                        </Suspense>
                                    )}
                                </Box>
                            </Row>
                        </Card.Body>

                        <Card.Body
                            style={{
                                paddingTop: '0px',
                                minHeight: `${immigrationHeight}px`,
                                ...contentStyleNonActive,
                                ...(!isRemarksHide?.immigration_check && contentStyleActive)
                            }}
                        >
                            <Row>
                                <Col md={12} className='ms-4'>
                                    <SummaryRemarks remarks={summaryData?.remarks?.immigration_check} height={immigrationHeight} />
                                </Col>
                            </Row>
                        </Card.Body>

                        <div
                            className={`remarks-panel ${isRemarksHide ? "visible" : ""}`}
                            style={{
                                ...remarkPanelStyle,
                                right: getRemarkSectionPosition(remarksType.immigration_check) ? "0" : "96%"
                            }}
                        >
                            <RemarkSection type={remarksType.immigration_check} />
                        </div>
                    </Card>
                </Row>

                {/* Application Fee Check */}
                {/* <Row>
                    <Col md={6}>
                        <CheckHeadings title="Application Fee Check" />
                    </Col>
                </Row>
                <Row className="mt-1">
                    <Card className="rounded-4">
                        {isRemarksHide?.application_fee_check ? (
                            <Card.Body className="d-flex gap-2 align-items-center" ref={applicationFeeRef}>
                                <div className="d-flex justify-content-between align-items-center application-fee-col p-2">
                                    <div className="fs-14 fw-semibold text-dark">Application Fee Check</div>
                                    <div className="application-fee-col-amount-col p-1 d-flex align-items-center justify-content-center">
                                        <span>{summaryData?.applicationFeeCheck?.fee} /-</span>
                                    </div>
                                </div>
                            </Card.Body>
                        ) : (
                            <Card.Body style={{ paddingTop: '0px', height: `${applicationFeeHeight}px` }}>
                                <Row>
                                    <Col md={6} className='ms-4'>
                                        <SummaryRemarks remarks={summaryData?.remarks?.application_fee_check} />
                                    </Col>
                                </Row>
                            </Card.Body>
                        )}
                        <div
                            className={`remarks-panel ${isRemarksHide ? "visible" : ""}`}
                            style={{ ...remarkPanelStyle, right: getRemarkSectionPosition(remarksType.application_fee_check) ? "0" : "96%" }}
                        >
                            <RemarkSection type={remarksType.application_fee_check} />
                        </div>
                    </Card>
                </Row> */}

                <Row>
                    <Col md={6}>
                        <CheckHeadings title="Application Fee Check" />
                    </Col>
                </Row>
                <Row className="mt-1">
                    <Card className="rounded-4 position-relative" style={{ overflow: "hidden" }}>
                        <Card.Body
                            ref={applicationFeeRef}
                            style={{
                                ...contentStyleNonActive,
                                ...(isRemarksHide.application_fee_check && contentStyleActive),
                                position: 'absolute',
                                width: '100%',
                            }}
                        >
                            <div className="d-flex gap-2 align-items-center">
                                <div className="d-flex justify-content-between align-items-center application-fee-col p-2">
                                    <div className="fs-14 fw-semibold text-dark">Application Fee Check</div>
                                    <div className="application-fee-col-amount-col p-1 d-flex align-items-center justify-content-center">
                                        <span>{summaryData?.applicationFeeCheck?.fee} /-</span>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>

                        <Card.Body
                            style={{
                                paddingTop: '0px',
                                minHeight: `${applicationFeeHeight}px`,
                                ...contentStyleNonActive,
                                ...(!isRemarksHide.application_fee_check && contentStyleActive),
                            }}
                        >
                            <Row>
                                <Col md={12} className="ms-4">
                                    <SummaryRemarks remarks={summaryData?.remarks?.application_fee_check} height={applicationFeeHeight} />
                                </Col>
                            </Row>
                        </Card.Body>

                        <div
                            className={`remarks-panel ${isRemarksHide ? "visible" : ""}`}
                            style={{
                                ...remarkPanelStyle,
                                right: getRemarkSectionPosition(remarksType.application_fee_check) ? "0" : "96%",
                            }}
                        >
                            <RemarkSection type={remarksType.application_fee_check} />
                        </div>
                    </Card>
                </Row>


            </div>
        </>
    )
}

export default Summary