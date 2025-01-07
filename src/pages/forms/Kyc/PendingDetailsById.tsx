import React, { useEffect, useMemo, useState } from "react";
import { Card, Form, Row } from "react-bootstrap";
import BasicDetails from "./BasicDetails";
import FormButtons from "./FormButtons";
import ProgramAvailabiltyCheck from "./ProgramAvailabiltyCheck";
import CampusCheck from "./CampusCheck";
import EntryRequirementCheck from "./EntryRequirementCheck";
import DocumentQualityCheck from "./DocumentQualityCheck";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { baseUrl, showSuccessAlert } from "../../../constants";
import moment from "moment";
import DocumentQuantityCheck from "./DocumentQuantityCheck";
import PreviousImmigrationCheck from "./PreviousImmigrationCheck";
import ApplicationFeeCheck from "./ApplicationFeeCheck";
import { Col } from "react-bootstrap";
import { FormInput } from "../../../components";
import { withSwal } from "react-sweetalert2";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

const steps = [
  "Program Availability",
  "Campus",
  "Entry Requirement",
  "Document Quantity",
  "Document Quality",
  "Immigration History",
  "Application Fee",
];

const CheckTypes = {
  availability: "availability",
  campus: "campus",
  entry_requirement: "entry_requirement",
  quantity: "quantity",
  quality: "quality",
  immigration: "immigration",
  application_fee: "application_fee",
};

