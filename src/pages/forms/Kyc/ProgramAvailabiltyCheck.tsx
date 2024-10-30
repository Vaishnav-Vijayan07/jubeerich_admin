import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";

type Props = {
  data: any
};

function ProgramAvailabiltyCheck({ data }: Props) {
  return (
    <>
      <Row>
        <h4>Program Availability Check</h4>
      </Row>
      <Row className="mt-2">
        <Card>
          <Card.Body>
            <Row className="mt-2">
              <Col md={3}>
                <h5>Country</h5>
                <p>{data?.country_name || 'N/A'}</p>
              </Col>

              <Col md={3}>
                <h5>University</h5>
                <p>{data?.university_name || 'N/A'}</p>
              </Col>

              <Col md={3}>
                <h5>Intake applying for</h5>
                <p>{data?.intake_applying_for || 'N/A'}</p>
              </Col>

              <Col md={3}>
                <h5>Course Link</h5>
                <p>
                  <a
                    href={data?.course_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data?.course_link || 'N/A'}
                  </a>
                </p>
              </Col>

            </Row>
            <Row className="mt-2 mb-2">
              <Col md={3}>
                <h5>Stream</h5>
                <p>{data?.stream_name}</p>
              </Col>

              <Col md={3}>
                <h5>Program</h5>
                <p>{data?.program_name}</p>
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

export default ProgramAvailabiltyCheck;
