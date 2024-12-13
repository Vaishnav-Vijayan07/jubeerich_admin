import React, { useEffect, useState } from "react";
import WithDashboardLayout from "../Dashboard3/WithDashboardLayout";
import { Col, Row, Spinner } from "react-bootstrap";
import LeadsTable from "../Components/LeadsTable";
import { dummyLeadData } from "../../users/data";
import SingleBarGraph from "../Components/SingleBarGraph";

const categories = ["New lead", "Spam", "Follow up", "Not responding", "Failed"];
const series = [
  {
    name: "Count",
    data: [60, 40, 30, 70, 50],
  },
];

function CounselorDashboard() {
  const [isStackGraphLoading, setIsStackGraphLoading] = useState(true);
  const [isLeadsTableLoading, setIsLeadsTableLoading] = useState(true);

  useEffect(() => {
    // Simulate fake delays for data loading
    const stackGraphTimeout = setTimeout(() => setIsStackGraphLoading(false), 2000);
    const leadsTableTimeout = setTimeout(() => setIsLeadsTableLoading(false), 3000);

    return () => {
      clearTimeout(stackGraphTimeout);
      clearTimeout(leadsTableTimeout);
    };
  }, []);

  return (
    <>
      <Row>
        <Col md={5}>
          {isStackGraphLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <SingleBarGraph categories={categories} series={series} />
          )}
        </Col>
        <Col md={7}>
          {isLeadsTableLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <LeadsTable leadsData={dummyLeadData} showOffice={false} />
          )}
        </Col>
      </Row>
    </>
  );
}

export default WithDashboardLayout(CounselorDashboard);
