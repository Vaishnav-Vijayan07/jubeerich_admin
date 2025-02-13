import axios from "axios";
import { useCallback, useState } from "react";
import { showErrorAlert, showSuccessAlert } from "../constants";
import { refreshData } from "../redux/countryReducer";
import { useDispatch } from "react-redux";
import swal from "sweetalert2";

const useSaveEducationDetails = () => {
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const dispatch = useDispatch();

  const savePrimaryEducationDetails = useCallback(
    async (primaryDetails, type: string, studentId: string) => {
      const formData = new FormData();
      formData.append("student_id", studentId);
      formData.append("operation", primaryDetails.id ? "update" : "add");
      formData.append("primary[qualification]", primaryDetails.qualification);
      formData.append("primary[board_name]", primaryDetails.board_name);
      formData.append("primary[school_name]", primaryDetails.school_name);
      formData.append("primary[startDate]", primaryDetails.startDate);
      formData.append("primary[endDate]", primaryDetails.endDate);
      formData.append("primary[percentage]", primaryDetails.percentage);
      if (primaryDetails.mark_sheet) {
        formData.append("primary_mark_sheet", primaryDetails.mark_sheet);
      }
      if (primaryDetails.certificate) {
        formData.append("primary_certificate", primaryDetails.certificate);
      }
      if (primaryDetails.admit_card) {
        formData.append("primary_admit_card", primaryDetails.admit_card);
      }

      const result = await swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save",
      });

      if (result.isConfirmed) {
        setPrimaryLoading(true);
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
          setPrimaryLoading(false);
        }
      }
    },
    []
  );

  return { savePrimaryEducationDetails, primaryLoading };
};

export default useSaveEducationDetails;
