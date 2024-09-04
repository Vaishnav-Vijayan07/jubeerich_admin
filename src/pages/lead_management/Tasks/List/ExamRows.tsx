import React, { useRef, useCallback } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { examtypes } from "../../../forms/data";

interface ExamForm {
  id?: number;
  exam_name: string;
  marks: string;
  exam_documents: File | null;
  document: string | null;
}

interface ExamDataProps {
  examForm: ExamForm[];
  addMoreExamForm: () => void;
  removeExamForm: (index: number, itemId: number) => void;
  handleExamInputChange: (index: number, event: any) => void;
  handleExamFileChange: (index: number, event: any) => void;
}

const ExamData: React.FC<ExamDataProps> = ({
  examForm,
  addMoreExamForm,
  removeExamForm,
  handleExamInputChange,
  handleExamFileChange,
}) => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const triggerFileInput = useCallback((index: number) => {
    fileInputRefs.current[index]?.click();
  }, []);

  const renderExamFields = (item: ExamForm, index: number) => (
    <Row key={index}>
      <Col md={3} lg={3}>
        <Form.Group className="mb-3">
          <Form.Label>Exam Type</Form.Label>
          <Form.Select
            aria-label="Select exam type"
            name="exam_name"
            onChange={(e) => handleExamInputChange(index, e)}
            value={item.exam_name}
          >
            <option value="">Choose..</option>
            {examtypes.map((type) => (
              <option value={type.name} key={type.name}>
                {type.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={3} lg={3}>
        <Form.Group className="mb-3">
          <Form.Label>Exam Score</Form.Label>
          <Form.Control
            type="text"
            name="marks"
            onChange={(e) => handleExamInputChange(index, e)}
            value={item.marks}
          />
        </Form.Group>
      </Col>
      <Col
        md={6}
        lg={6}
        className="d-flex justify-content-between align-items-center"
      >
        {item.document ? (
          <>
            <p onClick={() => triggerFileInput(index)}>{item.document}</p>
            <Form.Control
              name="exam_documents"
              type="file"
              onChange={(e) => handleExamFileChange(index, e)}
              ref={(el: any) => (fileInputRefs.current[index] = el)}
              style={{ display: "none" }}
            />
          </>
        ) : (
          <Form.Group className="mb-3">
            <Form.Label>Upload File</Form.Label>
            <Form.Control
              name="exam_documents"
              type="file"
              onChange={(e) => handleExamFileChange(index, e)}
            />
          </Form.Group>
        )}
      </Col>
      {examForm.length > 1 && (
        <Row className="mb-2">
          <Col className="d-flex align-items-center gap-1">
            <i
              className="text-danger mdi mdi-minus-circle-outline fs-3 ps-1"
              onClick={() => removeExamForm(index, item.id ?? 0)}
            ></i>
            <span className="text-danger">Remove</span>
          </Col>
        </Row>
      )}
    </Row>
  );

  return (
    <>
      {examForm.map((item, index) => renderExamFields(item, index))}
      <Row className="mb-2">
        <Col sm={3} className="d-flex align-items-center gap-1">
          <i
            className="text-primary mdi mdi-plus-circle-outline fs-3 ps-1"
            onClick={addMoreExamForm}
          ></i>
          <span className="text-primary">Add More</span>
        </Col>
      </Row>
    </>
  );
};

export default ExamData;
