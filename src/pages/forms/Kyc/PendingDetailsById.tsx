import React, { useEffect, useMemo, useState } from "react";
import { Card, Form, Row } from "react-bootstrap";
import BasicDetails from "./BasicDetails";
import FormButtons from "./FormButtons";
import ProgramAvailabiltyCheck from "./ProgramAvailabiltyCheck";
import CampusCheck from "./CampusCheck";
import EntryRequirementCheck from "./EntryRequirementCheck";
import DocumentQualityCheck from "./DocumentQualityCheck";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl, showSuccessAlert } from "../../../constants";
import moment from "moment";
import DocumentQuantityCheck from "./DocumentQuantityCheck";
import PreviousImmigrationCheck from "./PreviousImmigrationCheck";
import ApplicationFeeCheck from "./ApplicationFeeCheck";
import { Col } from "react-bootstrap";
import { FormInput } from "../../../components";
import { withSwal } from "react-sweetalert2";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const steps = [
  'Program Availability',
  'Campus',
  'Entry Requirement',
  'Document Quantity',
  'Document Quality',
  'Immigration History',
  'Application Fee',
];

const PendingDetailsById = withSwal((props: any) => {
  const { swal } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const [remark, setRemark] = useState<any>("");

  const [current, setCurrent] = useState(0);

  const [item, setItem] = useState<any>({});
  const [checks, setChecks] = useState<any>({});
  const [qualityForm, setQualityForm] = useState<any>({
    formatting: false,
    clarity: false,
    scanning: false,
  });
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const CheckTypes = {
    availability: "availability",
    campus: "campus",
    entry_requirement: "entry_requirement",
    quantity: "quantity",
    quality: "quality",
    immigration: "immigration",
    application_fee: "application_fee",
  };

  const formattedItem = useMemo(
    () => ({
      id: item?.existApplication?.id,
      full_name: item?.studyPreferDetails?.studyPreference?.userPrimaryInfo?.full_name || "N/A",
      country_name: item?.studyPreferDetails?.studyPreference?.country?.country_name || "N/A",
      university_name: item?.studyPreferDetails?.preferred_university?.university_name || "N/A",
      course_name: item?.studyPreferDetails?.preferred_courses?.course_name || "N/A",
      office_type_name: item?.studyPreferDetails?.studyPreference?.userPrimaryInfo?.office_type_name?.office_type_name || "N/A",
      source_name: item?.studyPreferDetails?.studyPreference?.userPrimaryInfo?.source_name?.source_name || "N/A",
      lead_received_date: moment(item?.studyPreferDetails?.studyPreference?.userPrimaryInfo?.lead_received_date).format("DD-MM-YYYY") || "N/A",
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
  const applicationId = useMemo(() => item?.existApplication?.id, [item]);
  const isChecksCompleted = useMemo(() => item?.existApplication?.is_application_checks_passed, [item]);
  const universityId = useMemo(() => item?.studyPreferDetails?.preferred_university?.id, [item]);
  const comments = useMemo(() => item?.existApplication?.comments || "", [item]);
  const reference_id = useMemo(() => item?.existApplication?.reference_id || 0, [item]);
  const application_fee = useMemo(() => item?.studyPreferDetails?.preferred_courses?.campuses?.[0]?.campus_course?.application_fee || 0, [item]);

  const availabilityCheck = useMemo(
    () => ({
      id: item?.existApplication?.id,
      country_name: item?.studyPreferDetails?.studyPreference?.country?.country_name || "N/A",
      university_name: item?.studyPreferDetails?.preferred_university?.university_name || "N/A",
      stream_name: item?.studyPreferDetails?.preferred_stream?.stream_name || "N/A",
      program_name: item?.studyPreferDetails?.preferred_courses?.course_name || "N/A",
      intake_applying_for: `${item?.studyPreferDetails?.intakeMonth || "N/A"} / ${item?.studyPreferDetails?.intakeYear || "N/A"}`,
      course_link: item?.studyPreferDetails?.preferred_courses?.campuses?.[0]?.campus_course?.course_link,
    }),
    [item]
  );

  const campusCheck = useMemo(
    () => ({
      id: item?.existApplication?.id,
      campus_name: item?.studyPreferDetails?.preferred_campus?.campus_name || "N/A",
    }),
    [item]
  );

  const getApplicationsById = async (id: any) => {
    try {
      const result = await axios.get(`${baseUrl}/api/application/${id}`);
      if (result) {
        setItem(result?.data?.data);
        setChecks(result?.data?.data?.checks);
        setQualityForm(result?.data?.data?.checks?.quality_check);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange =
  (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    if (id) getApplicationsById(id);
  }, []);

  const buttonNavigations = async (type: "next" | "prev") => {
    if (type === "next") {
      if (isChecksCompleted) {
        setCurrent(current + 1);
      } else {
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
          handleChecks(current);
          setCurrent(current + 1);
        }
      }
    } else {
      setCurrent(current - 1);
    }
  };

  const submitChecks = async (checkType: any) => {
    try {
      let payload;

      if (checkType == CheckTypes.quality) {
        payload = {
          application_id: applicationId,
          check_type: checkType,
          quality_value: qualityForm,
        };
      } else {
        payload = {
          application_id: applicationId,
          check_type: checkType,
        };
      }

      const res = await axios.put(`/check_application`, payload);

      if (res) {
        showSuccessAlert("Approved Suucessfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChecks = (index: any) => {
    switch (index) {
      case 0:
        if (!checks?.availability_check) submitChecks(CheckTypes.availability);
        break;
      case 1:
        if (!checks?.campus_check) submitChecks(CheckTypes.campus);
        break;
      case 2:
        if (!checks?.entry_requirement_check) submitChecks(CheckTypes.entry_requirement);
        break;
      case 3:
        if (!checks?.quantity_check) submitChecks(CheckTypes.quantity);
        break;
      case 4:
        if (!(checks?.quality_check?.clarity && checks?.quality_check?.scanning && checks?.quality_check?.formatting))
          submitChecks(CheckTypes.quality);
        break;
      case 5:
        if (!checks?.immigration_check) submitChecks(CheckTypes.immigration);
        break;
      default:
        break;
    }
  };

  const rejectApplication = async (id: any) => {
    try {
      let payload = {
        student_id: studentId,
        remarks: remark,
        application_id: applicationId,
      };

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
        const res = await axios.post(`/kyc_reject`, payload);
        if (res) {
          showSuccessAlert("Rejected Succesfully");
          navigate('/kyc_details/applications/pending');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejection = (value: number) => {
    rejectApplication(value);
  };

  const handleCheckChange = (name: any, checked: any) => {
    setQualityForm((prev: any) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleProceedApplication = async (value: any) => {
    if (!value) return;

    try {
      // If all checks are completed, proceed to submit the application checks.
      if (!isChecksCompleted) {
        await submitChecks(CheckTypes.application_fee);
      }

      // Navigate to the specified page, passing the required state.
      navigate("/kyc_details/pending/portal_details", {
        state: { universityId, applicationId, comments, reference_id },
      });
    } catch (error) {
      console.error("Error submitting application checks:", error);
      // Optionally, display an error message to the user here
    }
  };

  return (
    <>
      <Row className="mt-2">
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Basic Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <BasicDetails data={formattedItem} studentId={studentId} />
        </AccordionDetails>
      </Accordion>
      </Row>
      <Row className="pt-2">
        <Card>
          <Card.Body>
            <Box sx={{ width: '100%' }}>
              <Stepper activeStep={current} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Card.Body>
        </Card>
      </Row>

      {current === 0 && <ProgramAvailabiltyCheck data={availabilityCheck} />}
      {current === 1 && <CampusCheck data={campusCheck} />}
      {current === 2 && <EntryRequirementCheck studentId={studentId} />}
      {current === 3 && <DocumentQuantityCheck studentId={studentId} />}
      {current === 4 && <DocumentQualityCheck studentId={studentId} handleFormData={handleCheckChange} quality={qualityForm} />}
      {current === 5 && <PreviousImmigrationCheck studentId={studentId} />}
      {current === 6 && <ApplicationFeeCheck studentId={studentId} fee={application_fee} />}

      <Row style={{ padding: "0px" }}>
        <Col md={12} style={{ padding: "0px" }}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <FormInput
              labelClassName="ms-2"
              name="remarks"
              type="textarea"
              rows="6"
              label="Remarks"
              value={remark}
              onChange={(e) => setRemark(e.target?.value)}
            />
          </Form.Group>
        </Col>
        <FormButtons
          studentId={studentId}
          handleNavigation={buttonNavigations}
          current={current}
          handleReject={handleRejection}
          handleProceed={handleProceedApplication}
        />
      </Row>
    </>
  );
});

export default PendingDetailsById;
