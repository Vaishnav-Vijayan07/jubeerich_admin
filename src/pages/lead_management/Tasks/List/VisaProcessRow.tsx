import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";
import moment from "moment";
import Select from "react-select";
import { travel_history, visa_approve, visa_decline, Visa_Types } from "./data";
import ActionButton from "./ActionButton";
import { baseUrl } from "../../../../constants";
import FieldHistoryTable from "../../../../components/FieldHistory";
import axios from "axios";

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
  studentId,
  decisions
}: any) => {
  const [visaDeclineData, setVisaDeclineData] = useState<any[]>([]);
  const [visaApproveData, setVisaApproveData] = useState<any[]>([]);
  const [travelHistoryData, setTravelHistoryData] = useState<any[]>([]);
  const [historyModal, setHistoryModal] = useState<boolean>(false);
  const [urlString, setUrlString] = useState<string>("");
  const [allCountries, setAllCountries] = useState<any>([]);
  const [isVisaDeclined, setIsVisaDeclined] = useState<boolean>(false);
  const [isVisaApproved, setIsVisaApproved] = useState<boolean>(false);
  const [hasTravelHistoy, setHasTravelHistoy] = useState<boolean>(false)

  useEffect(() => {
    if(decisions){
      setIsVisaDeclined(decisions?.is_visa_declined);
      setIsVisaApproved(decisions?.is_visa_approved);
      setHasTravelHistoy(decisions?.has_travel_history);
    }

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
  }, [visaDecline, visaApprove, travelHistory, decisions]);

  const toggleHistoryModal = (url?: string) => {
    if (url) setUrlString(url);
    setHistoryModal(!historyModal);
  };

  const getAllCountries = async () => {
    try {
      const res = await axios.get(`https://countriesnow.space/api/v0.1/countries/iso`, {
        timeout: 10000,
      });
      setAllCountries(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCountries();
  }, []);

  return (
    <Row>
      {/*  Previous Visa Decline */}
      <Row className="bg-light py-3 ps-3">
        <div className="d-flex justify-content-between">
          <h5 className="mb-4 text-uppercase">
            <i className="mdi mdi-account-circle me-1"></i>Previous Visa Decline
          </h5>

          <Button
            className="btn-sm btn-secondary waves-effect waves-light float-end me-2"
            onClick={() => toggleHistoryModal("previous_visa_decline")}
            style={{ height: "fit-content" }}
          >
            <i className="mdi mdi-history"></i> View History
          </Button>
        </div>

        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="source_id">
              <Form.Label>Have ever your visa declined?</Form.Label>
              <div className="d-flex justify-content-start align-items-center mt-1">
                <Form.Check
                  type="radio"
                  name="isVisaDeclined"
                  checked={isVisaDeclined}
                  onChange={() => setIsVisaDeclined(true)}
                  label={<span className="ps-1 fw-bold">Yes</span>}
                />
                <Form.Check
                  type="radio"
                  name="isVisaDeclined"
                  checked={!isVisaDeclined}
                  onChange={() => setIsVisaDeclined(false)}
                  label={<span className="ps-1 fw-bold">No</span>}
                  className="ms-3"
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        {/* {visaDeclineData.length > 0 && */}
        {isVisaDeclined &&
          visaDeclineData.map((data: any, index: any) => (
            <Row key={index}>
              <Col md={6} lg={4} xl={4} xxl={4}>
                <Form.Group className="mb-3" controlId="visa_type">
                  <Form.Label> Visa Type</Form.Label>
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
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(index, "visa_type", selectedOption.value, visa_decline)
                    }
                  />
                  {data?.errors?.visa_type && <Form.Text className="text-danger">{data?.errors?.visa_type}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} xl={4} xxl={4}>
                <Form.Group className="mb-3" controlId="country">
                  <Form.Label><span className="text-danger">*</span> Country</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    name="country_name"
                    options={allCountries?.map((item: any) => {
                      return {
                        label: item.name,
                        value: item?.name,
                        iso: item?.Iso3,
                      };
                    })}
                    value={
                      data?.country_name
                        ? {
                          label: allCountries.find((u: any) => u.name == data?.country_name)?.name,
                          value: data?.country_name,
                        }
                        : null
                    }
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(index, "country_name", selectedOption.value, visa_decline)
                    }
                    placeholder="Select a country"
                  />
                  {data?.errors?.country_name && <Form.Text className="text-danger">{data?.errors?.country_name}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={4} xl={4} xxl={4}>
                <Form.Group className="mb-3" controlId="course_applied">
                  <Form.Label>
                    <span className="text-danger">*</span> Course Applied
                  </Form.Label>
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
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(index, "course_applied", selectedOption.value, visa_decline)
                    }
                  />
                  {data?.errors?.course_applied && <Form.Text className="text-danger">{data?.errors?.course_applied}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={4} xl={4} xxl={4}>
                <Form.Group className="mb-3" controlId="university_applied">
                  <Form.Label>
                    <span className="text-danger">*</span> University Applied
                  </Form.Label>
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
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(index, "university_applied", selectedOption.value, visa_decline)
                    }
                  />
                  {data?.errors?.university_applied && (
                    <Form.Text className="text-danger">{data?.errors?.university_applied}</Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} lg={4} xl={4} xxl={4}>
                <Form.Group className="mb-3" controlId="rejection_reason">
                  <Form.Label>Rejection Reason</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    name="rejection_reason"
                    placeholder="Enter Rejection Reason"
                    key="rejection_reason"
                    value={data?.rejection_reason || ""}
                    onChange={(e) => handleVisaInputChange(index, e, visa_decline)}
                  />

                  {data?.errors?.rejection_reason && (
                    <Form.Text className="text-danger">{data?.errors?.rejection_reason}</Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} lg={4} xl={4} xxl={4}>
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

        {isVisaDeclined && (
          <>
            <Row className="mb-2">
              <ActionButton onClick={() => addMoreVisaForm(visa_decline)} label="Add More" iconClass="mdi mdi-plus" />
            </Row>
          </>
        )}
        <Button className="w-auto px-3 ms-2" onClick={() => saveVisaForm(visa_decline, isVisaDeclined)}>
          Save Declined Visa Details
        </Button>
      </Row>

      {/*  Previous Visa Approve */}
      <Row className="bg-light py-3 ps-3 mt-4">
        <Modal show={historyModal} onHide={toggleHistoryModal} centered dialogClassName={"modal-full-width"} scrollable>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body style={{ margin: "0 !important", padding: "0 !important" }}>
            <FieldHistoryTable apiUrl={urlString} studentId={studentId} />
          </Modal.Body>
        </Modal>

        <div className="d-flex justify-content-between m-0">
          <h5 className="mb-4 text-uppercase">
            <i className="mdi mdi-account-circle me-1"></i>Previous Visa Approvals
          </h5>

          <Button
            className="btn-sm btn-secondary waves-effect waves-light float-end me-2"
            onClick={() => toggleHistoryModal("previous_visa_approval")}
            style={{ height: "fit-content" }}
          >
            <i className="mdi mdi-history"></i> View History
          </Button>
        </div>

        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="source_id">
              <Form.Label>Have ever your visa approved?</Form.Label>
              <div className="d-flex justify-content-start align-items-center mt-1">
                <Form.Check
                  type="radio"
                  name="isVisaApproved"
                  checked={isVisaApproved}
                  onChange={() => setIsVisaApproved(true)}
                  label={<span className="ps-1 fw-bold">Yes</span>}
                />
                <Form.Check
                  type="radio"
                  name="isVisaApproved"
                  checked={!isVisaApproved}
                  onChange={() => setIsVisaApproved(false)}
                  label={<span className="ps-1 fw-bold">No</span>}
                  className="ms-3"
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        {/* {visaApproveData.length > 0 && */}
        {isVisaApproved &&
          visaApproveData.map((data: any, index: any) => (
            <Row key={index}>
              <Col md={6} lg={4} xl={4} xxl={4}>
                <Form.Group className="mb-3" controlId="visa_type">
                  <Form.Label>Visa Type</Form.Label>
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
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(index, "visa_type", selectedOption.value, visa_approve)
                    }
                  />
                  {data?.errors?.visa_type && <Form.Text className="text-danger">{data?.errors?.visa_type}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} xl={4} xxl={4}>
                <Form.Group className="mb-3" controlId="country">
                  <Form.Label><span className="text-danger">*</span> Country</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    name="country_name"
                    options={allCountries?.map((item: any) => {
                      return {
                        label: item.name,
                        value: item?.name,
                        iso: item?.Iso3,
                      };
                    })}
                    value={
                      data?.country_name
                        ? {
                            label: allCountries.find((u: any) => u.name == data?.country_name)?.name,
                            value: data?.country_name,
                          }
                        : null
                    }
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(index, "country_name", selectedOption.value, visa_approve)
                    }
                    placeholder="Select a country"
                  />
                  {data?.errors?.country_name && <Form.Text className="text-danger">{data?.errors?.country_name}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={4} xl={4} xxl={4}>
                <Form.Group className="mb-3" controlId="course_applied">
                  <Form.Label>
                    <span className="text-danger">*</span> Course
                  </Form.Label>
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
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(index, "course_applied", selectedOption.value, visa_approve)
                    }
                  />
                  {data?.errors?.course_applied && <Form.Text className="text-danger">{data?.errors?.course_applied}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={4} xl={4} xxl={4}>
                <Form.Group className="mb-3" controlId="university_applied">
                  <Form.Label>
                    <span className="text-danger">*</span> University Applied
                  </Form.Label>
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
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(index, "university_applied", selectedOption.value, visa_approve)
                    }
                  />
                  {data?.errors?.university_applied && (
                    <Form.Text className="text-danger">{data?.errors?.university_applied}</Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} lg={4} xl={4} xxl={4}>
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

        {isVisaApproved && (
          <>
            <Row className="mb-2">
              <ActionButton label="Add More" onClick={() => addMoreVisaForm(visa_approve)} iconClass="mdi mdi-plus" />
            </Row>
          </>
        )}
        <Button className="w-auto ms-2 px-3" onClick={() => saveVisaForm(visa_approve, isVisaApproved)}>
          Save Approved Visa Details
        </Button>
      </Row>

      {/* Travel History */}
      <Row className="bg-light py-3 ps-3 mt-4">
        <div className="d-flex justify-content-between m-0">
          <h5 className="mb-4 text-uppercase">
            <i className="mdi mdi-account-circle me-1"></i>Travel History
          </h5>

          <Button
            className="btn-sm btn-secondary waves-effect waves-light float-end me-2"
            onClick={() => toggleHistoryModal("travel_history")}
            style={{ height: "fit-content" }}
          >
            <i className="mdi mdi-history"></i> View History
          </Button>
        </div>

        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="source_id">
              <Form.Label>Did you have any travel history?</Form.Label>
              <div className="d-flex justify-content-start align-items-center mt-1">
                <Form.Check
                  type="radio"
                  name="hasTravelHistoy"
                  checked={hasTravelHistoy}
                  onChange={() => setHasTravelHistoy(true)}
                  label={<span className="ps-1 fw-bold">Yes</span>}
                />
                <Form.Check
                  type="radio"
                  name="hasTravelHistoy"
                  checked={!hasTravelHistoy}
                  onChange={() => setHasTravelHistoy(false)}
                  label={<span className="ps-1 fw-bold">No</span>}
                  className="ms-3"
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        {/* {travelHistoryData.length > 0 && */}
        {hasTravelHistoy &&
          travelHistoryData.map((data: any, index: any) => (
            <Row key={index}>

              <Col md={6} xl={4} xxl={4}>
                <Form.Group className="mb-3" controlId="country">
                  <Form.Label><span className="text-danger">*</span> Country</Form.Label>
                  <Select
                    className="react-select react-select-container"
                    name="country_name"
                    options={allCountries?.map((item: any) => {
                      return {
                        label: item.name,
                        value: item?.name,
                        iso: item?.Iso3,
                      };
                    })}
                    value={
                      data?.country_name
                        ? {
                            label: allCountries.find((u: any) => u.name == data?.country_name)?.name,
                            value: data?.country_name,
                          }
                        : null
                    }
                    onChange={(selectedOption: any) =>
                      handleVisaSelectChange(index, "country_name", selectedOption.value, travel_history)
                    }
                    placeholder="Select a country"
                  />
                  {data?.errors?.country_name && <Form.Text className="text-danger">{data?.errors?.country_name}</Form.Text>}
                </Form.Group>
              </Col>

              <Col md={6} lg={4} xl={4} xxl={4}>
                <Form.Group className="mb-3" controlId="start_date">
                  <Form.Label>Start Date</Form.Label>
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

              <Col md={6} lg={4} xl={4} xxl={4}>
                <Form.Group className="mb-3" controlId="end_date">
                  <Form.Label>End Date</Form.Label>
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

              <Col md={6} lg={4} xl={4} xxl={4}>
                <Form.Group className="mb-3" controlId="purpose_of_travel">
                  <Form.Label>Purpose of Travel</Form.Label>
                  <FormInput
                    type="text"
                    name="purpose_of_travel"
                    placeholder="Enter Purpose of Travel"
                    key="purpose_of_travel"
                    value={data?.purpose_of_travel || ""}
                    onChange={(e) => handleVisaInputChange(index, e, travel_history)}
                  />
                  {data?.errors?.purpose_of_travel && (
                    <Form.Text className="text-danger">{data?.errors?.purpose_of_travel}</Form.Text>
                  )}
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

        {hasTravelHistoy && (
          <>
            <Row className="mb-2">
              <ActionButton onClick={() => addMoreVisaForm(travel_history)} label="Add More" iconClass="mdi mdi-plus" />
            </Row>
          </>
        )}
        <Button className="w-auto ms-2 px-3" onClick={() => saveVisaForm(travel_history, hasTravelHistoy)}>
          Save Travel History
        </Button>
      </Row>
    </Row>
  );
};

export default VisaProcessRow;
