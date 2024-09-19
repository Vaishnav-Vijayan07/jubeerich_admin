import { Button, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { FormInput } from "../../../../components";
import { intakeMonthOptions, intakeYearList } from "./data";

const StudyPreferenceRow = ({
  StudyPreference,
  countryName,
  handleStudyPreferenceChange,
  addMoreStudyPreference,
  removeStudyPreference,
  dropdownData,
  loading,
}: any) => {
  console.log(StudyPreference);
  console.log(countryName);

  return (
    <Row className={loading ? "opacity-25" : ""}>
      <h5 className="mb-4 text-uppercase">
        <i className="mdi mdi-account-circle me-1"></i> Study Preference Info -
        {countryName}
      </h5>

      <Row>
        <Col xl={6} xxl={4}>
          <Form.Group className="mb-3" controlId="universityId">
            <Form.Label>University</Form.Label>
            <Select
              className="react-select react-select-container"
              classNamePrefix="react-select"
              options={dropdownData?.universities}
              value={
                StudyPreference?.[0]?.universityId
                  ? {
                      label: dropdownData.universities.find(
                        (u: any) =>
                          u.value === StudyPreference?.[0]?.universityId
                      )?.label,
                      value: StudyPreference?.[0]?.universityId,
                    }
                  : null
              }
              placeholder="Select University"
              name="universityId"
              onChange={(selectedOption: any) =>
                handleStudyPreferenceChange(
                  0,
                  "universityId",
                  selectedOption.value
                )
              }
            />
          </Form.Group>
        </Col>

        <Col xl={6} xxl={4}>
          <Form.Group className="mb-3" controlId="campusId">
            <Form.Label>Campus</Form.Label>
            <Select
              className="react-select react-select-container"
              classNamePrefix="react-select"
              options={dropdownData?.campuses}
              value={
                StudyPreference?.[0]?.campusId
                  ? {
                      label: dropdownData.campuses.find(
                        (c: any) => c.value === StudyPreference?.[0]?.campusId
                      )?.label,
                      value: StudyPreference?.[0]?.campusId,
                    }
                  : null
              }
              placeholder="Select Campus"
              name="campusId"
              onChange={(selectedOption: any) =>
                handleStudyPreferenceChange(0, "campusId", selectedOption.value)
              }
            />
          </Form.Group>
        </Col>

        <Col xl={6} xxl={4}>
          <Form.Group className="mb-3" controlId="courseTypeId">
            <Form.Label>Course Type</Form.Label>
            <Select
              className="react-select react-select-container"
              classNamePrefix="react-select"
              options={dropdownData?.courseTypes}
              value={
                StudyPreference?.[0]?.courseTypeId
                  ? {
                      label: dropdownData.courseTypes.find(
                        (c: any) =>
                          c.value === StudyPreference?.[0]?.courseTypeId
                      )?.label,
                      value: StudyPreference?.[0]?.courseTypeId,
                    }
                  : null
              }
              placeholder="Select Course Type"
              name="courseTypeId"
              onChange={(selectedOption: any) =>
                handleStudyPreferenceChange(
                  0,
                  "courseTypeId",
                  selectedOption.value
                )
              }
            />
          </Form.Group>
        </Col>

        <Col xl={6} xxl={4}>
          <Form.Group className="mb-3" controlId="streamId">
            <Form.Label>Stream</Form.Label>
            <Select
              className="react-select react-select-container"
              classNamePrefix="react-select"
              options={dropdownData?.streams}
              value={
                StudyPreference?.[0]?.streamId
                  ? {
                      label: dropdownData.streams.find(
                        (s: any) => s.value === StudyPreference?.[0]?.streamId
                      )?.label,
                      value: StudyPreference?.[0]?.streamId,
                    }
                  : null
              }
              placeholder="Select Stream"
              name="streamId"
              onChange={(selectedOption: any) =>
                handleStudyPreferenceChange(0, "streamId", selectedOption.value)
              }
            />
          </Form.Group>
        </Col>

        <Col xl={6} xxl={4}>
          <Form.Group className="mb-3" controlId="courseId">
            <Form.Label>Course</Form.Label>
            <Select
              className="react-select react-select-container"
              classNamePrefix="react-select"
              options={dropdownData?.courses}
              value={
                StudyPreference?.[0]?.courseId
                  ? {
                      label: dropdownData.courses.find(
                        (c: any) => c.value === StudyPreference?.[0]?.courseId
                      )?.label,
                      value: StudyPreference?.[0]?.courseId,
                    }
                  : null
              }
              placeholder="Select Course"
              name="courseId"
              onChange={(selectedOption: any) =>
                handleStudyPreferenceChange(0, "courseId", selectedOption.value)
              }
            />
          </Form.Group>
        </Col>

        <Col xl={6} xxl={4}>
          <Form.Group className="mb-3" controlId="intakeYear">
            <Form.Label>Intake Year</Form.Label>
            <Select
              className="react-select react-select-container"
              classNamePrefix="react-select"
              options={intakeYearList}
              value={
                StudyPreference?.[0]?.intakeYear
                  ? {
                      label: intakeYearList.find(
                        (m: any) => m.value === StudyPreference?.[0]?.intakeYear
                      )?.label,
                      value: StudyPreference?.[0]?.intakeYear,
                    }
                  : null
              }
              placeholder="Select Intake Year"
              name="intakeYear"
              onChange={(selectedOption: any) =>
                handleStudyPreferenceChange(
                  0,
                  "intakeYear",
                  selectedOption.value
                )
              }
            />
          </Form.Group>
        </Col>

        <Col xl={6} xxl={4}>
          <Form.Group className="mb-3" controlId="intakeMonth">
            <Form.Label>Intake Month</Form.Label>
            <Select
              className="react-select react-select-container"
              classNamePrefix="react-select"
              options={intakeMonthOptions}
              value={
                StudyPreference?.[0]?.intakeMonth
                  ? {
                      label: intakeMonthOptions.find(
                        (m: any) =>
                          m.value === StudyPreference?.[0]?.intakeMonth
                      )?.label,
                      value: StudyPreference?.[0]?.intakeMonth,
                    }
                  : null
              }
              placeholder="Select Intake Month"
              name="intakeMonth"
              onChange={(selectedOption: any) =>
                handleStudyPreferenceChange(
                  0,
                  "intakeMonth",
                  selectedOption.value
                )
              }
            />
          </Form.Group>
        </Col>

        <Col xl={6} xxl={4}>
          <Form.Group className="mb-3" controlId="estimatedBudget">
            <Form.Label>Estimated Budget</Form.Label>
            <FormInput
              type="number"
              name="estimatedBudget"
              placeholder="Enter estimated budget"
              key="estimatedBudget"
              value={StudyPreference?.[0]?.estimatedBudget || ""}
              onChange={(e) =>
                handleStudyPreferenceChange(
                  0,
                  "estimatedBudget",
                  e.target.value
                )
              }
              min={0}
            />
          </Form.Group>
        </Col>

        {/* Add More Button */}
        <Row className="mb-2">
          <Col className="d-flex align-items-center gap-1">
            <i
              className="text-primary mdi mdi-plus-circle-outline fs-3 ps-1"
              onClick={addMoreStudyPreference}
            ></i>
            <span className="text-primary">Add More</span>
          </Col>
        </Row>
      </Row>

      {StudyPreference?.length > 1 &&
        StudyPreference.slice(1).map((item: any, index: any) => (
          <Row key={index + 1}>
            <Col xl={6} xxl={4}>
              <Form.Group className="mb-3" controlId="universityId">
                <Form.Label>University</Form.Label>
                <Select
                  className="react-select react-select-container"
                  classNamePrefix="react-select"
                  options={dropdownData?.universities}
                  value={
                    item?.universityId
                      ? {
                          label: dropdownData.universities.find(
                            (u: any) => u.value === item.universityId
                          )?.label,
                          value: item.universityId,
                        }
                      : null
                  }
                  placeholder="Select University"
                  name="universityId"
                  onChange={(selectedOption: any) =>
                    handleStudyPreferenceChange(
                      index + 1,
                      "universityId",
                      selectedOption.value
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col xl={6} xxl={4}>
              <Form.Group className="mb-3" controlId="campusId">
                <Form.Label>Campus</Form.Label>
                <Select
                  className="react-select react-select-container"
                  classNamePrefix="react-select"
                  options={dropdownData?.campuses}
                  value={
                    item?.campusId
                      ? {
                          label: dropdownData.campuses.find(
                            (c: any) => c.value === item.campusId
                          )?.label,
                          value: item.campusId,
                        }
                      : null
                  }
                  placeholder="Select Campus"
                  name="campusId"
                  onChange={(selectedOption: any) =>
                    handleStudyPreferenceChange(
                      index + 1,
                      "campusId",
                      selectedOption.value
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col xl={6} xxl={4}>
              <Form.Group className="mb-3" controlId="courseTypeId">
                <Form.Label>Course Type</Form.Label>
                <Select
                  className="react-select react-select-container"
                  classNamePrefix="react-select"
                  options={dropdownData?.courseTypes}
                  value={
                    item?.courseTypeId
                      ? {
                          label: dropdownData.courseTypes.find(
                            (c: any) => c.value === item.courseTypeId
                          )?.label,
                          value: item.courseTypeId,
                        }
                      : null
                  }
                  placeholder="Select Course Type"
                  name="courseTypeId"
                  onChange={(selectedOption: any) =>
                    handleStudyPreferenceChange(
                      index + 1,
                      "courseTypeId",
                      selectedOption.value
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col xl={6} xxl={4}>
              <Form.Group className="mb-3" controlId="streamId">
                <Form.Label>Stream</Form.Label>
                <Select
                  className="react-select react-select-container"
                  classNamePrefix="react-select"
                  options={dropdownData?.streams}
                  value={
                    item?.streamId
                      ? {
                          label: dropdownData.streams.find(
                            (s: any) => s.value === item.streamId
                          )?.label,
                          value: item.streamId,
                        }
                      : null
                  }
                  placeholder="Select Stream"
                  name="streamId"
                  onChange={(selectedOption: any) =>
                    handleStudyPreferenceChange(
                      index + 1,
                      "streamId",
                      selectedOption.value
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col xl={6} xxl={4}>
              <Form.Group className="mb-3" controlId="courseId">
                <Form.Label>Course</Form.Label>
                <Select
                  className="react-select react-select-container"
                  classNamePrefix="react-select"
                  options={dropdownData?.courses}
                  value={
                    item?.courseId
                      ? {
                          label: dropdownData.courses.find(
                            (c: any) => c.value === item.courseId
                          )?.label,
                          value: item.courseId,
                        }
                      : null
                  }
                  placeholder="Select Course"
                  name="courseId"
                  onChange={(selectedOption: any) =>
                    handleStudyPreferenceChange(
                      index + 1,
                      "courseId",
                      selectedOption.value
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col xl={6} xxl={4}>
              <Form.Group className="mb-3" controlId="intakeYear">
                <Form.Label>Intake Year</Form.Label>
                <Select
                  className="react-select react-select-container"
                  classNamePrefix="react-select"
                  options={intakeYearList}
                  value={
                    item.intakeYear
                      ? {
                          label: intakeYearList.find(
                            (m: any) => m.value === item.intakeYear
                          )?.label,
                          value: item.intakeYear,
                        }
                      : null
                  }
                  placeholder="Select Intake Year"
                  name="intakeYear"
                  onChange={(selectedOption: any) =>
                    handleStudyPreferenceChange(
                      index + 1,
                      "intakeYear",
                      selectedOption.value
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col xl={6} xxl={4}>
              <Form.Group className="mb-3" controlId="intakeMonth">
                <Form.Label>Intake Month</Form.Label>
                <Select
                  className="react-select react-select-container"
                  classNamePrefix="react-select"
                  options={intakeMonthOptions}
                  value={
                    item?.intakeMonth
                      ? {
                          label: intakeMonthOptions.find(
                            (m: any) => m.value === item.intakeMonth
                          )?.label,
                          value: item.intakeMonth,
                        }
                      : null
                  }
                  placeholder="Select Intake Month"
                  name="intakeMonth"
                  onChange={(selectedOption: any) =>
                    handleStudyPreferenceChange(
                      index + 1,
                      "intakeMonth",
                      selectedOption.value
                    )
                  }
                />
              </Form.Group>
            </Col>

            <Col xl={6} xxl={4}>
              <Form.Group className="mb-3" controlId="estimatedBudget">
                <Form.Label>Estimated Budget</Form.Label>
                <FormInput
                  type="number"
                  name="estimatedBudget"
                  placeholder="Enter estimated budget"
                  key="estimatedBudget"
                  value={item?.estimatedBudget || ""}
                  onChange={(e) =>
                    handleStudyPreferenceChange(
                      index + 1,
                      "estimatedBudget",
                      e.target.value
                    )
                  }
                  min={0}
                />
              </Form.Group>
            </Col>

            {/* Add More Button */}
            <Row className="mb-2">
              <Col className="d-flex align-items-center gap-1">
                <i
                  className="text-danger mdi mdi-minus-circle-outline fs-3 ps-1"
                  onClick={() => {
                    const itemId = item.id ?? 0;
                    removeStudyPreference(index + 1, itemId);
                  }}
                ></i>
                <span className="text-danger">Remove</span>
              </Col>
            </Row>
          </Row>
        ))}
    </Row>
  );
};

export default StudyPreferenceRow;
