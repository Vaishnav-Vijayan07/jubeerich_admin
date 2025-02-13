import React from "react";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type Props = {
  applicationId: string;
};

function ViewAllDetails({ applicationId }: Props) {
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate(`/kyc_details/pending/${applicationId}`);
  };

  return (
    <>
      <Col md={12} className="view-all-container">
        <div onClick={handleNavigation} className="d-flex align-items-center">
          <div className="d-flex align-items-center text-primary view-link" role="button">
            <i className="mdi mdi-arrow-left-bold-circle-outline fs-3 me-2"></i>
            <span className="view-text">View all check details</span>
          </div>
        </div>
      </Col>
    </>
  );
}

export default ViewAllDetails;
