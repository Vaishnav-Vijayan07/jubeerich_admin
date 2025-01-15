import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Filters from "./Filters";
import CustomFilter from "../../../components/Dashboard/CustomFilter";

type Props = {
  categories: string[];
  series: SeriesItems[];
};

type SeriesItems = {
  name: string;
  data: number[];
};

function StackGraph({ categories, series }: Props) {
  const isDataPresent = series.length > 0;

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false, // Ensure the toolbar is displayed
        tools: {
          download: true, // Download option
          selection: true, // Enable selection tool
          zoom: true, // Enable zoom tool
          zoomin: true, // Enable zoom in
          zoomout: true, // Enable zoom out
          pan: true, // Enable pan tool
          reset: true, // Add reset zoom button
        },
        autoSelected: "zoom", // Default selected tool
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories, // Pass your categories dynamically
      // tickPlacement: "on",
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    fill: {
      opacity: 1,
    },
    colors: ["#d9534f", "#5bc0de", "#5cb85c", "#f0ad4e","#d9534f", "#5bc0de", "#5cb85c", "#f0ad4e","#d9534f", "#5bc0de", "#5cb85c", "#f0ad4e"],
  };

  return (
    <Card style={{ minHeight: "500px" }}>
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
