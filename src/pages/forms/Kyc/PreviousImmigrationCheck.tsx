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

function PreviousImmigrationCheck({ studentId, application_id, type, eligibility_id }: any) {
  const dispatch = useDispatch();
  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);
  const [remarks, setRemarks] = useState<string>("");
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
      setShowRemark(checkData.data.data?.remarks?.remarks ? true : false);
    } catch (error) {
      console.log(error);
    }
  };

  const showRemarkBox = () => {
    setShowRemark(true);
  };

  const saveRemark = async () => {
    try {
      await axios.post(`/checks_remarks/${type}/${application_id}`, {
        remarks: remarks == "" ? null : remarks,
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
        <h4 className="py-1" style={{ width: "max-content", color: "#1976d2", fontWeight: "800" }}>
          Previous Immigration History Check
        </h4>
      </Row>
      <Row className="mt-2">
        <Card>
          <Card.Body>
            <Row className="ms-3 me-3">
              {/* Visa Approvals */}
              <Row className="mt-2">
                <span className="border bg-secondary rounded-2">
                  <Form.Label className="fs-4 mt-1 text-white">Previous Visa Approval</Form.Label>
                </span>
                {visaApprovals?.length > 0 ? (
                  visaApprovals.map((data: any, index: number) => (
                    <Row key={index} className="ms-3">
                      <Row className="mt-3">
                        <Form.Group className="mb-2" controlId="country_name">
                          <Form.Label>
                            {`Country`} - {data?.approved_country?.country_name}
                          </Form.Label>
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group className="mb-2" controlId="visa_type">
                          <Form.Label>
                            {`Visa Type`} - {formatVisaName(data?.visa_type)}
                          </Form.Label>
                        </Form.Group>
                      </Row>
                      <Row>
                        <Col md={6} lg={6} xl={6} xxl={4}>
                          <Form.Group className="mb-2" controlId="approved_letter">
                            <Form.Label>Approved Letter</Form.Label>
                            <FileDisplay fileName={data?.approved_letter} filePath={""} />
                          </Form.Group>
                        </Col>
                      </Row>
                      <hr className="mt-3" />
                    </Row>
                  ))
                ) : (
                  <div className="d-flex justify-content-center align-items-center border border-secondary mt-2 me-2">
                    <h4 className="text-muted">No Documents Uploaded</h4>
                  </div>
                )}
              </Row>

              {/* Visa Declines */}
              <Row className="mt-2">
                <span className="border bg-secondary rounded-2">
                  <Form.Label className="fs-4 mt-1 text-white">Previous Visa Declines</Form.Label>
                </span>
                {visaDeclines?.length > 0 ? (
                  visaDeclines.map((data: any, index: number) => (
                    <Row key={index} className="ms-3">
                      <Row className="mt-3">
                        <Form.Group className="mb-2" controlId="country_name">
                          <Form.Label>
                            {`Country`} - {data?.declined_country?.country_name}
                          </Form.Label>
                        </Form.Group>
                      </Row>
                      <Row>
                        <Form.Group className="mb-2" controlId="visa_type">
                          <Form.Label>
                            {`Visa Type`} - {formatVisaName(data?.visa_type)}
                          </Form.Label>
                        </Form.Group>
                      </Row>
                      <Row>
                        <Col md={6} lg={6} xl={6} xxl={4}>
                          <Form.Group className="mb-1" controlId="declined_letter">
                            <Form.Label>Declined Letter</Form.Label>
                            <FileDisplay fileName={data?.declined_letter} filePath={""} />
                          </Form.Group>
                        </Col>
                      </Row>
                      <hr className="mt-3" />
                    </Row>
                  ))
                ) : (
                  <div className="d-flex justify-content-center align-items-center border border-secondary mt-2 me-2">
                    <h4 className="text-muted">No Documents Uploaded</h4>
                  </div>
                )}
              </Row>
            </Row>
          </Card.Body>
        </Card>
      </Row>
      <RemarksSection  showRemark={showRemark} remarks={remarks} setRemarks={setRemarks} saveRemark={saveRemark} showRemarkBox={showRemarkBox} />
    </>
  );
}

export default PreviousImmigrationCheck;
