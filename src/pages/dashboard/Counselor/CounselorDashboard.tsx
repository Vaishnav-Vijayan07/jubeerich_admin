import React from "react";
import WithDashboardLayout from "../Dashboard3/WithDashboardLayout";
import { Col, Row } from "react-bootstrap";
import LeadsTable from "../Components/LeadsTable";
import StackGraph from "../Components/StackGraph";



function CounselorDashboard({ categories, series, latestLeadsCount }: any) {
  return (
    <>
      <Row>
        <Col md={5}>
        <StackGraph categories={categories} series={series} />
        </Col>
        <Col md={7}>
          <LeadsTable leadsData={latestLeadsCount} showOffice={false} />
        </Col>
      </Row>
    </>
  );
}

export default WithDashboardLayout(CounselorDashboard);
