import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";

const AcademicInfoRow = ({
  academicInfo,
  handleAcademicInfoChange,
  validationErrors,
  addMoreAcademicInfo,
  removeAcademicInfo,
}: any) => {
  return (
    <Row>
      <h5 className="mb-4 text-uppercase">
        <i className="mdi mdi-account-circle me-1"></i> Academic Info
      </h5>

      {/* Initial Education Entry */}
      <Row>
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="qualification">
            <Form.Label>
              <span className="text-danger">* </span>Qualification
            </Form.Label>
            <FormInput
              type="text"
              name="qualification"
              placeholder="Enter qualification"
              value={academicInfo?.[0]?.qualification || ""}
              onChange={(e) => handleAcademicInfoChange(0, e)}
            />
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="place">
            <Form.Label>
              <span className="text-danger">* </span>Place
            </Form.Label>
            <FormInput
              type="text"
              name="place"
              placeholder="Enter place"
              value={academicInfo?.[0]?.place || ""}
              onChange={(e) => handleAcademicInfoChange(0, e)}
            />
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="percentage">
            <Form.Label>
              <span className="text-danger">* </span>Percentage
            </Form.Label>
            <FormInput
              type="number"
              name="percentage"
              placeholder="Enter percentage"
              value={academicInfo?.[0]?.percentage || ""}
              onChange={(e) => handleAcademicInfoChange(0, e)}
              min={0}
            />
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="year_of_passing">
            <Form.Label>
              <span className="text-danger">* </span>Year of passing
            </Form.Label>
            <FormInput
              type="number"
              name="year_of_passing"
              placeholder="Enter year of passing"
              value={academicInfo?.[0]?.year_of_passing || ""}
              onChange={(e) => handleAcademicInfoChange(0, e)}
              min={0}
            />
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-2" controlId="backlogs">
            <Form.Label>Backlogs</Form.Label>
            <FormInput
              type="number"
              name="backlogs"
              placeholder="Enter backlogs"
              value={academicInfo?.[0]?.backlogs}
              onChange={(e) => handleAcademicInfoChange(0, e)}
            />
          </Form.Group>
        </Col>
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

      {academicInfo?.length > 1 &&
        academicInfo?.slice(1).map((item: any, index: any) => (
          <Row key={index + 1}>
            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3" controlId="qualification">
                <Form.Label>
                  <span className="text-danger">* </span>Qualification
                </Form.Label>
                <FormInput
                  type="text"
                  name="qualification"
                  placeholder="Enter qualification"
                  value={item?.qualification || ""}
                  onChange={(e) => handleAcademicInfoChange(index + 1, e)}
                />
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3" controlId="place">
                <Form.Label>
                  <span className="text-danger">* </span>Place
                </Form.Label>
                <FormInput
                  type="text"
                  name="place"
                  placeholder="Enter place"
                  value={item?.place || ""}
                  onChange={(e) => handleAcademicInfoChange(index + 1, e)}
                />
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3" controlId="percentage">
                <Form.Label>
                  <span className="text-danger">* </span>Percentage
                </Form.Label>
                <FormInput
                  type="number"
                  name="percentage"
                  placeholder="Enter percentage"
                  value={item?.percentage || ""}
                  onChange={(e) => handleAcademicInfoChange(index + 1, e)}
                  min={0}
                />
                {validationErrors.percentage && (
                  <Form.Text className="text-danger">
                    {validationErrors.percentage}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3" controlId="year_of_passing">
                <Form.Label>
                  <span className="text-danger">* </span>Year of passing
                </Form.Label>
                <FormInput
                  type="number"
                  name="year_of_passing"
                  placeholder="Enter year of passing"
                  value={item?.year_of_passing || ""}
                  onChange={(e) => handleAcademicInfoChange(index + 1, e)}
                  min={0}
                />
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-2" controlId="backlogs">
                <Form.Label>Backlogs</Form.Label>
                <FormInput
                  type="number"
                  name="backlogs"
                  placeholder="Enter backlogs"
                  value={item?.backlogs}
                  onChange={(e) => handleAcademicInfoChange(index + 1, e)}
                />
              </Form.Group>
            </Col>

            {academicInfo.length > 1 && (
              <Row className="mb-2">
                <Col className="d-flex align-items-center gap-1">
                  <i
                    className="text-danger mdi mdi-minus-circle-outline fs-3 ps-1"
                    onClick={() => {
                      const itemId = item.id ?? 0;
                      removeAcademicInfo(index + 1, itemId);
                    }}
                  ></i>
                  <span className="text-danger">Remove</span>
                </Col>
              </Row>
            )}
          </Row>
        ))}
    </Row>
  );
};

export default AcademicInfoRow;
