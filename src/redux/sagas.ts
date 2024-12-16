import { all } from "redux-saga/effects";

import authSaga from "./auth/saga";
import layoutSaga from "./layout/saga";
import categorySaga from "./category/saga";
import sourceSaga from "./sources/saga";
import channelSaga from "./channels/saga";
import campaignSaga from "./campaigns/saga";
import branchesSaga from "./branches/saga";
import RoleSaga from "./users/roles/saga";
import FranchiseSaga from "./users/franchiseCounsellors/saga";
import LeadsSaga from "./leads/saga";
import statusSaga from "./status/saga";
import ChecklistSaga from "./checklist/saga";
import SubStatusSaga from "./subStatus/saga";
import HistorySaga from "./history/saga";
import DashboardSaga from "./dashboard/saga";
import OfficeTypeSaga from "./OfficeType/saga";
import RegionSaga from "./regions/saga";
import FlagSaga from "./flag/saga";
import MaritalStatusSaga from "./marital_status/saga";
import CountrySaga from "./country/saga";
import UniversitySaga from "./University/saga";
import ProgramSaga from "./programs/saga";
import FranchiseUserSaga from "./franchise/saga";
import CampusSaga from "./campus/saga";
import CourseTypeSaga from "./course_type/saga";
import CourseSaga from "./course/saga";
import StreamSaga from "./stream/saga";
import dropDownSaga from "./dropDown/saga";
import KYCSaga from "./KYC/saga";
import AdminUserSaga from "./users/adminUsers/saga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    layoutSaga(),
    categorySaga(),
    sourceSaga(),
    channelSaga(),
    OfficeTypeSaga(),
    RegionSaga(),
    FlagSaga(),
    CountrySaga(),
    UniversitySaga(),
    ProgramSaga(),
    MaritalStatusSaga(),
    campaignSaga(),
    branchesSaga(),
    RoleSaga(),
    LeadsSaga(),
    statusSaga(),
    ChecklistSaga(),
    SubStatusSaga(),
    HistorySaga(),
    DashboardSaga(),
    FranchiseSaga(),
    FranchiseUserSaga(),
    CampusSaga(),
    CourseTypeSaga(),
    CourseSaga(),
    StreamSaga(),
    dropDownSaga(),
    KYCSaga(),
    AdminUserSaga()
  ]);
}
