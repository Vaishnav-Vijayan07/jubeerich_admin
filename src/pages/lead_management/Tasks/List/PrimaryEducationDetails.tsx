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
          </Form.Group>
        </Col>

        <Row className="mb-2">
          <Col md={4} className="">
            {details?.mark_sheet && (
              <div>
                <img
                  src={
                    details?.id
                      ? `${baseUrl}/uploads/educationDocuments/${details?.mark_sheet}`
                      : details?.mark_sheet instanceof File
                      ? URL.createObjectURL(details?.mark_sheet)
                      : details?.mark_sheet
                  } // URL from the API or previously saved file
                  alt="Uploaded Mark Sheet"
                  style={{
                    width: "100px",
                    height: "auto",
                    borderRadius: "5px",
                  }} // Adjust size and style as needed
                />
              </div>
            )}
          </Col>
          <Col md={4} className="">
            {details?.certificate && (
              <div>
                <img
                  src={
                    details?.id
                      ? `${baseUrl}/uploads/educationDocuments/${details?.certificate}`
                      : details?.certificate instanceof File
                      ? URL.createObjectURL(details?.certificate)
                      : details?.certificate
                  } // URL from the API or previously saved file
                  alt="Uploaded Mark Sheet"
                  style={{
                    width: "100px",
                    height: "auto",
                    borderRadius: "5px",
                  }} // Adjust size and style as needed
                />
              </div>
            )}
          </Col>
          <Col md={4} className="">
            {details?.admit_card && (
              <div>
                <img
                  src={
                    details?.id
                      ? `${baseUrl}/uploads/educationDocuments/${details?.admit_card}`
                      : details?.admit_card instanceof File
                      ? URL.createObjectURL(details?.admit_card)
                      : details?.admit_card
                  } // URL from the API or previously saved file
                  alt="Uploaded Mark Sheet"
                  style={{
                    width: "100px",
                    height: "auto",
                    borderRadius: "5px",
                  }} // Adjust size and style as needed
                />
              </div>
            )}
          </Col>
        </Row>
      </Row>
    </>
  );
};

export default PrimaryEducationDetails;
