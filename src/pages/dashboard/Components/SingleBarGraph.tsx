import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Filters from "./Filters";

type Props = {
  categories: string[];
  series: SeriesItems[];
};

type SeriesItems = {
  name: string;
  data: number[];
};

function SingleBarGraph({ categories, series }: Props) {
  const isDataPresent = series.length > 0;

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      tickPlacement: "on",
      categories, // Set X-axis labels
      title: {
        text: "Lead Type", // Title for Y-axis
      },
    },
    yaxis: {
      title: {
        text: "Count", // Title for Y-axis
      },
    },
    legend: {
      show: false, // No legend needed for a single dataset
    },
    fill: {
      opacity: 1,
    },
    colors: ["#3b82f6"], // Single color for the bars
  };

  return (
    <Card>
      <Card.Body>
        {isDataPresent ? (
          <Row>
            <Col md={12}>
              <Chart options={options} series={series} type="bar" height={350} />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col md={12}>
              <h4 className="text-center mt-3">No data available</h4>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}

export default SingleBarGraph;
