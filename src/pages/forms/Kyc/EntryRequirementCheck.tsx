import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";

type Props = {
  studentId: any;
};

export const types = {
  education : 'education',
  visa : 'visa'
}

function EntryRequirementCheck({ studentId }: Props) {
  const [educationDetails, setEducationDetails] = useState<any>([]);
  const [gapDetails, setGapDetails] = useState<any>([]);

  const fetchEducationalCheck = async() => {
    try {
      const res = await axios.get(`/details_application/${types.education}/${studentId}`);
      if(res){
        setEducationDetails([...res?.data?.data?.educationDetails, ...res?.data?.data?.graduationDetails]);
        setGapDetails(res?.data?.data?.gapReasons)
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchEducationalCheck()
  }, [studentId])
  

  return (
    <>
      <Row>
        <h4 className="py-1" style={{width:"max-content", color:"#1976d2", fontWeight:"800"}}>Entry Requirement Check</h4>
      </Row>

      <Row className="mt-2">
        <Card>
          <Card.Body>
            <Row className="mb-2">
              <div className="text-start mt-2 ps-1">
                <h5 className="font-weight-bold text-danger">Qualifications:</h5>

                {educationDetails?.length > 0 ? educationDetails?.map((qual: any, index: number) => (
                  <div
                    key={index}
                    className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`}
                    style={{ padding: "10px", borderRadius: "4px" }}
                  >
                    <p className="mb-1 font-15">
                      <strong>Qualification:</strong>
                      <span className="ms-2">{qual?.qualification}</span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>Name of the College & University:</strong>
                      <span className="ms-2">{qual?.school_name}</span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>Start Date:</strong>
                      <span className="ms-2">{qual?.start_date ? moment(qual?.start_date).format('DD/MM/YYYY') : 'N/A'}</span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>End Date:</strong>
                      <span className="ms-2">{qual?.end_date ? moment(qual?.end_date).format('DD/MM/YYYY') : 'N/A'}</span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>Percentage:</strong>
                      <span className="ms-2">{qual?.percentage}</span>
                    </p>
                  </div>
                )) : <div className='d-flex justify-content-center align-items-center border border-secondary mt-2 me-2'><h4 className='text-muted'>No Documents Uploaded</h4></div>}


                <h5 className="font-weight-bold text-danger">Periods of Gap:</h5>

                {gapDetails?.length > 0 ? gapDetails?.map((gap: any, index: any) => (
                  <div
                    key={index}
                    className={`mb-3 ${index % 2 === 0 ? "bg-light" : ""}`}
                    style={{ padding: "10px", borderRadius: "4px" }}
                  >
                    <p className="mb-1 font-15">
                      <strong>Period of Gap:</strong>
                      <span className="ms-2">{`${(gap?.start_date) ? moment(gap?.start_date).format('DD/MM/YYYY') : 'N/A'} - ${(gap?.end_date) ? moment(gap?.end_date).format('DD/MM/YYYY') : 'N/A'}`}</span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>Reason:</strong>
                      <span className="ms-2">{gap?.reason}</span>
                    </p>
                    <p className="mb-1 font-15">
                      <strong>Supporting Documents:</strong>
                      <span className="ms-2">{gap?.type.toUpperCase()}</span>
                    </p>
                  </div>
                )) : <div className='d-flex justify-content-center align-items-center border border-secondary mt-2 me-2'><h4 className='text-muted'>No Documents Uploaded</h4></div>}
              </div>
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </>
  );
}

export default EntryRequirementCheck;
