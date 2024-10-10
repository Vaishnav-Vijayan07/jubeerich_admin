import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

interface Props {}

const PendingDetailsById = (props: Props) => {
  const { id } = useParams();

  const item = {
    id: 1,
    full_name: "John Doe",
    country_name: "India",
    university_name: "University of Mumbai",
    course_name: "B.Tech",
    office_type_name: "Mumbai",
    source_name: "Walkin",
    lead_received_date: "2021-01-10 18:30:00",
    date: "2021-01-12 18:30:00",
    assigned_by: "Counsellor",
    assign_type: "Assigned",
    assigned_to: "John Smith",
    employee_name: "John Doe",
    status: "In Progress",
  };

  return (
    <>
      <Row className="mt-2">
        <Card>
          <Card.Body>
            <h3 className="header ">Basic Details</h3>
            <Row className="mt-2 p-3">
              <Col md={2}>
                <h5>Name</h5>
                <p>{item.full_name}</p>
              </Col>

              <Col md={2}>
                <h5>Country</h5>
                <p>{item.country_name}</p>
              </Col>

              <Col md={2}>
                <h5>University</h5>
                <p>{item.university_name}</p>
              </Col>

              <Col md={2}>
                <h5>Course</h5>
                <p>{item.course_name}</p>
              </Col>

              <Col md={2}>
                <h5>Office Type</h5>
                <p>{item.office_type_name}</p>
              </Col>

              <Col md={2}>
                <h5>Source</h5>
                <p>{item.source_name}</p>
              </Col>

              <Col md={2}>
                <h5>Lead Received Date</h5>
                <p>{item.lead_received_date}</p>
              </Col>

              <Col md={2}>
                <h5>Assigned By</h5>
                <p>{item.assigned_by}</p>
              </Col>

              <Col md={2}>
                <h5>Assign Type</h5>
                <p>{item.assign_type}</p>
              </Col>

              <Col md={2}>
                <h5>Assigned To</h5>
                <p>{item.assigned_to}</p>
              </Col>

              <Col md={2}>
                <h5>Status</h5>
                <p>{item.status}</p>
              </Col>
              <Col md={2}>
                <Button variant="primary" className="mt-2" size="sm">
                  View More
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
      <Row>
        <h4>Program Availability Check</h4>
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
            <Row>
              <Col className="d-flex justify-content-end">
                <Button variant="danger" className="me-2">
                  Reject
                </Button>
                <Button variant="success">Next</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default PendingDetailsById;
