import React from "react";
import { Col, Row } from "react-bootstrap"; // Assuming you're using React Bootstrap

interface ActionButtonProps {
  onClick: () => void; // Function for handling the click
  label: string; // Text for the button
  iconClass: string; // Icon class for the button
  colorClass?: string; // Optional: Class for text color, defaults to "text-primary"
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  label,
  iconClass,
  colorClass = "text-primary", // Default color is primary
}) => (
  <Row className="mb-2">
    <Col className="d-flex align-items-center gap-1">
      <i
        className={`${colorClass} ${iconClass} fs-3 ps-1`}
        onClick={onClick}
      ></i>
      <span className={colorClass}>{label}</span>
    </Col>
  </Row>
);

export default ActionButton;
