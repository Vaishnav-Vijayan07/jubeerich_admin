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
        title: "Confirm Action",
        text: `Do you want to delete?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, Delete`,
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
