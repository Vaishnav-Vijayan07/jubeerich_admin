import React, { useState, useEffect } from "react";
import WithDashboardLayout from "../Dashboard3/WithDashboardLayout";
import { Row, Col } from "react-bootstrap";
import LeadsTable from "../Components/LeadsTable";
import { dummyLeadData } from "../../users/data";
import StackGraph from "../Components/StackGraph";
import Spinner from "react-bootstrap/Spinner";
import CustomFilter from "../../../components/CustomFilter";

function ItTeamDashboard({ categories, series, latestLeadsCount }: any) {
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
            <LeadsTable leadsData={latestLeadsCount} showOffice={true} />
          )}
        </Col>
      </Row>
    </>
  );
}

export default WithDashboardLayout(ItTeamDashboard);
