import Swal from "sweetalert2";

export const showConfirmation = async (message = "Do you want to delete?") => {
  return await Swal.fire({
    title: "Confirm Action",
    text: message,
    icon: "question",
    iconColor: "#8B8BF5",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#8B8BF5",
    cancelButtonColor: "#E97777",
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
};
