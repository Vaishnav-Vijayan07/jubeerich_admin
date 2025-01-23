import { useCallback, useState } from "react";
import { showErrorAlert, showSuccessAlert } from "../constants";
import { useDispatch } from "react-redux";
import axios from "axios";
import { refreshData } from "../redux/countryReducer";
import swal from "sweetalert2";

const useSaveStudyPreferenceData = () => {
  const dispatch = useDispatch();
  const [saveLoading, setSaveLoading] = useState(false);

  const saveStudyPreferenceData = useCallback(
    async (studyPreferenceData: any, studyPreferenceId: any) => {
      console.log("studyPreferenceData", studyPreferenceData);

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

      const result = await swal.fire({
        title: "Confirm Action",
        text: `Do you want to save the changes?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, Save`,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#8B8BF5", // Purple color for confirm button
        cancelButtonColor: "#E97777", // Pink/red color for cancel button
        buttonsStyling: true,
        customClass: {
          popup: "rounded-4 shadow-lg",
          confirmButton: "btn btn-lg px-4 rounded-3 order-2 hover-custom",
          cancelButton: "btn btn-lg px-4 rounded-3 order-1 hover-custom",
          title: "fs-2 fw-normal mb-2",
        },
        width: "26em",
        padding: "2em",
      });

      if (result.isConfirmed) {
        setSaveLoading(true);
        try {
          const response = await axios.post(`study_preferences_details`, {
            study_preferences: modifiedDataToServer,
            studyPreferenceId,
          });
          if (response.data.status) {
            showSuccessAlert("Data updated successfully");
            dispatch(refreshData());
          }
        } catch (error) {
          console.error("Error saving study preference:", error);
          showErrorAlert("Failed to save study preference");
        } finally {
          setSaveLoading(false);
        }
      }
    },
    []
  );

  return {
    saveStudyPreferenceData,
    saveLoading,
  };
};

export default useSaveStudyPreferenceData;
