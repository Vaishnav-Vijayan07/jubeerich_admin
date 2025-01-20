import React, { memo, useEffect, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import FormInput from "./FormInput"; // Assuming FormInput is a custom component
import classNames from "classnames";

interface Props {
  showRemark?: boolean;
  remark?: string;
  saveRemark?: (value: string) => void;
  onRemarkChange?: (value: string) => void;
}

const RemarksSection = ({ remark, onRemarkChange }: Props) => {
  const handleRemarkChange = (value: string) => {
    if (onRemarkChange) {
      onRemarkChange(value);
    }
  };

  return (
    <>
      <Row style={{ padding: "0px" }}>
        <Col md={3}>
          <div className="d-flex align-items-center">
            <h5 className="me-2">Remark</h5>
          </div>
        </Col>

        <Col md={12} style={{ padding: "0px" }}>
          <Form.Group className="mb-3" controlId="remarksTextarea">
            <FormInput
              className="remark-text-area"
              labelClassName="ms-2"
              name="remarks"
              type="textarea"
              rows="6"
              value={remark}
              onChange={(e) => handleRemarkChange(e.target?.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row></Row>
    </>
  );
};

export default memo(RemarksSection);
