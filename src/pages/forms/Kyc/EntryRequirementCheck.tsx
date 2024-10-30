import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";

type Props = {
  studentId: any;
};
let educationDetails: any[] = [];
let gapDetails: any[] = [];

function EntryRequirementCheck({ studentId }: Props) {
  const [educationDetails, setEducationDetails] = useState<any>([]);
  const [gapDetails, setGapDetails] = useState<any>([]);

  const fetchEducationalCheck = async() => {
    try {
      const res = await axios.get('');
      setEducationDetails([
        {
            "id": 4,
            "start_date": "2024-01-09T00:00:00.000Z",
            "end_date": "2024-10-02T00:00:00.000Z",
            "qualification": "BCA",
            "university_name": "Test University",
            "college_name": "Test College",
            "percentage": "99.00",
            "certificate": "Office_Management-1730279603191-104461788.txt",
            "registration_certificate": "Modifications_in_Office_Management-1730279603197-36670.txt",
            "backlog_certificate": "NoC-1728275865588-120973902-1730279603199-653715030.docx",
            "grading_scale_info": "dummy-pdf_2_dummy-pdf_2-1730279603200-637038948.pdf",
            "transcript": "dummy-pdf_2_dummy-pdf_2-1730279603202-524317921.pdf",
            "individual_marksheet": "Prisma_Config-1730279603202-470085188.pdf",
            "admit_card": "dummy-pdf_2_dummy-pdf_2_dummy-pdf_2-1730279603194-529715616.pdf",
            "conversion_formula": "Test"
        },
        {
          "id": 5,
          "startDate": "2021-01-02T00:00:00.000Z",
          "endDate": "2022-02-14T00:00:00.000Z",
          "qualification": "10th",
          "percentage": "88.00",
          "board_name": "CBSE",
          "school_name": "Test School",
          "certificate": "NoC-1730279515171-99646527.docx",
          "mark_sheet": "Modifications_in_Office_Management-1730279515169-241672466.txt",
          "admit_card": "NoC-1730279515173-280019330.docx"
      },
      {
        "id": 6,
        "startDate": "2022-02-02T00:00:00.000Z",
        "endDate": "2023-02-21T00:00:00.000Z",
        "qualification": "plustwo",
        "percentage": "90.00",
        "board_name": "CBSE",
        "school_name": "Test School",
        "certificate": "Prisma_Config-1730279549100-822534807.pdf",
        "mark_sheet": "NoC-1730279549098-602261635.docx",
        "admit_card": "dummy-pdf_2_dummy-pdf_2-1730279549103-207799016.pdf"
    }
    ])

    setGapDetails([
      {
        "id": 7,
        "reason": "Reason One",
        "start_date": "2024-10-17T00:00:00.000Z",
        "type": "education",
        "end_date": "2024-10-21T00:00:00.000Z",
        "supporting_document": "gap[0][supporting_document]-Prisma_Config-1730279620117-479260864.pdf"
    }
    ])
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
        <h4>Entry Requirement Check</h4>
      </Row>

      <Row className="mt-2">
        <Card>
          <Card.Body>
            <Row className="mb-2">
              <div className="text-start mt-2 ps-1">
                <h5 className="font-weight-bold text-danger">Qualifications:</h5>

                {educationDetails?.map((qual: any, index: number) => (
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
                ))}


                <h5 className="font-weight-bold text-danger">Periods of Gap:</h5>

                {gapDetails?.map((gap: any, index: any) => (
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
                ))}
              </div>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control as="textarea" rows={6} />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </>
  );
}

export default EntryRequirementCheck;
