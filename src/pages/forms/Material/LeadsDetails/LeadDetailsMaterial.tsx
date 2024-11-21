import React, { Suspense, useEffect, useState } from "react";
import { Card, Nav, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import useDropdownData from "../../../../hooks/useDropdownDatas";
import { RootState } from "../../../../redux/store";
import { useParams } from "react-router-dom";
import BasicInfo from "../../../lead_management/Tasks/List/BasicInfo";
import AcademicInfo from "../../../lead_management/Tasks/List/AcademicInfo";
import VisaProcess from "../../../lead_management/Tasks/List/VisaProcess";
import StudyPreference from "../../../lead_management/Tasks/List/StudyPreference/StudyPreference";
import FundPlan from "../../../lead_management/Tasks/List/FundPlan/FundPlan";
import EducationDetails from "../../../lead_management/Tasks/List/EducationDetails";
import Comments from "../../../lead_management/Tasks/List/Comments";
import Attachments from "../../../lead_management/Tasks/List/Attachments";
import AdditionalDocuments from "../../../lead_management/Tasks/List/AdditionalDocuments";
import PassportDetails from "../../../lead_management/Tasks/List/PassportDetails";
import FamilyDetails from "../../../lead_management/Tasks/List/FamilyDetails/FamilyDetails";
import WorkExpereince from "../../../lead_management/Tasks/List/WorkExpereince/WorkExpereince";
import axios from "axios";
import { icons } from "../../../../assets/images/icons";
import moment from "moment";
import DocumentsOverview from "../../../lead_management/Tasks/List/DocumentsOverview/DocumentsOverview";
import History from "../../../lead_management/Tasks/List/History";
import { Accordion, AccordionDetails, AccordionSummary, Box, Tab, Tabs, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Props {}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const LeadDetailsMaterial = (props: Props) => {
  const { id: studentId } = useParams();
  const [basicInfo, setBasicInfo] = useState<any>({});
  const [tabValue, setTabValue] = React.useState("basic_info");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const dispatch = useDispatch();
  const { user, refresh } = useSelector((state: RootState) => ({
    user: state.Auth.user,
    refresh: state.refreshReducer.refreshing,
  }));

  const { dropdownData, loading } = useDropdownData("marital,officeType,franchise,region");
  const { officeTypes, regions, franchises, maritalStatus } = dropdownData;

  const getBasicInfo = async () => {
    try {
      const { data } = await axios.get(`/getStudentBasicInfo/${studentId}`);
      setBasicInfo(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getBasicInfo();
  }, []);

  if (loading) {
    return <Spinner animation="border" style={{ position: "absolute", top: "50%", left: "50%" }} />;
  }

  const tabsStyle = {
    "& .MuiTabs-indicator": {
      backgroundColor: "#26BCA2",
      height: "4px",
      fontWeight: "bold",
      fontSize: "16px",
    },
  };

  const individualTabStyle = {
    "&.Mui-selected": {
      color: "black",
    },
    marginBottom: "0.6rem",
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
  };

  return (
    <>
      <Accordion className="mt-3 mb-3 py-2 px-3" style={{ boxShadow: "none" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
          <h4 className="text-secondary mt-0 mb-0">Basic Details</h4>
        </AccordionSummary>
        <AccordionDetails>
          <Row className="mt-1">
            <div className="grid-container mb-2">
              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Name</p>
                <div className="d-flex align-items-start" style={{ gap: "5px" }}>
                  <img src={icons.user} alt="date" className="me-1" height="16" />
                  <h5 className="m-0 font-size-14">{basicInfo?.full_name}</h5>
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Phone Number</p>
                <div className="d-flex align-items-center outline-none" style={{ gap: "5px" }}>
                  <img src={icons.apple} alt="phone" className="me-1" width="16" />
                  <input
                    type="tel"
                    value={basicInfo?.phone}
                    style={{
                      border: "none",
                      outline: "none",
                      width: "100%",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Email</p>
                <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                  <img src={icons.email} alt="email" className="me-1" width="17" />
                  <input
                    type="text"
                    value={basicInfo?.email}
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: "16px",
                      fontWeight: 600,
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              <br className="grid-br" />
              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Source</p>
                <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                  <img src={icons.cloud} alt="source icon" className="me-1" width="16" />
                  <h5 className="m-0 font-size-14">{basicInfo?.source_name}</h5>
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">Channel</p>
                <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                  <img src={icons.information} alt="cahnnel icon" className="me-1" width="16" />
                  <h5 className="m-0 font-size-14">{basicInfo?.channel_name}</h5>
                </div>
              </div>

              <div className="">
                <p className="mt-2 mb-1 text-muted fw-light">City</p>
                <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                  <img src={icons.business} alt="comapny icon" className="me-1" width="16" />
                  <h5 className="m-0 font-size-14">{basicInfo?.city}</h5>
                </div>
              </div>
            </div>
          </Row>
        </AccordionDetails>
      </Accordion>

      <Card>
        <Card.Body>
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={tabValue}
              onChange={handleChange}
              textColor="secondary"
              variant="scrollable"
              aria-label="secondary tabs example"
              sx={{ ...tabsStyle }}
            >
              <Tab value="basic_info" label="Basic Info" sx={{ ...individualTabStyle }} />
              <Tab value="exam_details" label="Exam Details" sx={{ ...individualTabStyle }} />
              <Tab value="work_exp" label="Work Experience" sx={{ ...individualTabStyle }} />
              <Tab value="study_pref" label="Study Preference" sx={{ ...individualTabStyle }} />
              <Tab value="education" label="Education Details" sx={{ ...individualTabStyle }} />
              <Tab value="fund_plan" label="Fund Plan" sx={{ ...individualTabStyle }} />
              <Tab value="comments" label="Comments" sx={{ ...individualTabStyle }} />
              <Tab value="history" label="History" sx={{ ...individualTabStyle }} />
              <Tab value="passport" label="Passport Details" sx={{ ...individualTabStyle }} />
              <Tab value="family" label="Family Details" sx={{ ...individualTabStyle }} />
              <Tab value="visa" label="Visa Process" sx={{ ...individualTabStyle }} />
              <Tab value="add_docs" label="Additional Documents" sx={{ ...individualTabStyle }} />
              <Tab value="docs_overview" label="Documents Overview" sx={{ ...individualTabStyle }} />
            </Tabs>

            {/* Tab content */}
            <Box sx={{ p: 4 }}>
              {tabValue === "basic_info" && studentId && (
                <Suspense fallback={null}>
                  <BasicInfo
                    studentId={studentId}
                    role={user.role}
                    officeTypes={officeTypes}
                    regions={regions}
                    franchises={franchises}
                    maritalStatus={maritalStatus}
                  />
                </Suspense>
              )}

              {tabValue === "exam_details" && studentId && (
                <Suspense fallback={null}>
                  <AcademicInfo studentId={studentId} />
                </Suspense>
              )}

              {tabValue === "work_exp" && studentId && (
                <Suspense fallback={null}>
                  <WorkExpereince studentId={studentId} />
                </Suspense>
              )}

              {tabValue === "study_pref" && studentId && (
                <Suspense fallback={null}>
                  <StudyPreference studentId={studentId} />
                </Suspense>
              )}

              {tabValue === "education" && studentId && (
                <Suspense fallback={null}>
                  <EducationDetails studentId={studentId} />
                </Suspense>
              )}

              {tabValue === "fund_plan" && studentId && (
                <Suspense fallback={null}>
                  <FundPlan student_id={studentId} />
                </Suspense>
              )}

              {tabValue === "comments" && studentId && (
                <Suspense fallback={null}>
                  <Comments studentId={studentId} />
                </Suspense>
              )}

              {tabValue === "history" && studentId && (
                <Suspense fallback={null}>
                  <History studentId={studentId} />
                </Suspense>
              )}

              {tabValue === "passport" && studentId && (
                <Suspense fallback={null}>
                  <PassportDetails studentId={studentId} />
                </Suspense>
              )}

              {tabValue === "family" && studentId && (
                <Suspense fallback={null}>
                  <FamilyDetails studentId={studentId} />
                </Suspense>
              )}

              {tabValue === "visa" && studentId && (
                <Suspense fallback={null}>
                  <VisaProcess studentId={studentId} />
                </Suspense>
              )}

              {tabValue === "add_docs" && studentId && (
                <Suspense fallback={null}>
                  <AdditionalDocuments studentId={studentId} />
                </Suspense>
              )}

              {tabValue === "docs_overview" && studentId && (
                <Suspense fallback={null}>
                  <DocumentsOverview studentId={studentId} />
                </Suspense>
              )}
            </Box>
          </Box>
        </Card.Body>
      </Card>
    </>
  );
};

export default LeadDetailsMaterial;
