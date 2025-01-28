import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../../components";
import moment from "moment";
import { baseUrl } from "../../../../../constants";
import ActionButton from "../ActionButton";
import React from "react";

const WorkExpRow = ({
  workExperienceData,
  handleWorkExperienceChange,
  addMoreWorkExperience,
  removeWorkExperience,
}: any) => {
  console.log(workExperienceData);

  const renderWorkRows = (workExperience: any, index: any) => (
    <>
      <Row key={index} className="mb-3 p-2 border-bottom rounded pe-0">
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="qualification">
            <Form.Label><span className="text-danger">*</span> Work Experience</Form.Label>
            <FormInput
              type="text"
              name="years"
              placeholder="Enter work experience"
              key="years"
              value={workExperience?.years || ""}
              onChange={(e) =>
                handleWorkExperienceChange(e.target.name, e.target.value, index)
              }
              min={0}
              max={99}
            />
            {workExperience?.errors?.years && (
              <Form.Text className="text-danger">
                {workExperience?.errors?.years}
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="company">
            <Form.Label><span className="text-danger">*</span> Company</Form.Label>
            <FormInput
              type="text"
              name="company"
              placeholder="Enter company"
              key="company"
              value={workExperience?.company || ""}
              onChange={(e) =>
                handleWorkExperienceChange(e.target.name, e.target.value, index)
              }
            />
            {workExperience?.errors?.company && (
              <Form.Text className="text-danger">
                {workExperience?.errors?.company}
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="designation">
            <Form.Label><span className="text-danger">*</span> Designation</Form.Label>
            <FormInput
              type="text"
              name="designation"
              placeholder="Enter designation"
              key="designation"
              value={workExperience?.designation || ""}
              onChange={(e) =>
                handleWorkExperienceChange(e.target.name, e.target.value, index)
              }
            />
            {workExperience?.errors?.designation && (
              <Form.Text className="text-danger">
                {workExperience?.errors?.designation}
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`bank_statement`}>
            <Form.Label>
              <span className="text-danger">*</span> Bank Statement
            </Form.Label>
            <FormInput
              type="file"
              accept="image/*,application/pdf" 
              name="bank_statement"
              onChange={(e) =>
                handleWorkExperienceChange(
                  e.target.name,
                  e.target.files?.[0],
                  index
                )
              }
            />
            {workExperience?.errors?.bank_statement && (
              <Form.Text className="text-danger">
                {workExperience?.errors?.bank_statement}
              </Form.Text>
            )}
            {typeof workExperience?.bank_statement === "string" && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-eye text-primary me-2"></i>
                <a
                  href={`${baseUrl}uploads/workDocuments/${workExperience?.bank_statement}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  bank_statement
                </a>
              </div>
            )}
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`experience_certificate`}>
            <Form.Label>
              <span className="text-danger">*</span> Experience Certificate
            </Form.Label>
            <FormInput
              type="file"
              accept="image/*,application/pdf" 
              name="experience_certificate"
              onChange={(e) =>
                handleWorkExperienceChange(
                  e.target.name,
                  e.target.files?.[0],
                  index
                )
              }
            />
            {workExperience?.errors?.experience_certificate && (
              <Form.Text className="text-danger">
                {workExperience?.errors?.experience_certificate}
              </Form.Text>
            )}
            {typeof workExperience?.experience_certificate === "string" && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-eye text-primary me-2"></i>
                <a
                  href={`${baseUrl}uploads/workDocuments/${workExperience?.experience_certificate}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  experience_certificate
                </a>
              </div>
            )}
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`job_offer_document`}>
            <Form.Label>
              <span className="text-danger">*</span> Job Offer Document
            </Form.Label>
            <FormInput
              type="file"
              accept="image/*,application/pdf" 
              name="job_offer_document"
              onChange={(e) =>
                handleWorkExperienceChange(
                  e.target.name,
                  e.target.files?.[0],
                  index
                )
              }
            />
            {workExperience?.errors?.job_offer_document && (
              <Form.Text className="text-danger">
                {workExperience?.errors?.job_offer_document}
              </Form.Text>
            )}
            {typeof workExperience?.job_offer_document === "string" && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-eye text-primary me-2"></i>
                <a
                  href={`${baseUrl}uploads/workDocuments/${workExperience?.job_offer_document}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  job_offer_document
                </a>
              </div>
            )}
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`appointment_document`}>
            <Form.Label>
              <span className="text-danger">*</span> Appointment Document
            </Form.Label>
            <FormInput
              type="file"
              accept="image/*,application/pdf" 
              name="appointment_document"
              onChange={(e) =>
                handleWorkExperienceChange(
                  e.target.name,
                  e.target.files?.[0],
                  index
                )
              }
            />
            {workExperience?.errors?.appointment_document && (
              <Form.Text className="text-danger">
                {workExperience?.errors?.appointment_document}
              </Form.Text>
            )}
            {typeof workExperience?.appointment_document === "string" && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-eye text-primary me-2"></i>
                <a
                  href={`${baseUrl}uploads/workDocuments/${workExperience?.appointment_document}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  appointment_document
                </a>
              </div>
            )}
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`payslip_document`}>
            <Form.Label>
              <span className="text-danger">*</span> Payslip Document
            </Form.Label>
            <FormInput
              type="file"
              accept="image/*,application/pdf" 
              name="payslip_document"
              onChange={(e) =>
                handleWorkExperienceChange(
                  e.target.name,
                  e.target.files?.[0],
                  index
                )
              }
            />
            {workExperience?.errors?.payslip_document && (
              <Form.Text className="text-danger">
                {workExperience?.errors?.payslip_document}
              </Form.Text>
            )}
            {typeof workExperience?.payslip_document === "string" && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-eye text-primary me-2"></i>
                <a
                  href={`${baseUrl}uploads/workDocuments/${workExperience?.payslip_document}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  payslip_document
                </a>
              </div>
            )}
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="dob">
            <Form.Label>
              <span className="text-danger">*</span> From
            </Form.Label>
            <FormInput
              type="date"
              name="from"
              placeholder="Select date of birth"
              key="from"
              defaultValue={moment(workExperience?.from).format("YYYY-MM-DD")}
              value={moment(workExperience?.from).format("YYYY-MM-DD")}
              max={moment().format("YYYY-MM-DD")}
              onChange={(e) =>
                handleWorkExperienceChange(e.target.name, e.target.value, index)
              }
            />
            {workExperience?.errors?.from && (
              <Form.Text className="text-danger">
                {workExperience?.errors?.from}
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="dob">
            <Form.Label>
              <span className="text-danger">*</span> To
            </Form.Label>
            <FormInput
              type="date"
              name="to"
              placeholder="Select date of birth"
              key="to"
              max={moment().format("YYYY-MM-DD")}
              defaultValue={moment(workExperience?.to).format("YYYY-MM-DD")}
              value={moment(workExperience?.to).format("YYYY-MM-DD")}
              onChange={(e) =>
                handleWorkExperienceChange(e.target.name, e.target.value, index)
              }
            />
            {workExperience?.errors?.to && (
              <Form.Text className="text-danger">
                {workExperience?.errors?.to}
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        {workExperienceData?.length > 0 && (
          <ActionButton
            onClick={() => removeWorkExperience(index, workExperience?.id ?? 0)}
            label="Remove"
            iconClass="mdi mdi-delete"
            colorClass="text-danger" // Make it red for "Remove"
          />
        )}
      </Row>
    </>
  );

  return (
    <Row>
      <h5 className="mb-4 text-uppercase">
        <i className="mdi mdi-account-circle me-1"></i>Work Experience
      </h5>

      {workExperienceData?.map((workExperience: any, index: any) =>
        renderWorkRows(workExperience, index)
      )}

      <Row>
        <Row className="mb-2">
          <ActionButton
            onClick={addMoreWorkExperience}
            label="Add More"
            iconClass="mdi mdi-plus"
          />
        </Row>
      </Row>
    </Row>
  );
};

export default WorkExpRow;
