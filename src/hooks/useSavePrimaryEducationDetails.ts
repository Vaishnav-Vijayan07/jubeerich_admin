import axios from "axios";
import { useCallback, useState } from "react";
import { showErrorAlert, showSuccessAlert } from "../constants";

const useSaveEducationDetails = (
  fetchEducationDetails: (id: string) => void
) => {
  const [loading, setLoading] = useState(false);

  const saveEducationDetails = useCallback(
    async (formData: FormData, type: string, studentId: string) => {
      setLoading(true);
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
          fetchEducationDetails(studentId);
          showSuccessAlert(data.message);
        }
      } catch (error) {
        console.error("Error saving education details:", error);
        showErrorAlert("Failed to save education details");
      } finally {
        setLoading(false);
      }
    },
    [fetchEducationDetails]
  );

  return { saveEducationDetails, loading };
};

export default useSaveEducationDetails;
