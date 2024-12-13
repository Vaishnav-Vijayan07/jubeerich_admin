import React from "react";
import { Card,Row,Col } from "react-bootstrap";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Filters from "./Filters";

type Props = {
  labels: string[];
  pieSeries: number[];
};

function PieData({ labels, pieSeries }: Props) {
  const options: ApexOptions = {
    chart: {
      type: "pie",
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    title: {
      text: "KYC",
    },
    fill: {
      type: "gradient",
    },
    labels,
  };

  return (
    <Card>
      <Card.Body>
      <Row className="mb-3">
          <Col>
            <Filters />
          </Col>
        </Row>
        <Chart options={options} series={pieSeries} type="donut" height={350} />
      </Card.Body>
    </Card>
  );
}

export default PieData;
