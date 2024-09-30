import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";
import moment from "moment";
import Select from "react-select";
import { travel_history, visa_approve, visa_decline, Visa_Types } from "./data";
import ActionButton from "./ActionButton";

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
                  <Form.Label>Visa Type</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={Visa_Types}
                    value={
                      data?.visa_type
                        ? {
                            label: Visa_Types.find(
                              (u: any) => u.value === data?.visa_type
                            )?.label,
                            value: data?.visa_type,
                          }
                        : null
                    }
                    placeholder="Select Visa Type"
                    name="visa_type"
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(
                        index,
                        "visa_type",
                        selectedOption.value,
                        visa_decline
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="rejection_reason">
                  <Form.Label>Rejection Reason</Form.Label>
                  <FormInput
                    type="text"
                    name="rejection_reason"
                    placeholder="Enter Rejection Reason"
                    key="rejection_reason"
                    value={data?.rejection_reason || ""}
                    onChange={(e) =>
                      handleVisaInputChange(index, e, visa_decline)
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="country_id">
                  <Form.Label>Country</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={countries}
                    value={
                      data?.country_id
                        ? {
                            label: countries.find(
                              (u: any) => u.value == data?.country_id
                            )?.label,
                            value: data?.country_id,
                          }
                        : null
                    }
                    placeholder="Select Country"
                    name="country_id"
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(
                        index,
                        "country_id",
                        selectedOption.value,
                        visa_decline
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="course_applied">
                  <Form.Label>Course</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={courses}
                    value={
                      data?.course_applied
                        ? {
                            label: courses.find(
                              (u: any) => u.value == data?.course_applied
                            )?.label,
                            value: data?.course_applied,
                          }
                        : null
                    }
                    placeholder="Select Course"
                    name="course_applied"
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(
                        index,
                        "course_applied",
                        selectedOption.value,
                        visa_decline
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="university_applied">
                  <Form.Label>University Applied</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={universities}
                    value={
                      data?.university_applied
                        ? {
                            label: universities.find(
                              (u: any) => u.value == data?.university_applied
                            )?.label,
                            value: data?.university_applied,
                          }
                        : null
                    }
                    placeholder="Select University Applied"
                    name="university_applied"
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(
                        index,
                        "university_applied",
                        selectedOption.value,
                        visa_decline
                      )
                    }
                  />
                </Form.Group>
              </Col>
              {visaDeclineData.length > 1 && (
                <Row className="mb-2">
                  <ActionButton
                    onClick={() =>
                      removeVisaForm(index, data.id ?? 0, visa_decline)
                    }
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
          <ActionButton
            onClick={() => addMoreVisaForm(visa_decline)}
            label="Add More"
            iconClass="mdi mdi-plus"
          />
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
                  <Form.Label>Visa Type</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={Visa_Types}
                    value={
                      data?.visa_type
                        ? {
                            label: Visa_Types.find(
                              (u: any) => u.value == data?.visa_type
                            )?.label,
                            value: data?.visa_type,
                          }
                        : null
                    }
                    placeholder="Select Visa Type"
                    name="visa_type"
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(
                        index,
                        "visa_type",
                        selectedOption.value,
                        visa_approve
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="country_id">
                  <Form.Label>Country</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={countries}
                    value={
                      data?.country_id
                        ? {
                            label: countries.find(
                              (u: any) => u.value == data?.country_id
                            )?.label,
                            value: data?.country_id,
                          }
                        : null
                    }
                    placeholder="Select Country"
                    name="country_id"
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(
                        index,
                        "country_id",
                        selectedOption.value,
                        visa_approve
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="course_applied">
                  <Form.Label>Course</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={courses}
                    value={
                      data?.course_applied
                        ? {
                            label: courses.find(
                              (u: any) => u.value == data?.course_applied
                            )?.label,
                            value: data?.course_applied,
                          }
                        : null
                    }
                    placeholder="Select Course"
                    name="course_applied"
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(
                        index,
                        "course_applied",
                        selectedOption.value,
                        visa_approve
                      )
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="university_applied">
                  <Form.Label>University Applied</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={universities}
                    value={
                      data?.university_applied
                        ? {
                            label: universities.find(
                              (u: any) => u.value == data?.university_applied
                            )?.label,
                            value: data?.university_applied,
                          }
                        : null
                    }
                    placeholder="Select University Applied"
                    name="university_applied"
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(
                        index,
                        "university_applied",
                        selectedOption.value,
                        visa_approve
                      )
                    }
                  />
                </Form.Group>
              </Col>
              {visaApproveData.length > 1 && (
                <Row className="mb-2">
                  <ActionButton
                    label="Remove"
                    onClick={() =>
                      removeVisaForm(index, data.id ?? 0, visa_approve)
                    }
                    iconClass="mdi mdi-delete"
                    colorClass="text-danger"
                  />
                </Row>
              )}
              <hr />
            </Row>
          ))}

        <Row className="mb-2">
          <ActionButton
            label="Add More"
            onClick={() => addMoreVisaForm(visa_approve)}
            iconClass="mdi mdi-plus"
          />
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
                  <Form.Label>Country</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    classNamePrefix="react-select"
                    options={countries}
                    value={
                      data?.country_id
                        ? {
                            label: countries.find(
                              (u: any) => u.value == data?.country_id
                            )?.label,
                            value: data?.country_id,
                          }
                        : null
                    }
                    placeholder="Select Country"
                    name="country_id"
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(
                        index,
                        "country_id",
                        selectedOption.value,
                        travel_history
                      )
                    }
                  />
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
                    onChange={(e) =>
                      handleVisaInputChange(index, e, travel_history)
                    }
                  />
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
                    onChange={(e) =>
                      handleVisaInputChange(index, e, travel_history)
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6} lg={6} xl={6} xxl={4}>
                <Form.Group className="mb-3" controlId="purpose_of_travel">
                  <Form.Label>Purpose of Travel</Form.Label>
                  <FormInput
                    type="text"
                    name="purpose_of_travel"
                    placeholder="Enter Purpose of Travel"
                    key="purpose_of_travel"
                    value={data?.purpose_of_travel || ""}
                    onChange={(e) =>
                      handleVisaInputChange(index, e, travel_history)
                    }
                  />
                </Form.Group>
              </Col>
              {travelHistoryData.length > 1 && (
                <Row className="mb-2">
                  <ActionButton
                    onClick={() =>
                      removeVisaForm(index, data.id ?? 0, travel_history)
                    }
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
          <ActionButton
            onClick={() => addMoreVisaForm(travel_history)}
            label="Add More"
            iconClass="mdi mdi-plus"
          />
        </Row>
        <Button className="mb-2" onClick={() => saveVisaForm(travel_history)}>
          Save Travel History
        </Button>
      </Row>
    </Row>
  );
};

export default VisaProcessRow;
