import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";
import React from "react";

interface AcademicInfo {
  id?: number;
  qualification: string;
  place: string;
  percentage: number;
  year_of_passing: number;
  backlogs?: number;
}

interface AcademicInfoRowProps {
  academicInfo: AcademicInfo[];
  handleAcademicInfoChange: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  validationErrors?: Record<string, string>;
  addMoreAcademicInfo: () => void;
  removeAcademicInfo: (index: number, id: number) => void;
}

const AcademicInfoRow: React.FC<AcademicInfoRowProps> = ({
  academicInfo,
  handleAcademicInfoChange,
  validationErrors,
  addMoreAcademicInfo,
  removeAcademicInfo,
}) => {
  return (
    <Row>
      <h5 className="mb-4 text-uppercase">
        <i className="mdi mdi-account-circle me-1"></i> Academic Info
      </h5>

      {/* Initial Education Entry */}
      <Row>
        {academicInfo.map((item, index) => (
          <React.Fragment key={index}>
            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <span className="text-danger">* </span>Qualification
                </Form.Label>
                <FormInput
                  type="text"
                  name="qualification"
                  placeholder="Enter qualification"
                  value={item.qualification || ""}
                  onChange={(e) => handleAcademicInfoChange(index, e)}
                />
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <span className="text-danger">* </span>Place
                </Form.Label>
                <FormInput
                  type="text"
                  name="place"
                  placeholder="Enter place"
                  value={item.place || ""}
                  onChange={(e) => handleAcademicInfoChange(index, e)}
                />
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <span className="text-danger">* </span>Percentage
                </Form.Label>
                <FormInput
                  type="number"
                  name="percentage"
                  placeholder="Enter percentage"
                  value={item.percentage || ""}
                  onChange={(e) => handleAcademicInfoChange(index, e)}
                  min={0}
                />
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <span className="text-danger">* </span>Year of passing
                </Form.Label>
                <FormInput
                  type="number"
                  name="year_of_passing"
                  placeholder="Enter year of passing"
                  value={item.year_of_passing || ""}
                  onChange={(e) => handleAcademicInfoChange(index, e)}
                  min={0}
                />
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-2">
                <Form.Label>Backlogs</Form.Label>
                <FormInput
                  type="number"
                  name="backlogs"
                  placeholder="Enter backlogs"
                  value={item.backlogs || ""}
                  onChange={(e) => handleAcademicInfoChange(index, e)}
                />
              </Form.Group>
            </Col>

            {academicInfo.length > 1 && (
              <Col className="d-flex align-items-center gap-1 mb-2">
                <i
                  className="text-danger mdi mdi-minus-circle-outline fs-3 ps-1"
                  onClick={() => {
                    const itemId = item.id ?? 0;
                    removeAcademicInfo(index, itemId);
                  }}
                ></i>
                <span className="text-danger">Remove</span>
              </Col>
            )}
          </React.Fragment>
        ))}

        <Row className="mb-2">
          <Col className="d-flex align-items-center gap-1">
            <i
              className="text-primary mdi mdi-plus-circle-outline fs-3 ps-1"
              onClick={addMoreAcademicInfo}
            ></i>
            <span className="text-primary">Add More</span>
          </Col>
        </Row>
      </Row>
    </Row>
  );
};

export default AcademicInfoRow;
