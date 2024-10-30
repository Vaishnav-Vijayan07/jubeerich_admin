import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { withSwal } from "react-sweetalert2";
import useDropdownData from "../../../../../hooks/useDropdownDatas";
import axios from "axios";
import StudyPreferenceRow from "./StudyPrefRow";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

const StudyPreference = withSwal((props: any) => {
  const { swal, studentId } = props;

  //create state for item
  const [item, setItem] = useState([]);

  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);

  const { dropdownData } = useDropdownData("universities,courses,streams,campuses,courseTypes");

  const getStudyPrefData = async () => {
    console.log("studentId, calling");

    try {
      const { data } = await axios.get(`/study_preferences_details/${studentId}`);

      setItem(data?.data);
      console.log("studentId data", data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (dropdownData.universities.length > 0 && dropdownData.campuses.length > 0) {
      getStudyPrefData();
    }
  }, [dropdownData.universities.length, dropdownData.campuses.length, refresh, studentId]);

  return (
    <>
      <Row>
        {item.length > 0 &&
          item?.map((values: any, index: any) => (
            <StudyPreferenceRow
              key={index + values?.country_name}
              studyPreference={values?.studyDetails}
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
