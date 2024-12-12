import React from "react";
import { Card } from "react-bootstrap";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type Props = {
  categories: string[];
  series: SeriesItems[];
};

type SeriesItems = {
  name: string;
  data: number[];
};

function SingleBarGraph({ categories, series }: Props) {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false, // Hide toolbar if not needed
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
        <Chart options={options} series={series} type="bar" height={350} />
      </Card.Body>
    </Card>
  );
}

export default SingleBarGraph;
