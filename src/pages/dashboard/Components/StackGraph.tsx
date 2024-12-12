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

function StackGraph({ categories, series }: Props) {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false, // Hide toolbar if not needed
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%",
      },
    },

    grid: {
      show: true,
      borderColor: "#212121",
      strokeDashArray: 5,
      position: "back",
      yaxis: {
        lines: {
          show: true,
        },
      },
    },

    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
    },
    legend: {
      position: "top",
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
        <Chart options={options} series={series} type="bar" height={350} />
      </Card.Body>
    </Card>
  );
}

export default StackGraph;
