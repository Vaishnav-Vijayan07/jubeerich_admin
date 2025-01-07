import axios from "axios";
import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { showSuccessAlert } from "../../../constants";
import { useNavigate, useSearchParams } from "react-router-dom";

const CheckTypes = {
  availability: "availability",
  campus: "campus",
  entry_requirement: "entry_requirement",
  quantity: "quantity",
  quality: "quality",
  immigration: "immigration",
  application_fee: "application_fee",
};

function FormButtons({
  successNavigate,
  type,
  isCheckPassed,
  current,
  handleStepChange,
  student_id,
  country_id,
  application_id,
  remarks,
  qualityForm,
  localData,
}: any) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const checkChangeInData = () => {
    return JSON.stringify(qualityForm) !== JSON.stringify(localData);
  };

  const rejectApplication = async (id: any) => {
    let payload = {
      student_id: student_id,
      remarks: `${remarks}-Rejected from ${searchParams.get("step")}`,
      application_id: application_id,
      assigned_country_id: country_id,
    };

    console.log("payload", payload);

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save",
      });

      if (result.isConfirmed) {
        const res = await axios.post(`/kyc_reject`, payload);
        if (res) {
          showSuccessAlert("Rejected Succesfully");
          navigate("/kyc_details/applications/pending");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("isCheckPassed", isCheckPassed);

  const handleNext = async () => {
    const isChangeDetectionNeeded = type === "quality" && checkChangeInData();

    if (!isCheckPassed || isChangeDetectionNeeded) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: "Yes, Save",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#8B8BF5", // Purple color for confirm button
        cancelButtonColor: "#E97777", // Pink/red color for cancel button
        buttonsStyling: true,
        customClass: {
          popup: "rounded-4 shadow-lg",
          confirmButton: "btn btn-lg px-4 rounded-3 order-2",
          cancelButton: "btn btn-lg px-4 rounded-3 order-1",
          title: "fs-2 fw-normal mb-2",
        },
        width: "26em",
        padding: "2em",
      });

      if (result.isConfirmed) {
        await handleChecks(type);
        handleStepChange(current + 1);
      }
    } else {
      handleStepChange(current + 1);
    }
  };

  const handleNavigation = (type: "next" | "prev") => {
    if (type == "next") {
      handleNext();
    } else {
      handleStepChange(current - 1);
    }
  };

  const handleChecks = async (type: any) => {
    switch (type) {
      case "availability":
        await submitChecks(CheckTypes.availability);
        break;
      case "campus":
        submitChecks(CheckTypes.campus);
        break;
      case "entry_requirement":
        submitChecks(CheckTypes.entry_requirement);
        break;
      case "quantity":
        submitChecks(CheckTypes.quantity);
        break;
      case "quality":
        submitChecks(CheckTypes.quality);
        break;
      case "immigration":
        submitChecks(CheckTypes.immigration);
        break;
      default:
        break;
    }
  };

  const submitChecks = async (checkType: any) => {
    try {
      let payload;

      if (checkType == CheckTypes.quality) {
        payload = {
          application_id: application_id,
          check_type: checkType,
          quality_value: qualityForm,
        };
      } else {
        payload = {
          application_id: application_id,
          check_type: checkType,
        };
      }

      const { data } = await axios.put(`/check_application`, payload);

      if (data?.status) {
        showSuccessAlert("Approved Suucessfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProceedApplication = async () => {
    try {
      // If all checks are completed, proceed to submit the application checks.
      if (!isCheckPassed) {
        await submitChecks(CheckTypes.application_fee);
      }

      successNavigate();
    } catch (error) {
      console.error("Error submitting application checks:", error);
      // Optionally, display an error message to the user here
    }
  };

  return (
    <>
      <Row>
        <Col className="d-flex justify-content-end">
          <Button
            style={{ backgroundColor: "#F1556C", color: "white", border: "none", borderRadius: "5px" }}
            className="me-2"
            onClick={() => rejectApplication(application_id)}
          >
            Reject
          </Button>

          {current !== 0 && (
            <Button
              style={{ backgroundColor: "#B3ACEE", color: "white", border: "none", borderRadius: "5px" }}
              className="me-2"
              onClick={() => handleNavigation("prev")}
            >
              Previous
            </Button>
          )}

          {current !== 6 ? (
            <Button
              style={{ backgroundColor: "#6658DD", color: "white", border: "none", borderRadius: "5px" }}
              onClick={() => handleNavigation("next")}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleProceedApplication}>Proceed to application</Button>
          )}
        </Col>
      </Row>
    </>
  );
}

export default FormButtons;
