import React, { useState } from "react";
import { Button, Col, Form, Dropdown, Card, Row, Collapse } from "react-bootstrap";

type SortOption = {
  value: string;
  label: string;
};

type Props = {
  countries ?: SelectItems[]
  source ?: SelectItems[]
  offices ?: SelectItems[]
};

type SelectItems = {
    label: string;
    value:string;
}

const sortOptions: SortOption[] = [
  { value: "created_at", label: "Created Date" },
  { value: "lead_received_date", label: "Lead Received Date" },
  { value: "full_name", label: "Name" },
  { value: "id", label: "id" },
  // Add more sort options as needed
];

function CustomLeadFilters({countries,offices,source}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const handleFieldChange = (value: string) => {
    console.log("Field Change:", value);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrder = e.target.value as "asc" | "desc";
    console.log("Order Change:", newOrder);
  };

  const handleApplySort = () => {
    console.log("Apply Sort");
  };

  const handleClear = () => {
    console.log("Clear");
  };

  return (
    <Card>
      <Row>
        <Col className="d-flex justify-content-start align-items-center">
          <span className="mt-3 ms-3 w-full">
            <h4 className="header-title mb-1" style={{ fontSize: "18px" }}>
              Filters
            </h4>
          </span>
        </Col>
        <Col className="d-flex justify-content-end align-items-center">
          <span className="ms-3 me-3" onClick={() => setOpen(!open)} aria-controls="example-collapse-text" aria-expanded={open}>
            {open && <i className="mdi mdi-arrow-up-drop-circle-outline fs-2"></i>}
            {!open && <i className="mdi mdi-arrow-down-drop-circle-outline fs-2"></i>}
          </span>
        </Col>
      </Row>

      <Card.Body  className="p-3">
        <Collapse in={open}>
          <div>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-0">
                  <Form.Label className="text-muted fw-semibold small">Source</Form.Label>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-secondary"
                      id="sort-field-dropdown"
                      className="small text-truncate"
                      style={{ minWidth: "120px" }}
                    >
                      Choose
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {countries?.map((option) =>
                        option.value !== "id" ? (
                          <Dropdown.Item key={option.value} onClick={() => handleFieldChange(option.value)}>
                            {option.label}
                          </Dropdown.Item>
                        ) : null
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-0">
                  <Form.Label className="text-muted fw-semibold small">Office</Form.Label>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-secondary"
                      id="sort-field-dropdown"
                      className="small text-truncate"
                      style={{ minWidth: "120px" }}
                    >
                      Choose
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {sortOptions.map((option) =>
                        option.value !== "id" ? (
                          <Dropdown.Item key={option.value} onClick={() => handleFieldChange(option.value)}>
                            {option.label}
                          </Dropdown.Item>
                        ) : null
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-0">
                  <Form.Label className="text-muted fw-semibold small">Country</Form.Label>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-secondary"
                      id="sort-field-dropdown"
                      className="small text-truncate"
                      style={{ minWidth: "120px" }}
                    >
                      Choose
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {sortOptions.map((option) =>
                        option.value !== "id" ? (
                          <Dropdown.Item key={option.value} onClick={() => handleFieldChange(option.value)}>
                            {option.label}
                          </Dropdown.Item>
                        ) : null
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
              </Col>

              <Col md={3} className="align-self-end d-flex gap-2">
                  <Button variant="primary" size="sm" onClick={handleApplySort} className=" fw-semibold ms-2">
                    Apply
                  </Button>
              </Col>
            </Row>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
}

export default CustomLeadFilters;
