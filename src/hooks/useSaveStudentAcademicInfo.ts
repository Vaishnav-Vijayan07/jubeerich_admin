import { useState, useCallback } from "react";
import axios from "axios";
import swal from "sweetalert2";
import { showErrorAlert, showSuccessAlert } from "../constants";
import {
  isAllItemsPresentAcademic,
  isAllItemsPresentExam,
} from "../utils/fieldsChecker";

const useSaveStudentAcademicInfo = (
  studentId: number,
  getAcademicInfo: () => void
) => {
  const [loading, setLoading] = useState(false);

  const saveStudentAcademicInfo = useCallback(
    async (academicInfoFromApi: any[], examForm: any[]) => {
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

      if (examForm.length > 0) {
        const validItems = examForm.filter((item: any) =>
          isAllItemsPresentExam(item)
        );

        validItems.forEach((item: any, index: number) => {
          const itemId = item.id ?? 0;

          newFormData.append(`exam_details[${index}][id]`, itemId);
          newFormData.append(
            `exam_details[${index}][exam_name]`,
            item.exam_name
          );
          newFormData.append(`exam_details[${index}][marks]`, item.marks);
          newFormData.append(`exam_details[${index}][document]`, item.document);
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