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
      formData.append(`examRecords[${index}][exam_date]`, item.exam_date);
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
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save",
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
    async (examForm: any[]) => {
      const newFormData = new FormData();

      appendExamInfoToFormData(examForm, newFormData);

      newFormData.append("user_id", studentId.toString());

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
