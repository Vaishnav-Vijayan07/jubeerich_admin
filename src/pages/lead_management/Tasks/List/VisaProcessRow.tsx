import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";
import moment from "moment";
import Select from "react-select";
import { travel_history, visa_approve, visa_decline, Visa_Types } from "./data";
import ActionButton from "./ActionButton";
import { baseUrl } from "../../../../constants";

const VisaProcessRow = ({
  visaDecline,
  visaApprove,
  travelHistory,
  countries,
  courses,
  universities,
  handleVisaInputChange,
  handleVisaSelectChange,
  saveVisaForm,
  addMoreVisaForm,
  removeVisaForm,
  handleFileChange,
}: any) => {
  const [visaDeclineData, setVisaDeclineData] = useState<any[]>([]);
  const [visaApproveData, setVisaApproveData] = useState<any[]>([]);
  const [travelHistoryData, setTravelHistoryData] = useState<any[]>([]);

  useEffect(() => {
    if (visaDecline.length) {
      setVisaDeclineData(visaDecline);
    } else {
      addMoreVisaForm(visa_decline);
    }

    if (visaApprove.length) {
      setVisaApproveData(visaApprove);
    } else {
      addMoreVisaForm(visa_approve);
    }

    if (travelHistory.length) {
      setTravelHistoryData(travelHistory);
    } else {
      addMoreVisaForm(travel_history);
    }
  }, [visaDecline, visaApprove, travelHistory]);

  return (
    <Row>
      {/*  Previous Visa Decline */}
      <Row>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-account-circle me-1"></i>Previous Visa Decline
        </h5>
        {visaDeclineData.length > 0 &&
          visaDeclineData.map((data: any, index: any) => (
            <Row key={index}>
              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="visa_type">
                  <Form.Label><span className="text-danger">*</span> Visa Type</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={Visa_Types}
                    value={
                      data?.visa_type
                        ? {
                            label: Visa_Types.find((u: any) => u.value === data?.visa_type)?.label,
                            value: data?.visa_type,
                          }
                        : null
                    }
                    placeholder="Select Visa Type"
                    name="visa_type"
                    onChange={(selectedOption: any) => handleVisaSelectChange(index, "visa_type", selectedOption.value, visa_decline)}
                  />
                  {data?.errors?.visa_type && <Form.Text className="text-danger">{data?.errors?.visa_type}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="country_id">
                  <Form.Label><span className="text-danger">*</span> Country</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={countries}
                    value={
                      data?.country_id
                        ? {
                            label: countries.find((u: any) => u.value == data?.country_id)?.label,
                            value: data?.country_id,
                          }
                        : null
                    }
                    placeholder="Select Country"
                    name="country_id"
                    onChange={(selectedOption: any) => handleVisaSelectChange(index, "country_id", selectedOption.value, visa_decline)}
                  />
                  {data?.errors?.country_id && <Form.Text className="text-danger">{data?.errors?.country_id}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="course_applied">
                  <Form.Label><span className="text-danger">*</span> Course Applied</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={courses}
                    value={
                      data?.course_applied
                        ? {
                            label: courses.find((u: any) => u.value == data?.course_applied)?.label,
                            value: data?.course_applied,
                          }
                        : null
                    }
                    placeholder="Select Course"
                    name="course_applied"
                    onChange={(selectedOption: any) => handleVisaSelectChange(index, "course_applied", selectedOption.value, visa_decline)}
                  />
                  {data?.errors?.course_applied && <Form.Text className="text-danger">{data?.errors?.course_applied}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="university_applied">
                  <Form.Label><span className="text-danger">*</span> University Applied</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={universities}
                    value={
                      data?.university_applied
                        ? {
                            label: universities.find((u: any) => u.value == data?.university_applied)?.label,
                            value: data?.university_applied,
                          }
                        : null
                    }
                    placeholder="Select University Applied"
                    name="university_applied"
                    onChange={(selectedOption: any) => handleVisaSelectChange(index, "university_applied", selectedOption.value, visa_decline)}
                  />
                  {data?.errors?.university_applied && <Form.Text className="text-danger">{data?.errors?.university_applied}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="rejection_reason">
                  <Form.Label><span className="text-danger">*</span> Rejection Reason</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    name="rejection_reason"
                    placeholder="Enter Rejection Reason"
                    key="rejection_reason"
                    value={data?.rejection_reason || ""}
                    onChange={(e) => handleVisaInputChange(index, e, visa_decline)}
                  />

                  {data?.errors?.rejection_reason && <Form.Text className="text-danger">{data?.errors?.rejection_reason}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-2" controlId="decline_letter">
                  <Form.Label>Rejection Letter</Form.Label>
                  <FormInput type="file" name="decline_letter" onChange={(e) => handleFileChange(e, visa_decline, index)} />
                  {data?.errors?.decline_letter && <Form.Text className="text-danger">{data?.errors?.decline_letter}</Form.Text>}
                </Form.Group>
                <div className="d-flex mb-2">
                  {data?.decline_letter && (
                    <a
                      href={`${baseUrl}uploads/${data?.decline_letter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                    >
                      <div className="p-1">{data?.decline_letter ? "Rejection Letter" : ""}</div>
                    </a>
                  )}
                </div>
              </Col>

              {visaDeclineData.length > 1 && (
                <Row className="mb-2">
                  <ActionButton
                    onClick={() => removeVisaForm(index, data.id ?? 0, visa_decline)}
                    label="Remove"
                    iconClass="mdi mdi-delete"
                    colorClass="text-danger"
                  />
                </Row>
              )}
              <hr />
            </Row>
          ))}

        <Row className="mb-2">
          <ActionButton onClick={() => addMoreVisaForm(visa_decline)} label="Add More" iconClass="mdi mdi-plus" />
        </Row>
        <Button className="mb-3" onClick={() => saveVisaForm(visa_decline)}>
          Save Declined Visa Details
        </Button>
      </Row>

      {/*  Previous Visa Approve */}
      <Row>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-account-circle me-1"></i>Previous Visa Approvals
        </h5>

        {visaApproveData.length > 0 &&
          visaApproveData.map((data: any, index: any) => (
            <Row key={index}>
              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="visa_type">
                  <Form.Label><span className="text-danger">*</span> Visa Type</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={Visa_Types}
                    value={
                      data?.visa_type
                        ? {
                            label: Visa_Types.find((u: any) => u.value == data?.visa_type)?.label,
                            value: data?.visa_type,
                          }
                        : null
                    }
                    placeholder="Select Visa Type"
                    name="visa_type"
                    onChange={(selectedOption: any) => handleVisaSelectChange(index, "visa_type", selectedOption.value, visa_approve)}
                  />
                  {data?.errors?.visa_type && <Form.Text className="text-danger">{data?.errors?.visa_type}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="country_id">
                  <Form.Label><span className="text-danger">*</span> Country</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={countries}
                    value={
                      data?.country_id
                        ? {
                            label: countries.find((u: any) => u.value == data?.country_id)?.label,
                            value: data?.country_id,
                          }
                        : null
                    }
                    placeholder="Select Country"
                    name="country_id"
                    onChange={(selectedOption: any) => handleVisaSelectChange(index, "country_id", selectedOption.value, visa_approve)}
                  />
                  {data?.errors?.country_id && <Form.Text className="text-danger">{data?.errors?.country_id}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="course_applied">
                  <Form.Label><span className="text-danger">*</span> Course</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={courses}
                    value={
                      data?.course_applied
                        ? {
                            label: courses.find((u: any) => u.value == data?.course_applied)?.label,
                            value: data?.course_applied,
                          }
                        : null
                    }
                    placeholder="Select Course"
                    name="course_applied"
                    onChange={(selectedOption: any) => handleVisaSelectChange(index, "course_applied", selectedOption.value, visa_approve)}
                  />
                  {data?.errors?.course_applied && <Form.Text className="text-danger">{data?.errors?.course_applied}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="university_applied">
                  <Form.Label><span className="text-danger">*</span> University Applied</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={universities}
                    value={
                      data?.university_applied
                        ? {
                            label: universities.find((u: any) => u.value == data?.university_applied)?.label,
                            value: data?.university_applied,
                          }
                        : null
                    }
                    placeholder="Select University Applied"
                    name="university_applied"
                    onChange={(selectedOption: any) => handleVisaSelectChange(index, "university_applied", selectedOption.value, visa_approve)}
                  />
                  {data?.errors?.university_applied && <Form.Text className="text-danger">{data?.errors?.university_applied}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-2" controlId="approve_letter">
                  <Form.Label>Approved Letter</Form.Label>
                  <FormInput type="file" name="approve_letter" onChange={(e) => handleFileChange(e, visa_approve, index)} />
                </Form.Group>
                <div className="d-flex mb-2">
                  {data?.approve_letter && (
                    <a
                      href={`${baseUrl}uploads/${data?.approve_letter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none border rounded-2 border-1 border-secondary text-truncate"
                    >
                      <div className="p-1">{data?.approve_letter ? "Approved Letter" : ""}</div>
                    </a>
                  )}
                </div>
              </Col>

              {visaApproveData.length > 1 && (
                <Row className="mb-2">
                  <ActionButton
                    label="Remove"
                    onClick={() => removeVisaForm(index, data.id ?? 0, visa_approve)}
                    iconClass="mdi mdi-delete"
                    colorClass="text-danger"
                  />
                </Row>
              )}
              <hr />
            </Row>
          ))}

        <Row className="mb-2">
          <ActionButton label="Add More" onClick={() => addMoreVisaForm(visa_approve)} iconClass="mdi mdi-plus" />
        </Row>
        <Button className="mb-3" onClick={() => saveVisaForm(visa_approve)}>
          Save Approved Visa Details
        </Button>
      </Row>

      {/* Travel History */}
      <Row>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-account-circle me-1"></i>Travel History
        </h5>

        {travelHistoryData.length > 0 &&
          travelHistoryData.map((data: any, index: any) => (
            <Row key={index}>
              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="country_id">
                  <Form.Label><span className="text-danger">*</span> Country</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={countries}
                    value={
                      data?.country_id
                        ? {
                            label: countries.find((u: any) => u.value == data?.country_id)?.label,
                            value: data?.country_id,
                          }
                        : null
                    }
                    placeholder="Select Country"
                    name="country_id"
                    onChange={(selectedOption: any) => handleVisaSelectChange(index, "country_id", selectedOption.value, travel_history)}
                  />
                  {data?.errors?.country_id && <Form.Text className="text-danger">{data?.errors?.country_id}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="start_date">
                  <Form.Label>
                    <span className="text-danger">*</span> Start Date
                  </Form.Label>
                  <FormInput
                    type="date"
                    name="start_date"
                    placeholder="Select start date"
                    key="start_date"
                    value={moment(data?.start_date).format("YYYY-MM-DD")}
                    onChange={(e) => handleVisaInputChange(index, e, travel_history)}
                  />
                  {data?.errors?.start_date && <Form.Text className="text-danger">{data?.errors?.start_date}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="end_date">
                  <Form.Label>
                    <span className="text-danger">*</span> End Date
                  </Form.Label>
                  <FormInput
                    type="date"
                    name="end_date"
                    placeholder="Select end date"
                    key="end_date"
                    value={moment(data?.end_date).format("YYYY-MM-DD")}
                    onChange={(e) => handleVisaInputChange(index, e, travel_history)}
                  />
                  {data?.errors?.end_date && <Form.Text className="text-danger">{data?.errors?.end_date}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="purpose_of_travel">
                  <Form.Label><span className="text-danger">*</span> Purpose of Travel</Form.Label>
                  <FormInput
                    type="text"
                    name="purpose_of_travel"
                    placeholder="Enter Purpose of Travel"
                    key="purpose_of_travel"
                    value={data?.purpose_of_travel || ""}
                    onChange={(e) => handleVisaInputChange(index, e, travel_history)}
                  />
                  {data?.errors?.purpose_of_travel && <Form.Text className="text-danger">{data?.errors?.purpose_of_travel}</Form.Text>}
                </Form.Group>
              </Col>
              {travelHistoryData.length > 1 && (
                <Row className="mb-2">
                  <ActionButton
                    onClick={() => removeVisaForm(index, data.id ?? 0, travel_history)}
                    label="Remove"
                    iconClass="mdi mdi-delete"
                    colorClass="text-danger"
                  />
                </Row>
              )}
              <hr />
            </Row>
          ))}

        <Row className="mb-2">
          <ActionButton onClick={() => addMoreVisaForm(travel_history)} label="Add More" iconClass="mdi mdi-plus" />
        </Row>
        <Button className="mb-2" onClick={() => saveVisaForm(travel_history)}>
          Save Travel History
        </Button>
      </Row>
    </Row>
  );
};

export default VisaProcessRow;
