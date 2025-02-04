import React, { useMemo, useState } from "react";
import { Button, Col, Form, Dropdown, Card, Row, Collapse } from "react-bootstrap";
import { counsellor_tl_id, cre_id, cre_tl_id, it_team_id, regional_manager_id } from "../constants";
import FormInput from "./FormInput";
import { set } from "react-hook-form";

type SortOption = {
  value: string;
  label: string;
};

type Props = {
  countries: SelectItems[];
  source: SelectItems[];
  offices?: SelectItems[];
  cres?: SelectItems[];
  consellors?: SelectItems[];
  branches?: SelectItems[];
  counselors_tl?: SelectItems[];
  selectedCountry: string;
  selectedOffice?: string;
  selectedSource: string;
  selectedSortBy: string;
  selectedBranch?: string;
  selectedSortOrder: string;
  selectedCre?: string;
  selectedCounsellors?: string;
  selectedCounselorsTL?: string;
  userRole?: any;
  onFilterChange?: (name: string, value: string) => void;
  onApplySort?: () => void;
  onClear?: VoidFunction;
  exportLeads?: (value: any) => void
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

const initialDateState = {
  start_date: '',
  end_date: ''
}

function CustomLeadFilters({
  countries,
  offices,
  source,
  cres,
  consellors,
  branches,
  counselors_tl,
  selectedCountry,
  selectedOffice,
  selectedSource,
  selectedCre,
  selectedBranch,
  selectedSortBy,
  selectedSortOrder,
  selectedCounsellors,
  selectedCounselorsTL,
  userRole,
  onApplySort,
  onClear,
  onFilterChange,
  exportLeads
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<any>(initialDateState);

  const showOffices = userRole == it_team_id;
  const showCounsellors = userRole == cre_id || userRole == counsellor_tl_id;
  const showBranches = userRole == regional_manager_id;

  const handleFieldChange = (name: string, value: string) => {
    onFilterChange?.(name, value);
  };

  const handleApplySort = () => {
    onApplySort?.();
  };

  const handleClear = () => {
    onClear?.();
  };

  const handleExportLead = () => {
    exportLeads?.(dateRange);
  }

  const handleDateRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    setDateRange({
      ...dateRange,
      [name]: value
    });
  }

  return (
    <Card>
      <Row onClick={() => setOpen(!open)}>
        <Col className="d-flex justify-content-start align-items-center">
          <span className="mt-3 ms-3 w-full">
            <h4 className="header-title mb-3" style={{ fontSize: "18px" }}>
              Filters
            </h4>
          </span>
        </Col>
        <Col className="d-flex justify-content-end align-items-center">
          <span className="ms-3 me-3" aria-controls="example-collapse-text" aria-expanded={open}>
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

                {offices && offices?.length > 0 && showOffices && (
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
                )}

                {cres && cres?.length > 0 && (
                  <Col>
                    <Form.Group className="mb-0">
                      <Form.Label className="text-muted fw-semibold small">Cre's</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-secondary"
                          id="sort-field-dropdown"
                          className="medium text-truncate"
                          style={{ minWidth: "120px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                        >
                          {cres?.find((cre) => cre.value === selectedCre)?.label || "All"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {[{ value: "all", label: "All" }, ...cres]?.map((option) => (
                            <Dropdown.Item key={option.value} onClick={() => handleFieldChange("cre", option.value)}>
                              {option.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>
                )}

                {consellors && consellors?.length > 0 && showCounsellors && (
                  <Col>
                    <Form.Group className="mb-0">
                      <Form.Label className="text-muted fw-semibold small">Counsellors</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-secondary"
                          id="sort-field-dropdown"
                          className="medium text-truncate"
                          style={{ minWidth: "120px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                        >
                          {consellors?.find((cre) => cre.value === selectedCounsellors)?.label || "All"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {[{ value: "all", label: "All" }, ...consellors]?.map((option) => (
                            <Dropdown.Item key={option.value} onClick={() => handleFieldChange("counsellor", option.value)}>
                              {option.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>
                )}

                {branches && branches?.length > 0 && showBranches && (
                  <Col>
                    <Form.Group className="mb-0">
                      <Form.Label className="text-muted fw-semibold small">Branches</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="outline-secondary"
                          id="sort-field-dropdown"
                          className="medium text-truncate"
                          style={{ minWidth: "120px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                        >
                          {branches?.find((cre) => cre.value === selectedBranch)?.label || "All"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {[{ value: "all", label: "All" }, ...branches]?.map((option) => (
                            <Dropdown.Item key={option.value} onClick={() => handleFieldChange("branches", option.value)}>
                              {option.label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>
                )}

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
            <Row className="pt-3 pb-2">
              <Col md={2}>
                <FormInput name="start_date" label="From" type="date" value={dateRange.start_date} onChange={handleDateRangeChange} />
              </Col>
              <Col md={2}>
                <FormInput name="end_date" label="To" type="date" value={dateRange.end_date} onChange={handleDateRangeChange} />
              </Col>
              <Col md={3} className="mt-3">
                  <Button className="btn-sm btn-blue waves-effect waves-light" style={{ height: "42px"}} onClick={handleExportLead}>Export Lead</Button>
                  <Button className="btn-sm btn-danger waves-effect waves-light ms-2" style={{ height: "42px"}} onClick={() => setDateRange(initialDateState)}>Clear</Button>
              </Col>
            </Row>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
}

export default CustomLeadFilters;
