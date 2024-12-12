import React from "react";
import { Card } from "react-bootstrap";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

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
        <Chart options={options} series={pieSeries} type="donut" height={350} />
      </Card.Body>
    </Card>
  );
}

export default PieData;
