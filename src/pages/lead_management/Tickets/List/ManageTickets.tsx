import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";

// dummy data
import { TicketDetailsItems } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { getBranches, getCategory, getChannel, getLead, getSource, getStatus } from "../../../../redux/actions";

import LeadCompontents from "./LeadsComponent";
import axios from "axios";

interface ManageTicketsProps {
  Leads: any;
  ticketDetails: TicketDetailsItems[];
  show: boolean;
  onHide: () => void;
  onSubmit: () => void;
}

const ManageTickets = ({ Leads, ticketDetails, show, onHide, onSubmit }: ManageTicketsProps) => {
  const [branchData, setBranchData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [channelData, setChannelData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [flagsData, setFlagsData] = useState([]);
  const dispatch = useDispatch();

  const Category = useSelector((state: RootState) => state?.Category?.category?.data);
  const Channel = useSelector((state: RootState) => state?.Channels?.channels?.data);
  const Source = useSelector((state: RootState) => state?.Source?.sources?.data);
  const Branch = useSelector((state: RootState) => state?.Branches?.branches?.data);
  const Status = useSelector((state: RootState) => state?.Status?.status?.data);

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
    dispatch(getCategory());
    dispatch(getSource());
    dispatch(getChannel());
    dispatch(getBranches());
    dispatch(getStatus());
    getExecutiveUsers();
  }, []);

  // Transforming and setting state for Leads data
  useEffect(() => {
    if (Branch) {
      const branchArray = Branch?.map((branch: any) => ({
        value: branch.id.toString(),
        label: branch.branch_name,
      }));
      setBranchData(branchArray);
    }
  }, [Branch]);

  useEffect(() => {
    if (Category) {
      const categoryArray = Category?.map((category: any) => ({
        value: category.id.toString(),
        label: category.category_name,
      }));
      setCategoryData(categoryArray);
    }
  }, [Category]);

  useEffect(() => {
    if (Channel) {
      const ChannelArray = Channel?.map((channel: any) => ({
        value: channel.id.toString(),
        label: channel.channel_name,
      }));
      setChannelData(ChannelArray);
    }
  }, [Channel]);

  useEffect(() => {
    if (Source) {
      const SourceArray = Source?.map((source: any) => ({
        value: source.id.toString(),
        label: source.source_name,
      }));
      setSourceData(SourceArray);
    }
  }, [Source]);

  useEffect(() => {
    if (Status) {
      const StatusArray = Status?.map((status: any) => ({
        value: status.id,
        label: status.status_name,
      }));
      setStatusData(StatusArray);
    }
  }, [Status]);

  useEffect(() => {
    axios.get("/flags").then((res) => {
      const flagsArray = res?.data?.map((flag: any) => ({
        value: flag.id,
        label: flag.flag_name,
      }));
      setFlagsData(flagsArray);
    });
  }, []);

  return (
    <React.Fragment>
      <Row>
        <Col>
          <LeadCompontents
            leadsData={Leads}
            ticketDetails={ticketDetails}
            CategoryData={categoryData}
            ChannelData={channelData}
            SourceData={sourceData}
            BranchData={branchData}
            statusData={statusData}
            UsersData={usersData}
            FlagData={flagsData}
            show={show}
            onHide={onHide}
            onSubmit={onSubmit}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ManageTickets;
