import { useState, useCallback } from "react";
import axios from "axios";
import swal from "sweetalert2";
import { showErrorAlert, showSuccessAlert } from "../constants";
import { useDispatch } from "react-redux";
import { refreshData } from "../redux/countryReducer";

const useSaveGraduationInfo = (studentId: number | string) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const saveStudentGraduationDetails = useCallback(
    async (graduationDetails: any[], is_graduated: any) => {
      const newFormData = new FormData();
      newFormData.append(`student_id`, studentId.toString());
      newFormData.append(`is_graduated`, is_graduated.toString());

      graduationDetails.forEach((detail: any, index: any) => {
        const itemId = detail.id ?? 0;
        newFormData.append(`graduation[${index}][id]`, itemId.toString());

        newFormData.append(
          `graduation[${index}][start_date]`,
          detail.start_date
        );
        newFormData.append(`graduation[${index}][end_date]`, detail.end_date);
        newFormData.append(
          `graduation[${index}][percentage]`,
          detail.percentage
        );
        newFormData.append(
          `graduation[${index}][conversion_formula]`,
          detail.conversion_formula
        );
        newFormData.append(
          `graduation[${index}][qualification]`,
          detail.qualification
        );
        newFormData.append(
          `graduation[${index}][college_name]`,
          detail.college_name
        );
        newFormData.append(
          `graduation[${index}][university_name]`,
          detail.university_name
        );

        // Append files with indexed field names for compatibility with multer
        if (typeof detail?.certificate === "object") {
          newFormData.append(
            `graduation[${index}][certificate]`,
            detail.certificate
          );
        }

        if (typeof detail?.admit_card === "object") {
          newFormData.append(
            `graduation[${index}][admit_card]`,
            detail.admit_card
          );
        }

        if (typeof detail?.registration_certificate === "object") {
          newFormData.append(
            `graduation[${index}][registration_certificate]`,
            detail.registration_certificate
          );
        }

        if (typeof detail?.backlog_certificate === "object") {
          newFormData.append(
            `graduation[${index}][backlog_certificate]`,
            detail.backlog_certificate
          );
        }

        if (typeof detail?.grading_scale_info === "object") {
          newFormData.append(
            `graduation[${index}][grading_scale_info]`,
            detail.grading_scale_info
          );
        }

        if (typeof detail?.transcript === "object") {
          newFormData.append(
            `graduation[${index}][transcript]`,
            detail.transcript
          );
        }

        if (typeof detail?.individual_marksheet === "object") {
          newFormData.append(
            `graduation[${index}][individual_marksheet]`,
            detail.individual_marksheet
          );
        }
      });

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
        setLoading(true);
        try {
          const res = await axios.post("graduationDetails", newFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("res: =>", res);
          dispatch(refreshData());
          showSuccessAlert(res.data.message);
        } catch (err) {
          console.log(err);
          showErrorAlert(err);
        } finally {
          setLoading(false);
        }
      }
    },
    [studentId]
  );

  return { saveStudentGraduationDetails, loading };
};

export default useSaveGraduationInfo;
