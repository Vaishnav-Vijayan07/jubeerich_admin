import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";

// components
import PageTitle from "../../../components/PageTitle";

import SalesChart from "./SalesChart";
import StatisticsChart from "./StatisticsChart";
import IncomeChart from "./IncomeChart";
import Statistics from "./Statistics";
import ProjectsDetails from "./ProjectsDetails";

// dummy data
import { projectsDetails, reportData } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard } from "../../../redux/actions";
import { RootState } from "../../../redux/store";
import DashBoardCards from "../../../components/DashBoardCards";

const Dashboard4 = () => {
  const dispatch = useDispatch();

  const { DashboardData, loading, error } = useSelector((state: RootState) => ({
    loading: state?.Dashboard?.loading,
    DashboardData: state?.Dashboard.dashboard.data?.data,
    error: state?.Dashboard?.error,
  }));

  const { userRole } = useSelector((state: RootState) => ({
    userRole: state?.Auth.user.name,
  }));

  useEffect(() => {
    dispatch(getDashboard());
  }, []);

  console.log("DashboardData", DashboardData);

  const data = reportData;

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Dashboards", path: "/dashboard-4" },
          { label: "Dashboard", path: "/dashboard-4", active: true },
        ]}
        title={"Dashboard"}
      />

      {/* <Row>
        <Col xl={4} md={6}>
          <SalesChart data={DashboardData?.leads_statistics} />
        </Col>
        <Col xl={4} md={6}>
          <StatisticsChart data={DashboardData?.monthly_statistics} />
        </Col>
        <Col xl={4} md={12}>
          <IncomeChart data={DashboardData?.leads_history} />
        </Col>
      </Row>

      <Statistics data={DashboardData?.executive_users} />

      <Row>
        <Col>
          <ProjectsDetails projectsDetails={DashboardData?.recently_closed} />
        </Col>
      </Row> */}
      {userRole == "CRE 1" && (
        <>
          <DashBoardCards />
          <Row>
            <Col>
              <ProjectsDetails />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default Dashboard4;
