import React from "react";
import { Button, Col } from "react-bootstrap";

type Props = {
  handleNavigation: (type: "next" | "prev") => void;
  current: number;
  handleReject: (value: any) => void
};

function FormButtons({ handleNavigation, current, handleReject }: Props) {
  
  const setRejectionIndex = (current: any) => {
    handleReject(current)
  }

  const handleNavigationToPortalDetails = ()=>{
    
  }

  return (
    <>
      <Col className="d-flex justify-content-end">
        <Button variant="danger" className="me-2" onClick={() => setRejectionIndex(current)}>
          Reject
        </Button>
        {current !== 0 && (
          <Button variant="success" className="me-2" onClick={() => handleNavigation("prev")}>
            Previous
          </Button>
        )}
        {current !== 6 ? (
          <Button variant="success" onClick={() => handleNavigation("next")}>
            Next
          </Button>
        ) : (
          <Button variant="success" onClick={handleNavigationToPortalDetails}>Proceed to application</Button>
        )}
      </Col>
    </>
  );
}

export default FormButtons;
