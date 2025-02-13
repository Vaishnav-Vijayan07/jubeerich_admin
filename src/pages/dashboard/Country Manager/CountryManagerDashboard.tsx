import React, { useState, useEffect } from "react";
import WithDashboardLayout from "../Dashboard3/WithDashboardLayout";
import { Row, Col } from "react-bootstrap";
import LeadsTable from "../Components/LeadsTable";
import StackGraph from "../Components/StackGraph";
import PieData from "../Components/PieData";

function CountryManagerDashboard({ categories, series, latestLeadsCount, pieData,colors }: any) {
  const labels = pieData?.pieCategories;
  const pieSeries = pieData?.pieSeries;

  return (
    <>
      <Row className="d-flex align-items-stretch mb-2">
        <Col md={5}>
          <StackGraph categories={categories} series={series} colors={colors} />
        </Col>
        <Col md={7}>
          <PieData labels={labels || []} pieSeries={pieSeries || []} />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <LeadsTable leadsData={latestLeadsCount} showOffice={true} />
        </Col>
      </Row>
    </>
  );
}

export default WithDashboardLayout(CountryManagerDashboard);
