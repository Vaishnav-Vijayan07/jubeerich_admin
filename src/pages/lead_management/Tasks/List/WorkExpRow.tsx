import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";
import moment from "moment";

const WorkExpRow = ({
  workExperience,
  handleWorkExperienceChange,
  addMoreWorkExperience,
  removeWorkExperience,
}: any) => {
  return (
    <Row>
      <h5 className="mb-4 text-uppercase">
        <i className="mdi mdi-account-circle me-1"></i>Work Experience
      </h5>

      {/* Initial Education Entry */}
      <Row>
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="qualification">
            <Form.Label>Years</Form.Label>
            <FormInput
              type="number"
              name="years"
              placeholder="Enter work experience"
              key="years"
              value={workExperience?.[0]?.years || ""}
              onChange={(e) => handleWorkExperienceChange(0, e)}
              min={0}
            />
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="company">
            <Form.Label>Company</Form.Label>
            <FormInput
              type="text"
              name="company"
              placeholder="Enter company"
              key="company"
              value={workExperience?.[0]?.company || ""}
              onChange={(e) => handleWorkExperienceChange(0, e)}
            />
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="designation">
            <Form.Label>Designation</Form.Label>
            <FormInput
              type="text"
              name="designation"
              placeholder="Enter designation"
              key="designation"
              value={workExperience?.[0]?.designation || ""}
              onChange={(e) => handleWorkExperienceChange(0, e)}
            />
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="dob">
            <Form.Label>
              <span className="text-danger">*</span> From
            </Form.Label>
            <FormInput
              type="date"
              name="from"
              placeholder="Select date of birth"
              key="from"
              defaultValue={moment(workExperience?.[0]?.from).format(
                "YYYY-MM-DD"
              )}
              value={moment(workExperience?.[0]?.from).format("YYYY-MM-DD")}
              onChange={(e) => handleWorkExperienceChange(0, e)}
            />
          </Form.Group>
        </Col>

        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId="dob">
            <Form.Label>
              <span className="text-danger">*</span> To
            </Form.Label>
            <FormInput
              type="date"
              name="to"
              placeholder="Select date of birth"
              key="to"
              defaultValue={moment(workExperience?.[0]?.to).format(
                "YYYY-MM-DD"
              )}
              value={moment(workExperience?.[0]?.to).format("YYYY-MM-DD")}
              onChange={(e) => handleWorkExperienceChange(0, e)}
            />
          </Form.Group>
        </Col>
        <Row className="mb-2">
          <Col className="d-flex align-items-center gap-1">
            <i
              className="text-primary mdi mdi-plus-circle-outline fs-3 ps-1"
              onClick={addMoreWorkExperience}
            ></i>
            <span className="text-primary">Add More</span>
          </Col>
        </Row>
      </Row>

      {workExperience?.length > 1 &&
        workExperience.slice(1).map((item: any, index: any) => (
          <Row key={index + 1}>
            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3" controlId="qualification">
                <Form.Label>Work Experience</Form.Label>
                <FormInput
                  type="number"
                  name="years"
                  placeholder="Enter work experience"
                  key="years"
                  value={item?.years || ""}
                  onChange={(e) => handleWorkExperienceChange(index + 1, e)}
                  min={0}
                />
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3" controlId="company">
                <Form.Label>Company</Form.Label>
                <FormInput
                  type="text"
                  name="company"
                  placeholder="Enter company"
                  key="company"
                  value={item?.company || ""}
                  onChange={(e) => handleWorkExperienceChange(index + 1, e)}
                />
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3" controlId="designation">
                <Form.Label>Designation</Form.Label>
                <FormInput
                  type="text"
                  name="designation"
                  placeholder="Enter designation"
                  key="designation"
                  value={item?.designation || ""}
                  onChange={(e) => handleWorkExperienceChange(index + 1, e)}
                />
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3" controlId="dob">
                <Form.Label>
                  <span className="text-danger">*</span> From
                </Form.Label>
                <FormInput
                  type="date"
                  name="from"
                  placeholder="Select date of birth"
                  key="from"
                  defaultValue={moment(item?.from).format("YYYY-MM-DD")}
                  value={moment(item?.from).format("YYYY-MM-DD")}
                  onChange={(e) => handleWorkExperienceChange(index + 1, e)}
                />
              </Form.Group>
            </Col>

            <Col md={4} lg={4} xl={4} xxl={4}>
              <Form.Group className="mb-3" controlId="dob">
                <Form.Label>
                  <span className="text-danger">*</span> To
                </Form.Label>
                <FormInput
                  type="date"
                  name="to"
                  placeholder="Select date of birth"
                  key="to"
                  defaultValue={moment(item?.to).format("YYYY-MM-DD")}
                  value={moment(item?.to).format("YYYY-MM-DD")}
                  onChange={(e) => handleWorkExperienceChange(index + 1, e)}
                />
              </Form.Group>
            </Col>
            {workExperience.length > 1 && (
              <Row className="mb-2">
                <Col className="d-flex align-items-center gap-1">
                  <i
                    className="text-danger mdi mdi-minus-circle-outline fs-3 ps-1"
                    onClick={() => {
                      const itemId = item.id ?? 0;
                      removeWorkExperience(index + 1, itemId);
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

export default WorkExpRow;
