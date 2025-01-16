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

const Dashboard3 = () => {
  const userInfo = JSON.parse(sessionStorage.getItem("jb_user") || "{}");

  const renderDashboard = () => {
    switch (userInfo?.role_name) {
      case "IT Team":
        return <ItTeamDashboard userRole={userInfo?.role_name} />;
      case "CRE":
        return <CreDashboard userRole={userInfo?.role_name}/>;
      case "CRE TL":
        return <CreTlDashboard userRole={userInfo?.role_name}/>;
      case "Counsellor":
        return <CounselorDashboard userRole={userInfo?.role_name}/>;
      case "Country Manager":
        return <CountryManagerDashboard userRole={userInfo?.role_name}/>;
      case "Application Manager":
        return <ManagerDashboard userRole={userInfo?.role_name}/>
      case "Application Team":
        return <ApplicationTeamDashboard userRole={userInfo?.role_name}/>
      default:
        return (
          <>
            <PageTitle breadCrumbItems={[{ label: "Dashboards", path: "" }]} title={"Dashboard"} />

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
