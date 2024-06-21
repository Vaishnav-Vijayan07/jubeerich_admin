import { combineReducers } from "redux";

import Auth from "./auth/reducers";
import Layout from "./layout/reducers";
import Category from "./category/reducers";
import Source from "./sources/reducer";
import Channels from "./channels/reducers";
import Campaign from "./campaigns/reducers";
import Branches from "./branches/reducer";
import Roles from "./users/roles/reducer";
import Users from "./users/adminUsers/reducers";
import Leads from "./leads/reducers";
import Status from "./status/reducers";
import Checklist from "./checklist/reducers";
import SubStatus from "./subStatus/reducers";
import History from "./history/reducers";
import Dashboard from "./dashboard/reducer";
import OfficeTypes from "./OfficeType/reducers";
import Region from "./regions/reducers";
import Flag from "./flag/reducers";
import MaritalStatus from "./marital_status/reducers";
export default combineReducers({
  Auth,
  Layout,
  Category,
  Source,
  Channels,
  OfficeTypes,
  Region,
  Campaign,
  Branches,
  Flag,
  MaritalStatus,
  Roles,
  Users,
  Leads,
  Status,
  Checklist,
  SubStatus,
  History,
  Dashboard
});
