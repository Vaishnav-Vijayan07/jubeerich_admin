import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Attachments = ({ studentId }: any) => {
    const [docs, setDocs] = useState([])

    const getAllAttachmentApi = async () => {
        try {
            const attachments = await axios.get(`get_all_docs/${studentId}`)
            setDocs(attachments?.data?.data)
        } catch (err) {
            console.log("error:", err)
        }
    }

    console.log("docs ==>", docs);


    useEffect(() => {
        getAllAttachmentApi()
    }, [])

    return (
        <div>
            <h5 className="mb-2 text-uppercase">
                <i className="mdi mdi-file-document-outline me-1"></i> Exam Documents
            </h5>
            {
                docs?.map((doc: any) => (
                    <Card className="mb-1 shadow-none border">
                        <div className="p-2">
                            <Row className="align-items-center">
                                <div className="col-auto">
                                    <div className="avatar-sm">
                                        <span className="avatar-title badge-soft-primary text-primary rounded" style={{ fontSize: "13px" }}>
                                            {doc?.extension?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="col ps-0">
                                    <p className="mb-0 font-12">{doc?.exam_name}</p>
                                    <Link to="#" className="text-muted fw-bold">
                                        {doc?.document}
                                    </Link>
                                </div>
                                <div className="col-auto">
                                    <Link to={doc?.downloadUrl} className="btn btn-link font-16 text-muted" target="_blank" rel="noopener noreferrer" download>
                                        <i className="dripicons-download"></i>
                                    </Link>
                                </div>
                            </Row>
                        </div>
                    </Card>
                ))
            }
        </div>
    )
}

export default Attachments