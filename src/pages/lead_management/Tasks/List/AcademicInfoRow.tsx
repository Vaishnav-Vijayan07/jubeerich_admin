import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";
import React from "react";
import ActionButton from "./ActionButton";

interface AcademicInfo {
  id?: number;
  qualification: string;
  place: string;
  percentage: number;
  year_of_passing: number;
  backlogs?: number;
  errors?: any;
}

interface AcademicInfoRowProps {
  academicInfo: AcademicInfo[];
  handleAcademicInfoChange: (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  addMoreAcademicInfo: () => void;
  removeAcademicInfo: (index: number, id: number) => void;
}

const AcademicInfoRow: React.FC<AcademicInfoRowProps> = ({
  academicInfo,
  handleAcademicInfoChange,
  addMoreAcademicInfo,
  removeAcademicInfo,
}) => {
  console.log(academicInfo);

  return (
    <Row>
      <h5 className="mb-4 text-uppercase">
        <i className="mdi mdi-account-circle me-1"></i> Academic Info
      </h5>

      {/* Initial Education Entry */}
      <Row>
        {academicInfo.map((item, index) => (
          <Row key={index} className="p-2 border-bottom rounded">
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
                {item?.errors && (
                  <Form.Text className="text-danger">
                    {item?.errors.qualification}
                  </Form.Text>
                )}
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
                {item?.errors && (
                  <Form.Text className="text-danger">
                    {item?.errors.place}
                  </Form.Text>
                )}
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
                {item?.errors && (
                  <Form.Text className="text-danger">
                    {item?.errors.percentage}
                  </Form.Text>
                )}
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
                {item?.errors && (
                  <Form.Text className="text-danger">
                    {item?.errors.year_of_passing}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-2">
                <Form.Label>Backlogs</Form.Label>
                <FormInput
                  type="number"
                  name="backlogs"
                  placeholder="Enter backlogs"
                  value={item.backlogs}
                  onChange={(e) => handleAcademicInfoChange(index, e)}
                />
                {item?.errors && (
                  <Form.Text className="text-danger">
                    {item?.errors.backlogs}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            {academicInfo.length > 1 && (
              <ActionButton
                onClick={() => removeAcademicInfo(index, item.id ?? 0)}
                label="Remove"
                iconClass="mdi mdi-delete"
                colorClass="text-danger" // Make it red for "Remove"
              />
            )}
          </Row>
        ))}

        <Row className="mb-2">
          <ActionButton
            onClick={addMoreAcademicInfo}
            label="Add More"
            iconClass="mdi mdi-plus"
          />
        </Row>
      </Row>
    </Row>
  );
};

export default AcademicInfoRow;
