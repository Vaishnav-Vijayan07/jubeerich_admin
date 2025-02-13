import React, { useState } from "react";
import { Button, Col, Form, Dropdown } from "react-bootstrap";

type SortOption = {
  value: string;
  label: string;
};

type Props = {
  onSortChange?: (type: string, value: string) => void;
  onClear?: () => void;
  onApplySort?: () => void;
  isSortApplied?: boolean;
  selectedField?: string;
  sortOrder?: "asc" | "desc";
};

const sortOptions: SortOption[] = [
  { value: "created_at", label: "Created Date" },
  { value: "lead_received_date", label: "Lead Received Date" },
  { value: "full_name", label: "Name" },
  { value: "id", label: "id" },
  // Add more sort options as needed
];

function SortBox({ onSortChange, onClear, onApplySort, selectedField, sortOrder }: Props) {
  const handleFieldChange = (value: string) => {
    onSortChange?.("order", value);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrder = e.target.value as "asc" | "desc";
    onSortChange?.("type", newOrder);
  };

  const handleApplySort = () => {
    onApplySort?.();
  };

  const handleClear = () => {
    onClear?.();
  };

  return (
    <Col md={6} className="d-flex align-items-center justify-content-between gap-3 py-2 px-3 bg-light rounded">
      <Form.Group className="mb-0">
        <Form.Label className="text-muted fw-semibold small">Sort By</Form.Label>
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" id="sort-field-dropdown" className="small text-truncate" style={{ minWidth: "120px" }}>
            {selectedField ? sortOptions.find((opt) => opt.value === selectedField)?.label : "Choose"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {sortOptions.map((option) =>
              option.value !== "id" ? (
                <Dropdown.Item key={option.value} onClick={() => handleFieldChange(option.value)} active={selectedField === option.value}>
                  {option.label}
                </Dropdown.Item>
              ) : null
            )}
          </Dropdown.Menu>
        </Dropdown>
      </Form.Group>

      <Form.Group className="mb-0">
        <Form.Label className="text-muted fw-semibold small">Order</Form.Label>
        <Form.Select value={sortOrder} onChange={handleOrderChange} className="small" style={{ minWidth: "120px" }} disabled={!selectedField}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Form.Select>
      </Form.Group>
      <div className="align-self-end d-flex gap-2">
        <Button variant="primary" size="sm" onClick={handleApplySort} disabled={!selectedField} className=" fw-semibold ms-2">
          Apply
        </Button>
      </div>
    </Col>
  );
}

export default SortBox;
