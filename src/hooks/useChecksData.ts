import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { refreshData } from "../redux/countryReducer";
import { RootState } from "../redux/store";

interface UseRemarksProps {
  type: string;
  application_id: string;
  eligibility_id: string;
}

export const useRemarks = ({ type, application_id, eligibility_id }: UseRemarksProps) => {
  const [data, setData] = useState<any>(null);
  const [remarks, setRemarks] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [showRemark, setShowRemark] = useState<boolean>(false);
  const [isCheckPassed, setIsCheckPassed] = useState<boolean>(false);
  const [localData, setLocalData] = useState<any>({
    formatting: false,
    clarity: false,
    scanning: false,
  });
  const [qualityForm, setQualityForm] = useState<any>({
    formatting: false,
    clarity: false,
    scanning: false,
  });
  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`/checks/${type}/${application_id}`);
      setData(data.data?.checks);
      setRemarks(data.data?.remarks?.remarks);
      setRemark(data.data?.remarks?.remarks);
      setIsCheckPassed(data?.data?.remarks?.isCheckPassed);
      setQualityForm(data.data?.remarks?.qualityForm);
      setLocalData(data.data?.remarks?.qualityForm);
      setShowRemark(!!data.data?.remarks?.remarks);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  
  const saveRemark = async (value: string) => {
    try {
      await axios.post(`/checks_remarks/${type}/${application_id}`, {
        remarks: value === "" ? null : value,
        eligibility_id,
      });
      dispatch(refreshData());
    } catch (error) {
      console.error("Error saving remark:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [application_id, refresh]);

  return {
    data,
    remarks,
    showRemark,
    saveRemark,
    isCheckPassed,
    localData,
    qualityForm,
    setQualityForm,
    remark,
    setRemark
  };
};
