import React from "react";
import WithDashboardLayout from "../Dashboard3/WithDashboardLayout";
import { Col, Row} from "react-bootstrap";
import LeadsTable from "../Components/LeadsTable";
import SingleBarGraph from "../Components/SingleBarGraph";

function CreDashboard({ categories, series, latestLeadsCount }: any) {
  return (
    <>
      <Row>
        <Col md={6}>
          <SingleBarGraph categories={categories} series={series} />
        </Col>
        <Col md={6}>
          <LeadsTable leadsData={latestLeadsCount} showOffice={false} />
        </Col>
      </Row>
    </>
  );
}

export default WithDashboardLayout(CreDashboard);
