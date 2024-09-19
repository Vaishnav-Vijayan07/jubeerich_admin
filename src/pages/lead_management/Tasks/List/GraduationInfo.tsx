import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";
import moment from "moment";
import useSaveGraduationInfo from "../../../../hooks/useSaveGraduationInfo";
import useRemoveFromApi from "../../../../hooks/useRemoveFromApi";

interface GraduationDetailsProps {
  title: string; // Title for the section (Primary/Secondary)
  details: {
    start_date?: string;
    end_date?: string;
    certificate: File | null;
    grading_scale_info: File | null;
    admit_card: File | null;
    backlog_certificate: File | null;
    registration_certificate: File | null;
    percentage: number | string;
    conversion_formula: number | string;
  };
  student_id: string | number;
}

const GraduationInfo: React.FC<GraduationDetailsProps> = ({
  title,
  details,
  student_id,
}) => {
  const [graduationDetails, setGraduationDetails] = useState<any>(details);

  const { saveStudentGraduationDetails, loading } =
    useSaveGraduationInfo(student_id);
  const { removeFromApi } = useRemoveFromApi();

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: any
  ) => {
    handleGraduationDetailsChange(e.target.name, e.target.value, index);
  };

  const handleFileChange = (e: any, index: any) => {
    if (e.target.files && e.target.files.length > 0) {
      handleGraduationDetailsChange(e.target.name, e.target.files[0], index);
    }
  };

  const addMoreGraduationForm = () => {
    setGraduationDetails([
      ...graduationDetails,
      {
        qualification: "",
        start_date: "",
        end_date: "",
        percentage: "",
        conversion_formula: "",
        certificate: null,
        admit_card: null,
        registration_certificate: null,
        backlog_certificate: null,
        grading_scale_info: null,
      },
    ]);
  };

  const removeGraduationForm = (index: any, id: any) => {
    if (id == 0) {
      const updatedGraduationDetails = [...graduationDetails];
      updatedGraduationDetails.splice(index, 1);
      setGraduationDetails(updatedGraduationDetails);
    } else {
      removeFromApi(id, "graduation");
    }
  };

  // Handlers for graduation details state update
  const handleGraduationDetailsChange = (
    name: string,
    value: any,
    index: any
  ) => {
    const newDetails = [...graduationDetails];
    newDetails[index][name] = value;
    setGraduationDetails(newDetails);
  };

  const handleSave = () => {
    saveStudentGraduationDetails(graduationDetails);
  };

  return (
    <>
      <Row>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-office-building me-1"></i> {title}
        </h5>
      </Row>

      <>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3" controlId={`${title}_qualification`}>
              <Form.Label>
                <span className="text-danger">*</span> Course Type
              </Form.Label>
              <FormInput
                type="text"
                placeholder="UG/PG.."
                name="qualification"
                value={graduationDetails?.[0]?.qualification}
                onChange={(e) => handleFieldChange(e, 0)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId={`${title}_start_date`}>
              <Form.Label>
                <span className="text-danger">*</span> Start Date
              </Form.Label>
              <FormInput
                type="date"
                name="start_date"
                value={moment(graduationDetails?.[0]?.start_date).format(
                  "YYYY-MM-DD"
                )}
                onChange={(e) => handleFieldChange(e, 0)}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3" controlId={`${title}_end_date`}>
              <Form.Label>
                <span className="text-danger">*</span> End Date
              </Form.Label>
              <FormInput
                type="date"
                name="end_date"
                value={moment(graduationDetails?.[0]?.end_date).format(
                  "YYYY-MM-DD"
                )}
                onChange={(e) => handleFieldChange(e, 0)}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>
                <span className="text-danger">* </span>Percentage
              </Form.Label>
              <FormInput
                type="number"
                name="percentage"
                placeholder="Enter percentage"
                value={graduationDetails?.[0]?.percentage}
                onChange={(e) => handleFieldChange(e, 0)}
                min={0}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group
              className="mb-3"
              controlId={`${title}_conversion_formula`}
            >
              <Form.Label>
                <span className="text-danger">*</span> Conversion Formula
              </Form.Label>
              <FormInput
                type="text"
                name="conversion_formula"
                value={graduationDetails?.[0]?.conversion_formula}
                onChange={(e) => handleFieldChange(e, 0)}
              />
            </Form.Group>
          </Col>

          <Col
            md={4}
            className="d-flex justify-content-between align-items-center"
          >
            <Form.Group className="mb-3" controlId={`${title}_admit_card`}>
              <Form.Label>Upload Admit Card</Form.Label>
              <Form.Control
                name="admit_card"
                type="file"
                onChange={(e) => handleFileChange(e, 0)}
              />
              {graduationDetails?.[0]?.id !== "0" &&
                typeof graduationDetails?.[0]?.admit_card !== "object" &&
                graduationDetails?.[0]?.admit_card && (
                  <Form.Text className="text-primary">
                    {graduationDetails?.[0]?.admit_card}
                  </Form.Text>
                )}
            </Form.Group>
          </Col>

          <Col
            md={4}
            className="d-flex justify-content-between align-items-center"
          >
            <Form.Group className="mb-3" controlId={`${title}_certificate`}>
              <Form.Label>Upload Certificate</Form.Label>
              <Form.Control
                name="certificate"
                type="file"
                onChange={(e) => handleFileChange(e, 0)}
              />
              {graduationDetails?.[0]?.id !== "0" &&
                typeof graduationDetails?.[0]?.certificate !== "object" &&
                graduationDetails?.[0]?.certificate && (
                  <Form.Text className="text-primary">
                    {graduationDetails?.[0]?.certificate}
                  </Form.Text>
                )}
            </Form.Group>
          </Col>

          <Col
            md={4}
            className="d-flex justify-content-between align-items-center"
          >
            <Form.Group
              className="mb-3"
              controlId={`${title}_registration_certificate `}
            >
              <Form.Label>Upload Registration Certificate</Form.Label>
              <Form.Control
                name="registration_certificate"
                type="file"
                onChange={(e) => handleFileChange(e, 0)}
              />
              {graduationDetails?.[0]?.id !== "0" &&
                typeof graduationDetails?.[0]?.registration_certificate !==
                  "object" &&
                graduationDetails?.[0]?.registration_certificate && (
                  <Form.Text className="text-primary">
                    {graduationDetails?.[0]?.registration_certificate}
                  </Form.Text>
                )}
            </Form.Group>
          </Col>

          <Col
            md={4}
            className="d-flex justify-content-between align-items-center"
          >
            <Form.Group
              className="mb-3"
              controlId={`${title}_grading_scale_info`}
            >
              <Form.Label>Upload Gray Scale Info</Form.Label>
              <Form.Control
                name="grading_scale_info"
                type="file"
                onChange={(e) => handleFileChange(e, 0)}
              />
              {graduationDetails?.[0]?.id !== "0" &&
                typeof graduationDetails?.[0]?.grading_scale_info !==
                  "object" &&
                graduationDetails?.[0]?.grading_scale_info && (
                  <Form.Text className="text-primary">
                    {graduationDetails?.[0]?.grading_scale_info}
                  </Form.Text>
                )}
            </Form.Group>
          </Col>

          <Col
            md={4}
            className="d-flex justify-content-between align-items-center"
          >
            <Form.Group
              className="mb-3"
              controlId={`${title}_backlog_certificate`}
            >
              <Form.Label>Upload Backlog Certificate</Form.Label>
              <Form.Control
                name="backlog_certificate"
                type="file"
                onChange={(e) => handleFileChange(e, 0)}
              />
              {graduationDetails?.[0]?.id !== "0" &&
                typeof graduationDetails?.[0]?.backlog_certificate !==
                  "object" &&
                graduationDetails?.[0]?.backlog_certificate && (
                  <Form.Text className="text-primary">
                    {graduationDetails?.[0]?.backlog_certificate}
                  </Form.Text>
                )}
            </Form.Group>
          </Col>
        </Row>

        {graduationDetails.length > 1 && (
          <Row className="mb-2">
            <Col className="d-flex align-items-center gap-1">
              <i
                className="text-danger mdi mdi-minus-circle-outline fs-3 ps-1"
                onClick={() => {
                  const itemId = graduationDetails?.[0]?.id ?? 0;
                  removeGraduationForm(0, itemId);
                }}
              ></i>
              <span className="text-danger">Remove</span>
            </Col>
          </Row>
        )}

        <Row className="mb-2">
          <Col sm={3} className="d-flex align-items-center gap-1">
            <i
              className="text-primary mdi mdi-plus-circle-outline fs-3 ps-1"
              onClick={addMoreGraduationForm}
            ></i>
            <span className="text-primary">Add More</span>
          </Col>
        </Row>
      </>

      {graduationDetails.length > 1 &&
        graduationDetails.slice(1).map((item: any, index: any) => (
          <>
            <Row key={index + 1}>
              <Col md={4}>
                <Form.Group
                  className="mb-3"
                  controlId={`${title}_qualification`}
                >
                  <Form.Label>
                    <span className="text-danger">*</span> Course Type
                  </Form.Label>
                  <FormInput
                    type="text"
                    placeholder="UG/PG.."
                    name="qualification"
                    value={item?.qualification}
                    onChange={(e) => handleFieldChange(e, index + 1)}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3" controlId={`${title}_start_date`}>
                  <Form.Label>
                    <span className="text-danger">*</span> Start Date
                  </Form.Label>
                  <FormInput
                    type="date"
                    name="start_date"
                    value={moment(item?.start_date).format("YYYY-MM-DD")}
                    onChange={(e) => handleFieldChange(e, index + 1)}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3" controlId={`${title}_end_date`}>
                  <Form.Label>
                    <span className="text-danger">*</span> End Date
                  </Form.Label>
                  <FormInput
                    type="date"
                    name="end_date"
                    value={moment(item?.end_date).format("YYYY-MM-DD")}
                    onChange={(e) => handleFieldChange(e, index + 1)}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <span className="text-danger">* </span>Percentage
                  </Form.Label>
                  <FormInput
                    type="number"
                    name="percentage"
                    placeholder="Enter percentage"
                    value={item?.percentage}
                    onChange={(e) => handleFieldChange(e, index + 1)}
                    min={0}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3"
                  controlId={`${title}_conversion_formula`}
                >
                  <Form.Label>
                    <span className="text-danger">*</span> Conversion Formula
                  </Form.Label>
                  <FormInput
                    type="text"
                    name="conversion_formula"
                    value={item?.conversion_formula}
                    onChange={(e) => handleFieldChange(e, index + 1)}
                  />
                </Form.Group>
              </Col>

              <Col
                md={4}
                className="d-flex justify-content-between align-items-center"
              >
                <Form.Group className="mb-3" controlId={`${title}_admit_card`}>
                  <Form.Label>Upload Admit Card</Form.Label>
                  <Form.Control
                    name="admit_card"
                    type="file"
                    onChange={(e) => handleFileChange(e, index + 1)}
                  />
                  {item?.id !== "0" &&
                    typeof item?.admit_card !== "object" &&
                    item?.admit_card && (
                      <Form.Text className="text-primary">
                        {item?.admit_card}
                      </Form.Text>
                    )}
                </Form.Group>
              </Col>

              <Col
                md={4}
                className="d-flex justify-content-between align-items-center"
              >
                <Form.Group className="mb-3" controlId={`${title}_certificate`}>
                  <Form.Label>Upload Certificate</Form.Label>
                  <Form.Control
                    name="certificate"
                    type="file"
                    onChange={(e) => handleFileChange(e, index + 1)}
                  />
                  {item?.id !== "0" &&
                    typeof item?.certificate !== "object" &&
                    item?.certificate && (
                      <Form.Text className="text-primary">
                        {item?.certificate}
                      </Form.Text>
                    )}
                </Form.Group>
              </Col>
              <Col
                md={4}
                className="d-flex justify-content-between align-items-center"
              >
                <Form.Group
                  className="mb-3"
                  controlId={`${title}_registration_certificate `}
                >
                  <Form.Label>Upload Registration Certification</Form.Label>
                  <Form.Control
                    name="registration_certificate"
                    type="file"
                    onChange={(e) => handleFileChange(e, index + 1)}
                  />
                  {item?.id !== "0" &&
                    typeof item?.registration_certificate !== "object" &&
                    item?.registration_certificate && (
                      <Form.Text className="text-primary">
                        {item?.registration_certificate}
                      </Form.Text>
                    )}
                </Form.Group>
              </Col>
              <Col
                md={4}
                className="d-flex justify-content-between align-items-center"
              >
                <Form.Group
                  className="mb-3"
                  controlId={`${title}_grading_scale_info`}
                >
                  <Form.Label>Upload Gray Scale Info</Form.Label>
                  <Form.Control
                    name="grading_scale_info"
                    type="file"
                    onChange={(e) => handleFileChange(e, index + 1)}
                  />
                  {item?.id !== "0" &&
                    typeof item?.grading_scale_info !== "object" &&
                    item?.grading_scale_info && (
                      <Form.Text className="text-primary">
                        {item?.grading_scale_info}
                      </Form.Text>
                    )}
                </Form.Group>
              </Col>
              <Col
                md={4}
                className="d-flex justify-content-between align-items-center"
              >
                <Form.Group
                  className="mb-3"
                  controlId={`${title}_backlog_certificate`}
                >
                  <Form.Label>Upload Backlog Certificate</Form.Label>
                  <Form.Control
                    name="backlog_certificate"
                    type="file"
                    onChange={(e) => handleFileChange(e, index + 1)}
                  />
                  {item?.id !== "0" &&
                    typeof item?.backlog_certificate !== "object" &&
                    item?.backlog_certificate && (
                      <Form.Text className="text-primary">
                        {item?.backlog_certificate}
                      </Form.Text>
                    )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col className="d-flex align-items-center gap-1">
                <i
                  className="text-danger mdi mdi-minus-circle-outline fs-3 ps-1"
                  onClick={() => {
                    const itemId = item?.id ?? 0;
                    removeGraduationForm(index + 1, itemId);
                  }}
                ></i>
                <span className="text-danger">Remove</span>
              </Col>
            </Row>
          </>
        ))}

      <Row className="mb-2">
        <Button variant="primary" className="mt-4" onClick={handleSave}>
          {loading ? "Saving.." : "Save Graduation Info"}
        </Button>
      </Row>
    </>
  );
};

export default GraduationInfo;
