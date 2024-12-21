import React, { useState } from "react";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import calender from "../assets/images/icons/calendar.svg";

type FilterType = "today" | "weekly" | "monthly" | "custom";

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

const CustomFilter: React.FC = () => {
  const [filterType, setFilterType] = useState<FilterType>("today");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const filters = ["today", "weekly", "monthly", "custom"];

  const handleFilterClick = (type: any) => {
    setFilterType(type);
  };

  const handleFilter = (type: any) => {
    console.log("type", type);
  };

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
            <Row style={styles.row}>
              {filters.map((type) => (
                <Col key={type} md={3}>
                  <div style={styles.filterItem(filterType === type)} onClick={() => handleFilterClick(type)}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                </Col>
              ))}
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
                <Button variant="primary" type="button" onClick={()=>handleFilter("custom")}>
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
              <Button variant="primary" type="button" onClick={()=>handleFilter("weekly")}>
                Apply
              </Button>
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
              <Button variant="primary" type="button" onClick={()=>handleFilter("monthly")}>
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

export default CustomFilter;
