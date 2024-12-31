import React, { useState, useEffect } from "react";
import WithDashboardLayout from "../Dashboard3/WithDashboardLayout";
import { Row, Col } from "react-bootstrap";
import LeadsTable from "../Components/LeadsTable";
import StackGraph from "../Components/StackGraph";
import Spinner from "react-bootstrap/Spinner";
import PieData from "../Components/PieData";

function CountryManagerDashboard({ categories, series, latestLeadsCount, pieData }: any) {
  const labels = pieData?.pieCategories;
  const pieSeries = pieData?.pieSeries;

  return (
    <>
      <Row>
        <Col md={5}>
          <StackGraph categories={categories} series={series} />
        </Col>
        <Col md={7}>
          <PieData labels={labels || []} pieSeries={pieSeries || []} />
        </Col>
      </Row>
      <Row>
        <LeadsTable leadsData={latestLeadsCount} showOffice={true} />
      </Row>
    </>
  );
}

export default WithDashboardLayout(CountryManagerDashboard);
