import { RootState } from "./../redux/store";
import { useState, useCallback } from "react";
import axios from "axios";
import swal from "sweetalert2";
import { showErrorAlert, showSuccessAlert } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { refreshData } from "../redux/countryReducer";

const useSaveWorkInfo = (studentId: number | string) => {
  const [saveLoading, setSaveLoading] = useState(false);
  const dispatch = useDispatch();

  const saveWorkDetails = useCallback(
    async (workDetails: any[]) => {
      const newFormData = new FormData();
      newFormData.append(`user_id`, studentId.toString());

      workDetails.forEach((work: any, index: any) => {
        const itemId = work.id ?? 0;
        newFormData.append(`workExperience[${index}][id]`, itemId.toString());

        newFormData.append(`workExperience[${index}][years]`, work.years);
        newFormData.append(
          `workExperience[${index}][designation]`,
          work.designation
        );
        newFormData.append(`workExperience[${index}][company]`, work.company);
        newFormData.append(`workExperience[${index}][from]`, work.from);
        newFormData.append(`workExperience[${index}][to]`, work.to);

        // Append files with indexed field names for compatibility with multer
        if (typeof work?.bank_statement === "object") {
          newFormData.append(
            `workExperience[${index}][bank_statement]`,
            work.bank_statement
          );
        }

        if (typeof work?.experience_certificate === "object") {
          newFormData.append(
            `workExperience[${index}][experience_certificate]`,
            work.experience_certificate
          );
        }

        if (typeof work?.job_offer_document === "object") {
          newFormData.append(
            `workExperience[${index}][job_offer_document]`,
            work.job_offer_document
          );
        }

        if (typeof work?.appointment_document === "object") {
          newFormData.append(
            `workExperience[${index}][appointment_document]`,
            work.appointment_document
          );
        }

        if (typeof work?.payslip_document === "object") {
          newFormData.append(
            `workExperience[${index}][payslip_document]`,
            work.payslip_document
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
          const res = await axios.post("studentWorkInfo", newFormData, {
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
          setSaveLoading(false);
        }
      }
    },
    [studentId]
  );

  return { saveWorkDetails, saveLoading };
};

export default useSaveWorkInfo;
