import { Row, Col, Form, Button } from "react-bootstrap";
import { FormInput } from "../../../../components";
import Select from "react-select";
import { baseUrl } from "../../../../constants";

const fundTypeOptions = [
  { value: "loan", label: "Loan" },
  { value: "savings", label: "Savings" },
  { value: "fd", label: "FD" },
];

const FundPlanRows = ({
  fundPlan,
  handleFundPlanInputChange,
  removeFundPlan,
  handleAddMoreFundPlan,
}: any) => {
  console.log(fundPlan);

  const renderFundRows = (plan: any, index: number) => (
    <>
      <Row key={index} className="mb-4 p-2 border-rounded ">
        {/* Type */}
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`type-${index}`}>
            <Form.Label>Type</Form.Label>
            <Select
              name="type"
              placeholder="Select fund type"
              value={fundTypeOptions.find(
                (option) => option.value === plan.type
              )}
              onChange={(selectedOption: any) =>
                handleFundPlanInputChange(index, "type", selectedOption?.value)
              }
              options={fundTypeOptions}
            />
            {plan.errors?.type && (
              <Form.Text className="text-danger">{plan.errors.type}</Form.Text>
            )}
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
              onChange={(e) =>
                handleFundPlanInputChange(index, e.target.name, e.target.value)
              }
            />
            {plan.errors?.sponsor_name && (
              <Form.Text className="text-danger">
                {plan.errors.sponsor_name}
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        {/* Approx Annual Income */}
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group
            className="mb-3"
            controlId={`approx_annual_income-${index}`}
          >
            <Form.Label>Approx Annual Income</Form.Label>
            <FormInput
              type="number"
              name="approx_annual_income"
              placeholder="Enter approx. annual income"
              value={plan.approx_annual_income || ""}
              onChange={(e) =>
                handleFundPlanInputChange(index, e.target.name, e.target.value)
              }
              min={0}
            />
            {plan.errors?.approx_annual_income && (
              <Form.Text className="text-danger">
                {plan.errors.approx_annual_income}
              </Form.Text>
            )}
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
                onChange={(e: any) =>
                  handleFundPlanInputChange(index, "itr_status", e.target.value)
                }
              />

              <Form.Check
                inline
                label="Yet to file"
                id={`no-${index}`}
                type="radio"
                name={`itr_status-${index}`}
                checked={plan?.itr_status === "no"} // If "no", check this button
                value="no"
                onChange={(e: any) =>
                  handleFundPlanInputChange(index, "itr_status", e.target.value)
                }
              />
            </div>
          </Form.Group>
        </Col>

        {/* Supporting Document */}
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group
            className="mb-3"
            controlId={`supporting_document-${index}`}
          >
            <Form.Label>Supporting Document</Form.Label>
            <Form.Control
              type="file"
              name="supporting_document"
              onChange={(e: any) =>
                handleFundPlanInputChange(
                  index,
                  e.target.name,
                  e.target.files?.[0]
                )
              }
            />
            {plan.errors?.supporting_document && (
              <Form.Text className="text-danger">
                {plan.errors.supporting_document}
              </Form.Text>
            )}
            {typeof plan.supporting_document === "string" && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-download text-primary me-2"></i>
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
        {fundPlan.length > 1 && (
          <Col className="d-flex align-items-center gap-1">
            <i
              className="text-danger mdi mdi-minus-circle-outline fs-3 ps-1"
              onClick={() => removeFundPlan(index, plan.id ?? 0)}
            ></i>
            <span className="text-danger">Remove</span>
          </Col>
        )}
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
        <Col className="d-flex align-items-center gap-1">
          <i
            className="text-primary mdi mdi-plus-circle-outline fs-3 ps-1"
            onClick={handleAddMoreFundPlan}
          ></i>
          <span className="text-primary">Add More</span>
        </Col>
      </Row>
    </>
  );
};

export default FundPlanRows;
