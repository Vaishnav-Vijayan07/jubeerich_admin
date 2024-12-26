import React, { memo, useState } from "react";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getDashboard } from "../redux/actions";

const styles: any = {
  filterItem: (isSelected: any) => ({
    padding: "10px 20px",
    borderRadius: "8px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: isSelected ? "#3f6eb4" : "#f1f1f1",
    color: isSelected ? "#fff" : "#333",
    fontWeight: isSelected ? "bold" : "normal",
    transition: "background-color 0.3s, color 0.3s",
  }),
  row: {
    marginTop: "20px",
  },
};

const CustomFilter = ({
  filterType,
  setFilterType,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedDate,
  setSelectedDate,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  filters,
  handleFilter,
}: any) => {
  const dispatch = useDispatch();

  const handleFilterApplyClick = (type: any) => {
    setFilterType(type);
  };

  // Get the week number for a given date

  const handleFilterApply = (filterType: any) => {
    handleFilter(filterType);
  };

  const handleClearFilter = () => {
    setFilterType("");
    setSelectedYear(new Date().getFullYear().toString());
    setSelectedMonth((new Date().getMonth() + 1).toString());
    setSelectedDate("");
    setCustomStartDate("");
    setCustomEndDate("");
    dispatch(getDashboard());
  };

  // Handle date selection and automatically set week
  const handleDateSelection = (date: string) => {
    setSelectedDate(date);
  };

  // Generate array of years (current year and 5 years back)
  const years = Array.from({ length: 6 }, (_, i) => (new Date().getFullYear() - i).toString());

  // Generate array of months
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: new Date(2024, i, 1).toLocaleString("default", { month: "long" }),
  }));

  const divComponent = () => {
    if (filterType === "custom") {
      return (
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>From Date</Form.Label>
              <Form.Control type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>To Date</Form.Label>
              <Form.Control type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
      );
    }
  };

  return (
    <Card className="bg-white">
      <Card.Body>
        <Form>
          {/* Filter Type Selection */}
          <Form.Group className="mb-3">
            <Row style={styles.row}>
              {filters.map((type: any) => (
                <Col key={type} md={2}>
                  <div style={styles.filterItem(filterType === type)} onClick={() => handleFilterApplyClick(type)}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                </Col>
              ))}
              <Col className="d-flex align-items-end justify-content-end">
                <Button type="button" onClick={handleClearFilter}>
                  Clear
                </Button>
              </Col>
            </Row>
          </Form.Group>

          {/* Custom Date Range */}
          {filterType === "custom" && (
            <Row className="mb-3" md={6}>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>From Date</Form.Label>
                  <Form.Control type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>To Date</Form.Label>
                  <Form.Control type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="primary" type="button" onClick={() => handleFilterApply("custom")}>
                  Apply
                </Button>
              </Col>
            </Row>
          )}

          {/* Weekly Selection */}
          {filterType === "weekly" && (
            <Row className="mb-3" md={6}>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Year</Form.Label>
                  <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Month</Form.Label>
                  <Form.Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" value={selectedDate} onChange={(e) => handleDateSelection(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="primary" type="button" onClick={() => handleFilterApply("weekly")}>
                  Apply
                </Button>
              </Col>
            </Row>
          )}

          {/* Monthly Selection */}
          {filterType === "monthly" && (
            <Row className="mb-3" md={6}>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Year</Form.Label>
                  <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Month</Form.Label>
                  <Form.Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="primary" type="button" onClick={() => handleFilterApply("monthly")}>
                  Apply
                </Button>
              </Col>
            </Row>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default memo(CustomFilter);