const PendingDetailsById = withSwal((props: any) => {
  const { swal } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [current, setCurrent] = useState(0);
  const [item, setItem] = useState<any>(null);

  const [expanded, setExpanded] = React.useState<string | false>(false);
  // const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);

  const formattedItem = useMemo(
    () => ({
      id: item?.existApplication?.id,
      full_name: item?.studyPreferDetails?.studyPreference?.userPrimaryInfo?.full_name || "N/A",
      country_name: item?.studyPreferDetails?.studyPreference?.country?.country_name || "N/A",
      university_name: item?.studyPreferDetails?.preferred_university?.university_name || "N/A",
      course_name: item?.studyPreferDetails?.preferred_courses?.course_name || "N/A",
      office_type_name: item?.studyPreferDetails?.studyPreference?.userPrimaryInfo?.office_type_name?.office_type_name || "N/A",
      source_name: item?.studyPreferDetails?.studyPreference?.userPrimaryInfo?.source_name?.source_name || "N/A",
      lead_received_date:
        moment(item?.studyPreferDetails?.studyPreference?.userPrimaryInfo?.lead_received_date).format("DD-MM-YYYY") || "N/A",
      date: "2021-01-12 18:30:00",
      assigned_by: "Counsellor",
      assign_type: item?.studyPreferDetails?.studyPreference?.userPrimaryInfo?.assign_type || "N/A",
      assigned_to: item?.assigned_user?.name || "N/A",
      employee_name: "John Doe",
      status: item?.existApplication?.application_status ? "Approved" : "Not Approved",
    }),
    [item]
  );

  const studentId = useMemo(() => item?.studyPreferDetails?.studyPreference?.userPrimaryInfoId, [item]);
  const country_id = useMemo(() => item?.studyPreferDetails?.studyPreference?.countryId, [item]);
  const applicationId = useMemo(() => item?.existApplication?.id, [item]);
  const eligibilityId = useMemo(() => item?.checks?.eligibility_remarks?.id, [item]);
  const isChecksCompleted = useMemo(() => item?.existApplication?.is_application_checks_passed, [item]);
  const universityId = useMemo(() => item?.studyPreferDetails?.preferred_university?.id, [item]);
  const comments = useMemo(() => item?.existApplication?.comments || "", [item]);
  const reference_id = useMemo(() => item?.existApplication?.reference_id || 0, [item]);

  item &&
    !item.assigned_user &&
    swal
      .fire({
        icon: "warning", // Adds a warning icon
        title: "Action Required",
        html: `
      <p style="font-size: 1rem; margin: 10px 0;">
        <strong>Please assign a application member</strong> before proceeding.
      </p>
      <p style="color: #555;">
        You need to assign a application member to handle this case. Click "OK" to return to the pending KYC details page.
      </p>
    `,
        confirmButtonText: "Assign Now", // Better call-to-action
        confirmButtonColor: "#3085d6", // Custom button color
        background: "#f9f9f9", // Light background
        allowOutsideClick: false, // Block interactions outside the alert
        allowEscapeKey: false,
        allowEnterKey: false,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          navigate("/kyc_details/all/pending");
        }
      });

  const handleStepChange = (value: number) => {
    setCurrent(value);
  };

  const getApplicationsById = async (id: any) => {
    try {
      const result = await axios.get(`${baseUrl}/api/application/${id}`);
      if (result) {
        setItem(result?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    searchParams.set("step", steps[current]);
    setSearchParams(searchParams);
  }, [current]);

  useEffect(() => {
    if (id) getApplicationsById(id);
  }, []);

  return (
    <>
      <Row className="mt-2">
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          sx={{
            boxShadow: "none", // Removes the box shadow
            "&:before": {
              display: "none", // Removes the default divider line
            },
          }}
          style={{ borderRadius: "10px" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
            <Typography sx={{ width: "33%", flexShrink: 0 }}>Basic Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <BasicDetails data={formattedItem} studentId={studentId} />
          </AccordionDetails>
        </Accordion>
      </Row>
      <Row className="pt-2">
        <Card style={{borderRadius: "10px"}}>
          <Card.Body>
            <Box sx={{ width: "100%" }}>
              <Stepper activeStep={current} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Card.Body>
        </Card>
      </Row>

      {current === 0 && (
        <ProgramAvailabiltyCheck
          student_id={studentId}
          country_id={country_id}
          application_id={id}
          type={CheckTypes.availability}
          eligibility_id={eligibilityId}
          handleStepChange={handleStepChange}
          current={current}
        />
      )}
      {current === 1 && (
        <CampusCheck
          student_id={studentId}
          country_id={country_id}
          application_id={id}
          type={CheckTypes.campus}
          eligibility_id={eligibilityId}
          handleStepChange={handleStepChange}
          current={current}
        />
      )}
      {current === 2 && (
        <EntryRequirementCheck
          studentId={studentId}
          country_id={country_id}
          application_id={id}
          type={CheckTypes.entry_requirement}
          eligibility_id={eligibilityId}
          handleStepChange={handleStepChange}
          current={current}
        />
      )}
      {current === 3 && (
        <DocumentQuantityCheck
          country_id={country_id}
          studentId={studentId}
          application_id={id}
          type={CheckTypes.quantity}
          eligibility_id={eligibilityId}
          handleStepChange={handleStepChange}
          current={current}
        />
      )}
      {current === 4 && (
        <DocumentQualityCheck
          studentId={studentId}
          country_id={country_id}
          handleStepChange={handleStepChange}
          current={current}
          application_id={id}
          type={CheckTypes.quality}
          eligibility_id={eligibilityId}
        />
      )}
      {current === 5 && (
        <PreviousImmigrationCheck
          country_id={country_id}
          studentId={studentId}
          application_id={id}
          type={CheckTypes.immigration}
          eligibility_id={eligibilityId}
          handleStepChange={handleStepChange}
          current={current}
        />
      )}
      {current === 6 && (
        <ApplicationFeeCheck
          country_id={country_id}
          studentId={studentId}
          application_id={id}
          type={CheckTypes.application_fee}
          eligibility_id={eligibilityId}
          handleStepChange={handleStepChange}
          current={current}
          universityId={universityId}
          comments={comments}
          reference_id={reference_id}
        />
      )}
    </>
  );
});

export default PendingDetailsById;
