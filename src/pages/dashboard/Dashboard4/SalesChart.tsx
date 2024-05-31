import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

// components
import { BasicPortlet } from "../../../components/Portlet";

const SalesChart = ({ data }: any) => {


  const apexOpts: ApexOptions = {
    chart: {
      type: "donut",
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              formatter: (val: string) => {
                return val;
              },
            },
            value: {
              show: true,
              formatter: (val: string) => {
                return val;
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    // colors: ["#4fc6e1", "#6658dd", "#ebeff2"],
    colors: ["#4fc6e1", "#6658dd", "#ebeff2"],
    legend: {
      show: false,
    },
    labels: ["Potential Leads", "Closed Leads", "New Leads"],
    tooltip: {
      enabled: false,
    },
  };

  const apexData = [parseInt(data?.potential), parseInt(data?.closed), parseInt(data?.newlead)];

  return (
    <>
      <BasicPortlet cardTitle="Leads Statistics" titleClass="header-title">
        <div className="text-center">
          <div className="row mt-2">
            <div className="col-4">
              <h3>{data?.total_leads}</h3>
              <p className="text-muted font-13 mb-0 text-truncate">Total</p>
            </div>
            <div className="col-4">
              <h3>{data?.potential}</h3>
              <p className="text-muted font-13 mb-0 text-truncate">Potential</p>
            </div>
            <div className="col-4">
              <h3>{data?.closed}</h3>
              <p className="text-muted font-13 mb-0 text-truncate">Closed</p>
            </div>
          </div>

          <div dir="ltr">
            <Chart options={apexOpts} series={apexData} type="donut" height={270} className="apex-charts mt-4" />
          </div>
        </div>
      </BasicPortlet>
    </>
  );
};

export default SalesChart;
