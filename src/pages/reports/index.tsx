import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";

// components
import PageTitle from "../../components/PageTitle";

import ManageTickets from "./ManageTickets";

// dummy data
import { ticketDetails } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { getLead, getLeadUser, getStatus } from "../../redux/actions";
import { RootState } from "../../redux/store";
import { AUTH_SESSION_KEY } from "../../constants";
import axios from "axios";

const List = () => {
  const [statusData, setStatusData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  const dispatch = useDispatch();

  const Status = useSelector((state: RootState) => state?.Status?.status?.data);

  //get leads
  const sendRequest = () => {
    if (userInfo) {
      const { user_id } = JSON.parse(userInfo);
      if (user_id == 1) {
        dispatch(getLead(1,10));;
      } else {
        dispatch(getLeadUser());
      }
    }
  };

  const getExecutiveUsers = () => {
    axios.get("/exicutive_users").then((res) => {
      const UsersArray = res.data?.map((status: any) => ({
        value: status.id,
        label: status.name,
      }));
      setUsersData(UsersArray);
    });
  };

  useEffect(() => {
    sendRequest();
  }, [userInfo]);

  useEffect(() => {
    dispatch(getStatus());
    getExecutiveUsers();
  }, []);

  useEffect(() => {
    if (Status) {
      const StatusArray = Status?.map((status: any) => ({
        value: status.id,
        label: status.status_name,
      }));
      setStatusData(StatusArray);
    }
  }, [Status]);

  return (
    <>
      <PageTitle breadCrumbItems={[{ label: "Reports", path: "/reports", active: true }]} title={"Reports"} />

      <Row>
        <Col>
          <ManageTickets
            ticketDetails={ticketDetails}
            statusData={statusData}
            usersData={usersData}
            show={false}
            onHide={function (): void {
              throw new Error("Function not implemented.");
            }}
            onSubmit={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default List;
