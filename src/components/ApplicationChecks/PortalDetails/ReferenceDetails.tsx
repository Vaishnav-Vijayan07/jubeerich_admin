import axios from "axios";
import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { showSuccessAlert } from "../../../constants";
import { useNavigate } from "react-router-dom";

type Props = {
  reference_id: string;
  comments: string;
  applicationId: string;
};

function ReferenceDetails({ reference_id, comments, applicationId }: Props) {
  const navigate = useNavigate();

  const [application_reference_id, setReferenceId] = useState(reference_id);
  const [application_comment, setApplicationComment] = useState(comments);

  const handleLanguageMarkInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "application_reference_id") {
      setReferenceId(value);
    } else if (name === "application_comment") {
      setApplicationComment(value);
    }
  };

  const proceedSave = async (application_reference_id: any, application_comment: any) => {
    try {
      const { data } = await axios.patch(`/complete_application/${applicationId}`, {
        ref_id: application_reference_id,
        comment: application_comment,
      });
      if (data?.status) {
        navigate("/kyc_details/applications/submitted");
        showSuccessAlert("Application submitted succesfully");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleProceed = () => {
    console.log(application_reference_id, application_comment);
    proceedSave(application_reference_id, application_comment);
  };

  return (
    <>
      <Card className="ribbon-box">
        <Card.Body className="portal-box-container">
          <Row>
            <div className="ribbon ribbon-primary float-start px-3 max-content mt-2" style={{marginLeft: "-17px"}}>
              <span>Reference Details</span>
            </div>
          </Row>
          <Row>
            <Col className="">
              <Form.Group className="mb-3" controlId="application_reference_id">
                <Form.Label>Reference ID</Form.Label>
                <Form.Control
                  type="text"
                  name="application_reference_id"
                  value={application_reference_id}
                  onChange={(e) => {
                    handleLanguageMarkInputChange(e);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
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
          <Row className="mb-2">
            <Col>
              <Button className="reference-details-button float-end" onClick={handleProceed}>
                Mark as complete
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default ReferenceDetails;
