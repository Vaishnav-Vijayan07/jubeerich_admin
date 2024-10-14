import React from "react";
import { Button, Col } from "react-bootstrap";

type Props = {
  handleNavigation: (type: "next" | "prev") => void;
  current: number;
};

function FormButtons({ handleNavigation, current }: Props) {
  return (
    <>
      <Col className="d-flex justify-content-end">
        <Button variant="danger" className="me-2">
          Reject
        </Button>
        {current !== 0 && (
          <Button variant="success" className="me-2" onClick={() => handleNavigation("prev")}>
            Previous
          </Button>
        )}
        {current !== 3 ? (
          <Button variant="success" onClick={() => handleNavigation("next")}>
            Next
          </Button>
        ) : (
          <Button variant="success">Proceed</Button>
        )}
      </Col>
    </>
  );
}

export default FormButtons;
