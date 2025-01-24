import React from "react";
import WithDashboardLayout from "../Dashboard3/WithDashboardLayout";
import { Row, Col } from "react-bootstrap";
import LeadsTable from "../Components/LeadsTable";
import StackGraph from "../Components/StackGraph";

function CreTlDashboard({ categories, series, latestLeadsCount,colors }: any) {
  return (
    <>
      <Row>
        <Col md={5}>
          <StackGraph categories={categories} series={series} colors={colors}/>
        </Col>
        <Col md={7}>
          <LeadsTable leadsData={latestLeadsCount} showOffice={false} />
        </Col>
      </Row>
    </>
  );
}

export default WithDashboardLayout(CreTlDashboard);
