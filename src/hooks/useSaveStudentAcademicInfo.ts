import { useState, useCallback } from "react";
import axios from "axios";
import swal from "sweetalert2";
import {
  AUTH_SESSION_KEY,
  showErrorAlert,
  showSuccessAlert,
} from "../constants";
import {
  isAllItemsPresentAcademic,
  isAllItemsPresentExam,
} from "../utils/fieldsChecker";

let userId: any;
let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

if (userInfo) {
  let { user_id } = JSON.parse(userInfo);
  userId = user_id;
}

const useSaveStudentAcademicInfo = (
  studentId: number,
  getAcademicInfo: () => void
) => {
  const [loading, setLoading] = useState(false);

  // Function to append academic info to FormData
  const appendAcademicInfoToFormData = (
    academicInfoFromApi: any[],
    formData: FormData
  ) => {
    if (academicInfoFromApi.length > 0) {
      academicInfoFromApi.forEach((record: any, index: any) => {
        const itemId = record.id ?? "0";
        formData.append(`academicRecords[${index}][id]`, itemId);
        formData.append(
          `academicRecords[${index}][qualification]`,
          record.qualification
        );
        formData.append(`academicRecords[${index}][place]`, record.place);
        formData.append(
          `academicRecords[${index}][percentage]`,
          record.percentage
        );
        formData.append(
          `academicRecords[${index}][year_of_passing]`,
          record.year_of_passing
        );
        formData.append(`academicRecords[${index}][backlogs]`, record.backlogs);
      });
    }
  };

  // Function to append exam info to FormData
  const appendExamInfoToFormData = (examForm: any[], formData: FormData) => {
    examForm.forEach((item: any, index: number) => {
      const itemId = item.id ?? 0;
      formData.append(`examRecords[${index}][id]`, itemId);
      formData.append(`examRecords[${index}][exam_type]`, item.exam_type);
      formData.append(
        `examRecords[${index}][listening_score]`,
        item.listening_score
      );
      formData.append(
        `examRecords[${index}][speaking_score]`,
        item.speaking_score
      );
      formData.append(
        `examRecords[${index}][reading_score]`,
        item.reading_score
      );
      formData.append(
        `examRecords[${index}][writing_score]`,
        item.writing_score
      );
      formData.append(
        `examRecords[${index}][overall_score]`,
        item.overall_score
      );
      formData.append(
        `examRecords[${index}][exam_remarks]`,
        item.exam_remarks ? item.exam_remarks : ""
      );
      formData.append(`examRecords[${index}][exam_date]`, item.exam_date ? item.exam_date : null);
      formData.append(`examRecords[${index}][updated_by]`, userId);
      if (typeof item?.score_card === "object") {
        formData.append(`examRecords[${index}][score_card]`, item.score_card);
      }
    });
  };

  // Function to save academic information
  const saveStudentAcademicInfo = useCallback(
    async (academicInfoFromApi: any[]) => {
      const newFormData = new FormData();

      appendAcademicInfoToFormData(academicInfoFromApi, newFormData);

      newFormData.append("user_id", studentId.toString());

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
          const res = await axios.post("studentAcademicInfo", newFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("res: =>", res);
          showSuccessAlert(res.data.message);
          getAcademicInfo();
        } catch (err) {
          console.log(err);
          showErrorAlert(err);
        } finally {
          setLoading(false);
        }
      }
    },
    [studentId, getAcademicInfo]
  );

  // Function to save exam information
  const saveStudentExamInfo = useCallback(
    async (examForm: any[], hasExams: boolean) => {
      const newFormData = new FormData();

      appendExamInfoToFormData(examForm, newFormData);

      newFormData.append("user_id", studentId.toString());
      newFormData.append("ielts", hasExams.toString());

      const result = await swal.fire({
        title: "Confirm Action",
        text: `Do you want to save exam info?`,
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
          const res = await axios.post("studentExamInfo", newFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("res: =>", res);
          showSuccessAlert(res.data.message);
          getAcademicInfo();
        } catch (err) {
          console.log(err);
          showErrorAlert(err);
        } finally {
          setLoading(false);
        }
      }
    },
    [studentId, getAcademicInfo]
  );

  return { saveStudentAcademicInfo, saveStudentExamInfo, loading };
};

export default useSaveStudentAcademicInfo;
