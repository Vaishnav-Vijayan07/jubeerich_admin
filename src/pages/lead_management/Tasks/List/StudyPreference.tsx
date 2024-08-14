import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../../components";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { getUniversity } from "../../../../redux/University/actions";
import { RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup';

const validationErrorsInitialState = {
  intersted_country: "",
  intrested_institution: "",
  intake_year: "",
  intake_month: "",
  estimated_budget: "",
  course_field_of_intrest: "",
  universities: "",
  campus: "",
  stream: "",
  course: "",
  duration: "",
  course_fee: ""
}

const initialState = {
  intersted_country: "",
  intrested_institution: "",
  intake_year: "",
  intake_month: "",
  estimated_budget: "",
  course_field_of_intrest: "",
  universities: "",
  campus: "",
  stream: "",
  course: "",
  duration: "",
  course_fee: ""
};

const StudyPreference = ({ studentId, Countries }: any) => {
  const [formData, setformData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [universityData, setUniversityData] = useState([]);
  const [selectedUniversities, setSelectedUniversities] = useState<any>([]);
  const [selectedUniversities1, setSelectedUniversities1] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState(validationErrorsInitialState);

  const ValidationSchema = yup.object().shape({
    intersted_country: yup.string().required("Prefered Country cannot be empty"),
    intrested_institution: yup.string().nullable(),
    intake_year: yup.string().required("Intake Year cannot be empty"),
    intake_month: yup.string().required("Intake Month cannot be empty"),
    estimated_budget: yup.string().nullable(),
    course_field_of_intrest: yup.string().nullable(),
    universities: yup.array().of(yup.string()).nullable(),
    campus: yup.string().nullable(),
    stream: yup.string().nullable(),
    course: yup.string().nullable(),
    duration: yup.string().nullable(),
    course_fee: yup.string().nullable(),

    // intersted_country: formData?.intersted_country,
    // intrested_institution: formData?.intrested_institution,
    // intake_year: formData?.intake_year,
    // intake_month: formData?.intake_month,
    // estimated_budget: formData?.estimated_budget,
    // course_field_of_intrest: formData?.course_field_of_intrest,
    // user_id: studentId,
    // course_fee: formData?.course_fee,
    // universities: formData?.universities,
    // campus: formData?.campus,
    // stream: formData?.stream,
    // course: formData?.course,
    // duration: formData?.duration,
  })

  console.log("selectedUniversities =====>", selectedUniversities);


  console.log("university data", universityData);


  const dispatch = useDispatch()

  const animatedComponents = makeAnimated();

  const University = useSelector((state: RootState) => state.University.universities.data);


  // apis
  const getStudyPreferenceInfo = () => {
    setformData(initialState)
    axios
      .get(`getStudentStudyPrferenceInfo/${studentId}`)
      .then((res) => {
        console.log("res =>", res.data);
        setformData(res.data.data);

        const selectedUniversities = University?.map((university: any) => ({
          value: university.id,
          label: university.university_name,
        }));

        // Filter the universities to include only those in the comma-separated string
        const idsArray = res?.data?.data?.universities?.split(',')?.map((id: any) => parseInt(id, 10));
        const filteredUniversities = selectedUniversities.filter((university: any) =>
          idsArray.includes(university.value)
        );

        console.log("filteredUniversities ==>", filteredUniversities);
        

        // setSelectedUniversities(filteredUniversities);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    dispatch(getUniversity())
  }, [])

  // handling input data
  const handleInputChange = (e: any) => {
    setformData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // save details api
  const saveStudentStudyPreferenceInfo = async() => {

    try {
      await ValidationSchema.validate(formData, { abortEarly: false})
      
      setLoading(true);
      
      axios
        .post("saveStudentStudyPreferenceInfo", {
          intersted_country: formData?.intersted_country,
          intrested_institution: formData?.intrested_institution,
          intake_year: formData?.intake_year,
          intake_month: formData?.intake_month,
          estimated_budget: formData?.estimated_budget,
          course_field_of_intrest: formData?.course_field_of_intrest,
          user_id: studentId,
          course_fee: formData?.course_fee,
          universities: formData?.universities,
          campus: formData?.campus,
          stream: formData?.stream,
          course: formData?.course,
          duration: formData?.duration,
        })
        .then((res) => {
          console.log("res: =>", res);
          setLoading(false);
          showSuccessAlert(res.data.message);
          // getBasicInfoApi();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          showErrorAlert("Error occured");
        });
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
      const errors: any = {};
      validationError.inner.forEach((error) => {
        if (error.path) {
          errors[error.path] = error.message;
        }
      });
      setValidationErrors(errors);
      }
    }

  };

  useEffect(() => {
    if (University) {
      const universityArray = University?.map((university: any) => ({
        value: university.id,
        label: university.university_name,
      }));
      setUniversityData(universityArray);
    }
  }, [University]);

  useEffect(() => {
    if (studentId) {
      getStudyPreferenceInfo();
    }
  }, [studentId, University]);

  const handleUniversityChange = (selectedOptions: any) => {

    if (Array.isArray(selectedOptions)) {
      setSelectedUniversities(selectedOptions);
      const selectedIdsString = selectedOptions?.map((option) => option.value).join(", ");
      setformData((prev) => ({
        ...prev,
        universities: selectedIdsString,
      }));
    }
  }

  return (
    <>
      <>
        <h5 className="mb-4 text-uppercase">
          <i className="mdi mdi-account-circle me-1"></i> Study Preference Info
        </h5>
        <Row>
          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="intersted_country">
              <Form.Label>Preferred Country</Form.Label>
              <Form.Select
                className="mb-3"
                name="intersted_country"
                aria-label="Default select example"
                value={formData.intersted_country}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Open this select menu
                </option>
                {Countries?.map((country: any) => (
                  <option value={country.id}>{country.country_name}</option>
                ))}
              </Form.Select>
              {validationErrors.intersted_country && <Form.Text className="text-danger">{validationErrors.intersted_country}</Form.Text>}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="intrested_institution">
              <Form.Label>Intrested institution</Form.Label>
              <FormInput
                type="text"
                name="intrested_institution"
                placeholder="Enter intrested institution"
                key="intrested_institution"
                value={formData.intrested_institution}
                onChange={handleInputChange}
              />
              {validationErrors.intrested_institution && <Form.Text className="text-danger">{validationErrors.intrested_institution}</Form.Text>}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="intake_year">
              <Form.Label><span className="text-danger">* </span> Intake year</Form.Label>
              <FormInput
                type="number"
                name="intake_year"
                placeholder="Enter intake year"
                key="intake_year"
                value={formData.intake_year}
                onChange={handleInputChange}
              />
              {validationErrors.intake_year && (
            <Form.Text className="text-danger">{validationErrors.intake_year}</Form.Text>)}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="intake_month">
              <Form.Label><span className="text-danger">* </span> Intake Month</Form.Label>
              <Form.Select
                name="intake_month"
                className="mb-3"
                aria-label="Default select example"
                value={formData?.intake_month}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Open this select menu
                </option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </Form.Select>
              {validationErrors.intake_month && (
            <Form.Text className="text-danger">{validationErrors.intake_month}</Form.Text>)}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="estimated_budget">
              <Form.Label>Estimated budget</Form.Label>
              <FormInput
                type="number"
                name="estimated_budget"
                placeholder="Enter estimated budget"
                key="estimated_budget"
                value={formData.estimated_budget}
                onChange={handleInputChange}
              />
              {validationErrors.estimated_budget && (
            <Form.Text className="text-danger">{validationErrors.estimated_budget}</Form.Text>
          )}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="course_field_of_intrest">
              <Form.Label>Course field of intrest</Form.Label>
              <FormInput
                type="text"
                name="course_field_of_intrest"
                placeholder="Enter interested course field"
                key="course_field_of_intrest"
                value={formData.course_field_of_intrest}
                onChange={handleInputChange}
              />
              {validationErrors.course_field_of_intrest && (
            <Form.Text className="text-danger">{validationErrors.course_field_of_intrest}</Form.Text>
          )}
            </Form.Group>
          </Col>
          <Form.Group className="mb-3" controlId="universities">
            <Form.Label>University</Form.Label>
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              className="react-select react-select-container"
              name="universities"
              classNamePrefix="react-select"
              options={universityData}
              value={selectedUniversities}
              onChange={handleUniversityChange as any}
            />
            {/* {validationErrors.course_field_of_intrest && (
            <Form.Text className="text-danger">{validationErrors.course_field_of_intrest}</Form.Text>
          )} */}
          </Form.Group>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="campus">
              <Form.Label>Campus</Form.Label>
              <FormInput
                type="text"
                name="campus"
                placeholder="Enter campus name"
                key="campus"
                value={formData.campus}
                onChange={handleInputChange}
              />
              {validationErrors.campus && (
            <Form.Text className="text-danger">{validationErrors.campus}</Form.Text>
          )}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="stream">
              <Form.Label>Stream</Form.Label>
              <FormInput
                type="text"
                name="stream"
                placeholder="Enter stream name"
                key="stream"
                value={formData.stream}
                onChange={handleInputChange}
              />
              {validationErrors.stream && (
            <Form.Text className="text-danger">{validationErrors.stream}</Form.Text>
          )}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="course">
              <Form.Label>Course</Form.Label>
              <FormInput
                type="text"
                name="course"
                placeholder="Enter course name"
                key="course"
                value={formData.course}
                onChange={handleInputChange}
              />
              {validationErrors.course && (
            <Form.Text className="text-danger">{validationErrors.course}</Form.Text>
          )}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="duration">
              <Form.Label>Duration</Form.Label>
              <FormInput
                type="number"
                name="duration"
                placeholder="Enter duration"
                key="duration"
                value={formData.duration}
                onChange={handleInputChange}
              />
              {validationErrors.duration && (
            <Form.Text className="text-danger">{validationErrors.duration}</Form.Text>
          )}
            </Form.Group>
          </Col>

          <Col xl={6} xxl={4}>
            <Form.Group className="mb-3" controlId="course_fee">
              <Form.Label>Course fee</Form.Label>
              <FormInput
                type="number"
                name="course_fee"
                placeholder="Enter course fee"
                key="course_fee"
                value={formData.course_fee}
                onChange={handleInputChange}
              />
              {validationErrors.course_fee && (
            <Form.Text className="text-danger">{validationErrors.course_fee}</Form.Text>
          )}
            </Form.Group>
          </Col>

          <Button
            variant="primary"
            className="mt-4"
            type="submit"
            onClick={saveStudentStudyPreferenceInfo}
            disabled={loading}
          >
            Save Details
          </Button>
        </Row>
      </>
    </>
  );
};

export default StudyPreference;
