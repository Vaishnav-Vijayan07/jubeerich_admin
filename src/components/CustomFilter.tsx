import React, { useState } from "react";
import { Card, Form, Row, Col, Button } from "react-bootstrap";

type FilterType = "today" | "weekly" | "monthly" | "custom";

const CustomFilter: React.FC = () => {
  const [filterType, setFilterType] = useState<FilterType>("today");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<string>("");

  // Get the week number for a given date
  const getWeekNumber = (date: Date): string => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7).toString();
  };

  // Handle date selection and automatically set week
  const handleDateSelection = (date: string) => {
    setSelectedDate(date);
    const selectedDateObj = new Date(date);
    setSelectedWeek(getWeekNumber(selectedDateObj));
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
            <Row>
              {["today", "weekly", "monthly", "custom"].map((type) => (
                <Col key={type} xs={6} md={3}>
                  <Form.Check
                    type="radio"
                    id={`filter-${type}`}
                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                    name="filterType"
                    checked={filterType === type}
                    onChange={() => setFilterType(type as FilterType)}
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>

          {/* Custom Date Range */}
          {filterType === "custom" && (
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
          )}

          {/* Weekly Selection */}
          {filterType === "weekly" && (
            <Row className="mb-3">
              <Col md={4}>
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
              <Col md={4}>
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
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date" value={selectedDate} onChange={(e) => handleDateSelection(e.target.value)} />
                </Form.Group>
              </Col>
              {selectedWeek && (
                <Col md={12} className="mt-2">
                  <p className="mb-0">Selected Week: Week {selectedWeek}</p>
                </Col>
              )}
            </Row>
          )}

          {/* Monthly Selection */}
          {filterType === "monthly" && (
            <Row className="mb-3">
              <Col md={6}>
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
              <Col md={6}>
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
            </Row>
          )}
          <Row className="float-end">
            <Col>
              <Button className="btn-sm">Apply</Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CustomFilter;
