import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import ActionButton from "../ActionButton";
import { FormInput } from "../../../../../components";
import Select from "react-select";
import { currentStatus, modeOfPayment, natureOfOccupaton } from "./FamilyDetails";
import moment from "moment";

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
    <Row className="p-2 mt-2" style={{ borderBottom: "1px solid #6658dd" }}>
      <Row>
        <h5 className="mb-4 text-uppercase">Children Details</h5>
      </Row>
      <Col md={3}>
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
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`children?.${index}.name`}>
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
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`children?.${index}.gender`}>
                      <Form.Label>Gender</Form.Label>
                      <Select
                        className="react-select react-select-container"
                        classNamePrefix="react-select"
                        name={`children.${index}.gender`}
                        options={genderData}
                        value={genderData.find((item: any) => item.value === child.gender)}
                        onChange={(selected: any) =>
                          handleDropDowns(selected, {
                            name: `children?.${index}.gender`,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`children?.${index}.age`}>
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

                  <Col md={3}>
                    <Form.Group className="mb-3" controlId={`children.${index}.dob`}>
                      <Form.Label>Date of Birth</Form.Label>
                      <FormInput
                        type="date"
                        name={`children.${index}.dob`}
                        placeholder={`Enter child's dob`}
                        onChange={handleInputChange}
                        value={child?.dob}
                        max={moment().format("YYYY-MM-DD")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={3}>
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
            <ActionButton label="Add More Children" iconClass="mdi mdi-plus" onClick={handleAddChildren} />
          </Row>
        </>
      )}
    </Row>
  );
};

export default ChildrenDetails;
