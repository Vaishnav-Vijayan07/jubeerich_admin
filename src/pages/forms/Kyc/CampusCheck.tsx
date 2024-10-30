import React from "react";
import { Row,Col,Card,Form } from "react-bootstrap";

type Props = {
  data: any
};

function CampusCheck({ data }: Props) {
  return (
    <>
      <Row>
        <h4>Campus Check</h4>
      </Row>
      <Row className="mt-2">
        <Card>
          <Card.Body>
            <Row className="mt-1 mb-2">
              <Col md={6}>
                <h5>Campus</h5>
                <p>{data?.campus_name}</p>
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

export default CampusCheck;
