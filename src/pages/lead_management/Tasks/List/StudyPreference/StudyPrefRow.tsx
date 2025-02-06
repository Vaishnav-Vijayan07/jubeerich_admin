import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Select from "react-select";
import { FormInput } from "../../../../../components";
import { intakeMonthOptions, intakeYearList } from ".././data";
import ActionButton from ".././ActionButton";
import { useEffect, useMemo, useState } from "react";
import useRemoveFromApi from "../../../../../hooks/useRemoveFromApi";
import useSaveStudyPreferenceData from "../../../../../hooks/useSaveStudyPreferenceData";
import validateFields from "../../../../../helpers/validateHelper";
import StatusBadge from "./StatusBadge";
import { formatString } from "../../../../../utils/formatData";
import axios from "axios";

const StudyPreferenceRow = ({ studyPreference, countryName, countryId, dropdownData, studyPreferenceId, isEditable, initialFetch, setInitialFetch,studentId }: any) => {
  const { loading: deleteLoading, removeFromApi } = useRemoveFromApi();
  const { saveLoading, saveStudyPreferenceData } = useSaveStudyPreferenceData();
  const [universities, setUniversities] = useState<any>([]);
  const [selectedFormDataMap, setSelectedFormDataMap] = useState<any>(new Map());
  const [campusesMap, setCampusesMap] = useState<any>(new Map());
  const [courseMap, setCourseMap] = useState<any>(new Map());

  const fetchUniversitiesByCountry = async() => {
    const res = await axios.get(`/university_by_country/${countryId}`);
    setUniversities(res?.data?.data);
  }
  
  const fetchCampusByUniversity = async(index: any) => {
    const res = await axios.get(`/campuses_by_university/${selectedFormDataMap.get(index)?.universityId}`);
    if(res){
      setCampusesMap((prev: any) => {
        const newMap = new Map(prev);
        newMap.set(index, res?.data?.data);
        return newMap;
      });
    }
  }

  const fetchCourseList = async(index: any) => {
    const res = await axios.get(`/courses_by_type_stream`, { params: { type_id: selectedFormDataMap.get(index)?.courseTypeId, stream_id: selectedFormDataMap.get(index)?.streamId } });
    if(res){
      setCourseMap((prev: any) => {
        const newMap = new Map(prev);
        newMap.set(index, res?.data?.data);
        return newMap;
      });
    }
  }

  useEffect(() => {
    fetchUniversitiesByCountry()
  }, [countryId])

  useEffect(() => {
    if(initialFetch){
      if (studyPreference?.[0]?.id) {
        studyPreference.forEach((item: any, index: number) => {
          setSelectedFormDataMap((prevMap: any) => {
            const newMap = new Map(prevMap);
            newMap.set(index, item);
            return newMap;
          });
        });
      }
    }
  }, [studyPreference, initialFetch]);
  
  useEffect(() => {
    if(initialFetch){
      selectedFormDataMap.forEach((item: any, index: any) => {
        if (item && item.universityId) {
          fetchCampusByUniversity(index);
          fetchCourseList(index);
        }
      });
    }
  }, [selectedFormDataMap, initialFetch]);  
  

  const formattedUniversities = useMemo(() => {
    if (!universities || universities.length == 0) return [];
    return universities.map((data: any) => ({
      label: data?.university_name,
      value: data?.id,
    }));
  }, [universities]);

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
              // options={dropdownData?.universities}
              options={formattedUniversities}
              // value={
              //   item?.universityId
              //     ? {
              //         label: dropdownData.universities.find((u: any) => u.value === item.universityId)?.label,
              //         value: item.universityId,
              //       }
              //     : null
              // }
              value={
                item?.universityId
                  ? {
                      label: formattedUniversities.find((u: any) => u.value == item.universityId)?.label,
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
              isDisabled={selectedFormDataMap?.get(index)?.universityId ? false : true}
              // options={dropdownData?.campuses}
              options={campusesMap?.get(index)}
              // value={
              //   item?.campusId
              //     ? {
              //         label: dropdownData.campuses.find((c: any) => c.value === item.campusId)?.label,
              //         value: item.campusId,
              //       }
              //     : null
              // }
              value={
                item?.campusId
                  ? {
                      label: campusesMap?.get(index)?.find((c: any) => c.value == item.campusId)?.label,
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
              isDisabled={selectedFormDataMap?.get(index)?.campusId ? false : true}
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
              isDisabled={selectedFormDataMap?.get(index)?.courseTypeId ? false : true}
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
              isDisabled={selectedFormDataMap?.get(index)?.streamId ? false : true}
              // options={dropdownData?.courses}
              options={courseMap?.get(index)}
              value={
                item?.courseId
                  ? {
                      label: courseMap?.get(index)?.find((c: any) => c.value == item.courseId)?.label,
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
        {/* {isEditable && studyPreferenceData.length > 1 && ( */}
        {studyPreferenceData.length > 1 && (
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
      removeFromApi(itemId, "studyPreference",studentId);
    }
  };

  const handleStudyPreferenceChange = (index: number, field: string, value: any) => {
    setInitialFetch(false);
    const updatedPrefs = [...studyPreferenceData];
    updatedPrefs[index][field] = value;
    
    setSelectedFormDataMap((prevMap: any) => {
      prevMap.set(index, updatedPrefs[index]);
      return new Map(prevMap);
    });
    
    setStudyPreferenceData(updatedPrefs);

    switch (field) {
      case 'universityId':
        updatedPrefs[index]['campusId'] = '';
        updatedPrefs[index]['courseTypeId'] = '';
        updatedPrefs[index]['streamId'] = '';
        updatedPrefs[index]['courseId'] = '';
        
        setSelectedFormDataMap((prevMap: any) => {
          prevMap.set(index, updatedPrefs[index]);
          return new Map(prevMap);
        });
        fetchCampusByUniversity(index);
        break;
      case 'campusId':
        updatedPrefs[index]['courseTypeId'] = '';
        updatedPrefs[index]['streamId'] = '';
        updatedPrefs[index]['courseId'] = '';
        
        setSelectedFormDataMap((prevMap: any) => {
          prevMap.set(index, updatedPrefs[index]);
          return new Map(prevMap);
        });
        break;
      case 'courseTypeId':
        updatedPrefs[index]['streamId'] = '';
        updatedPrefs[index]['courseId'] = '';

        setSelectedFormDataMap((prevMap: any) => {
          prevMap.set(index, updatedPrefs[index]);
          return new Map(prevMap);
        });
        break
      case 'streamId':
        updatedPrefs[index]['courseId'] = '';

        setSelectedFormDataMap((prevMap: any) => {
          prevMap.set(index, updatedPrefs[index]);
          return new Map(prevMap);
        });
        fetchCourseList(index);
        break;
      default:
        break;
    }
  };

  const handleSave = async () => {
    const validationRules = {
      universityId: { required: true,message : "Please select university" },
      campusId: { required: true,message : "Please select campus" },
      courseTypeId: { required: true ,message : "Please select course type" },
      streamId: { required: true ,message : "Please select stream" },
      courseId: { required: true ,message : "Please select course" },
      intakeYear: { required: true ,message : "Please select intake year" },
      intakeMonth: { required: true ,message : "Please select intake month" },
      estimatedBudget: { required: true,message : "Please enter estimated budget" },
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
          {/* {isEditable && ( */}
            <Row className="pe-0">
              <Row className="mb-2 pe-0">
                <ActionButton label="Add More" iconClass="mdi mdi-plus" onClick={addMoreStudyPreference} />
              </Row>
            </Row>
          {/* )} */}
        </Row>

        <Row>
          <Button
            variant="primary"
            className=""
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
