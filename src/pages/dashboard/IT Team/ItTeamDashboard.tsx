import React, { useState, useEffect } from "react";
import WithDashboardLayout from "../Dashboard3/WithDashboardLayout";
import { Row, Col } from "react-bootstrap";
import LeadsTable from "../Components/LeadsTable";
import { dummyLeadData } from "../../users/data";
import StackGraph from "../Components/StackGraph";
import Spinner from "react-bootstrap/Spinner";

const categories = ["Corporate", "Branch", "Franchise"];
const series = [
  {
    name: "New lead",
    data: [44, 55, 41],
  },
  {
    name: "Spam",
    data: [13, 23, 20],
  },
  {
    name: "Follow up",
    data: [11, 17, 15],
  },
  {
    name: "Not responding",
    data: [17, 22, 19],
  },
  {
    name: "Failed",
    data: [9, 14, 12],
  },
];

function ItTeamDashboard() {
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
            <LeadsTable leadsData={dummyLeadData} showOffice={true} />
          )}
        </Col>
      </Row>
    </>
  );
}

export default WithDashboardLayout(ItTeamDashboard);
