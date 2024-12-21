import React, { useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import StatCards from "../Components/StatCards";
import CustomFilter from "../../../components/CustomFilter";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard } from "../../../redux/actions";
import { RootState } from "../../../redux/store";
import { Spinner } from "react-bootstrap";

const statCardsItems = [
  { id: 1, title: "Total leads", stats: "10000", icon: "fe-users", bgColor: "#5bc0de" }, // Blue for general data
  { id: 2, title: "Spam leads", stats: "1200", icon: "fe-alert-triangle", bgColor: "#f0ad4e" }, // Orange for warnings
  { id: 3, title: "Closed leads", stats: "2500", icon: "fe-check-circle", bgColor: "#5cb85c" }, // Green for success
  { id: 4, title: "Failed Leads", stats: "500", icon: "fe-x-circle", bgColor: "#d9534f" }, // Red for errors
];

const WithDashboardLayout = (Component: React.ComponentType<any>) => {
  // Return a new component wrapped with the layout
  return function WithDashboardLayoutComponent(props: any) {
    const dispatch = useDispatch();
    const { userRole } = props;

    const { cards, loading } = useSelector((state: RootState) => ({
      cards: state.Dashboard.dashboard.data?.statCards,
      loading: state.Dashboard.loading,
    }));

    console.log("dash", loading);

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
        <Component {...props} />
      </>
    );
  };
};

export default WithDashboardLayout;
