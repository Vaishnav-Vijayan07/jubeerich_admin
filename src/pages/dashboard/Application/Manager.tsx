import React, { useState, useEffect } from "react";
import WithDashboardLayout from "../Dashboard3/WithDashboardLayout";
import { Row, Col, Form } from "react-bootstrap";
import LeadsTable from "../Components/LeadsTable";
import StackGraph from "../Components/StackGraph";
import Spinner from "react-bootstrap/Spinner";
import PieData from "../Components/PieData";
import { useDispatch } from "react-redux";
import { getDashboard } from "../../../redux/actions";
import ApplicationsTable from "../Components/ApplicationsTable";

function ManagerDashboard({ categories, series, latestLeadsCount, pieData }: any) {
  const labels = pieData?.pieCategories;
  const pieSeries = pieData?.pieSeries;

  return (
    <>
      <Row className="d-flex  mb-2">
        <Col md={9}>
          <StackGraph categories={categories} series={series} />
        </Col>
        <Col md={3}>
          <div className="h-100">
            <PieData labels={labels || []} pieSeries={pieSeries || []} />
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={12}>
          <h4 className="text-primary">My Applications</h4>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <ApplicationsTable leadsData={latestLeadsCount} />
        </Col>
      </Row>
    </>
  );
}

export default WithDashboardLayout(ManagerDashboard);
