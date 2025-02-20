import React, { useEffect, useState } from "react";
import { Button, Modal, Row, Spinner } from "react-bootstrap";
import { withSwal } from "react-sweetalert2";
import useDropdownData from "../../../../../hooks/useDropdownDatas";
import axios from "axios";
import StudyPreferenceRow from "./StudyPrefRow";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import SkeletonComponent from "./LoadingSkeleton";
import FieldHistoryTable from "../../../../../components/FieldHistory";
import { useHistoryModal } from "../../../../../hooks/useHistoryModal";

const StudyPreference = withSwal((props: any) => {
  const { swal, studentId } = props;

  //create state for item
  const { dropdownData } = useDropdownData("universities,courses,streams,campuses,courseTypes");
  const {historyModal,toggleHistoryModal} = useHistoryModal();
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialFetch, setInitialFetch] = useState<boolean>(true);
  

  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);


  const getStudyPrefData = async () => {
    setLoading(true);
    setInitialFetch(true);

    try {
      const { data } = await axios.get(`/study_preferences_details/${studentId}`);

      setItem(data?.data);
      console.log("studentId data", data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (dropdownData.universities.length > 0 && dropdownData.campuses.length > 0) {
      getStudyPrefData();
    }
  }, [dropdownData.universities.length, dropdownData.campuses.length, refresh, studentId]);

  

  return (
    <>
      {loading ? (
        <SkeletonComponent />
      ) : (
        <Row className="pe-0">
          <Modal show={historyModal} onHide={toggleHistoryModal} centered dialogClassName={"modal-full-width"} scrollable>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body style={{ margin: "0 !important", padding: "0 !important" }}>
              <FieldHistoryTable apiUrl={"study_preference_details"} studentId={studentId} />
            </Modal.Body>
          </Modal>
          <div className="d-slex w-100 justify-content-end">
            <Button
              className="btn-sm btn-secondary waves-effect waves-light float-end me-2"
              onClick={toggleHistoryModal}
              style={{ height: "fit-content", width: "fit-content" }}
            >
              <i className="mdi mdi-history"></i> View History
            </Button>
          </div>

          {item.length > 0 &&
            item?.map((values: any, index: any) => (
              <StudyPreferenceRow
                key={index + values?.country_name}
                studyPreference={values?.studyDetails}
                parentIndex={index}
                countryName={values?.country_name}
                countryId={values?.country_id}
                studyPreferenceId={values?.studyPreferenceId}
                dropdownData={dropdownData}
                isEditable={values?.isEditable}
                initialFetch={initialFetch}
                setInitialFetch={setInitialFetch}
                studentId={studentId}
              />
            ))}
        </Row>
      )}
    </>
  );
});

export default StudyPreference;
