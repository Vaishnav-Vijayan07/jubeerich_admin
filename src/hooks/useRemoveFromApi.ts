import axios from "axios";
import { useState } from "react";
import { showErrorAlert, showSuccessAlert } from "../constants";
import { useDispatch } from "react-redux";
import { refreshData } from "../redux/countryReducer";

const useRemoveFromApi = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const removeFromApi = async (id: any, type: any, user_id: any) => {
    setLoading(true);
    try {
      const res = await axios.delete(`basic_info/${type}/${id}/${user_id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response: =>", res);
      showSuccessAlert(res.data.message);
      dispatch(refreshData());
    } catch (err) {
      console.error(err);
      showErrorAlert("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { removeFromApi, loading };
};

export default useRemoveFromApi;
