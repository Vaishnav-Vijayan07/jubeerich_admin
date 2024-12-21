import React, { useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import StatCards from "../Components/StatCards";
import CustomFilter from "../../../components/CustomFilter";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard } from "../../../redux/actions";
import { RootState } from "../../../redux/store";
import { Spinner } from "react-bootstrap";

const WithDashboardLayout = (Component: React.ComponentType<any>) => {
  // Return a new component wrapped with the layout
  return function WithDashboardLayoutComponent(props: any) {
    const dispatch = useDispatch();
    const { userRole } = props;

    const { cards, loading, categories, series,latestLeadsCount } = useSelector((state: RootState) => ({
      cards: state.Dashboard.dashboard.data?.statCards,
      categories: state.Dashboard.dashboard.data?.categories,
      series: state.Dashboard.dashboard.data?.series,
      latestLeadsCount: state.Dashboard.dashboard.data?.latestLeadsCount,
      loading: state.Dashboard.loading,
    }));

    console.log("dash", latestLeadsCount);

    useEffect(() => {
      dispatch(getDashboard());
    }, [dispatch]);

    if (loading) {
      return <Spinner animation="border" style={{ position: "absolute", top: "50%", left: "50%" }} />;
    }

    return (
      <>
        <PageTitle breadCrumbItems={[{ label: "Dashboard", path: "" }]} title="Dashboard" />
        <CustomFilter />
        <StatCards statCardsItems={cards || []} />
        <Component {...props} categories={categories || []} series={series || []} latestLeadsCount={latestLeadsCount} />
      </>
    );
  };
};

export default WithDashboardLayout;
