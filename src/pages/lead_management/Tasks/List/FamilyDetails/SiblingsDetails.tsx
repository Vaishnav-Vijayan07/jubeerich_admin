import React from "react";
import ActionButton from "../ActionButton";
import { Form, Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { FormInput } from "../../../../../components";

interface Props {
  handleInputChange: any;
  handleRemoveItem: any;
  handleAddSibling: any;
  siblings: any;
  number_of_siblings: any;
}

const SiblingsDetails = ({
  handleInputChange,
  siblings,
  number_of_siblings,
  handleRemoveItem,
  handleAddSibling,
}: Props) => {
  return (
    <Row className="p-2" style={{ borderBottom: "1px solid #6658dd" }}>
      <Row>
        <h5 className="mb-4 text-uppercase">Siblings Details</h5>
      </Row>
      <Col md={6}>
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
                  <Col md={4}>
                    <Form.Group
                      className="mb-3"
                      controlId={`siblings?.${index}.name`}
                    >
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
                  <Col md={4}>
                    <Form.Group
                      className="mb-3"
                      controlId={`siblings?.${index}.occupation`}
                    >
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
                  <Col md={4}>
                    <Form.Group
                      className="mb-3"
                      controlId={`siblings?.${index}.annual_income`}
                    >
                      <Form.Label>Annual Income</Form.Label>
                      <FormInput
                        type="number"
                        name={`siblings.${index}.annual_income`}
                        placeholder="Enter sibling's annual income"
                        onChange={handleInputChange}
                        value={sibling.annual_income}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId={`siblings?.${index}.income_tax_payer`}
                    >
                      <Form.Label>Income Tax Payer</Form.Label>
                      <Form.Check
                        type="checkbox"
                        label="Is Income Tax Payer"
                        name={`siblings.${index}.income_tax_payer`}
                        checked={sibling.income_tax_payer}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
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
            <ActionButton
              label="Add More Siblings"
              iconClass="mdi mdi-plus"
              onClick={handleAddSibling}
            />
          </Row>
        </>
      )}
    </Row>
  );
};

export default SiblingsDetails;
