import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import StatCards from "../Components/StatCards";
import CustomFilter from "../../../components/CustomFilter";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard } from "../../../redux/actions";
import { RootState } from "../../../redux/store";
import { Spinner } from "react-bootstrap";

type FilterType = "today" | "weekly" | "monthly" | "custom" | "";

const WithDashboardLayout = (Component: React.ComponentType<any>) => {
  // Return a new component wrapped with the layout
  return function WithDashboardLayoutComponent(props: any) {
    const dispatch = useDispatch();
    const { userRole } = props;

    const [filterType, setFilterType] = useState<FilterType>("");
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [customStartDate, setCustomStartDate] = useState<string>("");
    const [customEndDate, setCustomEndDate] = useState<string>("");
    const filters = ["weekly", "monthly", "custom"];

    const { cards, loading, categories, series, latestLeadsCount } = useSelector((state: RootState) => ({
      cards: state.Dashboard.dashboard.data?.statCards,
      categories: state.Dashboard.dashboard.data?.categories,
      series: state.Dashboard.dashboard.data?.series,
      latestLeadsCount: state.Dashboard.dashboard.data?.latestLeadsCount,
      loading: state.Dashboard.loading,
    }));


    const handleFilter = (filterType: any) => {
      switch (filterType) {
        case "monthly":
          dispatch(getDashboard({ filterType, year: selectedYear, month: selectedMonth }));
          break;

        case "weekly":
          dispatch(getDashboard({ filterType, year: selectedYear, month: selectedMonth, fromDate: selectedDate }));
          break;

        case "custom":
          dispatch(getDashboard({ filterType, fromDate: customStartDate, toDate: customEndDate }));
          break;

        // case "today":
        //   const today = new Date();
        //   dispatch(getDashboard({ startDate: today, endDate: today }));
        //   break;

        default:
          dispatch(getDashboard({}));
          break;
      }
    };

    useEffect(() => {
      dispatch(getDashboard());
    }, []);

    if (loading) {
      return <Spinner animation="border" style={{ position: "absolute", top: "50%", left: "50%" }} />;
    }

    return (
      <>
        <PageTitle breadCrumbItems={[{ label: "Dashboard", path: "" }]} title="Dashboard" />
        <CustomFilter
          filterType={filterType}
          setFilterType={setFilterType}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          customStartDate={customStartDate}
          setCustomStartDate={setCustomStartDate}
          customEndDate={customEndDate}
          setCustomEndDate={setCustomEndDate}
          filters={filters}
          handleFilter={handleFilter}
        />
        <StatCards statCardsItems={cards || []} />
        <Component {...props} categories={categories || []} series={series || []} latestLeadsCount={latestLeadsCount} />
      </>
    );
  };
};

export default WithDashboardLayout;
