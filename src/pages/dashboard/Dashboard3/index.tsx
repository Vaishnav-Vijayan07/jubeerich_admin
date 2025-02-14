import React from "react";
import { Row, Col } from "react-bootstrap";

// components
import PageTitle from "../../../components/PageTitle";
import Messages from "../../../components/Messages";
import TodoList from "../../../components/TodoList";
import ChatList from "../../../components/ChatList";

import Statistics from "./Statistics";
import PerformanceChart from "./PerformanceChart";
import RevenueChart from "./RevenueChart";

// dummy data
import { chatMessages } from "./data";
import CreDashboard from "../CRE/CreDashboard";
import CreTlDashboard from "../CRE TL/CreTlDashboard";
import ItTeamDashboard from "../IT Team/ItTeamDashboard";
import CounselorDashboard from "../Counselor/CounselorDashboard";
import CountryManagerDashboard from "../Country Manager/CountryManagerDashboard";
import ManagerDashboard from "../Application/Manager";
import ApplicationTeamDashboard from "../Application/Team";
import ApplicationsManagerTable from "../../../pages/dashboard/Components/ApplicationManagerTable";
import { application_manager_id, application_team_id, counsellor_id, country_manager_id, cre_id, cre_tl_id, it_team_id } from "../../../constants";

const Dashboard3 = () => {
  const userInfo = JSON.parse(sessionStorage.getItem("jb_user") || "{}");
  const user_role_id = (userInfo?.role).toString();


  const renderDashboard = () => {
    switch (user_role_id) {
      case it_team_id:
        return <ItTeamDashboard userRole={userInfo?.role_name} />;
      case cre_id:
        return <CreDashboard userRole={userInfo?.role_name} />;
      case cre_tl_id:
        return <CreTlDashboard userRole={userInfo?.role_name} />;
      case counsellor_id:
        return <CounselorDashboard userRole={userInfo?.role_name} />;
      case country_manager_id:
        return <CountryManagerDashboard userRole={userInfo?.role_name} />;
      case application_manager_id:
        return <ManagerDashboard userRole={userInfo?.role_name} >
          <ApplicationsManagerTable />
        </ManagerDashboard>;
      case application_team_id:
        return <ApplicationTeamDashboard userRole={userInfo?.role_name} />;
      default:
        return (
          <>
            <PageTitle breadCrumbItems={[{ label: "Dashboards", path: "", active: true }]} title={"Dashboard"} />

            <Statistics />

            <Row>
              <Col xl={6}>
                <RevenueChart />
              </Col>
              <Col xl={6}>
                <PerformanceChart />
              </Col>
            </Row>
            <Row>
              <Col lg={6} xl={4}>
                <Messages />
              </Col>
              <Col lg={6} xl={4}>
                <TodoList addTodo={true} height={"310px"} />
              </Col>
              <Col lg={12} xl={4}>
                <ChatList messages={chatMessages} />
              </Col>
            </Row>
          </>
        );
    }
  };

  return <>{renderDashboard()}</>;
};

export default Dashboard3;
