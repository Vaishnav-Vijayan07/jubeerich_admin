import React from "react";
import ActionButton from "../ActionButton";
import { Form, Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { FormInput } from "../../../../../components";
import { currentStatus, modeOfPayment, natureOfOccupaton } from "./FamilyDetails";
import moment from "moment";

interface Props {
  handleInputChange: any;
  handleRemoveItem: any;
  handleAddSibling: any;
  siblings: any;
  number_of_siblings: any;
}

const SiblingsDetails = ({ handleInputChange, siblings, number_of_siblings, handleRemoveItem, handleAddSibling }: Props) => {
  return (
    <Row className="p-2" style={{ borderBottom: "1px solid #6658dd" }}>
      <Row>
        <h5 className="mb-4 text-uppercase">Siblings' Details</h5>
      </Row>
      <Col md={3}>
        <Form.Group className="mb-3" controlId={`number_of_siblings`}>
          <Form.Label>Number of Siblings</Form.Label>
          <FormInput
            type="number"
            name="number_of_siblings"
            placeholder="Enter number of siblings"
            onChange={handleInputChange}
            value={number_of_siblings}
            min="0" // Ensure the user can't enter less than 0
          />
        </Form.Group>
      </Col>
      {number_of_siblings !== 0 && number_of_siblings !== "" && (
        <>
          <Row>
            {siblings?.map((sibling: any, index: number) => (
              <div key={index}>
                <h6>Sibling {index + 1}</h6>
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`siblings?.${index}.name`}>
                      <Form.Label>Name</Form.Label>
                      <FormInput
                        type="text"
                        name={`siblings.${index}.name`}
                        placeholder="Enter sibling's name"
                        onChange={handleInputChange}
                        value={sibling.name}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`siblings?.${index}.occupation`}>
                      <Form.Label>Occupation</Form.Label>
                      <FormInput
                        type="text"
                        name={`siblings.${index}.occupation`}
                        placeholder="Enter sibling's occupation"
                        onChange={handleInputChange}
                        value={sibling.occupation}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`siblings?.${index}.organization`}>
                      <Form.Label>Organization</Form.Label>
                      <FormInput
                        type="text"
                        name={`siblings.${index}.organization`}
                        placeholder={`Enter sibling's organization`}
                        onChange={handleInputChange}
                        value={sibling?.organization}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`siblings?.${index}.annual_income`}>
                      <Form.Label>Annual Income ( ₹ )</Form.Label>
                      <FormInput
                        type="number"
                        name={`siblings.${index}.annual_income`}
                        placeholder="Enter sibling's annual income"
                        onChange={handleInputChange}
                        value={sibling.annual_income}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`siblings.${index}.age`}>
                      <Form.Label>Age</Form.Label>
                      <FormInput
                        type="number"
                        name={`siblings.${index}.age`}
                        placeholder={`Enter siblings's age`}
                        onChange={handleInputChange}
                        value={sibling?.age}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`siblings.${index}.dob`}>
                      <Form.Label>Date of Birth</Form.Label>
                      <FormInput
                        type="date"
                        name={`siblings.${index}.dob`}
                        placeholder={`Enter siblings's dob`}
                        onChange={handleInputChange}
                        value={sibling?.dob}
                        max={moment().format("YYYY-MM-DD")}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`siblings.${index}.location`}>
                      <Form.Label>Location</Form.Label>
                      <FormInput
                        type="text"
                        name={`siblings.${index}.location`}
                        placeholder={`Enter siblings's location`}
                        onChange={handleInputChange}
                        value={sibling?.location}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`siblings.${index}.designation`}>
                      <Form.Label>Designation</Form.Label>
                      <FormInput
                        type="text"
                        name={`siblings.${index}.designation`}
                        placeholder={`Enter siblings's designation`}
                        onChange={handleInputChange}
                        value={sibling?.designation}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`siblings.${index}.duration`}>
                      <Form.Label>Duration</Form.Label>
                      <FormInput
                        type="number"
                        name={`siblings.${index}.duration`}
                        placeholder={`Enter siblings's duration`}
                        onChange={handleInputChange}
                        value={sibling?.duration}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`siblings.${index}.current_status`}>
                      <Form.Label>Current Status</Form.Label>
                      <Form.Select
                        aria-label="select current status"
                        name={`siblings.${index}.current_status`}
                        value={sibling?.current_status}
                        onChange={handleInputChange}
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

                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`siblings.${index}.monthly_salary`}>
                      <Form.Label>Monthly Salary ( ₹ )</Form.Label>
                      <FormInput
                        type="number"
                        name={`siblings.${index}.monthly_salary`}
                        placeholder={`Enter siblings's monthly salary`}
                        onChange={handleInputChange}
                        value={sibling?.monthly_salary}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`siblings.${index}.mode_of_payment`}>
                      <Form.Label>Mode of Payment</Form.Label>
                      <Form.Select
                        aria-label="select mode of payment"
                        name={`siblings.${index}.mode_of_payment`}
                        value={sibling?.mode_of_payment}
                        onChange={handleInputChange}
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

                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`siblings.${index}.current_income_source`}>
                      <Form.Label>Current Income Source</Form.Label>
                      <FormInput
                        type="text"
                        name={`siblings.${index}.current_income_source`}
                        placeholder={`Enter siblings's current income source`}
                        onChange={handleInputChange}
                        value={sibling?.current_income_source}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`siblings.${index}.income_tax_payer`}>
                      <Form.Label>Income Tax Payer</Form.Label>
                      <Form.Check
                        type="checkbox"
                        label="Is Income Tax Payer"
                        name={`siblings.${index}.income_tax_payer`}
                        checked={sibling?.income_tax_payer}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`siblings.${index}.nature_of_occupation`}>
                      <Form.Label>Nature of Occupation</Form.Label>
                      <Form.Select
                        aria-label="select nature of occupation"
                        name={`siblings.${index}.nature_of_occupation`}
                        value={sibling?.nature_of_occupation}
                        onChange={handleInputChange}
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
                  <Col md={3}>
                    <ActionButton
                      colorClass="text-danger"
                      iconClass="mdi mdi-delete"
                      label="Remove Sibling"
                      onClick={() => handleRemoveItem("siblings_info", index)}
                    />
                  </Col>
                </Row>
              </div>
            ))}
          </Row>

          <Row>
            <ActionButton label="Add More Siblings" iconClass="mdi mdi-plus" onClick={handleAddSibling} />
          </Row>
        </>
      )}
    </Row>
  );
};

export default SiblingsDetails;
