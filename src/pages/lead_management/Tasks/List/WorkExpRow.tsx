import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";
import moment from "moment";
import { baseUrl } from "../../../../constants";

const WorkExpRow = ({
  workExperience,
  handleWorkExperienceChange,
  addMoreWorkExperience,
  removeWorkExperience,
}: any) => {
  console.log(workExperience);

  return (
    <Row>
      <h5 className="mb-4 text-uppercase">
        <i className="mdi mdi-account-circle me-1"></i>Work Experience
      </h5>

      {/* Initial Education Entry */}
      <Row>
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="qualification">
            <Form.Label>Work Experience</Form.Label>
            <FormInput
              type="number"
              name="years"
              placeholder="Enter work experience"
              key="years"
              value={workExperience?.[0]?.years || ""}
              onChange={(e) =>
                handleWorkExperienceChange(e.target.name, e.target.value, 0)
              }
              min={0}
            />
            {workExperience?.[0]?.errors?.years && (
              <Form.Text className="text-danger">
                {workExperience?.[0]?.errors?.years}
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="company">
            <Form.Label>Company</Form.Label>
            <FormInput
              type="text"
              name="company"
              placeholder="Enter company"
              key="company"
              value={workExperience?.[0]?.company || ""}
              onChange={(e) =>
                handleWorkExperienceChange(e.target.name, e.target.value, 0)
              }
            />
            {workExperience?.[0]?.errors?.company && (
              <Form.Text className="text-danger">
                {workExperience?.[0]?.errors?.company}
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="designation">
            <Form.Label>Designation</Form.Label>
            <FormInput
              type="text"
              name="designation"
              placeholder="Enter designation"
              key="designation"
              value={workExperience?.[0]?.designation || ""}
              onChange={(e) =>
                handleWorkExperienceChange(e.target.name, e.target.value, 0)
              }
            />
            {workExperience?.[0]?.errors?.designation && (
              <Form.Text className="text-danger">
                {workExperience?.[0]?.errors?.designation}
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
              name="bank_statement"
              onChange={(e) =>
                handleWorkExperienceChange(
                  e.target.name,
                  e.target.files?.[0],
                  0
                )
              }
            />
            {workExperience?.[0]?.errors?.bank_statement && (
              <Form.Text className="text-danger">
                {workExperience?.[0]?.errors?.bank_statement}
              </Form.Text>
            )}
            {typeof workExperience?.[0]?.bank_statement === "string" && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-download text-primary me-2"></i>
                <a
                  href={`${baseUrl}/uploads/workDocuments/${workExperience?.[0]?.bank_statement}`}
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
          <Form.Group className="mb-3" controlId={`job_offer_document`}>
            <Form.Label>
              <span className="text-danger">*</span> Job Offer Document
            </Form.Label>
            <FormInput
              type="file"
              name="job_offer_document"
              onChange={(e) =>
                handleWorkExperienceChange(
                  e.target.name,
                  e.target.files?.[0],
                  0
                )
              }
            />
            {workExperience?.[0]?.errors?.job_offer_document && (
              <Form.Text className="text-danger">
                {workExperience?.[0]?.errors?.job_offer_document}
              </Form.Text>
            )}
            {typeof workExperience?.[0]?.job_offer_document === "string" && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-download text-primary me-2"></i>
                <a
                  href={`${baseUrl}/uploads/workDocuments/${workExperience?.[0]?.job_offer_document}`}
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
              name="appointment_document"
              onChange={(e) =>
                handleWorkExperienceChange(
                  e.target.name,
                  e.target.files?.[0],
                  0
                )
              }
            />
            {workExperience?.[0]?.errors?.appointment_document && (
              <Form.Text className="text-danger">
                {workExperience?.[0]?.errors?.appointment_document}
              </Form.Text>
            )}
            {typeof workExperience?.[0]?.appointment_document === "string" && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-download text-primary me-2"></i>
                <a
                  href={`${baseUrl}/uploads/workDocuments/${workExperience?.[0]?.appointment_document}`}
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
              name="payslip_document"
              onChange={(e) =>
                handleWorkExperienceChange(
                  e.target.name,
                  e.target.files?.[0],
                  0
                )
              }
            />
            {workExperience?.[0]?.errors?.payslip_document && (
              <Form.Text className="text-danger">
                {workExperience?.[0]?.errors?.payslip_document}
              </Form.Text>
            )}
            {typeof workExperience?.[0]?.payslip_document === "string" && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-download text-primary me-2"></i>
                <a
                  href={`${baseUrl}/uploads/workDocuments/${workExperience?.[0]?.payslip_document}`}
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
              defaultValue={moment(workExperience?.[0]?.from).format(
                "YYYY-MM-DD"
              )}
              value={moment(workExperience?.[0]?.from).format("YYYY-MM-DD")}
              onChange={(e) =>
                handleWorkExperienceChange(e.target.name, e.target.value, 0)
              }
            />
            {workExperience?.[0]?.errors?.from && (
              <Form.Text className="text-danger">
                {workExperience?.[0]?.errors?.from}
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
              defaultValue={moment(workExperience?.[0]?.to).format(
                "YYYY-MM-DD"
              )}
              value={moment(workExperience?.[0]?.to).format("YYYY-MM-DD")}
              onChange={(e) =>
                handleWorkExperienceChange(e.target.name, e.target.value, 0)
              }
            />
            {workExperience?.[0]?.errors?.to && (
              <Form.Text className="text-danger">
                {workExperience?.[0]?.errors?.to}
              </Form.Text>
            )}
          </Form.Group>
        </Col>
        <Row className="mb-2">
          <Col className="d-flex align-items-center gap-1">
            <i
              className="text-primary mdi mdi-plus-circle-outline fs-3 ps-1"
              onClick={addMoreWorkExperience}
            ></i>
            <span className="text-primary">Add More</span>
          </Col>
        </Row>
      </Row>

      {workExperience?.length > 1 &&
        workExperience.slice(1).map((item: any, index: any) => (
          <Row key={index + 1}>
            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3" controlId="qualification">
                <Form.Label>Work Experience</Form.Label>
                <FormInput
                  type="number"
                  name="years"
                  placeholder="Enter work experience"
                  key="years"
                  value={item?.years || ""}
                  onChange={(e) =>
                    handleWorkExperienceChange(
                      e.target.name,
                      e.target.value,
                      index + 1
                    )
                  }
                  min={0}
                />
                {workExperience?.[index + 1]?.errors?.years && (
                  <Form.Text className="text-danger">
                    {workExperience?.[index + 1]?.errors?.years}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3" controlId="company">
                <Form.Label>Company</Form.Label>
                <FormInput
                  type="text"
                  name="company"
                  placeholder="Enter company"
                  key="company"
                  value={item?.company || ""}
                  onChange={(e) =>
                    handleWorkExperienceChange(
                      e.target.name,
                      e.target.value,
                      index + 1
                    )
                  }
                />
                {workExperience?.[index + 1]?.errors?.company && (
                  <Form.Text className="text-danger">
                    {workExperience?.[index + 1]?.errors?.company}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3" controlId="designation">
                <Form.Label>Designation</Form.Label>
                <FormInput
                  type="text"
                  name="designation"
                  placeholder="Enter designation"
                  key="designation"
                  value={item?.designation || ""}
                  onChange={(e) =>
                    handleWorkExperienceChange(
                      e.target.name,
                      e.target.value,
                      index + 1
                    )
                  }
                />
                {workExperience?.[index + 1]?.errors?.designation && (
                  <Form.Text className="text-danger">
                    {workExperience?.[index + 1]?.errors?.designation}
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
                  name="bank_statement"
                  onChange={(e) =>
                    handleWorkExperienceChange(
                      e.target.name,
                      e.target.files?.[0],
                      index + 1
                    )
                  }
                />
                {workExperience?.[index + 1]?.errors?.bank_statement && (
                  <Form.Text className="text-danger">
                    {workExperience?.[index + 1]?.errors?.bank_statement}
                  </Form.Text>
                )}
                {typeof workExperience?.[index + 1]?.bank_statement ===
                  "string" && (
                  <div className="d-flex align-items-center">
                    <i className="mdi mdi-download text-primary me-2"></i>
                    <a
                      href={`${baseUrl}/uploads/workDocuments/${
                        workExperience?.[index + 1]?.bank_statement
                      }`}
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
              <Form.Group className="mb-3" controlId={`job_offer_document`}>
                <Form.Label>
                  <span className="text-danger">*</span> Job Offer Document
                </Form.Label>
                <FormInput
                  type="file"
                  name="job_offer_document"
                  onChange={(e) =>
                    handleWorkExperienceChange(
                      e.target.name,
                      e.target.files?.[0],
                      index + 1
                    )
                  }
                />
                {workExperience?.[index + 1]?.errors?.job_offer_document && (
                  <Form.Text className="text-danger">
                    {workExperience?.[index + 1]?.errors?.job_offer_document}
                  </Form.Text>
                )}

                {typeof workExperience?.[index + 1]?.job_offer_document ===
                  "string" && (
                  <div className="d-flex align-items-center">
                    <i className="mdi mdi-download text-primary me-2"></i>
                    <a
                      href={`${baseUrl}/uploads/workDocuments/${
                        workExperience?.[index + 1]?.job_offer_document
                      }`}
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
                  name="appointment_document"
                  onChange={(e) =>
                    handleWorkExperienceChange(
                      e.target.name,
                      e.target.files?.[0],
                      index + 1
                    )
                  }
                />
                {workExperience?.[index + 1]?.errors?.appointment_document && (
                  <Form.Text className="text-danger">
                    {workExperience?.[index + 1]?.errors?.appointment_document}
                  </Form.Text>
                )}

                {typeof workExperience?.[index + 1]?.appointment_document ===
                  "string" && (
                  <div className="d-flex align-items-center">
                    <i className="mdi mdi-download text-primary me-2"></i>
                    <a
                      href={`${baseUrl}/uploads/workDocuments/${
                        workExperience?.[index + 1]?.appointment_document
                      }`}
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
                  name="payslip_document"
                  onChange={(e) =>
                    handleWorkExperienceChange(
                      e.target.name,
                      e.target.files?.[0],
                      index + 1
                    )
                  }
                />
                {workExperience?.[index + 1]?.errors?.payslip_document && (
                  <Form.Text className="text-danger">
                    {workExperience?.[index + 1]?.errors?.payslip_document}
                  </Form.Text>
                )}

                {typeof workExperience?.[index + 1]?.payslip_document ===
                  "string" && (
                  <div className="d-flex align-items-center">
                    <i className="mdi mdi-download text-primary me-2"></i>
                    <a
                      href={`${baseUrl}/uploads/workDocuments/${
                        workExperience?.[index + 1]?.payslip_document
                      }`}
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
                  defaultValue={moment(item?.from).format("YYYY-MM-DD")}
                  value={moment(item?.from).format("YYYY-MM-DD")}
                  onChange={(e) =>
                    handleWorkExperienceChange(
                      e.target.name,
                      e.target.value,
                      index + 1
                    )
                  }
                />
                {workExperience?.[index + 1]?.errors?.from && (
                  <Form.Text className="text-danger">
                    {workExperience?.[index + 1]?.errors?.from}
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
                  defaultValue={moment(item?.to).format("YYYY-MM-DD")}
                  value={moment(item?.to).format("YYYY-MM-DD")}
                  onChange={(e) =>
                    handleWorkExperienceChange(
                      e.target.name,
                      e.target.value,
                      index + 1
                    )
                  }
                />
                {workExperience?.[index + 1]?.errors?.to && (
                  <Form.Text className="text-danger">
                    {workExperience?.[index + 1]?.errors?.to}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            {workExperience.length > 1 && (
              <Row className="mb-2">
                <Col className="d-flex align-items-center gap-1">
                  <i
                    className="text-danger mdi mdi-minus-circle-outline fs-3 ps-1"
                    onClick={() => {
                      const itemId = item.id ?? 0;
                      removeWorkExperience(index + 1, itemId);
                    }}
                  ></i>
                  <span className="text-danger">Remove</span>
                </Col>
              </Row>
            )}
          </Row>
        ))}
    </Row>
  );
};

export default WorkExpRow;
