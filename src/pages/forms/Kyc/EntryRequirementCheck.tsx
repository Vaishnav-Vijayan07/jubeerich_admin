import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";

type Props = {};

function EntryRequirementCheck({}: Props) {
  return (
    <>
      <Row>
        <h4>Entry Requirement Check</h4>
      </Row>
      
      <Row className="mt-2">
        <Card>
          <Card.Body>
            <Row className="mt-2 p-3">
              <Col md={2}>
                <h5>Country</h5>
                <p>Canada</p>
              </Col>

              <Col md={2}>
                <h5>University</h5>
                <p>MacEwan University</p>
              </Col>

              <Col md={2}>
                <h5>Intake applying for</h5>
                <p>April</p>
              </Col>

              <Col md={2}>
                <h5>Course Link</h5>
                <p>
                  <a
                    href="https://www.macewan.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.macewan.ca
                  </a>
                </p>
              </Col>

              <Col md={2}>
                <h5>Stream</h5>
                <p>Program</p>
              </Col>

              <Col md={2}>
                <h5>Information Technology</h5>
                <p>Data Science</p>
              </Col>
            </Row>
            <Row>
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

export default EntryRequirementCheck;
