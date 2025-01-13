import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import DocumentsOverview from "../../lead_management/Tasks/List/DocumentsOverview/DocumentsOverview";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../constants";
import { Visa_Types } from "../../lead_management/Tasks/List/data";
import noFile from "../../../assets/images/icons/file_not_found.svg";
import axios from "axios";
import { types } from "./EntryRequirementCheck";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { refreshData } from "../../../redux/countryReducer";
import { FormInput } from "../../../components";
import RemarksSection from "../../../components/CheckRemarkTextBox";
import FormButtons from "./FormButtons";
import CheckHeadings from "../../../components/CheckHeadings";
import RequirementCheck from "../../../components/ApplicationChecks/RequirementCheck";
import ImmigrationDetails from "../../../components/ApplicationChecks/DocsQuantity/ImmigrationDetails";

function PreviousImmigrationCheck({ current, handleStepChange, studentId, country_id, application_id, type, eligibility_id }: any) {
  const dispatch = useDispatch();
  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);
  const [remarks, setRemarks] = useState<string>("");
  const [isCheckPassed, setIsCheckPassed] = useState<boolean>(false);
  const [showRemark, setShowRemark] = useState<boolean>(false);
  const [visaApprovals, setVisaApprovals] = useState<any>([]);
  const [visaDeclines, setVisaDeclines] = useState<any>([]);

  const fetchImmigrationDetails = async () => {
    try {
      const [visaData, checkData] = await Promise.all([
        axios.get(`/details_application/${types.visa}/${studentId}`),
        axios.get(`/checks/${type}/${application_id}`),
      ]);

      setVisaApprovals(visaData.data?.visaDetails?.previousVisaApprovals);
      setVisaDeclines(visaData.data?.visaDetails?.previousVisaDeclines);
      setRemarks(checkData.data.data?.remarks?.remarks);
      setIsCheckPassed(checkData.data.data?.remarks?.isCheckPassed);
      setShowRemark(checkData.data.data?.remarks?.remarks ? true : false);
    } catch (error) {
      console.log(error);
    }
  };

  const showRemarkBox = () => {
    setShowRemark(true);
  };

  const saveRemark = async (value: string) => {
    try {
      await axios.post(`/checks_remarks/${type}/${application_id}`, {
        remarks: value == "" ? null : value,
        eligibility_id,
      });
      dispatch(refreshData());
    } catch (error) {
      console.log(error);
    }
  };

  const getFileName = (fileName: string) => {
    if (!fileName) return "";
    const parts = fileName.split(".");
    const extension = parts.pop();
    let name = parts.join(".");

    const hyphenCount = (name.match(/-/g) || []).length;

    if (hyphenCount === 3) {
      const hyphenIndex = name.indexOf("-");
      if (hyphenIndex !== -1) {
        name = name.slice(hyphenIndex + 1).trim();
      }
    }

    if (name.length > 25) {
      name = name.slice(0, 25) + "...";
    }

    return name;
  };

  const formatVisaName = (name: any) => {
    let res;
    if (name) {
      res = Visa_Types.filter((data: any) => data?.value == name);
      return res?.[0]?.label;
    }
  };

  const getFileType = (fileName: string) => {
    if (!fileName) return "";
    const parts = fileName.split(".");
    const ext = parts.pop();
    return ext ? ext.toLowerCase() : "";
  };

  useEffect(() => {
    fetchImmigrationDetails();
  }, [studentId, refresh]);

  const FileDisplay = (props: any) => {
    const { fileName, filePath } = props;

    return (
      <>
        <Card className="mb-1 mt-1 shadow-none border">
          <div className="p-2">
            <Row className="align-items-center">
              {fileName && (
                <Col className="col-auto">
                  <div className="avatar-sm">
                    <span className="avatar-title badge-soft-primary text-primary rounded">.{getFileType(fileName)}</span>
                  </div>
                </Col>
              )}

              {fileName && (
                <Col className="ps-0">
                  <Link to="#" className="text-muted fw-bold">
                    {getFileName(fileName)}
                  </Link>
                  <br />
                </Col>
              )}

              {!fileName && (
                <Col className="d-flex-col justify-content-end col-auto">
                  <img src={noFile} alt="date logo" width={37.3} className="" />
                  <span className="ms-1">File Not Uploaded</span>
                </Col>
              )}

              {fileName && (
                <Col className="col-auto">
                  <a
                    href={`${baseUrl}/uploads/${filePath}/${fileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="btn-download"
                    className="btn btn-link font-16 text-muted"
                  >
                    <i className="dripicons-download"></i>
                  </a>
                </Col>
              )}
            </Row>
          </div>
        </Card>
      </>
    );
  };

  return (
    <>
      <Row>
        <CheckHeadings title="Previous Immigration" />
      </Row>
     
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body>
            <CheckHeadings  title="Previous Visa Approvals"/>
            <ImmigrationDetails  VisaData={visaApprovals}/>
          </Card.Body>
        </Card>
      </Row>
      <Row className="mt-2">
        <Card className="basic-card">
          <Card.Body>
            <CheckHeadings  title="Previous Visa Declines"/>
            <ImmigrationDetails VisaData={visaDeclines}/>
          </Card.Body>
        </Card>
      </Row>
      <RemarksSection showRemark={showRemark} remarks={remarks} saveRemark={saveRemark} />
      <FormButtons
        type={type}
        current={current}
        isCheckPassed={isCheckPassed}
        handleStepChange={handleStepChange}
        student_id={studentId}
        country_id={country_id}
        application_id={application_id}
        remarks={remarks}
      />
    </>
  );
}

export default PreviousImmigrationCheck;
