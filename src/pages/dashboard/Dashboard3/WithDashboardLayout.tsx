import React from "react";
import PageTitle from "../../../components/PageTitle";
import StatCards from "../Components/StatCards";

const statCardsItems = [
  { id: 1, title: "Total leads", stats: "10000", icon: "fe-users", bgColor: "#5bc0de" }, // Blue for general data
  { id: 2, title: "Spam leads", stats: "1200", icon: "fe-alert-triangle", bgColor: "#f0ad4e" }, // Orange for warnings
  { id: 3, title: "Closed leads", stats: "2500", icon: "fe-check-circle", bgColor: "#5cb85c" }, // Green for success
  { id: 4, title: "Failed Leads", stats: "500", icon: "fe-x-circle", bgColor: "#d9534f" }, // Red for errors
];


const WithDashboardLayout = (Component: React.ComponentType<any>) => {
  // Return a new component wrapped with the layout
  return function WithDashboardLayoutComponent(props: any) {
    return (
      <>
        <PageTitle breadCrumbItems={[{ label: "Dashboard", path: "" }]} title="Dashboard" />
        <StatCards statCardsItems={statCardsItems} />
        <Component {...props} />
      </>
    );
  };
};

export default WithDashboardLayout;
