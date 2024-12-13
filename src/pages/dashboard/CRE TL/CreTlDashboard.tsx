import React, { useState, useEffect } from "react";
import WithDashboardLayout from "../Dashboard3/WithDashboardLayout";
import { Row, Col } from "react-bootstrap";
import LeadsTable from "../Components/LeadsTable";
import { dummyLeadData } from "../../users/data";
import Spinner from "react-bootstrap/Spinner";
import StackGraph from "../Components/StackGraph";

const categories = Array.from({ length: 6 }, (_, i) => `CRE-${i + 1}`);
const series = [
  {
    name: "New lead",
    data: [44, 55, 41, 37, 22, 43],
  },
  {
    name: "Spam",
    data: [13, 23, 20, 8, 13, 27],
  },
  {
    name: "Follow up",
    data: [11, 17, 15, 13, 9, 17],
  },
  {
    name: "Not responding",
    data: [17, 22, 19, 18, 7, 21],
  },
  {
    name: "Failed",
    data: [9, 14, 12, 10, 4, 15],
  },
];

function CreTlDashboard() {
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
            <StackGraph categories={categories} series={series} />
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

export default WithDashboardLayout(CreTlDashboard);
