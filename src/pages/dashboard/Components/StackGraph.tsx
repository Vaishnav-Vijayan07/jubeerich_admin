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
