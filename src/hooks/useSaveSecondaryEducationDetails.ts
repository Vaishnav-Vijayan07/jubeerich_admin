import axios from "axios";
import { useCallback, useState } from "react";
import { showErrorAlert, showSuccessAlert } from "../constants";
import { refreshData } from "../redux/countryReducer";
import { useDispatch } from "react-redux";
import swal from "sweetalert2";

const useSaveSecondaryEducationDetails = () => {
  const [secondaryLoading, setSecondaryLoading] = useState(false);
  const dispatch = useDispatch();

  const saveSecondaryEducationDetails = useCallback(
    async (secondaryDetails, type: string, studentId: string) => {
      const formData = new FormData();
      formData.append("student_id", studentId);
      formData.append("operation", secondaryDetails.id ? "update" : "add");
      formData.append(
        "secondary[qualification]",
        secondaryDetails.qualification
      );
      formData.append("secondary[board_name]", secondaryDetails.board_name);
      formData.append("secondary[school_name]", secondaryDetails.school_name);
      formData.append("secondary[startDate]", secondaryDetails.startDate);
      formData.append("secondary[endDate]", secondaryDetails.endDate);
      formData.append("secondary[percentage]", secondaryDetails.percentage);
      if (secondaryDetails.mark_sheet) {
        formData.append("secondary_mark_sheet", secondaryDetails.mark_sheet);
      }
      if (secondaryDetails.certificate) {
        formData.append("secondary_certificate", secondaryDetails.certificate);
      }
      if (secondaryDetails.admit_card) {
        formData.append("secondary_admit_card", secondaryDetails.admit_card);
      }

      const result = await swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, save it!",
      });
      if (result.isConfirmed) {
        setSecondaryLoading(true);
        try {
          const { data } = await axios.post(
            `/studentPrimaryEducation/${type}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (data.status) {
            dispatch(refreshData());
            showSuccessAlert(data.message);
          }
        } catch (error) {
          console.error("Error saving education details:", error);
          showErrorAlert("Failed to save education details");
        } finally {
          setSecondaryLoading(false);
        }
      }
    },
    []
  );

  return { saveSecondaryEducationDetails, secondaryLoading };
};

export default useSaveSecondaryEducationDetails;
