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
        show: false,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
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
