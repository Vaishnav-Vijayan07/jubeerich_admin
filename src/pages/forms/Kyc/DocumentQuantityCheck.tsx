import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import DocumentsOverview from "../../lead_management/Tasks/List/DocumentsOverview/DocumentsOverview";
import { FormInput } from "../../../components";

type Props = {
    studentId: any;
};

function DocumentQuantityCheck({ studentId }: Props) {
    return (
        <>
            <Row>
                <h4 className="py-1" style={{width:"max-content", color:"#1976d2", fontWeight:"800"}}>Document Quantity Check</h4>
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
