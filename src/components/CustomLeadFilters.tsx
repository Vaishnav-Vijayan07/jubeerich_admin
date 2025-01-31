import React, { useState } from "react";
import { Button, Col, Form, Dropdown, Card, Row, Collapse } from "react-bootstrap";

type SortOption = {
  value: string;
  label: string;
};

type Props = {
  countries: SelectItems[];
  source: SelectItems[];
  offices: SelectItems[];
  selectedCountry: string;
  selectedOffice: string;
  selectedSource: string;
  selectedSortBy: string;
  selectedSortOrder: string;
  onFilterChange?: (name: string, value: string) => void;
  onApplySort?: () => void;
  onClear?: VoidFunction;
};

type SelectItems = {
  label: string;
  value: string;
};

const sortOptions: SortOption[] = [
  { value: "created_at", label: "Created Date" },
  { value: "lead_received_date", label: "Lead Received Date" },
  { value: "full_name", label: "Name" },
  { value: "id", label: "id" },
];

const sortOrderOptions: SortOption[] = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

function CustomLeadFilters({
  countries,
  offices,
  source,
  selectedCountry,
  selectedOffice,
  selectedSource,
  selectedSortBy,
  selectedSortOrder,
  onApplySort,
  onClear,
  onFilterChange,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const handleFieldChange = (name: string, value: string) => {
    onFilterChange?.(name, value);
  };

  const handleApplySort = () => {
    onApplySort?.();
  };

  const handleClear = () => {
    onClear?.();
  };

  return (
    <Card>
      <Row>
        <Col className="d-flex justify-content-start align-items-center">
          <span className="mt-3 ms-3 w-full">
            <h4 className="header-title mb-3" style={{ fontSize: "18px" }}>
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

      <Card.Body className="pt-0 pb-2">
        <Collapse in={open}>
          <div>
            <Row className="mb-3">
              <Col md={10} className="d-flex justify-content-evenly">
                <Col>
                  <Form.Group className="mb-0">
                    <Form.Label className="text-muted fw-semibold small">Country</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        id="sort-field-dropdown"
                        className="small text-truncate"
                        style={{ minWidth: "120px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      >
                        {countries?.find((country) => country.value === selectedCountry)?.label || "All"}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {[{ value: "all", label: "All" }, ...countries]?.map((option) => (
                          <Dropdown.Item key={option.value} onClick={() => handleFieldChange("country", option.value)}>
                            {option.label}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-0">
                    <Form.Label className="text-muted fw-semibold small">Office</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        id="sort-field-dropdown"
                        className="medium text-truncate"
                        style={{ minWidth: "120px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      >
                        {offices?.find((office) => office.value === selectedOffice)?.label || "All"}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {[{ value: "all", label: "All" }, ...offices]?.map((option) => (
                          <Dropdown.Item key={option.value} onClick={() => handleFieldChange("office", option.value)}>
                            {option.label}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-0">
                    <Form.Label className="text-muted fw-semibold small">Source</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        id="sort-field-dropdown"
                        className="small text-truncate"
                        style={{ minWidth: "120px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      >
                        {source?.find((source) => source.value === selectedSource)?.label || "All"}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {[{ value: "all", label: "All" }, ...source].map((option) => (
                          <Dropdown.Item key={option.value} onClick={() => handleFieldChange("source", option.value)}>
                            {option.label}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-0">
                    <Form.Label className="text-muted fw-semibold small">Sort by</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        id="sort-field-dropdown"
                        className="small text-truncate"
                        style={{ minWidth: "120px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      >
                        {selectedSortBy ? sortOptions.find((opt) => opt.value === selectedSortBy)?.label : "Choose"}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {sortOptions.map((option) =>
                          option.value !== "id" ? (
                            <Dropdown.Item key={option.value} onClick={() => handleFieldChange("sort_by", option.value)}>
                              {option.label}
                            </Dropdown.Item>
                          ) : null
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-0">
                    <Form.Label className="text-muted fw-semibold small">Order</Form.Label>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        id="sort-field-dropdown"
                        className="small text-truncate"
                        style={{ minWidth: "120px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      >
                        {selectedSortOrder ? sortOrderOptions.find((opt) => opt.value === selectedSortOrder)?.label : "Choose"}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {sortOrderOptions.map((option) => (
                          <Dropdown.Item key={option.value} onClick={() => handleFieldChange("sort_order", option.value)}>
                            {option.label}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                </Col>
              </Col>

              <Col className="align-self-end d-flex">
                <Button variant="primary" size="sm" onClick={handleApplySort} className="fw-semibold ms-2">
                  Apply
                </Button>
                <Button variant="outline-danger" size="sm" onClick={handleClear} className="fw-semibold ms-2">
                  Clear
                </Button>
              </Col>
            </Row>
          </div>
        </Collapse>
      </Card.Body>

      {/* 
        {isExpanded && (
          <Row>
            <Card.Body className="p-3">
              <Row>
                <Col md={10} className="d-flex justify-content-evenly">
                  <Col>
                    <Form.Group className="mb-0">
                      <Form.Label className="text-muted fw-semibold small">Country</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-secondary"
                          id="sort-field-dropdown"
                          className="small text-truncate"
                          style={{ minWidth: "120px",display:"flex",alignItems:"center",justifyContent:"space-between" }}
                        >
                          {countries?.find((country) => country.value === selectedCountry)?.label || "All"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {[{ value: "all", label: "All" }, ...countries]?.map((option) => (
                            <Dropdown.Item key={option.value} onClick={() => handleFieldChange("country", option.value)}>
                              {option.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-0">
                      <Form.Label className="text-muted fw-semibold small">Office</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-secondary"
                          id="sort-field-dropdown"
                          className="small text-truncate"
                          style={{ minWidth: "120px",display:"flex",alignItems:"center",justifyContent:"space-between" }}
                        >
                          {offices?.find((office) => office.value === selectedOffice)?.label || "All"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {[{ value: "all", label: "All" }, ...offices]?.map((option) => (
                            <Dropdown.Item key={option.value} onClick={() => handleFieldChange("office", option.value)}>
                              {option.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-0">
                      <Form.Label className="text-muted fw-semibold small">Source</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-secondary"
                          id="sort-field-dropdown"
                          className="small text-truncate"
                          style={{ minWidth: "120px",display:"flex",alignItems:"center",justifyContent:"space-between" }}
                        >
                          {source?.find((source) => source.value === selectedSource)?.label || "All"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {[{ value: "all", label: "All" }, ...source].map((option) => (
                            <Dropdown.Item key={option.value} onClick={() => handleFieldChange("source", option.value)}>
                              {option.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-0">
                      <Form.Label className="text-muted fw-semibold small">Sort by</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-secondary"
                          id="sort-field-dropdown"
                          className="small text-truncate"
                          style={{ minWidth: "120px",display:"flex",alignItems:"center",justifyContent:"space-between" }}
                        >
                          {selectedSortBy ? sortOptions.find((opt) => opt.value === selectedSortBy)?.label : "Choose"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {sortOptions.map((option) =>
                            option.value !== "id" ? (
                              <Dropdown.Item key={option.value} onClick={() => handleFieldChange("sort_by", option.value)}>
                                {option.label}
                              </Dropdown.Item>
                            ) : null
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-0">
                      <Form.Label className="text-muted fw-semibold small">Order</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-secondary"
                          id="sort-field-dropdown"
                          className="small text-truncate"
                          style={{ minWidth: "120px",display:"flex",alignItems:"center",justifyContent:"space-between" }}
                        >
                          {selectedSortOrder ? sortOrderOptions.find((opt) => opt.value === selectedSortOrder)?.label : "Choose"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {sortOrderOptions.map((option) => (
                            <Dropdown.Item key={option.value} onClick={() => handleFieldChange("sort_order", option.value)}>
                              {option.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>
                </Col>

                <Col className="align-self-end d-flex">
                  <Button variant="success" size="sm" onClick={handleApplySort} className="fw-semibold ms-2">
                    Apply
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={handleClear} className="fw-semibold ms-2">
                    Clear
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Row>
        )} */}
    </Card>
  );
}

export default CustomLeadFilters;
