import React, { useCallback, useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import StatCards from "../Components/StatCards";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard, getDashCountries } from "../../../redux/actions";
import { RootState } from "../../../redux/store";
import { Spinner } from "react-bootstrap";
import CustomFilter from "../../../components/Dashboard/CustomFilter";
import CountryFilter from "../../../components/Dashboard/CountryFilter";
import ApplicationsManagerTable from "../Components/ApplicationManagerTable";

type FilterType = "today" | "weekly" | "monthly" | "custom" | "";

const WithDashboardLayout = (Component: React.ComponentType<any>) => {
  // Return a new component wrapped with the layout
  return function WithDashboardLayoutComponent(props: any) {
    const dispatch = useDispatch();
    const { userRole } = props;
    const isApplicationSide = userRole === "Application Manager";

    const [currentCountry, setCurrentCountry] = useState(10);
    const [filterType, setFilterType] = useState<FilterType>("");
    const [selectedWeek, setSelectedWeek] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [customStartDate, setCustomStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [customEndDate, setCustomEndDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const filters = ["weekly", "monthly", "custom"];

    const { cards, loading, categories, series, latestLeadsCount, pieData, countries, colors } = useSelector((state: RootState) => ({
      cards: state.Dashboard.dashboard.data?.statCards,
      categories: state.Dashboard.dashboard.data?.categories,
      series: state.Dashboard.dashboard.data?.series,
      latestLeadsCount: state.Dashboard.dashboard.data?.latestLeadsCount,
      colors: state.Dashboard.dashboard.data?.colorsForGraph,
      countries: state.DashboardCountries.countries.data,
      pieData: state.Dashboard.dashboard.data?.applicationData,
      loading: state.Dashboard.loading,
    }));

    const handleCountryClick = (id: any) => {
      setCurrentCountry(id);
      handleFilter(filterType, id);
    };

    const handleFilter = useCallback(
      (filterType: any, country_id?: any) => {
        if (isApplicationSide) {
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
      },
      [dispatch, isApplicationSide, selectedYear, selectedMonth, selectedDate, customStartDate, customEndDate]
    );

    useEffect(() => {
      dispatch(isApplicationSide ? getDashboard({ country_id: currentCountry }) : getDashboard());
    }, []);

    useEffect(() => {
      if (isApplicationSide) {
        dispatch(getDashCountries());
      }
    }, []);

    useEffect(() => {
      if (countries && countries.length > 0) {
        setCurrentCountry(countries[0].id); // Assuming each country object has an `id` field
      }
    }, [countries]);

    if (loading) {
      return <Spinner animation="border" style={{ position: "absolute", top: "50%", left: "50%" }} />;
    }

    return (
      <>
        <PageTitle breadCrumbItems={[{ label: "Dashboard", path: "", active: true }]} title="Dashboard" />
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
          currentCountry={isApplicationSide ? currentCountry : undefined}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
        />
        {isApplicationSide && <CountryFilter countries={countries} onCountryChange={handleCountryClick} currentCountry={currentCountry} />}
        <StatCards statCardsItems={cards || []} role={userRole} />
        <Component
          {...props}
          categories={categories || []}
          series={series || []}
          latestLeadsCount={latestLeadsCount}
          pieData={pieData || {}}
          countries={countries || []}
          colors={colors}
        />
        {isApplicationSide && <ApplicationsManagerTable />}
      </>
    );
  };
};

export default WithDashboardLayout;
