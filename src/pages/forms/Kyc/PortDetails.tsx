import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ViewAllDetails from "../../../components/ApplicationChecks/PortalDetails/ViewAllDetails";
import PortalDetailsBox from "../../../components/ApplicationChecks/PortalDetails/PortalDetailsBox";
import ReferenceDetails from "../../../components/ApplicationChecks/PortalDetails/ReferenceDetails";

type Props = {};

function PortalDetails({}: Props) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { universityId, applicationId, comments, reference_id } = state || {};

  const [portalData, setPortalData] = useState(null);

  const fetchUniversityDetails = async () => {
    const { data } = await axios.get(`/portal_details/${universityId}`);
    setPortalData(data?.data);
  };

  console.log("sta", state);

  useEffect(() => {
    if (universityId && applicationId) {
      fetchUniversityDetails();
    }
  }, []);

  return (
    <>
      <Row>
        <Col md={4}>
          <div className="page-title-box">
            <h4 className="page-title">Portal Details</h4>
          </div>
        </Col>
      </Row>
      <Row>
        <Card style={{ zIndex: "1" }}>
          <Card.Body className="d-flex gap-3">
            <Col md={3}>
              <ViewAllDetails applicationId={applicationId} />
              <PortalDetailsBox data={portalData || []} />
            </Col>
            <Col className="flex-1">
              <ReferenceDetails reference_id={reference_id} comments={comments} applicationId={applicationId} />
            </Col>
          </Card.Body>
        </Card>
      </Row>
    </>
  );
}

export default PortalDetails;
