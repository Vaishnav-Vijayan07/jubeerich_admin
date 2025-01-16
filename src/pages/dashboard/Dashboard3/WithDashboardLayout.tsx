import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import StatCards from "../Components/StatCards";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard } from "../../../redux/actions";
import { RootState } from "../../../redux/store";
import { Spinner } from "react-bootstrap";
import CustomFilter from "../../../components/Dashboard/CustomFilter";
import CountryFilter from "../../../components/Dashboard/CountryFilter";

type FilterType = "today" | "weekly" | "monthly" | "custom" | "";

const WithDashboardLayout = (Component: React.ComponentType<any>) => {
  // Return a new component wrapped with the layout
  return function WithDashboardLayoutComponent(props: any) {
    const dispatch = useDispatch();
    const { userRole } = props;

    const [currentCountry, setCurrentCountry] = useState(1);
    const [filterType, setFilterType] = useState<FilterType>("");
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [customStartDate, setCustomStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [customEndDate, setCustomEndDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const filters = ["weekly", "monthly", "custom"];

    const { cards, loading, categories, series, latestLeadsCount, pieData, countries } = useSelector((state: RootState) => ({
      cards: state.Dashboard.dashboard.data?.statCards,
      categories: state.Dashboard.dashboard.data?.categories,
      series: state.Dashboard.dashboard.data?.series,
      latestLeadsCount: state.Dashboard.dashboard.data?.latestLeadsCount,
      countries: state.Dashboard.dashboard.data?.countries,
      pieData: state.Dashboard.dashboard.data?.applicationData,
      loading: state.Dashboard.loading,
    }));

    console.log("COUNTRY", currentCountry);

    const handleCountryClick = (id: any) => {
      console.log("COUNTRY", id);

      setCurrentCountry(id);
      handleFilter(filterType, id);
    };

    const handleFilter = (filterType: any, country_id?: any) => {
      if (userRole === "Application Manager") {
        switch (filterType) {
          case "monthly":
            dispatch(getDashboard({ filterType, year: selectedYear, month: selectedMonth, country_id }));
            break;

          case "weekly":
            dispatch(getDashboard({ filterType, year: selectedYear, month: selectedMonth, fromDate: selectedDate, country_id }));
            break;

          case "custom":
            dispatch(getDashboard({ filterType, fromDate: customStartDate, toDate: customEndDate, country_id }));
            break;

          default:
            dispatch(getDashboard({ country_id: country_id }));
            break;
        }
      } else {
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

          default:
            dispatch(getDashboard({}));
            break;
        }
      }
    };

    useEffect(() => {
      dispatch(userRole == "Application Manager" ? getDashboard({ country_id: currentCountry }) : getDashboard());
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
          setCurrentCountry={setCurrentCountry}
          currentCountry={userRole == "Application Manager" ? currentCountry : undefined}
        />
        {userRole == "Application Manager" && (
          <CountryFilter countries={countries} onCountryChange={handleCountryClick} currentCountry={currentCountry} />
        )}
        <StatCards statCardsItems={cards || []} />
        <Component
          {...props}
          categories={categories || []}
          series={series || []}
          latestLeadsCount={latestLeadsCount}
          pieData={pieData || {}}
          countries={countries || []}
        />
      </>
    );
  };
};

export default WithDashboardLayout;
