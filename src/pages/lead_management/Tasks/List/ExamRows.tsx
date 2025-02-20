import React, { useRef, useCallback } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { examtypes } from "../../../forms/data";
import moment from "moment";
import { baseUrl } from "../../../../constants";
import ActionButton from "./ActionButton";

interface ExamForm {
  id?: number;
  exam_name: string;
  marks: string;
  errors: any;
  score_card: string | null;
}

interface ExamDataProps {
  examForm: ExamForm[];
  addMoreExamForm: any;
  removeExamForm: any;
  handleExamInputChange: any;
  handleExamFileChange: any;
}

const ExamData: React.FC<ExamDataProps> = ({
  examForm,
  addMoreExamForm,
  removeExamForm,
  handleExamInputChange,
  handleExamFileChange,
}) => {
  // const renderExamFields = (item: ExamForm, index: number) => (
  const renderExamFields = (item: any, index: number) => (
    <Row key={index} className="p-2 border-bottom rounded pe-0">
      <Col md={4} lg={4}>
        <Form.Group className="mb-3">
          <Form.Label><span className="text-danger">*</span> Exam Type</Form.Label>
          <Form.Select
            aria-label="Select exam type"
            // name="exam_name"
            name="exam_type"
            onChange={(e) => handleExamInputChange(index, e)}
            value={item.exam_type}
          >
            <option value="">Choose..</option>
            {examtypes.map((type) => (
              <option value={type.name} key={type.name}>
                {type.name}
              </option>
            ))}
          </Form.Select>
          {item.errors?.exam_type && <Form.Text className="text-danger">{item.errors.exam_type}</Form.Text>}
        </Form.Group>
      </Col>

      <Col md={4} lg={4}>
        <Form.Group className="mb-3" controlId="listening_score">
          <Form.Label>Listening Score</Form.Label>
          <Form.Control
            type="text"
            name="listening_score"
            value={item.listening_score}
            onChange={(e) => {
              handleExamInputChange(index, e);
            }}
          />
          {item.errors?.listening_score && <Form.Text className="text-danger">{item.errors.listening_score}</Form.Text>}
        </Form.Group>
      </Col>
      <Col md={4} lg={4}>
        <Form.Group className="mb-3" controlId="speaking_score">
          <Form.Label>Speaking Score</Form.Label>
          <Form.Control
            type="text"
            name="speaking_score"
            value={item.speaking_score}
            onChange={(e) => {
              handleExamInputChange(index, e);
            }}
          />
          {item.errors?.speaking_score && <Form.Text className="text-danger">{item.errors.speaking_score}</Form.Text>}
        </Form.Group>
      </Col>
      <Col md={4} lg={4}>
        <Form.Group className="mb-3" controlId="reading_score">
          <Form.Label>Reading Score</Form.Label>
          <Form.Control
            type="text"
            name="reading_score"
            value={item.reading_score}
            onChange={(e) => {
              handleExamInputChange(index, e);
            }}
          />
          {item.errors?.reading_score && <Form.Text className="text-danger">{item.errors.reading_score}</Form.Text>}
        </Form.Group>
      </Col>
      <Col md={4} lg={4}>
        <Form.Group className="mb-3" controlId="writing_score">
          <Form.Label>Writing Score</Form.Label>
          <Form.Control
            type="text"
            name="writing_score"
            value={item.writing_score}
            onChange={(e) => {
              handleExamInputChange(index, e);
            }}
          />
          {item.errors?.writing_score && <Form.Text className="text-danger">{item.errors.writing_score}</Form.Text>}
        </Form.Group>
      </Col>
      <Col md={4} lg={4}>
        <Form.Group className="mb-3" controlId="marks">
          <Form.Label>Overall Score</Form.Label>
          <Form.Control
            type="text"
            name="overall_score"
            value={item.overall_score}
            onChange={(e) => {
              handleExamInputChange(index, e);
            }}
          />
          {item.errors?.overall_score && <Form.Text className="text-danger">{item.errors.overall_score}</Form.Text>}
        </Form.Group>
      </Col>
      <Col md={4} lg={4}>
        <Form.Group className="mb-3" controlId="marks">
          <Form.Label>Remarks</Form.Label>
          <Form.Control
            type="text"
            name="exam_remarks"
            value={item.exam_remarks}
            onChange={(e) => {
              handleExamInputChange(index, e);
            }}
          />
          {item.errors?.exam_remarks && <Form.Text className="text-danger">{item.errors.exam_remarks}</Form.Text>}
        </Form.Group>
      </Col>
      <Col md={4} lg={4}>
        <Form.Group className="mb-3" controlId="exam_date">
          <Form.Label>Exam Date</Form.Label>
          <Form.Control
            type="date"
            name="exam_date"
            value={moment(item?.exam_date).format("YYYY-MM-DD") ?? moment(item?.exam_date).format("YYYY-MM-DD")}
            max={moment().format("YYYY-MM-DD")}
            onChange={(e) => {
              handleExamInputChange(index, e);
            }}
          />
          {item.errors?.exam_date && <Form.Text className="text-danger">{item.errors.exam_date}</Form.Text>}
        </Form.Group>
      </Col>
      <Col md={4} lg={4} className="d-flex justify-content-between align-items-center">
        <Form.Group className="mb-3 form-group">
          <Form.Label>Upload Score Card
          <small className="text-muted ms-2">( Only images or PDF files are allowed )</small>
          </Form.Label>
          <Form.Control name="score_card" type="file" accept="image/*,application/pdf" onChange={(e) => handleExamFileChange(index, e)} />

          {item.errors?.score_card && <Form.Text className="text-danger">{item.errors.score_card}</Form.Text>}

          {typeof item?.score_card === "string" && (
            <div className="d-flex align-items-center">
              <i className="mdi mdi-eye text-primary me-2"></i>
              <a
                href={`${item?.score_card}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                score_card
              </a>
            </div>
          )}
        </Form.Group>
      </Col>
      {examForm.length > 0 && (
        <Row className="mb-2">
          <ActionButton
            label="Remove"
            onClick={() => removeExamForm(index, item.id ?? 0)}
            colorClass="text-danger"
            iconClass="mdi mdi-delete"
          />
        </Row>
      )}
    </Row>
  );

  return (
    <>
      {examForm.map((item, index) => renderExamFields(item, index))}
      <Row className="mb-2">
        <ActionButton onClick={addMoreExamForm} label="Add More" iconClass="mdi mdi-plus-circle-outline" />
      </Row>
    </>
  );
};

export default ExamData;
