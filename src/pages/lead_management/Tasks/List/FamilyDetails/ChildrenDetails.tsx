import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import ActionButton from "../ActionButton";
import { FormInput } from "../../../../../components";
import Select from "react-select";
import { currentStatus, modeOfPayment, natureOfOccupaton } from "./FamilyDetails";

interface Props {
  number_of_children: any;
  handleInputChange: any;
  handleRemoveItem: any;
  handleAddChildren: any;
  children: any;
  handleDropDowns: any;
}

const genderData = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const ChildrenDetails = ({
  number_of_children,
  handleInputChange,
  handleRemoveItem,
  handleAddChildren,
  children,
  handleDropDowns,
}: Props) => {
  return (
    <Row
      className="p-2 mt-2"
      style={{ borderBottom: "1px solid #6658dd" }}
    >
      <Row>
        <h5 className="mb-4 text-uppercase">Children Details</h5>
      </Row>
      <Col md={6}>
        <Form.Group className="mb-3" controlId={`number_of_children`}>
          <Form.Label>Number of Children</Form.Label>
          <FormInput
            type="number"
            name="number_of_children"
            placeholder="Enter number of children"
            onChange={handleInputChange}
            value={number_of_children}
            min="0" // Ensure the user can't enter less than 0
          />
        </Form.Group>
      </Col>
      {number_of_children !== 0 && number_of_children !== "" && (
        <>
          <Row>
            {children?.map((child: any, index: number) => (
              <div key={index}>
                <h6>Child {index + 1}</h6>
                <Row>
                  <Col md={4}>
                    <Form.Group
                      className="mb-3"
                      controlId={`children?.${index}.name`}
                    >
                      <Form.Label>Name</Form.Label>
                      <FormInput
                        type="text"
                        name={`children.${index}.name`}
                        placeholder="Enter child's name"
                        onChange={handleInputChange}
                        value={child.name}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group
                      className="mb-3"
                      controlId={`children?.${index}.gender`}
                    >
                      <Form.Label>Gender</Form.Label>
                      <Select
                        className="react-select react-select-container"
                        classNamePrefix="react-select"
                        name={`children.${index}.gender`}
                        options={genderData}
                        value={genderData.find(
                          (item: any) => item.value === child.gender
                        )}
                        onChange={(selected: any) =>
                          handleDropDowns(selected, {
                            name: `children?.${index}.gender`,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group
                      className="mb-3"
                      controlId={`children?.${index}.age`}
                    >
                      <Form.Label>Age</Form.Label>
                      <FormInput
                        type="number"
                        name={`children.${index}.age`}
                        placeholder="Enter child's age"
                        onChange={handleInputChange}
                        value={child.age}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId={`children.${index}.dob`}
                    >
                      <Form.Label>Date of Birth</Form.Label>
                      <FormInput
                        type="date"
                        name={`children.${index}.dob`}
                        placeholder={`Enter child's dob`}
                        onChange={handleInputChange}
                        value={child?.dob}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId={`children.${index}.occupation`}
                    >
                      <Form.Label>Occupation</Form.Label>
                      <FormInput
                        type="text"
                        name={`children.${index}.occupation`}
                        placeholder="Enter child's occupation"
                        onChange={handleInputChange}
                        value={child.occupation}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId={`children.${index}.organization`}>
                      <Form.Label>Organization</Form.Label>
                      <FormInput
                        type="text"
                        name={`children.${index}.organization`}
                        placeholder={`Enter child's organization`}
                        onChange={handleInputChange}
                        value={child?.organization}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId={`children.${index}.annual_income`}
                    >
                      <Form.Label>Annual Income</Form.Label>
                      <FormInput
                        type="number"
                        name={`children.${index}.annual_income`}
                        placeholder="Enter child's annual income"
                        onChange={handleInputChange}
                        value={child.annual_income}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId={`children.${index}.location`}
                    >
                      <Form.Label>Location</Form.Label>
                      <FormInput
                        type="text"
                        name={`children.${index}.location`}
                        placeholder={`Enter child's location`}
                        onChange={handleInputChange}
                        value={child?.location}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId={`children.${index}.designation`}
                    >
                      <Form.Label>Designation</Form.Label>
                      <FormInput
                        type="text"
                        name={`children.${index}.designation`}
                        placeholder={`Enter child's designation`}
                        onChange={handleInputChange}
                        value={child?.designation}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId={`children.${index}.duration`}
                    >
                      <Form.Label>Duration</Form.Label>
                      <FormInput
                        type="number"
                        name={`children.${index}.duration`}
                        placeholder={`Enter child's duration`}
                        onChange={handleInputChange}
                        value={child?.duration}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId={`children.${index}.current_status`}
                    >
                      <Form.Label>Current Status</Form.Label>
                      <Form.Select
                        aria-label="select current status"
                        name={`children.${index}.current_status`}
                        value={child?.current_status}
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

                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId={`children.${index}.monthly_salary`}
                    >
                      <Form.Label>Monthly Salary</Form.Label>
                      <FormInput
                        type="number"
                        name={`children.${index}.monthly_salary`}
                        placeholder={`Enter child's monthly salary`}
                        onChange={handleInputChange}
                        value={child?.monthly_salary}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId={`children.${index}.mode_of_payment`}
                    >
                      <Form.Label>Mode of Payment</Form.Label>
                      <Form.Select
                        aria-label="select mode of payment"
                        name={`children.${index}.mode_of_payment`}
                        value={child?.mode_of_payment}
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

                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId={`children.${index}.current_income_source`}
                    >
                      <Form.Label>Current Income Source</Form.Label>
                      <FormInput
                        type="text"
                        name={`children.${index}.current_income_source`}
                        placeholder={`Enter child's current income source`}
                        onChange={handleInputChange}
                        value={child?.current_income_source}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId={`children.${index}.income_tax_payer`}
                    >
                      <Form.Label>Income Tax Payer</Form.Label>
                      <Form.Check
                        type="checkbox"
                        label="Is Income Tax Payer"
                        name={`children.${index}.income_tax_payer`}
                        checked={child?.income_tax_payer}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId={`children.${index}.nature_of_occupation`}
                    >
                      <Form.Label>Nature of Occupation</Form.Label>
                      <Form.Select
                        aria-label="select nature of occupation"
                        name={`children.${index}.nature_of_occupation`}
                        value={child?.nature_of_occupation}
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
                </Row>
                <Row>
                  <Col md={6}>
                    <ActionButton
                      colorClass="text-danger"
                      iconClass="mdi mdi-delete"
                      label="Remove Child"
                      onClick={() => handleRemoveItem("children_info", index)}
                    />
                  </Col>
                </Row>
              </div>
            ))}
          </Row>

          <Row>
            <ActionButton
              label="Add More Children"
              iconClass="mdi mdi-plus"
              onClick={handleAddChildren}
            />
          </Row>
        </>
      )}
    </Row>
  );
};

export default ChildrenDetails;
