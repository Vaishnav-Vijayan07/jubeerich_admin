import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Filters from "./Filters";
import CustomFilter from "../../../components/CustomFilter";

type Props = {
  categories: string[];
  series: SeriesItems[];
};

type SeriesItems = {
  name: string;
  data: number[];
};

function StackGraph({ categories, series }: Props) {
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
      position: "bottom",
      horizontalAlign: "center",
    },
    fill: {
      opacity: 1,
    },
    colors: ["#306315ff", "#f7915eff", "#5de36aff", "#f53b22ff", "#e35d71ff"],
  };

  return (
    <Card>
      <Card.Body>
        <Row className="mb-3"></Row>
        <Chart options={options} series={series} type="bar" height={350} />
      </Card.Body>
    </Card>
  );
}

export default StackGraph;
