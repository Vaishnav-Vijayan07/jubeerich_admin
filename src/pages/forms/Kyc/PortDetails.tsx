import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

type Props = {};

function PortalDetails({}: Props) {
  const [reference_id, setReferenceId] = useState(0);
  const [application_comment, setApplicationComment] = useState("");

  const handleLanguageMarkInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "reference_id") {
      setReferenceId(value);
    } else if (name === "application_comment") {
      setApplicationComment(value);
    }
  };

  return (
    <>
      <Row cla>
        <Col>
          <div className="page-title-box">
            <h4 className="page-title">Portal Details</h4>
          </div>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col md={4}>
          <Row className="mt-2">
            <h4>Application Portal Details</h4>
          </Row>
          <Card>
            <Card.Body>
              <Row classname="d-flex flex-column p-2">
                <div className="p-1">
                  <h5>
                    Portal Link:
                    <i className="mdi mdi-link-variant"></i>
                    https://www.example.com
                  </h5>
                  <h5>Username: user123</h5>
                  <h5>Password: *******</h5>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row></Row>
      <Row className="mt-2">
        <Col md={9}>
          <Row className="mt-2">
            <h4>Reference Details</h4>
          </Row>
          <Card>
            <Card.Body>
              <Row classname="d-flex flex-column p-2">
                <Row>
                  <Col md={4} lg={4}>
                    <Form.Group className="mb-3" controlId="reference_id">
                      <Form.Label>Reference ID</Form.Label>
                      <Form.Control
                        type="text"
                        name="reference_id"
                        value={reference_id}
                        onChange={(e) => {
                          handleLanguageMarkInputChange(e);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={8} lg={8}>
                    <Form.Group className="mb-3" controlId="application_comment">
                      <Form.Label>Application Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        name="application_comment"
                        value={application_comment}
                        onChange={(e) => {
                          handleLanguageMarkInputChange(e);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={8} lg={8}>
                    <Button className="float-end">Proceed</Button>
                  </Col>
                </Row>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default PortalDetails;
