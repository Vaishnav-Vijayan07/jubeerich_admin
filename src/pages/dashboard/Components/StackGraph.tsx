import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type Props = {
  categories: string[];
  series: SeriesItems[];
  colors?: string[] | null;
};

type SeriesItems = {
  name: string;
  data: number[];
};

function StackGraph({ categories, series, colors }: Props) {
  const isDataPresent = series.length > 0;

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: -20,
        tools: {
          reset: `
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
      <path
        fill="currentColor"
        d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2v2a8 8 0 1 1-4.5 1.385V8h2V2h-6v2H6a9.99 9.99 0 0 0-4 8"
      ></path>
    </svg>
          `,
          download: false,
        },
      },
    },
    xaxis: {
      type: "category",
      categories: categories,
      tickPlacement: "on",
    },
    legend: {
      position: "top",
      offsetY: 20,
    },
    plotOptions: {
      bar: {
        columnWidth: "20%",
      },
    },
    fill: {
      opacity: 1,
    },
    dataLabels: {
      enabled: false,
    },
    colors: colors
      ? colors
      : ["#d9534f", "#5bc0de", "#5cb85c", "#f0ad4e", "#d9534f", "#5bc0de", "#5cb85c", "#f0ad4e", "#d9534f", "#5bc0de", "#5cb85c", "#f0ad4e"],
  };

  return (
    <Card className="h-100">
      <Card.Body>
        {isDataPresent ? (
          <Chart options={options} series={series} type="bar" height={350} />
        ) : (
          <Row className="justify-content-center">
            <Col md="6" className="text-center">
              <h4>No data available</h4>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}

export default StackGraph;
