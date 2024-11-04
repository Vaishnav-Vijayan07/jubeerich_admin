import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import DocumentsOverview from "../../lead_management/Tasks/List/DocumentsOverview/DocumentsOverview";

type Props = {
    studentId: any;
    fee: any;
};

function ApplicationFeeCheck({ studentId, fee }: Props) {
    return (
        <>
            <Row>
                <h4>Application Fee Check</h4>
            </Row>
            <Row className="mt-2">
                <Card>
                    <Card.Body>
                        <Row>
                            <Form.Group controlId="fee">
                                <Form.Label>
                                    {`Application Fee`} - {fee}
                                </Form.Label>
                            </Form.Group>
                        </Row>
                    </Card.Body>
                </Card>
            </Row>
        </>
    );
}

export default ApplicationFeeCheck;
