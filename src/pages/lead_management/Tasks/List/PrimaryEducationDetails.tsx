import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";
import moment from "moment";
import { baseUrl } from "../../../../constants";

interface PrimaryEducationDetailsProps {
  title: string; // Title for the section (Primary/Secondary)
  details: {
    id: string | null;
    startDate: string;
    endDate: string;
    certificate: File | null;
    mark_sheet: File | null;
    admit_card: File | null;
    percentage: number | string;
  };
  onChange: (name: string, value: any) => void;
  errors: {
    startDate?: string;
    endDate?: string;
    certificates?: string;
    mark_sheet?: string;
    admit_card?: string;
    percentage?: string;
  };
}

const PrimaryEducationDetails: React.FC<PrimaryEducationDetailsProps> = ({
  title,
  details,
  onChange,
  errors,
}) => {
  console.log(details);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name, e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.name, e.target.files[0]);
    }
  };

  return (
    <>
      <Row>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-office-building me-1"></i> {title}
        </h5>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3" controlId={`${title}_start_date`}>
            <Form.Label>
              <span className="text-danger">*</span> Start Date
            </Form.Label>
            <FormInput
              type="date"
              name="startDate"
              value={moment(details.startDate).format("YYYY-MM-DD")}
              onChange={handleDateChange}
            />
            {errors.startDate && (
              <div className="text-danger">{errors.startDate}</div>
            )}
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3" controlId={`${title}_end_date`}>
            <Form.Label>
              <span className="text-danger">*</span> End Date
            </Form.Label>
            <FormInput
              type="date"
              name="endDate"
              value={moment(details.endDate).format("YYYY-MM-DD")}
              onChange={handleDateChange}
            />
            {errors.endDate && (
              <div className="text-danger">{errors.endDate}</div>
            )}
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3">
            <Form.Label>
              <span className="text-danger">* </span>Percentage
            </Form.Label>
            <FormInput
              type="number"
              name="percentage"
              placeholder="Enter percentage"
              value={details.percentage}
              onChange={handleDateChange}
              min={0}
            />
            {errors.percentage && (
              <div className="text-danger">{errors.percentage}</div>
            )}
          </Form.Group>
        </Col>

        <Col
          md={4}
          className="d-flex justify-content-between align-items-center"
        >
          <Form.Group className="mb-3" controlId={`${title}_exam_documents`}>
            <Form.Label>Upload Mark Sheet</Form.Label>
            <Form.Control
              name="mark_sheet"
              type="file"
              onChange={handleFileChange}
            />
            {typeof details.mark_sheet === "string" && (
              <div className="mt-2">
                <a
                  href={`${baseUrl}/uploads/educationDocuments/${details.mark_sheet}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="mdi mdi-download me-1"></i> mark_sheet
                </a>
              </div>
            )}
          </Form.Group>
        </Col>

        <Col
          md={4}
          className="d-flex justify-content-between align-items-center"
        >
          <Form.Group className="mb-3" controlId={`${title}_exam_documents`}>
            <Form.Label>Upload Certificate</Form.Label>
            <Form.Control
              name="certificate"
              type="file"
              onChange={handleFileChange}
            />
          {typeof details.certificate === "string" && (
            <div className="mt-2">
              <a
                href={`${baseUrl}/uploads/educationDocuments/${details.certificate}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="mdi mdi-download me-1"></i> certificate
              </a>
            </div>
          )}
          </Form.Group>
        </Col>

        <Col
          md={4}
          className="d-flex justify-content-between align-items-center"
        >
          <Form.Group className="mb-3" controlId={`${title}_exam_documents`}>
            <Form.Label>Upload Admit Card</Form.Label>
            <Form.Control
              name="admit_card"
              type="file"
              onChange={handleFileChange}
            />
            {typeof details.admit_card === "string" && (
              <div className="mt-2">
                <a
                  href={`${baseUrl}/uploads/educationDocuments/${details.admit_card}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="mdi mdi-download me-1"></i> admit_card
                </a>
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default PrimaryEducationDetails;
