import { Button, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { FormInput } from "../../../../components";
import { intakeMonthOptions, intakeYearList } from "./data";
import ActionButton from "./ActionButton";

const StudyPreferenceRow = ({
  StudyPreference,
  countryName,
  handleStudyPreferenceChange,
  addMoreStudyPreference,
  removeStudyPreference,
  dropdownData,
}: any) => {
  console.log(StudyPreference);

  const renderStudyprefRows = (item: any, index: any) => (
    <Row key={index} className="mb-3 p-2 border-bottom rounded">
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
                index,
                "universityId",
                selectedOption.value
              )
            }
          />
          {item?.errors?.universityId && (
            <Form.Text className="text-danger">
              {item?.errors?.universityId}
            </Form.Text>
          )}
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
                index,
                "campusId",
                selectedOption.value
              )
            }
          />
          {item?.errors?.campusId && (
            <Form.Text className="text-danger">
              {item?.errors?.campusId}
            </Form.Text>
          )}
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
                index,
                "courseTypeId",
                selectedOption.value
              )
            }
          />
          {item?.errors?.courseTypeId && (
            <Form.Text className="text-danger">
              {item?.errors?.courseTypeId}
            </Form.Text>
          )}
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
                index,
                "streamId",
                selectedOption.value
              )
            }
          />
          {item?.errors?.streamId && (
            <Form.Text className="text-danger">
              {item?.errors?.streamId}
            </Form.Text>
          )}
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
                index,
                "courseId",
                selectedOption.value
              )
            }
          />
          {item?.errors?.courseId && (
            <Form.Text className="text-danger">
              {item?.errors?.courseId}
            </Form.Text>
          )}
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
                index,
                "intakeYear",
                selectedOption.value
              )
            }
          />
          {item?.errors?.intakeYear && (
            <Form.Text className="text-danger">
              {item?.errors?.intakeYear}
            </Form.Text>
          )}
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
                index,
                "intakeMonth",
                selectedOption.value
              )
            }
          />
          {item?.errors?.intakeMonth && (
            <Form.Text className="text-danger">
              {item?.errors?.intakeMonth}
            </Form.Text>
          )}
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
                index,
                "estimatedBudget",
                e.target.value
              )
            }
            min={0}
          />
          {item?.errors?.estimatedBudget && (
            <Form.Text className="text-danger">
              {item?.errors?.estimatedBudget}
            </Form.Text>
          )}
        </Form.Group>
      </Col>

      {/* Add More Button */}
      <Row className="mb-2">
        <ActionButton
          label="Remove"
          iconClass="mdi mdi-delete"
          colorClass="text-danger"
          onClick={() => removeStudyPreference(index, item.id ?? 0)}
        />
      </Row>
    </Row>
  );

  return (
    <Row>
      <h5 className="mb-4 text-uppercase">
        <i className="mdi mdi-account-circle me-1"></i> Study Preference Info -
        {countryName}
      </h5>

      {StudyPreference?.map((item: any, index: number) => (
        <>{renderStudyprefRows(item, index)}</>
      ))}
      <Row>
        <Row className="mb-2">
          <ActionButton
            label="Add More"
            iconClass="mdi mdi-plus"
            colorClass="btn-primary"
            onClick={addMoreStudyPreference}
          />
        </Row>
      </Row>
    </Row>
  );
};

export default StudyPreferenceRow;
