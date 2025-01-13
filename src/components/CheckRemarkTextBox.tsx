import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import FormInput from "./FormInput"; // Assuming FormInput is a custom component
import classNames from "classnames";

interface Props {
  showRemark?: boolean;
  remarks?: string;
  saveRemark?: (value: string) => void;
}

const RemarksSection = ({ showRemark, remarks, saveRemark }: Props) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [remark, setRemark] = useState<string>("");

  const handleEdit = () => {
    setIsEdit(!isEdit);
    setRemark(remarks || "");
  };
  const handleSave = () => {
    if (saveRemark) {
      saveRemark(remark);
    }
    setIsEdit(false);
    setRemark("");
  };

  return (
    <>
      <Row style={{ padding: "0px" }}>
        <Col md={3}>
          <div className="d-flex align-items-center">
            <h5 className="me-2">Remark</h5>
            <i
              className={classNames("mdi", isEdit ? "mdi-close" : "mdi-pencil", "font-18 text-primary edit-icon")}
              onClick={handleEdit}
            ></i>
          </div>
          <p>{remarks}</p>
        </Col>
        {isEdit && (
          <>
            <Col md={12} style={{ padding: "0px" }}>
              <Form.Group className="mb-3" controlId="remarksTextarea">
                <FormInput
                  className="remark-text-area"
                  labelClassName="ms-2"
                  name="remarks"
                  type="textarea"
                  rows="6"
                  value={remark}
                  onChange={(e) => setRemark(e.target?.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Button variant="success" className="btn-sm me-2 mb-2" onClick={handleSave}>
                {showRemark ? "Save" : "Add"} Remarks
              </Button>
            </Col>
          </>
        )}
      </Row>
      <Row></Row>
    </>
  );
};

export default RemarksSection;
