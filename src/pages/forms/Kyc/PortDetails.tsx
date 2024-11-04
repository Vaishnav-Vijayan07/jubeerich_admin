import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {};

function PortalDetails({}: Props) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { universityId, applicationId, comments, reference_id } = state || {};

  const [application_reference_id, setReferenceId] = useState(reference_id);
  const [application_comment, setApplicationComment] = useState(comments);
  const [portalData, setPortalData] = useState({
    portal_link: "",
    username: "",
    password: "",
  });

  const proceedSave = async (application_reference_id: any, application_comment: any) => {
    try {
      const { data } = await axios.patch(`/complete_application/${applicationId}`, {
        ref_id: application_reference_id,
        comment: application_comment,
      });
      if (data?.status) {
        navigate("/kyc_details/applications/submitted");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUniversityDetails = async () => {
    const { data } = await axios.get(`/portal_details/${universityId}`);
    setPortalData(data?.data);
  };

  console.log(portalData);

  useEffect(() => {
    if (universityId && applicationId) {
      fetchUniversityDetails();
    }
  }, []);

  const handleLanguageMarkInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "application_reference_id") {
      setReferenceId(value);
    } else if (name === "application_comment") {
      setApplicationComment(value);
    }
  };

  const handleProceed = () => {
    console.log(application_reference_id, application_comment);
    proceedSave(application_reference_id, application_comment);
  };

  return (
    <>
      <Row>
        <Col md={4}>
          <div className="page-title-box">
            <h4 className="page-title">Portal Details</h4>
          </div>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col md={5}>
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
                    {portalData?.portal_link}
                  </h5>
                  <h5>Username: {portalData?.username}</h5>
                  <h5>Password: {portalData?.password}</h5>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={7}>
          <Row className="mt-2">
            <h4>Reference Details</h4>
          </Row>
          <Card>
            <Card.Body>
              <Row classname="d-flex flex-column p-2">
                <Row>
                  <Col>
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
                <Row>
                  <Col>
                    <Button className="float-end" style={{backgroundColor:"#28a745"}} onClick={handleProceed}>
                      Mark as complete
                    </Button>
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
