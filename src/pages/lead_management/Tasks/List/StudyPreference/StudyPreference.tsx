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

  //create state for item
  const [item, setItem] = useState([]);

  const [loading, setLoading] = useState(false);
  const [studyPreferenceData, setStudyPreferenceData] = useState<any[]>([
    initialStateStudyPreference,
  ]);

  const refresh = useSelector(
    (state: RootState) => state.refreshReducer.refreshing
  );

  const { loading: dropDownLoading, dropdownData } = useDropdownData("universities,courses,streams,campuses,courseTypes");

  const getStudyPrefData = async () => {
    setInitialLoading(true);

    try {
      const { data } = await axios.get(
        `/study_preferences_details/${studentId}`
      );

      setItem(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (
      dropdownData.universities.length > 0 &&
      dropdownData.campuses.length > 0
    ) {
      getStudyPrefData();
    }
  }, [dropdownData.universities.length, dropdownData.campuses.length, refresh]);

  if (initialLoading || dropDownLoading)
    return (
      <Spinner
        animation="border"
        style={{ position: "absolute", top: "100%", left: "50%" }}
      />
    );

  return (
    <>
      <Row>
        {item &&
          item?.map((values: any, index: any) => (
            <StudyPreferenceRow
              studyPreference={
                values?.studyDetails.length > 0
                  ? values?.studyDetails
                  : [initialStateStudyPreference]
              }
              parentIndex={index}
              countryName={values?.country_name}
              studyPreferenceId={values?.studyPreferenceId}
              dropdownData={dropdownData}
              isEditable={values?.isEditable}
            />
          ))}
      </Row>
    </>
  );
});

export default StudyPreference;
