import { Button, Card, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { customStyles } from "../../../../constants";

const statusOptions = [
  { value: "1", label: "In Progress" },
  { value: "2", label: "Approved" },
  { value: "3", label: "Rejected" },
];

const sourceOptions = [
  { value: "1", label: "Walkin" },
  { value: "2", label: "Email" },
  { value: "3", label: "Social Media" },
];

const assignedByOptions = [
  { value: "1", label: "Counsellor" },
  { value: "2", label: "Team Lead" },
  { value: "3", label: "Regional Manager" },
];

const employeeOptions = [
  { value: "1", label: "John Doe" },
  { value: "2", label: "Jane Doe" },
  { value: "3", label: "Jhon Smith" },
];

const countryOptions = [
  { value: "1", label: "India" },
  { value: "2", label: "USA" },
  { value: "3", label: "Canada" },
];

const FiltersSection = () => {
  return (
    <>
      <Card>
        <Card.Body>
          <h4 className="header-title mb-3">Filters</h4>
          <Row className="mb-3">
            <Col md={2}>
              <Form.Group className="mb-3" controlId="status_id">
                <Form.Label>Status</Form.Label>
                <Select
                  styles={customStyles}
                  className="react-select react-select-container select-wrapper"
                  classNamePrefix="react-select"
                  name="status_id"
                  options={statusOptions}
                  //   value={selectedStatus}
                  //   onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group className="mb-3" controlId="source_id">
                <Form.Label>Source</Form.Label>
                <Select
                  styles={customStyles}
                  className="react-select react-select-container select-wrapper"
                  classNamePrefix="react-select"
                  name="source_id"
                  options={sourceOptions}
                  //   value={selectedSourceFilter}
                  //   onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group className="mb-3" controlId="source_id">
                <Form.Label>Assigned By</Form.Label>
                <Select
                  styles={customStyles}
                  className="react-select react-select-container select-wrapper"
                  classNamePrefix="react-select"
                  name="source_id"
                    options={assignedByOptions}
                  //   value={selectedSourceFilter}
                  //   onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group className="mb-3" controlId="source_id">
                <Form.Label>Employee</Form.Label>
                <Select
                  styles={customStyles}
                  className="react-select react-select-container select-wrapper"
                  classNamePrefix="react-select"
                  name="source_id"
                    options={employeeOptions}
                  //   value={selectedSourceFilter}
                  //   onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group className="mb-3" controlId="preferredCountries">
                <Form.Label>Country</Form.Label>
                <Select
                  styles={customStyles}
                  className="react-select react-select-container select-wrapper"
                  classNamePrefix="react-select"
                  name="preferredCountries"
                    options={countryOptions}
                  //   value={selectedCountryFilter}
                  //   onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>

            <Col md={2} style={{ alignSelf: "center" }}>
              <Form.Group className="align-items-center">
                <Button
                  style={{ margin: "auto" }}
                  variant="primary"
                  //   onClick={handleClear}
                >
                  Clear
                </Button>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default FiltersSection;
