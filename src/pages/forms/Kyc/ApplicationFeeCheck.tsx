import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import DocumentsOverview from "../../lead_management/Tasks/List/DocumentsOverview/DocumentsOverview";

type Props = {
    studentId: any;
};

function ApplicationFeeCheck({ studentId }: Props) {
    return (
        <>
            <Row>
                <h4>Application Fee Check</h4>
            </Row>
            <Row className="mt-2">
                <Card>
                    <Card.Body>
                        <Row>
                            <Form.Group className="mb-2" controlId="country_name">
                                <Form.Label>
                                    {`Application Fee`} - {'500'}
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