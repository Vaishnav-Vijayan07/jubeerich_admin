import React, { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { withSwal } from "react-sweetalert2";
import useDropdownData from "../../../../hooks/useDropdownDatas";
import axios from "axios";
import StudyPreferenceRow from "./StudyPrefRow";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";

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
};

// const StudyPreference = ({ studentId, Countries }: any) => {
const StudyPreference = withSwal((props: any) => {
  const { swal, studentId } = props;

  const [loading, setLoading] = useState(false);
  const [studyPreferenceData, setStudyPreferenceData] = useState<any[]>([
    initialStateStudyPreference,
  ]);

  const [countryName, setCountryName] = useState("");
  const [studyPreferenceId, setStudyPreferenceId] = useState("");

  const getStudyPrefData = async () => {
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
      });
  };

  const { loading: dropDownLoading, dropdownData } = useDropdownData("");

  useEffect(() => {
    if (
      dropdownData.universities.length > 0 &&
      dropdownData.campuses.length > 0
    ) {
      getStudyPrefData();
    }
  }, [dropdownData.universities.length, dropdownData.campuses.length]);

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
      },
    ]);
  };

  const removeStudyPreferenceData = (id: any, type: string) => {
    swal
      .fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete",
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios
            .delete(`basic_info/${type}/${id}`, {
              headers: {
                "Content-Type": "application/json", // Assuming no file data is sent
              },
            })
            .then((res) => {
              console.log("Response: =>", res);
              setLoading(false);
              showSuccessAlert(res.data.message);
              getStudyPrefData();
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
              showErrorAlert("Error occurred");
            });
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const removeStudyPreference = (index: number, itemId: any) => {
    console.log(itemId);

    if (itemId === 0) {
      const updatedPrefs = studyPreferenceData.filter((_, i) => i !== index);
      setStudyPreferenceData(updatedPrefs);
    } else {
      removeStudyPreferenceData(itemId, "studyPreference");
    }
  };

  const saveStudyPreferenceData = async () => {
    setLoading(true);
    const modifiedDataToServer = studyPreferenceData?.map((data: any) => ({
      id: data.id ?? 0,
      universityId: data.universityId,
      campusId: data.campusId,
      courseTypeId: data.courseTypeId,
      streamId: data.streamId,
      courseId: data.courseId,
      intakeYear: data.intakeYear, // Ensure intakeYear is an integer
      intakeMonth: data.intakeMonth, // Assuming intakeMonth is already in the desired format
      estimatedBudget: data.estimatedBudget,
    }));

    try {
      const response = await axios.post(`study_preferences_details`, {
        study_preferences: modifiedDataToServer,
        studyPreferenceId,
      });
      showSuccessAlert("Data updated successfully");
      getStudyPrefData();
    } catch (error) {
      console.error("Error saving data", error);
      showErrorAlert("Error occurred while saving data");
    } finally {
      setLoading(false);
    }
  };

  if (loading || dropDownLoading)
    return (
      <Spinner
        animation="border"
        style={{ position: "absolute", top: "100%", left: "50%" }}
      />
    );

  return (
    <>
      <StudyPreferenceRow
        StudyPreference={studyPreferenceData}
        countryName={countryName}
        handleStudyPreferenceChange={handleStudyPreferenceChange}
        addMoreStudyPreference={addMoreStudyPreference}
        removeStudyPreference={removeStudyPreference}
        dropdownData={dropdownData}
        loading={loading}
      />

      <Row>
        <Button
          variant="primary"
          className="mt-4"
          type="submit"
          onClick={saveStudyPreferenceData}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
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
