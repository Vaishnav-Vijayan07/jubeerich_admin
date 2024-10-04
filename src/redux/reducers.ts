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
import FranchiseUsers from "./users/franchiseCounsellors/reducers";
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
import Country from "./country/reducers";
import University from "./University/reducers";
import Program from "./programs/reducers";
import Franchise from "./franchise/reducers";
import Campus from "./campus/reducers";
import CourseType from "./course_type/reducers";
import Course from "./course/reducers";
import Stream from "./stream/reducers";
import refreshReducer from "./countryReducer";
import DropDownReducer from "./dropDown/reducers";

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
  Country,
  University,
  Program,
  MaritalStatus,
  Roles,
  Users,
  Leads,
  Status,
  Checklist,
  SubStatus,
  History,
  Dashboard,
  FranchiseUsers,
  Franchise,
  Campus,
  CourseType,
  Course,
  Stream,
  DropDownReducer,
  refreshReducer,
});
