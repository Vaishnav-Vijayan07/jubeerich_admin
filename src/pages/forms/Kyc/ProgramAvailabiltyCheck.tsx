import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshData } from "../../../redux/countryReducer";
import { RootState } from "../../../redux/store";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FormInput } from "../../../components";
import axios from "axios";
import RemarksSection from "../../../components/CheckRemarkTextBox";
import { showSuccessAlert } from "../../../constants";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import FormButtons from "./FormButtons";

function ProgramAvailabiltyCheck({
  current,
  handleStepChange,
  student_id,
  country_id,
  application_id,
  type,
  eligibility_id,
}: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const refresh = useSelector((state: RootState) => state.refreshReducer.refreshing);
  const [data, setData] = useState<any>(null);
  const [remarks, setRemarks] = useState<string>("");
  const [showRemark, setShowRemark] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`/checks/${type}/${application_id}`);
      setData(data.data?.checks);
      setRemarks(data.data?.remarks?.remarks);
      setShowRemark(data.data?.remarks?.remarks ? true : false);
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

  useEffect(() => {
    fetchData();
  }, [application_id, refresh]);

  return (
    <>
      <Row>
        <h4 className="py-1" style={{ width: "max-content", color: "#1976d2", fontWeight: "800" }}>
          Program Availability Check
        </h4>
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
      {/* <RemarksSection
        showRemark={showRemark}
        remarks={remarks}
        setRemarks={setRemarks}
        saveRemark={saveRemark}
        showRemarkBox={showRemarkBox}
      /> */}
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
