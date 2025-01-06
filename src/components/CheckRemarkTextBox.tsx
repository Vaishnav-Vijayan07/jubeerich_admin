import React from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import FormInput from "./FormInput"; // Assuming FormInput is a custom component

interface Props {
  showRemark?: boolean;
  remarks?: string;
  setRemarks: (remarks: string) => void;
  saveRemark?: () => void;
  showRemarkBox?: () => void;
}

const RemarksSection = ({ showRemark, remarks, setRemarks, saveRemark, showRemarkBox }: Props) => {
  return (
    <>
       <Row style={{ padding: "0px" }}>
        {showRemark && (
          <Col md={12} style={{ padding: "0px" }}>
            <Form.Group className="mb-3" controlId="remarksTextarea">
              <FormInput
                labelClassName="ms-2"
                name="remarks"
                type="textarea"
                rows="6"
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target?.value)}
              />
            </Form.Group>
          </Col>
        )}
      </Row>
      <Row>
        <Col>
          <Button variant="success" className="btn-sm me-2 mb-2" onClick={showRemark ? saveRemark : showRemarkBox}>
            {showRemark ? "Save" : "Add"} Remarks
          </Button>
        </Col>
      </Row>
   
    </>
  );
};

export default RemarksSection;
