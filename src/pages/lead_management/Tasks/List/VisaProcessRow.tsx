import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FormInput } from '../../../../components';
import moment from 'moment';
import Select from "react-select";
import { Visa_Types } from './data';

const VisaProcessRow = ({ visaDecline, visaApprove, travelHistory, countries, courses, universities, handleVisaInputChange, handleVisaSelectChange, saveVisaForm, addMoreVisaForm, removeVisaForm }: any) => {

  const [selectedVisaType, setSelectedVisaType] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<any>(null);

  return (
    <Row>

      {/*  Previous Visa Decline */}
      <Row>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-account-circle me-1"></i>Previous Visa Decline
        </h5>
        {visaDecline.length > 0 && visaDecline.map((data: any, index: any) => (
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
                            (u: any) =>
                              u.value === data?.visa_type
                          )?.label,
                          value: data?.visa_type,
                        }
                      : null
                  }
                  placeholder="Select Visa Type"
                  name="visa_type"
                  onChange={(selectedOption: any) =>
                    handleVisaSelectChange(index, "visa_type", selectedOption.value, 'visa_decline')
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
                  onChange={(e) => handleVisaInputChange(index, e, 'visa_decline')}
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
                            (u: any) =>
                              u.value == data?.country_id
                          )?.label,
                          value: data?.country_id,
                        }
                      : null
                  }
                  placeholder="Select Country"
                  name="country_id"
                  onChange={(selectedOption: any) =>
                    handleVisaSelectChange(index, "country_id", selectedOption.value, 'visa_decline')
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
                            (u: any) =>
                              u.value == data?.course_applied
                          )?.label,
                          value: data?.course_applied,
                        }
                      : null
                  }
                  placeholder="Select Course"
                  name="course_applied"
                  onChange={(selectedOption: any) =>
                    handleVisaSelectChange(index, "course_applied", selectedOption.value, 'visa_decline')
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
                            (u: any) =>
                              u.value == data?.university_applied
                          )?.label,
                          value: data?.university_applied,
                        }
                      : null
                  }
                  placeholder="Select University Applied"
                  name="university_applied"
                  onChange={(selectedOption: any) =>
                    handleVisaSelectChange(index, "university_applied", selectedOption.value, 'visa_decline')
                  }
                />
              </Form.Group>
            </Col>
            <hr />
            {visaDecline.length > 0 && (
              <Row className="mb-2">
                <Col className="d-flex align-items-center gap-1">
                  <i
                    className="text-danger mdi mdi-minus-circle-outline fs-3 ps-1"
                    onClick={() => {
                      const itemId = data.id ?? 0;
                      removeVisaForm(index, itemId, 'visa_decline');
                    }}
                  ></i>
                  <span className="text-danger">Remove</span>
                </Col>
              </Row>
            )}
          </Row>
        ))}

        <Row className="mb-2">
          <Col className="d-flex align-items-center gap-1">
            <i
              className="text-primary mdi mdi-plus-circle-outline fs-3 ps-1"
              onClick={() => addMoreVisaForm('visa_decline')}
            ></i>
            <span className="text-primary">Add More</span>
          </Col>
        </Row>
          <Button className='mb-3' onClick={() => saveVisaForm('visa_decline')}>Save Declined Visa Details</Button>
      </Row>

      {/*  Previous Visa Approve */}
      <Row>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-account-circle me-1"></i>Previous Visa Approve
        </h5>

        {visaApprove.length > 0 && visaApprove.map((data: any, index: any) => (
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
                            (u: any) =>
                              u.value == data?.visa_type
                          )?.label,
                          value: data?.visa_type,
                        }
                      : null
                  }
                  placeholder="Select Visa Type"
                  name="visa_type"
                  onChange={(selectedOption: any) =>
                    handleVisaSelectChange(index, "visa_type", selectedOption.value, 'visa_approve')
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
                            (u: any) =>
                              u.value == data?.country_id
                          )?.label,
                          value: data?.country_id,
                        }
                      : null
                  }
                  placeholder="Select Country"
                  name="country_id"
                  onChange={(selectedOption: any) =>
                    handleVisaSelectChange(index, "country_id", selectedOption.value, 'visa_approve')
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
                            (u: any) =>
                              u.value == data?.course_applied
                          )?.label,
                          value: data?.course_applied,
                        }
                      : null
                  }
                  placeholder="Select Course"
                  name="course_applied"
                  onChange={(selectedOption: any) =>
                    handleVisaSelectChange(index, "course_applied", selectedOption.value, 'visa_approve')
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
                            (u: any) =>
                              u.value == data?.university_applied
                          )?.label,
                          value: data?.university_applied,
                        }
                      : null
                  }
                  placeholder="Select University Applied"
                  name="university_applied"
                  onChange={(selectedOption: any) =>
                    handleVisaSelectChange(index, "university_applied", selectedOption.value, 'visa_approve')
                  }
                />
              </Form.Group>
            </Col>
            <hr />
            {visaApprove.length > 0 && (
              <Row className="mb-2">
                <Col className="d-flex align-items-center gap-1">
                  <i
                    className="text-danger mdi mdi-minus-circle-outline fs-3 ps-1"
                    onClick={() => {
                      const itemId = data.id ?? 0;
                      removeVisaForm(index, itemId, 'visa_approve');
                    }}
                  ></i>
                  <span className="text-danger">Remove</span>
                </Col>
              </Row>
            )}
          </Row>
        ))}

        <Row className="mb-2">
          <Col className="d-flex align-items-center gap-1">
            <i
              className="text-primary mdi mdi-plus-circle-outline fs-3 ps-1"
              onClick={() => addMoreVisaForm('visa_approve')}
            ></i>
            <span className="text-primary">Add More</span>
          </Col>
        </Row>
        <Button className='mb-3' onClick={() => saveVisaForm('visa_approve')}>Save Approved Visa Details</Button>
      </Row>

      {/* Travel History */}
      <Row>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-account-circle me-1"></i>Travel History
        </h5>

        {travelHistory.length > 0 && travelHistory.map((data: any, index: any) => (
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
                            (u: any) =>
                              u.value == data?.country_id
                          )?.label,
                          value: data?.country_id,
                        }
                      : null
                  }
                  placeholder="Select Country"
                  name="country_id"
                  onChange={(selectedOption: any) =>
                    handleVisaSelectChange(index, "country_id", selectedOption.value, 'travel_history')
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
                  onChange={(e) => handleVisaInputChange(index, e, 'travel_history')}
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
                  onChange={(e) => handleVisaInputChange(index, e, 'travel_history')}
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
                  onChange={(e) => handleVisaInputChange(index, e, 'travel_history')}
                />
              </Form.Group>
            </Col>
            <hr />
            {travelHistory.length > 0 && (
              <Row className="mb-2">
                <Col className="d-flex align-items-center gap-1">
                  <i
                    className="text-danger mdi mdi-minus-circle-outline fs-3 ps-1"
                    onClick={() => {
                      const itemId = data.id ?? 0;
                      removeVisaForm(index, itemId, 'travel_history');
                    }}
                  ></i>
                  <span className="text-danger">Remove</span>
                </Col>
              </Row>
            )}
          </Row>
        ))}

        <Row className="mb-2">
          <Col className="d-flex align-items-center gap-1">
            <i
              className="text-primary mdi mdi-plus-circle-outline fs-3 ps-1"
              onClick={() => addMoreVisaForm('travel_history')}
            ></i>
            <span className="text-primary">Add More</span>
          </Col>
        </Row>
        <Button className='mb-2' onClick={() => saveVisaForm('travel_history')}>Save Travel History</Button>
      </Row>
    </Row>
  )
}

export default VisaProcessRow