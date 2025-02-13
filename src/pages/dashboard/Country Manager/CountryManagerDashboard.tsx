import React, { useState, useEffect } from "react";
import WithDashboardLayout from "../Dashboard3/WithDashboardLayout";
import { Row, Col } from "react-bootstrap";
import LeadsTable from "../Components/LeadsTable";
import { dummyLeadData } from "../../users/data";
import StackGraph from "../Components/StackGraph";
import Spinner from "react-bootstrap/Spinner";
import PieData from "../Components/PieData";

const categories = ["Counsellor-1", "Counsellor-2", "Counsellor-3", "Counsellor-4", "Counsellor-5"];
const series = [
  {
    name: "New lead",
    data: [44, 55, 41, 37, 22],
  },
  {
    name: "Spam",
    data: [44, 55, 41, 37, 22],
  },
  {
    name: "Follow up",
    data: [44, 55, 41, 37, 22],
  },
  {
    name: "Not responding",
    data: [44, 55, 41, 37, 22],
  },
  {
    name: "Failed",
    data: [44, 55, 41, 37, 22],
  },
];

const labels = ["Pending", "Approved"];
const pieSeries = [44, 55];

function CountryManagerDashboard() {
  const [isStackGraphLoading, setIsStackGraphLoading] = useState(true);
  const [isLeadsTableLoading, setIsLeadsTableLoading] = useState(true);
  const [isPieLoading, setIsPieLoading] = useState(true);

  useEffect(() => {
    // Simulate fake delays for data loading
    const stackGraphTimeout = setTimeout(() => setIsStackGraphLoading(false), 2000);
    const leadsTableTimeout = setTimeout(() => setIsLeadsTableLoading(false), 3000);
    const pieTableTimeout = setTimeout(() => setIsPieLoading(false), 2000);

    return () => {
      clearTimeout(stackGraphTimeout);
      clearTimeout(leadsTableTimeout);
      clearTimeout(pieTableTimeout);
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
          {isPieLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <PieData labels={labels} pieSeries={pieSeries} />
          )}
        </Col>
      </Row>
      <Row>
        {isLeadsTableLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <LeadsTable leadsData={dummyLeadData} showOffice={true} />
        )}
      </Row>
    </>
  );
}

export default WithDashboardLayout(CountryManagerDashboard);
