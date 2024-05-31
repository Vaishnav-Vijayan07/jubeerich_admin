import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";

// components
import PageTitle from "../../../../components/PageTitle";

import Statistics from "./Statistics";
import ManageTickets from "./ManageTickets";

// dummy data
import { ticketDetails } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { getLead, getLeadUser } from "../../../../redux/actions";
import { RootState } from "../../../../redux/store";
import { AUTH_SESSION_KEY, meeting_scheduled_id, meeting_to_be_scheduled_id, new_lead_id, proposal_shared_id } from "../../../../constants";

const List = () => {
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  const dispatch = useDispatch();
  const Leads = useSelector((state: RootState) => state?.Leads?.leads?.data?.data);

  const [NewLeads, setNewLeads] = useState([]);
  const [proposalShared, setProposalShared] = useState([]);
  const [meetingToBeScheduled, setMeetingToBeScheduled] = useState([]);
  const [meetingScheduled, setMeetingScheduled] = useState([]);

  //get leads
  const sendRequest = () => {
    if (userInfo) {
      const { user_id } = JSON.parse(userInfo);
      if (user_id == 1) {
        dispatch(getLead());
      } else {
        dispatch(getLeadUser());
      }
    }
  };

  useEffect(() => {
    sendRequest();
  }, [userInfo]);

  const calculateCounts = () => {
    const NewLeads = Leads?.filter((lead: any) => lead?.status == new_lead_id);
    const ProposalShared = Leads?.filter((lead: any) => lead?.status == proposal_shared_id);
    const MeetingToBeScheduled = Leads?.filter((lead: any) => lead?.status == meeting_to_be_scheduled_id);
    const MeetingScheduled = Leads?.filter((lead: any) => lead?.status == meeting_scheduled_id);

    setProposalShared(ProposalShared);
    setMeetingScheduled(MeetingScheduled);
    setMeetingToBeScheduled(MeetingToBeScheduled);
    setNewLeads(NewLeads);
  };

  useEffect(() => {
    if (Leads) {
      calculateCounts();
    }
  }, [Leads]);

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Leads", path: "/leads/leads_list" },
          { label: "Leads List", path: "/leads/leads_list", active: true },
        ]}
        title={"Leads List"}
      />

      <Row>
        <Col md={6} xl={6} xxl={3}>
          <Statistics icon="fe-tag" variant="primary" stats={NewLeads?.length} desc="New Leads" />
        </Col>
        <Col md={6} xl={6} xxl={3}>
          <Statistics icon="fe-clock" variant="warning" stats={proposalShared?.length} desc="Proposal to be shared" />
        </Col>
        <Col md={6} xl={6} xxl={3}>
          <Statistics icon="fe-check-circle" variant="success" stats={meetingToBeScheduled?.length} desc="Meeting to be scheduled" />
        </Col>
        <Col md={6} xl={6} xxl={3}>
          <Statistics icon="fe-activity" variant="info" stats={meetingScheduled?.length} desc="Meeting scheduled" />
        </Col>
      </Row>

      <Row>
        <Col>
          <ManageTickets
            Leads={Leads}
            ticketDetails={ticketDetails}
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
