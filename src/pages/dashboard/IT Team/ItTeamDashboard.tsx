import React from "react";
import WithDashboardLayout from "../Dashboard3/WithDashboardLayout";
import { Row, Col } from "react-bootstrap";
import LeadsTable from "../Components/LeadsTable";
import StackGraph from "../Components/StackGraph";

function ItTeamDashboard({ categories, series, latestLeadsCount,colors }: any) {
  return (
    <>
      <Row>
        <Col md={5}>
          <StackGraph categories={categories} series={series} colors={colors} />
        </Col>
        <Col md={7}>
          <LeadsTable leadsData={latestLeadsCount} showOffice={true} />
        </Col>
      </Row>
    </>
  );
}

export default WithDashboardLayout(ItTeamDashboard);
