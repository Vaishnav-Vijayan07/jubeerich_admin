import axios from "axios";
import React, { useEffect, useState } from "react";
import { showErrorAlert } from "../../../../../constants";
import { Button, Row, Spinner } from "react-bootstrap";
import FundPlanRows from "./FundPlanRows";
import validateFields from "../../../../../helpers/validateHelper";
import useSaveFundPlan from "../../../../../hooks/useSaveFundPlan";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import useRemoveFromApi from "../../../../../hooks/useRemoveFromApi";

interface Props {
  student_id: string | number;
}

const initialFundPlanState = {
  type: "",
  fund_origin: "",
  sponsor_name: "",
  approx_annual_income: "",
  relation_with_sponsor: "",
  sponsorship_amount: "",
  name_of_bank: "",
  itr_status: "no",
  has_min_6_months_backup: "no",
  source_of_funds: "",
  supporting_document: null,
  errors: {},
};

const FundPlan = ({ student_id }: Props) => {
  const [fundPlan, setFundPlan] = useState<any>([initialFundPlanState]);
  const [initialLoading, setInitialLoading] = useState(false);

  const { saveFundPlan, saveLoading } = useSaveFundPlan(student_id);
  const { loading, removeFromApi } = useRemoveFromApi();

  const refreshing = useSelector(
    (state: RootState) => state.refreshReducer.refreshing
  );

  const handleAddMoreFundPlan = () => {
    setFundPlan([
      ...fundPlan,
      {
        type: "",
        fund_origin: "",
        sponsor_name: "",
        approx_annual_income: "",
        relation_with_sponsor: "",
        sponsorship_amount: "",
        name_of_bank: "",
        itr_status: "no",
        has_min_6_months_backup: "no",
        source_of_funds: "",
        supporting_document: null,
        errors: {},
      },
    ]);
  };

  const removeFundPlan = (index: number, id: string | number) => {
    if (id == 0) {
      const newFundPlan = [...fundPlan];
      newFundPlan.splice(index, 1);
      setFundPlan(newFundPlan);
    } else {
      removeFromApi(id, "fund");
    }
  };

  const saveFundPlanData = () => {

    console.log(fundPlan);
    

    const validationRules = {
      type: { required: true },
      fund_origin: { required: true },
      has_min_6_months_backup : { required: true },
      source_of_funds: { required: true },
      sponsor_name: { required: true },
      approx_annual_income: { required: true },
      itr_status: { required: true },
      supporting_document: { required: true },
      relation_with_sponsor: { required: true },
      sponsorship_amount: { required: true },
      name_of_bank: { required: true },
    };
    // const { isValid, errors } = validateFields(fundPlan, validationRules);

    // if (!isValid) {
    //   // Ensure validation errors are displayed
    //   setFundPlan((prevState: any) =>
    //     prevState.map((exp: any, index: any) => ({
    //       ...exp,
    //       errors: errors[index] || {}, // Attach errors to specific fields
    //     }))
    //   );
    //   return;
    // }
    saveFundPlan(fundPlan);
  };

  const handleFundPlanInputChange = (
    index: number,
    name: string,
    value: string | number | File
  ) => {
    const newFundPlan = [...fundPlan];
    newFundPlan[index] = {
      ...newFundPlan[index], // Ensure you don't overwrite the whole object
      [name]: value, // Update the specific field dynamically
    };
    setFundPlan(newFundPlan);
  };

  const fetchFundPlan = async (student_id: string | number) => {
    try {
      setInitialLoading(true);
      const { data } = await axios.get(`studentFundInfo/${student_id}`);

      console.log(data?.data);

      data?.data.length > 0
        ? setFundPlan(data.data)
        : setFundPlan([initialFundPlanState]);
    } catch (error) {
      console.error("Error fetching fund plan:", error);
      showErrorAlert("Failed to fetch fund plan");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (student_id) {
      fetchFundPlan(student_id);
    }
  }, [student_id, refreshing]);

  // if (initialLoading) {
  //   return (
  //     <Spinner
  //       animation="border"
  //       style={{ position: "absolute", top: "100%", left: "45%" }}
  //     />
  //   );
  // }

  return (
    <>
      <Row>
        <FundPlanRows
          fundPlan={fundPlan}
          handleFundPlanInputChange={handleFundPlanInputChange}
          removeFundPlan={removeFundPlan}
          handleAddMoreFundPlan={handleAddMoreFundPlan}
        />
      </Row>

      <Row>
        <Button
          variant="primary"
          className="mt-4"
          type="submit"
          onClick={saveFundPlanData}
          disabled={saveLoading}
        >
          {saveLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              {" Saving..."} {/* Show spinner and text */}
            </>
          ) : (
            "Save Details" // Normal button text when not loading
          )}
        </Button>
      </Row>
    </>
  );
};

export default FundPlan;
