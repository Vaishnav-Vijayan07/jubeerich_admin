import React from "react";
import { Button, Col } from "react-bootstrap";

type Props = {
  handleNavigation: (type: "next" | "prev") => void;
  current: number;
  handleReject: (value: any) => void;
  studentId: any;
  handleProceed: any;
};

function FormButtons({ handleNavigation, current, handleReject, studentId, handleProceed }: Props) {
  const setRejectionIndex = (current: any) => {
    handleReject(current);
  };

  return (
    <>
      <Col className="d-flex justify-content-end">
        <Button disabled={!studentId} variant="danger" className="me-2" onClick={() => setRejectionIndex(current)}>
          Reject
        </Button>
        {current !== 0 && (
          <Button variant="success" className="me-2" onClick={() => handleNavigation("prev")}>
            Previous
          </Button>
        )}
        {current !== 6 ? (
          <Button disabled={!studentId} variant="success" onClick={() => handleNavigation("next")}>
            Next
          </Button>
        ) : (
          <Button onClick={handleProceed} variant="success">
            Proceed to application
          </Button>
        )}
      </Col>
    </>
  );
}

export default FormButtons;
