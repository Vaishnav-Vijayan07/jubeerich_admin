import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import RemarksSection from "../../../components/CheckRemarkTextBox";
import FormButtons from "./FormButtons";
import { useRemarks } from "../../../hooks/useChecksData";
import CheckHeadings from "../../../components/CheckHeadings";

const styles = {
  h5: { fontWeight: "600px", fontSize: "16px" },
  p: { fontWeight: "500px", fontSize: "14px" },
};

function ProgramAvailabiltyCheck({
  current,
  handleStepChange,
  student_id,
  country_id,
  application_id,
  type,
  eligibility_id,
}: any) {
  const { data, remarks, showRemark, saveRemark } = useRemarks({
    type,
    application_id,
    eligibility_id,
  });

  return (
    <>
      <Row>
        <CheckHeadings title={"Program Availability Check"} />
      </Row>
      <Row className="mt-2">
        <Card style={{ borderRadius: "10px" }}>
          <Card.Body>
            <div className="d-flex justify-content-between gap-2 align-items-center">
              <div className="border_right d-flex justify-content-center">
                <div className="w-auto">
                  <h5 className="checks_font_h5">Country</h5>
                  <p className="checks_font_p">{data?.country_name || "N/A"}</p>
                </div>
              </div>

              <div className="separator"></div>

              <div className="border_right d-flex justify-content-center">
                <div className="w-auto">
                  <h5 className="checks_font_h5">University</h5>
                  <p className="checks_font_p">{data?.university_name || "N/A"}</p>
                </div>
              </div>

              <div className="separator"></div>

              <div className="border_right d-flex justify-content-center">
                <div className="w-auto">
                  <h5 className="checks_font_h5">Intake applying for</h5>
                  <p className="checks_font_p">{data?.intake_applying_for || "N/A"}</p>
                </div>
              </div>

              <div className="separator"></div>

              <div className="border_right d-flex justify-content-center">
                <div className="w-auto">
                  <h5 className="checks_font_h5">Course Link</h5>
                  <p className="checks_font_p">
                    <a
                      href={data?.course_link}
                      onClick={(e) => {
                        if(data?.course_link == "N/A"){
                          e.preventDefault(); // Prevent the default click action
                        }
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {console.log("Course link ===>", data?.course_link)}
                      {data?.course_link == "N/A" ? "N/A" : "Click Here"}
                    </a>
                  </p>
                </div>
              </div>

              <div className="separator"></div>

              <div className="border_right d-flex justify-content-center">
                <div className="w-auto">
                  <h5 className="checks_font_h5">Stream</h5>
                  <p className="checks_font_p">{data?.stream_name}</p>
                </div>
              </div>

              <div className="separator"></div>

              <div className="d-flex justify-content-center">
                <div className="w-auto">
                  <h5 className="checks_font_h5 m-0 p-0">Program</h5>
                  <p className="checks_font_p m-0 p-0">{data?.program_name}</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Row>

      <RemarksSection showRemark={showRemark} remarks={remarks} saveRemark={saveRemark} />

      <FormButtons
        type={type}
        current={current}
        isCheckPassed={data?.isCheckPassed}
        handleStepChange={handleStepChange}
        student_id={student_id}
        country_id={country_id}
        application_id={application_id}
        remarks={remarks}
      />
    </>
  );
}

export default ProgramAvailabiltyCheck;
