import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

// components
import { BasicPortlet } from "../../../components/Portlet";

const IncomeChart = ({ data }: any) => {
  const [categoryData, setCategoryData] = useState<string[]>([]);
  const [maxValue, setMaxValue] = useState<number>(10);
  const [categoryValue, setCategoryValue] = useState<Array<{ name: string; type: string; data: number[] }>>([]);

  useEffect(() => {
    sortData();
  }, [data]);

  const sortData = () => {
    const seriesData: Array<{ name: string; type: string; data: number[] }> = [];
    const monthData: string[] = [];

    // Process monthly_counts for the first item in statistics
    const firstItem = data?.statistics?.[0];
    if (firstItem?.monthly_counts) {
      monthData.push(...firstItem.monthly_counts.map((month: any) => month?.month.substr(0, 3)));
    }

    // Process all items in statistics
    if (data?.statistics) {
      data.statistics.forEach((item: any) => {
        console.log("item", item);

        if (item.monthly_counts) {
          seriesData.push({
            name: item.status_name,
            type: "line",
            data: item.monthly_counts.map((item1: any) => item1.value),
          });
        }
      });
    }

    // Set your state or perform any other actions with seriesData and monthData
    setCategoryData(monthData);
    setCategoryValue(seriesData);
    const largestValue = Math.max(...seriesData.map((item) => Math.max(...item.data)));
    setMaxValue(largestValue);
  };

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "line",
      toolbar: {
        show: false,
      },
      stacked: false,
    },
    stroke: {
      width: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    fill: {
      type: "solid",
      opacity: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    },
    colors: [
      "#4a81d4",
      "#1fa083",
      "#d44e4e",
      "#ffa500",
      "#7e57c2",
      "#26c6da",
      "#ff5252",
      "#4caf50",
      "#ffc107",
      "#9575cd",
      "#009688",
      "#ff4081",
      "#8d6e63",
      "#536dfe",
      "#4dd0e1",
      "#ffd740",
      "#607d8b",
      "#e91e63",
    ],
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
    yaxis: {
      tickAmount: 4,
      min: 0,
      max: maxValue,
    },
  };

  // const series = [
  //   {
  //     name: "spam",
  //     type: "area",
  //     data: [20, 65, 40, 65, 40, 65, 60],
  //     // data: categoryValue,
  //   },
  //   {
  //     name: "closed",
  //     type: "line",
  //     data: [10, 75, 50, 55, 50, 75, 50],
  //     // data: closedValue,
  //   },
  // ];

  const series = categoryValue;
  return (
    <>
      <BasicPortlet cardTitle="Lead History" titleClass="header-title">
        <div className="text-center">
          <div className="row mt-2">
            <div className="col-4">
              <h3>{data?.total_leads ? data?.total_leads : "0"}</h3>
              <p className="text-muted font-13 mb-0 text-truncate">Total Leads</p>
            </div>
            <div className="col-4">
              <h3>{data?.spam_leads ? data?.spam_leads : "0"}</h3>
              <p className="text-muted font-13 mb-0 text-truncate">Spam Leads</p>
            </div>
            <div className="col-4">
              <h3>{data?.closed_leads ? data?.closed_leads : "0"}</h3>
              <p className="text-muted font-13 mb-0 text-truncate">Closed Leads</p>
            </div>
          </div>

          <div dir="ltr">
            <Chart options={options} series={series} type="line" height={273} className="apex-charts mt-2" />
          </div>
        </div>
      </BasicPortlet>
    </>
  );
};

export default IncomeChart;

// import React, { useEffect, useState } from "react";
// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";

// // components
// import { BasicPortlet } from "../../../components/Portlet";

// const IncomeChart = ({ data }: any) => {
//   const [categoryData, setCategoryData] = useState<string[]>([]);
//   const [categoryValue, setCategoryValue] = useState<number[]>([]);

//   const [closedData, setClosedData] = useState<string[]>([]);
//   const [closedValue, setClosedValue] = useState<number[]>([]);

//   useEffect(() => {
//     const categoryArray: string[] = [];
//     const dataArray: number[] = [];
//     data?.spam?.map((item: any) => {
//       categoryArray.push(item.month);
//       dataArray.push(item.value);
//     });
//     setCategoryData(categoryArray);
//     setCategoryValue(dataArray);
//   }, []);

//   useEffect(() => {
//     const categoryArray: string[] = [];
//     const dataArray: number[] = [];
//     data?.closed?.map((item: any) => {
//       categoryArray.push(item.month);
//       dataArray.push(item.value);
//     });
//     setClosedData(categoryArray);
//     setClosedValue(dataArray);
//   }, []);
//   const options: ApexOptions = {
//     chart: {
//       height: 350,
//       type: "line",
//       toolbar: {
//         show: false,
//       },
//       stacked: false,
//     },
//     stroke: {
//       width: [1, 2],
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     legend: {
//       show: false,
//     },
//     fill: {
//       type: "solid",
//       opacity: [0.3, 0.3],
//     },
//     colors: ["#4a81d4", "#1fa083"],
//     xaxis: {
//       // categories: ["2012", "2013", "2014", "2015", "2016", "2017", "2018"],
//       categories: categoryData,
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//     },
//     yaxis: {
//       tickAmount: 4,
//       min: 0,
//       max: 200,
//     },
//   };

//   const series = [
//     {
//       name: "spam",
//       type: "area",
//       // data: [20, 65, 40, 65, 40, 65, 60],
//       data: categoryValue,
//     },
//     {
//       name: "closed",
//       type: "line",
//       // data: [10, 75, 50],
//       data: closedValue,
//     },
//   ];

//   return (
//     <>
//       <BasicPortlet cardTitle="Lead History" titleClass="header-title">
//         <div className="text-center">
//           <div className="row mt-2">
//             <div className="col-4">
//               <h3>{data?.total_leads}</h3>
//               <p className="text-muted font-13 mb-0 text-truncate">Total Leads</p>
//             </div>
//             <div className="col-4">
//               <h3>{data?.total_spam}</h3>
//               <p className="text-muted font-13 mb-0 text-truncate">Spam Leads</p>
//             </div>
//             <div className="col-4">
//               <h3>{data?.total_closed}</h3>
//               <p className="text-muted font-13 mb-0 text-truncate">Closed Leads</p>
//             </div>
//           </div>

//           <div dir="ltr">
//             <Chart options={options} series={series} type="line" height={273} className="apex-charts mt-2" />
//           </div>
//         </div>
//       </BasicPortlet>
//     </>
//   );
// };

// export default IncomeChart;
