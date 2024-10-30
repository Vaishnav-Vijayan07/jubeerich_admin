import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import DocumentsOverview from "../../lead_management/Tasks/List/DocumentsOverview/DocumentsOverview";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../constants";
import { Visa_Types } from "../../lead_management/Tasks/List/data";
import noFile from '../../../assets/images/icons/file_not_found.svg'
import axios from "axios";
import { types } from "./EntryRequirementCheck";

type Props = {
    studentId: any;
};

function PreviousImmigrationCheck({ studentId }: Props) {
    const [visaApprovals, setVisaApprovals] = useState<any>([]);
    const [visaDeclines, setVisaDeclines] = useState<any>([]);

    const fetchImmigrationDetails = async () => {
        try {
            const res = await axios.get(`/details_application/${types.visa}/${studentId}`);
            if(res){
                setVisaApprovals(res?.data?.visaDetails?.previousVisaApprovals);
                setVisaDeclines(res?.data?.visaDetails?.previousVisaDeclines)
            }
            // setVisaApprovals([
            //     {
            //         "id": 3,
            //         "student_id": 115,
            //         "country_id": 6,
            //         "visa_type": "business_visa",
            //         "course_applied": 1,
            //         "country_name": "India",
            //         "university_applied": 1,
            //         "approved_letter": "Prisma_Config-1730279845338-503526384.pdf",
            //         "updated_by": 11,
            //         "createdAt": "2024-10-30T09:17:25.395Z",
            //         "updatedAt": "2024-10-30T09:17:25.395Z",
            //         "approved_country": {
            //             "country_name": "Ireland",
            //             "country_code": "IE"
            //         },
            //         "approved_course": {
            //             "course_name": "Bsc. Physics"
            //         },
            //         "approved_university_applied": {
            //             "id": 1,
            //             "university_name": "University of Aberdeen",
            //             "location": "Aberdeen",
            //             "country_id": 6,
            //             "website_url": "https://www.aberdeen.in",
            //             "image_url": "https://picsum.photos/200/300",
            //             "portal_link": "https://www.aberdeen.in",
            //             "username": "admin",
            //             "password": "admin@123",
            //             "updated_by": 6,
            //             "createdAt": "2024-07-12T07:04:03.227Z",
            //             "updatedAt": "2024-10-03T11:52:50.689Z"
            //         }
            //     }
            // ])

            // setVisaDeclines([
            //     {
            //         "id": 7,
            //         "student_id": 115,
            //         "country_id": 3,
            //         "visa_type": "tourist_visa",
            //         "course_applied": 1,
            //         "country_name": "US",
            //         "university_applied": 1,
            //         "rejection_reason": "Reason One",
            //         "declined_letter": "Modifications_in_Office_Management-1730279831922-435049720.txt",
            //         "updated_by": 11,
            //         "createdAt": "2024-10-30T09:17:11.974Z",
            //         "updatedAt": "2024-10-30T09:17:11.974Z",
            //         "declined_country": {
            //             "country_name": "Germany",
            //             "country_code": "DE"
            //         },
            //         "declined_course": {
            //             "course_name": "Bsc. Physics"
            //         },
            //         "declined_university_applied": {
            //             "id": 1,
            //             "university_name": "University of Aberdeen",
            //             "location": "Aberdeen",
            //             "country_id": 6,
            //             "website_url": "https://www.aberdeen.in",
            //             "image_url": "https://picsum.photos/200/300",
            //             "portal_link": "https://www.aberdeen.in",
            //             "username": "admin",
            //             "password": "admin@123",
            //             "updated_by": 6,
            //             "createdAt": "2024-07-12T07:04:03.227Z",
            //             "updatedAt": "2024-10-03T11:52:50.689Z"
            //         }
            //     }
            // ])
        } catch (error) {
            console.log(error);
        }
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

    const formatVisaName = (name: any) => {
        let res;
        if (name) {
            res = Visa_Types.filter((data: any) => data?.value == name)
            return res?.[0]?.label
        }
    }

    const getFileType = (fileName: string) => {
        if (!fileName) return ''
        const parts = fileName.split(".");
        const ext = parts.pop();
        return ext ? ext.toLowerCase() : '';
    }

    useEffect(() => {
        fetchImmigrationDetails()
    }, [studentId])


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

    return (
        <>
            <Row>
                <h4>Previous Immigration History Check</h4>
            </Row>
            <Row className="mt-2">
                <Card>
                    <Card.Body>
                        <Row className="ms-3 me-3">

                            {/* Visa Approvals */}
                            <Row className='mt-2'>
                                <span className='border bg-secondary rounded-2'>
                                    <Form.Label className='fs-4 mt-1 text-white' >Previous Visa Approval</Form.Label>
                                </span>
                                {visaApprovals?.length > 0 ? visaApprovals.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                        <Row className='mt-3'>
                                            <Form.Group className="mb-2" controlId="country_name">
                                                <Form.Label>
                                                    {`Country`} - {data?.approved_country?.country_name}
                                                </Form.Label>
                                            </Form.Group>
                                        </Row>
                                        <Row>
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
                                )) : <div className='d-flex justify-content-center align-items-center border border-secondary mt-2 me-2'><h4 className='text-muted'>No Documents Uploaded</h4></div>}
                            </Row>

                            {/* Visa Declines */}
                            <Row className='mt-2'>
                                <span className='border bg-secondary rounded-2'>
                                    <Form.Label className='fs-4 mt-1 text-white' >Previous Visa Declines</Form.Label>
                                </span>
                                {visaDeclines?.length > 0 ? visaDeclines.map((data: any, index: number) => (
                                    <Row key={index} className='ms-3'>
                                        <Row className='mt-3'>
                                            <Form.Group className="mb-2" controlId="country_name">
                                                <Form.Label>
                                                    {`Country`} - {data?.declined_country?.country_name}
                                                </Form.Label>
                                            </Form.Group>
                                        </Row>
                                        <Row>
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
                                )) : <div className='d-flex justify-content-center align-items-center border border-secondary mt-2 me-2'><h4 className='text-muted'>No Documents Uploaded</h4></div>}
                            </Row>
                        </Row>
                        <Row className="mt-4">
                            <Col md={12}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Remarks</Form.Label>
                                    <Form.Control as="textarea" rows={6} />
                                </Form.Group>
                            </Col>
                        </Row>

                    </Card.Body>
                </Card>
            </Row>
        </>
    );
}

export default PreviousImmigrationCheck;
