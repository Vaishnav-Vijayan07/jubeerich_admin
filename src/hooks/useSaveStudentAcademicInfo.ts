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

  const saveStudentAcademicInfo = useCallback(
    async (academicInfoFromApi: any[], examForm: any[]) => {
      console.log(examForm);
      const newFormData = new FormData();

      if (academicInfoFromApi.length > 0) {
        const validItems = academicInfoFromApi.filter((item: any) =>
          isAllItemsPresentAcademic(item)
        );

        validItems.forEach((record: any, index: any) => {
          const itemId = record.id ?? "0";

          newFormData.append(`academicRecords[${index}][id]`, itemId);
          newFormData.append(
            `academicRecords[${index}][qualification]`,
            record.qualification
          );
          newFormData.append(`academicRecords[${index}][place]`, record.place);
          newFormData.append(
            `academicRecords[${index}][percentage]`,
            record.percentage
          );
          newFormData.append(
            `academicRecords[${index}][year_of_passing]`,
            record.year_of_passing
          );
          newFormData.append(
            `academicRecords[${index}][backlogs]`,
            record.backlogs
          );
        });
      }

      // if (examForm.length > 0) {
      //   const validItems = examForm.filter((item: any) =>
      //     isAllItemsPresentExam(item)
      //   );

      //   validItems.forEach((item: any, index: number) => {
      //     const itemId = item.id ?? 0;

      //     newFormData.append(`exam_details[${index}][id]`, itemId);
      //     newFormData.append(
      //       `exam_details[${index}][exam_name]`,
      //       item.exam_name
      //     );
      //     newFormData.append(`exam_details[${index}][marks]`, item.marks);
      //     newFormData.append(`exam_details[${index}][document]`, item.document);
      //     if (typeof item?.exam_documents === "object") {
      //       newFormData.append(`exam_documents`, item.exam_documents);
      //     }
      //   });
      // }

      if (examForm.length > 0) {
        const validItems = examForm.filter((item: any) =>
          isAllItemsPresentExam(item)
        );

        validItems.forEach((item: any, index: number) => {
          const itemId = item.id ?? 0;

          newFormData.append(`exam_details[${index}][id]`, itemId);
          newFormData.append(
            `exam_details[${index}][exam_type]`,
            item.exam_type
          );
          newFormData.append(
            `exam_details[${index}][score_card]`,
            item.score_card
          );
          newFormData.append(
            `exam_details[${index}][listening_score]`,
            item.listening_score
          );
          newFormData.append(
            `exam_details[${index}][speaking_score]`,
            item.speaking_score
          );
          newFormData.append(
            `exam_details[${index}][reading_score]`,
            item.reading_score
          );
          newFormData.append(
            `exam_details[${index}][writing_score]`,
            item.writing_score
          );
          newFormData.append(
            `exam_details[${index}][overall_score]`,
            item.overall_score
          );
          newFormData.append(
            `exam_details[${index}][exam_date]`,
            item.exam_date
          );
          newFormData.append(`exam_details[${index}][updated_by]`, userId);
          if (typeof item?.exam_documents === "object") {
            newFormData.append(`exam_documents`, item.exam_documents);
          }
        });
      }

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
          const res = await axios.post("saveStudentAcademicInfo", newFormData, {
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

  return { saveStudentAcademicInfo, loading };
};

export default useSaveStudentAcademicInfo;
