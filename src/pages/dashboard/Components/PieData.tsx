import React from "react";
import { Card, Row, Col } from "react-bootstrap";
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
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);
              },
            },
            value: {
              formatter: function (value) {
                return value.toString();
              },
            },
          },
        },
      },
    },
    dataLabels: {
      formatter: function (value, { seriesIndex, dataPointIndex, w }) {
        return w.config.series[seriesIndex];
      },
    },
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <Chart options={options} series={pieSeries} type="donut" height={350} />
      </Card.Body>
    </Card>
  );
}

export default PieData;
