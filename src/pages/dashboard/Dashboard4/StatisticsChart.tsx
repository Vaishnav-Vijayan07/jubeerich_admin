import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

// components
import { BasicPortlet } from "../../../components/Portlet";

const StatisticsChart = ({ data }: any) => {
  const [categoryData, setCategoryData] = useState<string[]>([]);
  const [categoryValue, setCategoryValue] = useState<number[]>([]);

  useEffect(() => {
    const categoryArray: string[] = [];
    const dataArray: number[] = [];
    data?.statistics?.map((item: any) => {
      categoryArray.push(item.month_name?.substring(0, 3));
      dataArray.push(parseInt(item.closed_lead_count));
    });
    setCategoryData(categoryArray);
    setCategoryValue(dataArray);
  }, [data]);

  const apexOpts: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "20%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      // categories: ["2012", "2013", "2014", "2015", "2016", "2017", "2018"],
      categories: categoryData,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    colors: ["#00acc1"],
  };

  const apexData = [
    {
      name: "Statistics",
      // data: [87, 75, 50],
      data: categoryValue,
    },
  ];

  return (
    <>
      <BasicPortlet cardTitle="Statistics" titleClass="header-title">
        <div className="text-center">
          <div className="row mt-2">
            <div className="col-6">
              <h3>{data?.total_leads}</h3>
              <p className="text-muted font-13 mb-0 text-truncate">Total Leads</p>
            </div>
            <div className="col-6">
              <h3>{data?.closed_leads}</h3>
              <p className="text-muted font-13 mb-0 text-truncate">Total Closed</p>
            </div>
          </div>

          <div dir="ltr">
            <Chart options={apexOpts} series={apexData} type="bar" height={273} className="apex-charts mt-2" />
          </div>
        </div>
      </BasicPortlet>
    </>
  );
};

export default StatisticsChart;
