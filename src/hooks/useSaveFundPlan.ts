import swal from "sweetalert2";
import { useCallback, useState } from "react";
import { showErrorAlert, showSuccessAlert } from "../constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { refreshData } from "../redux/countryReducer";

const useSaveFundPlan = (studentId: string | number) => {
  const [saveLoading, setSaveLoading] = useState(false);

  const dispatch = useDispatch();

  const saveFundPlan = useCallback(
    async (fundPlanDetails: any[]) => {
      const newFormData = new FormData();
      newFormData.append("student_id", studentId.toString());

      fundPlanDetails.forEach((fund: any, index: any) => {
        const itemId = fund.id ?? 0;
        newFormData.append(`fund_details[${index}][id]`, itemId.toString());

        newFormData.append(`fund_details[${index}][type]`, fund.type);
        newFormData.append(
          `fund_details[${index}][sponsor_name]`,
          fund.sponsor_name
        );
        newFormData.append(
          `fund_details[${index}][approx_annual_income]`,
          fund.approx_annual_income.toString()
        );
        newFormData.append(
          `fund_details[${index}][relation_with_sponsor]`,
          fund.relation_with_sponsor
        );
        newFormData.append(
          `fund_details[${index}][sponsorship_amount]`,
          fund.sponsorship_amount.toString()
        );
        newFormData.append(
          `fund_details[${index}][name_of_bank]`,
          fund.name_of_bank
        );


        // Append supporting_document only if it's an object (file)
        if (typeof fund?.supporting_document === "object") {
          newFormData.append(
            `fund_details[${index}][supporting_document]`,
            fund.supporting_document
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
          const res = await axios.post("studentFundInfo", newFormData, {
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

  return { saveFundPlan, saveLoading };
};

export default useSaveFundPlan;
