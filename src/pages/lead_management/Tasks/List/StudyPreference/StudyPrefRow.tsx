import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Select from "react-select";
import { FormInput } from "../../../../../components";
import { intakeMonthOptions, intakeYearList } from ".././data";
import ActionButton from ".././ActionButton";
import { useState } from "react";
import useRemoveFromApi from "../../../../../hooks/useRemoveFromApi";
import useSaveStudyPreferenceData from "../../../../../hooks/useSaveStudyPreferenceData";
import validateFields from "../../../../../helpers/validateHelper";
import StatusBadge from "./StatusBadge";
import { formatString } from "../../../../../utils/formatData";

const StudyPreferenceRow = ({ studyPreference, countryName, dropdownData, studyPreferenceId, isEditable }: any) => {
  const { loading: deleteLoading, removeFromApi } = useRemoveFromApi();
  const { saveLoading, saveStudyPreferenceData } = useSaveStudyPreferenceData();

  console.log("studyPreference ===>", studyPreference);

  const [studyPreferenceData, setStudyPreferenceData] = useState<any>(
    studyPreference.length > 0
      ? studyPreference
      : [
          {
            id: null,
            universityId: "",
            campusId: "",
            courseTypeId: "",
            streamId: "",
            courseId: "",
            intakeYear: "",
            intakeMonth: "",
            estimatedBudget: "",
            errors: {},
          },
        ]
  );

  console.log("studyPreferenceData ===>", studyPreferenceData);

  console.log(studyPreference.length);
  console.log(studyPreferenceData.length);

  const renderStudyprefRows = (item: any, index: any, readOnly: boolean) => (
    <Row key={index} className="mb-3 border-bottom pe-0">
      {item?.applications?.length > 0 && (
        <Row className="pb-3 pe-0">
          <div className="d-flex gap-2 p-3 justify-content-between" style={{ backgroundColor: "#F8F8F8" }}>
            <div className="d-flex gap-2 align-content-center justify-content-center">
              <strong>Application Status:</strong>
              <StatusBadge status={formatString(item?.applications[0].application_status)} />
            </div>
            <div className="d-flex gap-2 align-content-center justify-content-center">
              <strong>KYC Status:</strong>
              <StatusBadge status={formatString(item?.applications[0].kyc_status)} />
            </div>
          </div>
        </Row>
      )}

      <Row className="pe-0">
        <Col md={6} xl={4} xxl={3}>
          <Form.Group className="mb-3" controlId="universityId">
            <Form.Label><span className="text-danger">*</span> University</Form.Label>
            <Select
              className="react-select react-select-container"
              classNamePrefix="react-select"
              // isDisabled={!readOnly}
              options={dropdownData?.universities}
              value={
                item?.universityId
                  ? {
                      label: dropdownData.universities.find((u: any) => u.value === item.universityId)?.label,
                      value: item.universityId,
                    }
                  : null
              }
              placeholder="Select University"
              name="universityId"
              onChange={(selectedOption: any) => handleStudyPreferenceChange(index, "universityId", selectedOption.value)}
            />
            {item?.errors?.universityId && <Form.Text className="text-danger">{item?.errors?.universityId}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6} xl={4} xxl={3}>
          <Form.Group className="mb-3" controlId="campusId">
            <Form.Label><span className="text-danger">*</span> Campus</Form.Label>
            <Select
              className="react-select react-select-container"
              classNamePrefix="react-select"
              // isDisabled={!readOnly}
              options={dropdownData?.campuses}
              value={
                item?.campusId
                  ? {
                      label: dropdownData.campuses.find((c: any) => c.value === item.campusId)?.label,
                      value: item.campusId,
                    }
                  : null
              }
              placeholder="Select Campus"
              name="campusId"
              onChange={(selectedOption: any) => handleStudyPreferenceChange(index, "campusId", selectedOption.value)}
            />
            {item?.errors?.campusId && <Form.Text className="text-danger">{item?.errors?.campusId}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6} xl={4} xxl={3}>
          <Form.Group className="mb-3" controlId="courseTypeId">
            <Form.Label><span className="text-danger">*</span> Course Type</Form.Label>
            <Select
              className="react-select react-select-container"
              classNamePrefix="react-select"
              // isDisabled={!readOnly}
              options={dropdownData?.courseTypes}
              value={
                item?.courseTypeId
                  ? {
                      label: dropdownData.courseTypes.find((c: any) => c.value === item.courseTypeId)?.label,
                      value: item.courseTypeId,
                    }
                  : null
              }
              placeholder="Select Course Type"
              name="courseTypeId"
              onChange={(selectedOption: any) => handleStudyPreferenceChange(index, "courseTypeId", selectedOption.value)}
            />
            {item?.errors?.courseTypeId && <Form.Text className="text-danger">{item?.errors?.courseTypeId}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6} xl={4} xxl={3}>
          <Form.Group className="mb-3" controlId="streamId">
            <Form.Label><span className="text-danger">*</span> Stream</Form.Label>
            <Select
              className="react-select react-select-container"
              classNamePrefix="react-select"
              // isDisabled={!readOnly}
              options={dropdownData?.streams}
              value={
                item?.streamId
                  ? {
                      label: dropdownData.streams.find((s: any) => s.value === item.streamId)?.label,
                      value: item.streamId,
                    }
                  : null
              }
              placeholder="Select Stream"
              name="streamId"
              onChange={(selectedOption: any) => handleStudyPreferenceChange(index, "streamId", selectedOption.value)}
            />
            {item?.errors?.streamId && <Form.Text className="text-danger">{item?.errors?.streamId}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6} xl={4} xxl={3}>
          <Form.Group className="mb-3" controlId="courseId">
            <Form.Label><span className="text-danger">*</span> Course</Form.Label>
            <Select
              className="react-select react-select-container"
              classNamePrefix="react-select"
              // isDisabled={!readOnly}
              options={dropdownData?.courses}
              value={
                item?.courseId
                  ? {
                      label: dropdownData.courses.find((c: any) => c.value === item.courseId)?.label,
                      value: item.courseId,
                    }
                  : null
              }
              placeholder="Select Course"
              name="courseId"
              onChange={(selectedOption: any) => handleStudyPreferenceChange(index, "courseId", selectedOption.value)}
            />
            {item?.errors?.courseId && <Form.Text className="text-danger">{item?.errors?.courseId}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6} xl={4} xxl={3}>
          <Form.Group className="mb-3" controlId="intakeYear">
            <Form.Label><span className="text-danger">*</span> Intake Year</Form.Label>
            <Select
              className="react-select react-select-container"
              classNamePrefix="react-select"
              // isDisabled={!readOnly}
              options={intakeYearList}
              value={
                item.intakeYear
                  ? {
                      label: intakeYearList.find((m: any) => m.value === item.intakeYear)?.label,
                      value: item.intakeYear,
                    }
                  : null
              }
              placeholder="Select Intake Year"
              name="intakeYear"
              onChange={(selectedOption: any) => handleStudyPreferenceChange(index, "intakeYear", selectedOption.value)}
            />
            {item?.errors?.intakeYear && <Form.Text className="text-danger">{item?.errors?.intakeYear}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6} xl={4} xxl={3}>
          <Form.Group className="mb-3" controlId="intakeMonth">
            <Form.Label><span className="text-danger">*</span> Intake Month</Form.Label>
            <Select
              className="react-select react-select-container"
              classNamePrefix="react-select"
              // isDisabled={!readOnly}
              options={intakeMonthOptions}
              value={
                item?.intakeMonth
                  ? {
                      label: intakeMonthOptions.find((m: any) => m.value === item.intakeMonth)?.label,
                      value: item.intakeMonth,
                    }
                  : null
              }
              placeholder="Select Intake Month"
              name="intakeMonth"
              onChange={(selectedOption: any) => handleStudyPreferenceChange(index, "intakeMonth", selectedOption.value)}
            />
            {item?.errors?.intakeMonth && <Form.Text className="text-danger">{item?.errors?.intakeMonth}</Form.Text>}
          </Form.Group>
        </Col>

        <Col md={6} xl={4} xxl={3}>
          <Form.Group className="mb-3" controlId="estimatedBudget">
            <Form.Label><span className="text-danger">*</span> Estimated Budget</Form.Label>
            <FormInput
              type="number"
              name="estimatedBudget"
              placeholder="Enter estimated budget"
              key="estimatedBudget"
              // readOnly={!readOnly}
              value={item?.estimatedBudget || ""}
              onChange={(e: any) => handleStudyPreferenceChange(index, "estimatedBudget", e.target.value)}
              min={0}
            />
            {item?.errors?.estimatedBudget && <Form.Text className="text-danger">{item?.errors?.estimatedBudget}</Form.Text>}
          </Form.Group>
        </Col>
        {isEditable && studyPreferenceData.length > 1 && (
          <Row className="mb-2">
            <ActionButton
              label="Remove"
              iconClass="mdi mdi-delete"
              colorClass="text-danger"
              onClick={() => removeStudyPreference(index, item.id ?? 0)}
            />
          </Row>
        )}
      </Row>
    </Row>
  );

  const addMoreStudyPreference = () => {
    setStudyPreferenceData([
      ...studyPreferenceData,
      {
        id: null,
        universityId: "",
        campusId: "",
        courseTypeId: "",
        streamId: "",
        courseId: "",
        intakeYear: "",
        intakeMonth: "",
        estimatedBudget: "",
        errors: {},
      },
    ]);
  };

  const removeStudyPreference = (index: number, itemId: any) => {
    console.log(itemId);

    if (itemId === 0) {
      const updatedPrefs = studyPreferenceData.filter((_: any, i: any) => i !== index);
      setStudyPreferenceData(updatedPrefs);
    } else {
      removeFromApi(itemId, "studyPreference");
    }
  };

  const handleStudyPreferenceChange = (index: number, field: string, value: any) => {
    const updatedPrefs = [...studyPreferenceData];
    updatedPrefs[index][field] = value;
    setStudyPreferenceData(updatedPrefs);
  };

  const handleSave = async () => {
    const validationRules = {
      universityId: { required: true },
      campusId: { required: true },
      courseTypeId: { required: true },
      streamId: { required: true },
      courseId: { required: true },
      intakeYear: { required: true },
      intakeMonth: { required: true },
      estimatedBudget: { required: true },
    };

    const { isValid, errors } = validateFields(studyPreferenceData, validationRules);

    if (!isValid) {
      setStudyPreferenceData((prevState: any) =>
        prevState.map((exp: any, index: any) => ({
          ...exp,
          errors: errors[index] || {},
        }))
      );
      return;
    }
    saveStudyPreferenceData(studyPreferenceData, studyPreferenceId);
  };

  return (
    <>
      <Row className="mb-2 pe-0">
        <Row className="pe-0">
          <h5 className="mb-4 text-uppercase">
            <i className="mdi mdi-account-circle me-1"></i> Study Preference Info - {countryName}
          </h5>

          {studyPreferenceData?.map((item: any, index: number) => {
            console.log("Study Preference Item:", studyPreferenceData, item, index); // Log the item
            return renderStudyprefRows(item, index, isEditable);
          })}
          {isEditable && (
            <Row className="pe-0">
              <Row className="mb-2 pe-0">
                <ActionButton label="Add More" iconClass="mdi mdi-plus" onClick={addMoreStudyPreference} />
              </Row>
            </Row>
          )}
        </Row>

        <Row>
          <Button
            variant="primary"
            className="mt-4"
            type="submit"
            onClick={handleSave}
            // disabled={saveLoading || !isEditable} // Disable button while loading
          >
            Save Details
          </Button>
        </Row>
      </Row>
    </>
  );
};

export default StudyPreferenceRow;
