import React, { memo } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type Props = {
  data: {
    id: number;
    full_name: string;
    country_name: string;
    university_name: string;
    course_name: string;
    office_type_name: string;
    source_name: string;
    lead_received_date: string; // Use Date if the value is actually a Date object
    date: string; // Same as above, consider Date type if necessary
    assigned_by: string;
    assign_type: string;
    assigned_to: string;
    employee_name: string;
    status: string;
  };
  studentId: any
};

function BasicDetails({ data, studentId }: Props) {
  const navigate = useNavigate();

  return (
    <Card>
      <Card.Body style={{paddingTop: '0px', paddingBottom: '0px'}}>
        <Row>
          <Col md={2}>
            <h5>Name</h5>
            <p>{data.full_name}</p>
          </Col>

          <Col md={2}>
            <h5>Country</h5>
            <p>{data.country_name}</p>
          </Col>

          <Col md={2}>
            <h5>University</h5>
            <p>{data.university_name}</p>
          </Col>

          <Col md={2}>
            <h5>Course</h5>
            <p>{data.course_name}</p>
          </Col>

          <Col md={2}>
            <h5>Office Type</h5>
            <p>{data.office_type_name}</p>
          </Col>

          <Col md={2}>
            <h5>Source</h5>
            <p>{data.source_name}</p>
          </Col>

          <Col md={2}>
            <h5>Lead Received Date</h5>
            <p>{data.lead_received_date}</p>
          </Col>

          <Col md={2}>
            <h5>Assigned By</h5>
            <p>{data.assigned_by}</p>
          </Col>

          <Col md={2}>
            <h5>Assign Type</h5>
            <p>{data.assign_type}</p>
          </Col>

          <Col md={2}>
            <h5>Assigned To</h5>
            <p>{data.assigned_to}</p>
          </Col>

          <Col md={2}>
            <h5>Status</h5>
            <p>{data.status}</p>
          </Col>
          <Col md={2}>
            <Button variant="primary" className="mt-2" size="sm" onClick={() => navigate(`/leads/manage/${studentId}`)}>
              View More
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default memo(  BasicDetails );
