import { Row, Col, Form, Button } from "react-bootstrap";
import { FormInput } from "../../../../components";
import Select from "react-select";
import { baseUrl } from "../../../../constants";
import ActionButton from "./ActionButton";
import React from "react";

const fundTypeOptions = [
  { value: "loan", label: "Loan" },
  { value: "savings", label: "Savings" },
  { value: "fd", label: "FD" },
  { value: "salary", label: "Salary" },
  { value: "pf", label: "PF" },
];

const FundPlanRows = ({ fundPlan, handleFundPlanInputChange, removeFundPlan, handleAddMoreFundPlan }: any) => {
  console.log(fundPlan);

  const renderFundRows = (plan: any, index: number) => (
    <>
      <Row key={index} className="mb-4 p-2 border-bottom rounded">
        {/* Type */}
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`type-${index}`}>
            <Form.Label>Type</Form.Label>
            <Select
              name="type"
              placeholder="Select fund type"
              value={fundTypeOptions.find((option) => option.value === plan.type)}
              onChange={(selectedOption: any) => handleFundPlanInputChange(index, "type", selectedOption?.value)}
              options={fundTypeOptions}
            />
            {plan.errors?.type && <Form.Text className="text-danger">{plan.errors.type}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`fund_origin-${index}`}>
            <Form.Label>Fund Origin</Form.Label>
            <Form.Select
              name="fund_origin"
              value={plan.fund_origin || ""}
              onChange={(e) => handleFundPlanInputChange(index, e.target.name, e.target.value)} // Standard HTML onChange
            >
              <option value="" disabled>
                Select Fund Origin
              </option>
              <option key={"Own Funds"} value={"Own Funds"}>
                Own Funds
              </option>
              <option key={"Sponsored Funds"} value={"Sponsored Funds"}>
                Sponsored Funds
              </option>
            </Form.Select>
            {plan.errors?.fund_origin && <Form.Text className="text-danger">{plan.errors.fund_origin}</Form.Text>}
          </Form.Group>
        </Col>

        {/* Sponsor Name */}
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`sponsor_name-${index}`}>
            <Form.Label>Sponsor Name</Form.Label>
            <FormInput
              type="text"
              name="sponsor_name"
              placeholder="Enter sponsor name"
              value={plan.sponsor_name || ""}
              onChange={(e) => handleFundPlanInputChange(index, e.target.name, e.target.value)}
            />
            {plan.errors?.sponsor_name && <Form.Text className="text-danger">{plan.errors.sponsor_name}</Form.Text>}
          </Form.Group>
        </Col>

        {/* Approx Annual Income */}
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`approx_annual_income-${index}`}>
            <Form.Label>Approx Annual Income</Form.Label>
            <FormInput
              type="number"
              name="approx_annual_income"
              placeholder="Enter approx. annual income"
              value={plan.approx_annual_income || ""}
              onChange={(e) => handleFundPlanInputChange(index, e.target.name, e.target.value)}
              min={0}
            />
            {plan.errors?.approx_annual_income && (
              <Form.Text className="text-danger">{plan.errors.approx_annual_income}</Form.Text>
            )}
          </Form.Group>
        </Col>

        {/* Relation with sponsor*/}

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`relation_with_sponsor-${index}`}>
            <Form.Label>Relation with sponsor</Form.Label>
            <FormInput
              type="text"
              name="relation_with_sponsor"
              placeholder="Enter relation with sponsor"
              value={plan.relation_with_sponsor || ""}
              onChange={(e) => handleFundPlanInputChange(index, e.target.name, e.target.value)}
            />
            {plan.errors?.relation_with_sponsor && (
              <Form.Text className="text-danger">{plan.errors.relation_with_sponsor}</Form.Text>
            )}
          </Form.Group>
        </Col>

        {/* Sponsorship amount */}

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`sponsorship_amount-${index}`}>
            <Form.Label>Sponsorship amount</Form.Label>
            <FormInput
              type="number"
              name="sponsorship_amount"
              placeholder="Enter sponsorship amount"
              value={plan.sponsorship_amount || ""}
              onChange={(e) => handleFundPlanInputChange(index, e.target.name, e.target.value)}
              min={0}
            />
            {plan.errors?.sponsorship_amount && <Form.Text className="text-danger">{plan.errors.sponsorship_amount}</Form.Text>}
          </Form.Group>
        </Col>

        {/* Name of bank */}

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`name_of_bank-${index}`}>
            <Form.Label>Name of bank</Form.Label>
            <FormInput
              type="text"
              name="name_of_bank"
              placeholder="Enter name of bank"
              value={plan.name_of_bank || ""}
              onChange={(e) => handleFundPlanInputChange(index, e.target.name, e.target.value)}
            />
            {plan.errors?.name_of_bank && <Form.Text className="text-danger">{plan.errors.name_of_bank}</Form.Text>}
          </Form.Group>
        </Col>

        {/* ITR Status */}
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`itr_status-${index}`}>
            <Form.Label className="mb-2">ITR Status</Form.Label>
            <div>
              <Form.Check
                inline
                id={`yes-${index}`}
                label="Filed"
                type="radio"
                name={`itr_status-${index}`}
                checked={plan?.itr_status === "yes"} // If "yes", check this button
                value="yes"
                onChange={(e: any) => handleFundPlanInputChange(index, "itr_status", e.target.value)}
              />

              <Form.Check
                inline
                label="Yet to file"
                id={`no-${index}`}
                type="radio"
                name={`itr_status-${index}`}
                checked={plan?.itr_status === "no"} // If "no", check this button
                value="no"
                onChange={(e: any) => handleFundPlanInputChange(index, "itr_status", e.target.value)}
              />
            </div>
          </Form.Group>
        </Col>

        {/* Supporting Document */}
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`supporting_document-${index}`}>
            <Form.Label>Supporting Document</Form.Label>
            <Form.Control
              type="file"
              name="supporting_document"
              onChange={(e: any) => handleFundPlanInputChange(index, e.target.name, e.target.files?.[0])}
            />
            {plan.errors?.supporting_document && <Form.Text className="text-danger">{plan.errors.supporting_document}</Form.Text>}
            {typeof plan.supporting_document === "string" && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-eye text-primary me-2"></i>
                <a
                  href={`${baseUrl}/uploads/fundDocuments/${plan?.supporting_document}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  supporting_document
                </a>
              </div>
            )}
          </Form.Group>
        </Col>
        {(plan?.type === "fd" || plan?.type === "savings") && (
          <>
            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3" controlId={`has_min_6_months_backup-${index}`}>
                <Form.Label className="mb-2">Does the funds have min 6 months has_min_6_months_backup?</Form.Label>
                <div>
                  <Form.Check
                    inline
                    id={`yes-${index}`}
                    label="Yes"
                    type="radio"
                    name={`has_min_6_months_backup-${index}`}
                    checked={plan?.has_min_6_months_backup === "yes"} // If "yes", check this button
                    value="yes"
                    onChange={(e: any) => handleFundPlanInputChange(index, "has_min_6_months_backup", e.target.value)}
                  />

                  <Form.Check
                    inline
                    label="No"
                    id={`no-${index}`}
                    type="radio"
                    name={`has_min_6_months_backup-${index}`}
                    checked={plan?.has_min_6_months_backup === "no"} // If "no", check this button
                    value="no"
                    onChange={(e: any) => handleFundPlanInputChange(index, "has_min_6_months_backup", e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3" controlId={`source_of_funds-${index}`}>
                <Form.Label>Explain the source of funds for FD/Savings.</Form.Label>
                <Form.Control
                  // type="text"
                  as={"textarea"}
                  rows={3}
                  name="source_of_funds"
                  placeholder="Explain the source of funds for FD/Savings."
                  value={plan.source_of_funds || ""}
                  onChange={(e) => handleFundPlanInputChange(index, e.target.name, e.target.value)}
                />
                {plan.errors?.source_of_funds && <Form.Text className="text-danger">{plan.errors.source_of_funds}</Form.Text>}
              </Form.Group>
            </Col>
          </>
        )}
        <Row>
          {fundPlan.length > 1 && (
            <ActionButton
              colorClass="text-danger"
              onClick={() => removeFundPlan(index, plan.id ?? 0)}
              iconClass="mdi mdi-delete"
              label="Remove"
            />
          )}
        </Row>
      </Row>
    </>
  );

  return (
    <>
      <Row>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-account-circle me-1"></i>Fund Plan
        </h5>
      </Row>

      {fundPlan?.map((plan: any, index: number) => renderFundRows(plan, index))}

      <Row className="mb-2">
        <ActionButton onClick={handleAddMoreFundPlan} label="Add more" iconClass="mdi mdi-plus" />
      </Row>
    </>
  );
};

export default FundPlanRows;
