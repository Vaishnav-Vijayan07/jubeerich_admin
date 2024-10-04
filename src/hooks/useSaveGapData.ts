import { useCallback, useState } from "react";
import { showErrorAlert, showSuccessAlert } from "../constants";
import { useDispatch } from "react-redux";
import axios from "axios";
import { refreshData } from "../redux/countryReducer";
import swal from "sweetalert2";

const useSaveGapData = (studentId: any) => {
  const dispatch = useDispatch();
  const [saveLoading, setSaveLoading] = useState(false);

  const saveGapData = useCallback(
    async (gapData: any, type: "education" | "work") => {
      console.log("gapData", gapData);
      const newformData = new FormData();

      newformData.append("student_id", studentId);

      gapData.forEach((gap: any, index: any) => {
        newformData.append(`gap[${index}][id]`, gap?.id ?? 0);
        newformData.append(`gap[${index}][type]`, type);
        newformData.append(`gap[${index}][start_date]`, gap?.start_date);
        newformData.append(`gap[${index}][end_date]`, gap?.end_date);
        newformData.append(`gap[${index}][reason]`, gap?.reason);

        // Append supporting_document only if it's an object (file)
        if (typeof gap?.supporting_document === "object") {
          newformData.append(
            `gap[${index}][supporting_document]`,
            gap?.supporting_document
          );
        }
      });

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
        setSaveLoading(true);
        try {
          const response = await axios.post("/gapReason", newformData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.status) {
            showSuccessAlert("Gap data saved successfully");
            dispatch(refreshData());
          }
        } catch (error) {
          console.error("Error saving gap data:", error);
          showErrorAlert("Failed to save gap data");
        } finally {
          setSaveLoading(false);
        }
      }
    },
    []
  );

  return {
    saveLoading,
    saveGapData,
  };
};

export default useSaveGapData;
