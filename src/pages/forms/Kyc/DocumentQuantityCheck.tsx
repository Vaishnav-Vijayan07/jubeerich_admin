import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import DocumentsOverview from "../../lead_management/Tasks/List/DocumentsOverview/DocumentsOverview";

type Props = {
    studentId: any;
    applicationId: any;
};

function DocumentQuantityCheck({ studentId, applicationId }: Props) {
    return (
        <>
            <Row>
                <h4>Document Quantity Check</h4>
            </Row>
            <Row className="mt-2">
                <Card>
                    <Card.Body>
                        <Row>
                            <DocumentsOverview studentId={studentId} check={true} />
                        </Row>
                    </Card.Body>
                </Card>
            </Row>
        </>
    );
}

export default DocumentQuantityCheck;
