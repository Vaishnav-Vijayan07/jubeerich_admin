import React, { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { withSwal } from "react-sweetalert2";
import useDropdownData from "../../../../../hooks/useDropdownDatas";
import axios from "axios";
import StudyPreferenceRow from "./StudyPrefRow";
import { showErrorAlert, showSuccessAlert } from "../../../../../constants";
import useRemoveFromApi from "../../../../../hooks/useRemoveFromApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import useSaveStudyPreferenceData from "../../../../../hooks/useSaveStudyPreferenceData";
import validateFields from "../../../../../helpers/validateHelper";

const initialStateStudyPreference = {
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
};

// const StudyPreference = ({ studentId, Countries }: any) => {
const StudyPreference = withSwal((props: any) => {
  const { swal, studentId } = props;

  const [initialLoading, setInitialLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studyPreferenceData, setStudyPreferenceData] = useState<any[]>([
    initialStateStudyPreference,
  ]);

  const refresh = useSelector(
    (state: RootState) => state.refreshReducer.refreshing
  );

  const [countryName, setCountryName] = useState("");
  const [studyPreferenceId, setStudyPreferenceId] = useState("");
  const { loading: dropDownLoading, dropdownData } = useDropdownData("");
  const { loading: deleteLoading, removeFromApi } = useRemoveFromApi();
  const { saveLoading, saveStudyPreferenceData } = useSaveStudyPreferenceData();

  const getStudyPrefData = async () => {
    setInitialLoading(true);
    axios
      .get(`/study_preferences_details/${studentId}`)
      .then((res) => {
        setStudyPreferenceId(res.data.data?.id);
        setCountryName(res.data.data?.country?.country_name);

        setStudyPreferenceData(
          res.data.data?.studyPreferenceDetails.length > 0
            ? res.data.data.studyPreferenceDetails
            : [initialStateStudyPreference]
        );
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setInitialLoading(false);
      });
  };

  useEffect(() => {
    if (
      dropdownData.universities.length > 0 &&
      dropdownData.campuses.length > 0
    ) {
      getStudyPrefData();
    }
  }, [dropdownData.universities.length, dropdownData.campuses.length, refresh]);

  const handleStudyPreferenceChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const updatedPrefs = [...studyPreferenceData];
    updatedPrefs[index][field] = value;
    setStudyPreferenceData(updatedPrefs);
  };

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
      const updatedPrefs = studyPreferenceData.filter((_, i) => i !== index);
      setStudyPreferenceData(updatedPrefs);
    } else {
      removeFromApi(itemId, "studyPreference");
    }
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

    const { isValid, errors } = validateFields(
      studyPreferenceData,
      validationRules
    );

    console.log(errors);

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

  if (initialLoading || dropDownLoading)
    return (
      <Spinner
        animation="border"
        style={{ position: "absolute", top: "100%", left: "50%" }}
      />
    );

  return (
    <>
      <Row className={deleteLoading || saveLoading ? "opacity-25" : ""}>
        <StudyPreferenceRow
          studyPreference={studyPreferenceData}
          countryName={countryName}
          handleStudyPreferenceChange={handleStudyPreferenceChange}
          addMoreStudyPreference={addMoreStudyPreference}
          removeStudyPreference={removeStudyPreference}
          dropdownData={dropdownData}
        />
      </Row>

      <Row>
        <Button
          variant="primary"
          className="mt-4"
          type="submit"
          onClick={handleSave}
          disabled={loading || saveLoading} // Disable button while loading
        >
          {loading || saveLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              {"Saving..."} {/* Show spinner and text */}
            </>
          ) : (
            "Save Details" // Normal button text when not loading
          )}
        </Button>
      </Row>
    </>
  );
});

export default StudyPreference;
