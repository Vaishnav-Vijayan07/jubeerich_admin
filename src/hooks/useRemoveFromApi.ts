import swal from "sweetalert2";
import axios from "axios";
import { useState } from "react";
import { showErrorAlert, showSuccessAlert } from "../constants";
import { useDispatch } from "react-redux";
import { refreshData } from "../redux/countryReducer";

const useRemoveFromApi = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const removeFromApi = async (id: any, type: string) => {
    try {
      const result = await swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete",
      });

      if (result.isConfirmed) {
        setLoading(true);

        try {
          const res = await axios.delete(`basic_info/${type}/${id}`, {
            headers: {
              "Content-Type": "application/json", // Assuming no file data is sent
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { removeFromApi, loading };
};

export default useRemoveFromApi;
