import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../../components";
import { currentStatus, modeOfPayment, natureOfOccupaton } from "./FamilyDetails";
import moment from "moment";

interface ParentDetailsFormProps {
  parentType: string;
  parentDetails: any;
  onChange: (e: any) => void;
}

const GrandParentDetailsForm = ({
  parentType,
  parentDetails,
  onChange,
}: ParentDetailsFormProps) => {

  const parentTypeMap: { [key: string]: string } = {
    paternal_grand_mother_info: 'Paternal Grand Mother',
    paternal_grand_father_info: 'Paternal Grand Father',
    maternal_grand_mother_info: 'Maternal Grand Mother',
    maternal_grand_father_info: 'Maternal Grand Father',
    paternal_grand_mother_info_spouse: 'Paternal Grand Mother Spouse',
    paternal_grand_father_info_spouse: 'Paternal Grand Father Spouse',
    maternal_grand_mother_info_spouse: 'Maternal Grand Mother Spouse',
    maternal_grand_father_info_spouse: 'Maternal Grand Father Spouse',
    father_in_law_info: 'Father In Law',
    mother_in_law_info: 'Father In Law',
  };

  const parentTypeName = parentTypeMap[parentType] || 'Unknown Parent Type';

  return (
    <Row className="border-bottom p-1 mb-1">
      <Row>
        <h5 className="mb-4 text-uppercase">{`${parentTypeName} Details`}</h5>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${parentType}_name`}>
            <Form.Label>{`Name of ${parentTypeName}`}</Form.Label>
            <FormInput
              type="text"
              name={`${parentType}.name`}
              placeholder={`Enter name of ${parentTypeName?.toLowerCase()}`}
              onChange={onChange}
              value={parentDetails?.name}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${parentType}_occupation`}>
            <Form.Label>Occupation</Form.Label>
            <FormInput
              type="text"
              name={`${parentType}.occupation`}
              placeholder={`Enter ${parentTypeName?.toLowerCase()}'s occupation`}
              onChange={onChange}
              value={parentDetails?.occupation}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group
            className="mb-3"
            controlId={`${parentType}_annual_income`}
          >
            <Form.Label>Annual Income</Form.Label>
            <FormInput
              type="number"
              name={`${parentType}.annual_income`}
              placeholder={`Enter ${parentTypeName?.toLowerCase()}'s annual income`}
              onChange={onChange}
              value={parentDetails?.annual_income}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${parentType}_organization`}>
            <Form.Label>Organization</Form.Label>
            <FormInput
              type="text"
              name={`${parentType}.organization`}
              placeholder={`Enter ${parentTypeName?.toLowerCase()}'s organization`}
              onChange={onChange}
              value={parentDetails?.organization}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group
            className="mb-3"
            controlId={`${parentType}_age`}
          >
            <Form.Label>Age</Form.Label>
            <FormInput
              type="number"
              name={`${parentType}.age`}
              placeholder={`Enter ${parentTypeName?.toLowerCase()}'s age`}
              onChange={onChange}
              value={parentDetails?.age}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group
            className="mb-3"
            controlId={`${parentType}_dob`}
          >
            <Form.Label>Date of Birth</Form.Label>
            <FormInput
              type="date"
              name={`${parentType}.dob`}
              placeholder={`Enter ${parentTypeName?.toLowerCase()}'s dob`}
              onChange={onChange}
              value={parentDetails?.dob}
              max={moment().format("YYYY-MM-DD")}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group
            className="mb-3"
            controlId={`${parentType}_location`}
          >
            <Form.Label>Location</Form.Label>
            <FormInput
              type="text"
              name={`${parentType}.location`}
              placeholder={`Enter ${parentTypeName?.toLowerCase()}'s location`}
              onChange={onChange}
              value={parentDetails?.location}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group
            className="mb-3"
            controlId={`${parentType}_designation`}
          >
            <Form.Label>Designation</Form.Label>
            <FormInput
              type="text"
              name={`${parentType}.designation`}
              placeholder={`Enter ${parentTypeName?.toLowerCase()}'s designation`}
              onChange={onChange}
              value={parentDetails?.designation}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group
            className="mb-3"
            controlId={`${parentType}_duration`}
          >
            <Form.Label>Duration</Form.Label>
            <FormInput
              type="number"
              name={`${parentType}.duration`}
              placeholder={`Enter ${parentTypeName?.toLowerCase()}'s duration`}
              onChange={onChange}
              value={parentDetails?.duration}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group
            className="mb-3"
            controlId={`${parentType}_current_status`}
          >
            <Form.Label>Current Status</Form.Label>
            <Form.Select
              aria-label="select current status"
              name={`${parentType}.current_status`}
              value={parentDetails?.current_status}
              onChange={onChange}
            >
              <option value="" disabled selected>
                Choose..
              </option>
              {currentStatus?.map((item: any) => (
                <option value={item?.value} key={item?.value}>
                  {item.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group
            className="mb-3"
            controlId={`${parentType}_monthly_salary`}
          >
            <Form.Label>Monthly Salary</Form.Label>
            <FormInput
              type="number"
              name={`${parentType}.monthly_salary`}
              placeholder={`Enter ${parentTypeName?.toLowerCase()}'s monthly salary`}
              onChange={onChange}
              value={parentDetails?.monthly_salary}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group
            className="mb-3"
            controlId={`${parentType}_mode_of_payment`}
          >
            <Form.Label>Mode of Payment</Form.Label>
            <Form.Select
              aria-label="select mode of payment"
              name={`${parentType}.mode_of_payment`}
              value={parentDetails?.mode_of_payment}
              onChange={onChange}
            >
              <option value="" disabled selected>
                Choose..
              </option>
              {modeOfPayment?.map((item: any) => (
                <option value={item?.value} key={item?.value}>
                  {item.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group
            className="mb-3"
            controlId={`${parentType}_current_income_source`}
          >
            <Form.Label>Current Income Source</Form.Label>
            <FormInput
              type="text"
              name={`${parentType}.current_income_source`}
              placeholder={`Enter ${parentTypeName?.toLowerCase()}'s current income source`}
              onChange={onChange}
              value={parentDetails?.current_income_source}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group
            className="mb-3"
            controlId={`${parentType}_income_tax_payer`}
          >
            <Form.Label>Income Tax Payer</Form.Label>
            <Form.Check
              type="checkbox"
              label="Is Income Tax Payer"
              name={`${parentType}.income_tax_payer`}
              checked={parentDetails?.income_tax_payer}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group
            className="mb-3"
            controlId={`${parentType}_nature_of_occupation`}
          >
            <Form.Label>Nature of Occupation</Form.Label>
            <Form.Select
              aria-label="select nature of occupation"
              name={`${parentType}.nature_of_occupation`}
              value={parentDetails?.nature_of_occupation}
              onChange={onChange}
            >
              <option value="" disabled selected>
                Choose..
              </option>
              {natureOfOccupaton?.map((item: any) => (
                <option value={item?.value} key={item?.value}>
                  {item.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </Row>
  );
};

export default GrandParentDetailsForm;
