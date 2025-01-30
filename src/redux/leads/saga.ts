import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// helpers
import {
  getLeads as getLeadsApi,
  addLeads as addLeadsApi,
  updateLeads as updateLeadsApi,
  deleteLeads as deleteSourcesApi,
  getLeadUser as getLeadUserApi,
} from "../../helpers/";

// actions
import {
  LeadsApiResponseSuccess,
  LeadsApiResponseError,
  getLead,
  getLeadUser,
  getLeadsTL,
  getLeadsByCounsellorTL as getLeadsByCounsellorTLAction,
  getLeadAssignedByCounsellorTL,
  getLeadAssigned,
} from "./actions";

// constants
import { LeadsActionTypes } from "./constants";
import { AUTH_SESSION_KEY, counsellor_tl_id, cre_tl_id } from "../../constants";
import {
  getAssignedLeadsByCreTl,
  getLeadsByCreTl,
  getAssignedLeadsByCounsellorTL as getAssignedLeadsByCounsellorTLAPI,
  getLeadsByCounsellorTL,
  getAssignedLeadsRegionalMangersApi,
} from "../../helpers/api/leads";

interface LeadsData {
  payload: {
    isAssignedLeads: boolean;
    currentPage: number;
    currentLimit: number;
    keyword?: string | undefined;
    sort_order?: string | undefined;
    sort_by?: string | undefined;
    country?: string | undefined;
    office?: string | undefined;
    source?: string | undefined;
    id: string;
    full_name: string;
    email: string;
    phone: string;
    lead_type_id: string;
    source_id: string;
    channel_id: string;
    city: string;
    preferred_country: string;
    office_type: string;
    flag_id: string;
    region_id: string | null;
    counsiler_id: string | null;
    branch_id: string | null;
    updated_by: string;
    remarks: string;
    lead_received_date: string;
    ielts: boolean;
    zipcode: any;
    exam_details?: any;
    exam_documents?: any;
    franchise_id?: string;
    changedFiles: any;
    navigate?: any;
  };
  type: string;
}

const api = new APICore();

let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
let userRole: any;
if (userInfo) {
  userRole = JSON.parse(userInfo)?.role;
}

function* getLeads({ payload: { currentPage, currentLimit, keyword, sort_by, sort_order, country, office, source } }: LeadsData): SagaIterator {
  try {
    let response;
    let data;
    response = yield call(getLeadsApi, currentPage, currentLimit, keyword, sort_by, sort_order, country, office, source);
    data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(LeadsApiResponseSuccess(LeadsActionTypes.GET_LEADS, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(LeadsApiResponseError(LeadsActionTypes.GET_LEADS, error));
  }
}

function* getLeadsAssignedByRegionalManager(): SagaIterator {
  try {
    let response = yield call(getAssignedLeadsRegionalMangersApi);
    let data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(
      LeadsApiResponseSuccess(LeadsActionTypes.GET_LEADS_REGIONAL_MANAGER, {
        data,
      })
    );
  } catch (error: any) {
    console.log("Error", error);
    yield put(LeadsApiResponseError(LeadsActionTypes.GET_LEADS_REGIONAL_MANAGER, error));
  }
}

function* getLeadsForTL({ payload: { currentPage, currentLimit, keyword, sort_by, sort_order, country, office, source } }: LeadsData): SagaIterator {
  try {
    let response;
    let data;
    response = yield call(getLeadsByCreTl, currentPage, currentLimit, keyword, sort_by, sort_order, country, office, source);
    data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(LeadsApiResponseSuccess(LeadsActionTypes.GET_LEADS_TL, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(LeadsApiResponseError(LeadsActionTypes.GET_LEADS_TL, error));
  }
}

function* getAssignedLeads({ payload: { currentPage, currentLimit, keyword } }: LeadsData): SagaIterator {
  try {
    let response = yield call(getAssignedLeadsByCreTl, currentPage, currentLimit, keyword);
    let data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(LeadsApiResponseSuccess(LeadsActionTypes.GET_LEADS_ASSIGNED, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(LeadsApiResponseError(LeadsActionTypes.GET_LEADS_ASSIGNED, error));
  }
}

function* getLeadsForCounsellorTL(): SagaIterator {
  try {
    let response;
    let data;
    response = yield call(getLeadsByCounsellorTL);
    data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(
      LeadsApiResponseSuccess(LeadsActionTypes.GET_LEADS_BY_COUNSELLOR_TL, {
        data,
      })
    );
  } catch (error: any) {
    console.log("Error", error);
    yield put(LeadsApiResponseError(LeadsActionTypes.GET_LEADS_BY_COUNSELLOR_TL, error));
  }
}

function* getAssignedLeadsByCounsellorTL({ payload: { currentPage, currentLimit, keyword } }: LeadsData): SagaIterator {
  try {
    let response = yield call(getAssignedLeadsByCounsellorTLAPI, currentPage, currentLimit, keyword);
    let data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(LeadsApiResponseSuccess(LeadsActionTypes.GET_LEADS_ASSIGNED_BY_COUNSELLOR_TL, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(LeadsApiResponseError(LeadsActionTypes.GET_LEADS_ASSIGNED_BY_COUNSELLOR_TL, error));
  }
}

function* getLeadUsers(): SagaIterator {
  try {
    const response = yield call(getLeadUserApi);
    const data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(LeadsApiResponseSuccess(LeadsActionTypes.GET_LEAD_USER, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(LeadsApiResponseError(LeadsActionTypes.GET_LEAD_USER, error));
  }
}

function* addLeads({
  payload: {
    isAssignedLeads,
    full_name,
    email,
    phone,
    lead_type_id,
    source_id,
    channel_id,
    city,
    preferred_country,
    office_type,
    flag_id,
    region_id,
    counsiler_id,
    branch_id,
    updated_by,
    remarks,
    lead_received_date,
    ielts,
    zipcode,
    exam_details,
    exam_documents,
    franchise_id,
    navigate,
  },
}: LeadsData): SagaIterator {
  try {
    const response = yield call(
      addLeadsApi,
      {
        full_name,
        email,
        phone,
        lead_type_id,
        source_id,
        channel_id,
        city,
        preferred_country,
        office_type,
        flag_id,
        region_id,
        counsiler_id,
        branch_id,
        updated_by,
        remarks,
        lead_received_date,
        ielts,
        zipcode,
        exam_details,
        franchise_id,
      },
      exam_documents
    );
    const data = response.data.message;

    yield put(LeadsApiResponseSuccess(LeadsActionTypes.ADD_LEADS, data));

    let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

    if (userInfo) {
      const { role } = JSON.parse(userInfo);

      // if (role == cre_tl_id) {
      //   console.log("getLeadsTL called");

      //   yield put(getLeadsTL());
      // } else if (role == counsellor_tl_id && isAssignedLeads) {
      //   yield put(getLeadAssignedByCounsellorTL());
      // }
      // else {
      //   yield put(getLead(1,10));
      // }
    }
    navigate(`/leads/manage/${response?.data?.data?.userPrimaryInfo?.id}`);
  } catch (error: any) {
    console.log("err", error);

    yield put(LeadsApiResponseError(LeadsActionTypes.ADD_LEADS, error));
  }
}

function* updateLeads({
  payload: {
    isAssignedLeads,
    id,
    full_name,
    email,
    phone,
    lead_type_id,
    source_id,
    channel_id,
    city,
    preferred_country,
    office_type,
    flag_id,
    region_id,
    counsiler_id,
    branch_id,
    updated_by,
    remarks,
    lead_received_date,
    ielts,
    zipcode,
    exam_details,
    exam_documents,
    franchise_id,
    currentPage,
    currentLimit,
  },
}: LeadsData): SagaIterator {
  try {
    console.log("lead_type_id", lead_type_id);

    const response = yield call(
      updateLeadsApi,
      id,
      {
        full_name,
        email,
        phone,
        lead_type_id,
        source_id,
        channel_id,
        city,
        preferred_country,
        office_type,
        flag_id,
        region_id,
        counsiler_id,
        branch_id,
        updated_by,
        remarks,
        lead_received_date,
        ielts,
        zipcode,
        exam_details,
        franchise_id,
      },
      exam_documents
    );
    const data = response.data.message;

    yield put(LeadsApiResponseSuccess(LeadsActionTypes.UPDATE_LEADS, data));

    let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

    if (userInfo) {
      const { role } = JSON.parse(userInfo);

      if (role == cre_tl_id && isAssignedLeads) {
        yield put(getLeadAssigned(currentPage, currentLimit));
      } else if (role == cre_tl_id) {
        yield put(getLeadsTL(currentPage, currentLimit));
      } else if (role == counsellor_tl_id && isAssignedLeads) {
        yield put(getLeadAssignedByCounsellorTL(currentPage, currentLimit));
      } else {
        yield put(getLead(currentPage, currentLimit));
      }
    }
  } catch (error: any) {
    yield put(LeadsApiResponseError(LeadsActionTypes.UPDATE_LEADS, error));
  }
}

function* deleteLeads({ payload: { id, isAssignedLeads, currentLimit, currentPage } }: LeadsData): SagaIterator {
  try {
    const response = yield call(deleteSourcesApi, id);
    const data = response.data.message;

    yield put(LeadsApiResponseSuccess(LeadsActionTypes.DELETE_LEADS, data));
    let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

    if (userInfo) {
      const { role } = JSON.parse(userInfo);

      if (role == cre_tl_id && isAssignedLeads) {
        yield put(getLeadAssigned(currentPage, currentLimit));
      } else if (role == cre_tl_id) {
        yield put(getLeadsTL(currentPage, currentLimit));
      } else if (role == counsellor_tl_id && isAssignedLeads) {
        yield put(getLeadAssignedByCounsellorTL(currentPage, currentLimit));
      } else {
        yield put(getLead(currentPage, currentLimit));
      }
    }
  } catch (error: any) {
    yield put(LeadsApiResponseError(LeadsActionTypes.DELETE_LEADS, error));
  }
}

export function* watchGetLeads() {
  yield takeEvery(LeadsActionTypes.GET_LEADS, getLeads);
}

export function* watchGetLeadsForTL() {
  yield takeEvery(LeadsActionTypes.GET_LEADS_TL, getLeadsForTL);
}

export function* watchGetAssignedLeads() {
  yield takeEvery(LeadsActionTypes.GET_LEADS_ASSIGNED, getAssignedLeads);
}
export function* watchGetAssignedLeadsByCounsellorTL() {
  yield takeEvery(LeadsActionTypes.GET_LEADS_ASSIGNED_BY_COUNSELLOR_TL, getAssignedLeadsByCounsellorTL);
}

export function* watchGetLeadsByCounsellorTL() {
  yield takeEvery(LeadsActionTypes.GET_LEADS_BY_COUNSELLOR_TL, getLeadsForCounsellorTL);
}

export function* watchGetLeadUser() {
  yield takeEvery(LeadsActionTypes.GET_LEAD_USER, getLeadUsers);
}

export function* watchaddLeads() {
  yield takeEvery(LeadsActionTypes.ADD_LEADS, addLeads);
}

export function* watchUpdateLeads(): any {
  yield takeEvery(LeadsActionTypes.UPDATE_LEADS, updateLeads);
}

export function* watchDeleteLeads(): any {
  yield takeEvery(LeadsActionTypes.DELETE_LEADS, deleteLeads);
}

export function* watcGetLeadsRegionalmanger(): any {
  yield takeEvery(LeadsActionTypes.GET_LEADS_REGIONAL_MANAGER, getLeadsAssignedByRegionalManager);
}

function* LeadsSaga() {
  yield all([
    fork(watchGetLeads),
    fork(watchGetLeadsForTL),
    fork(watchGetAssignedLeads),
    fork(watchGetAssignedLeadsByCounsellorTL),
    fork(watchGetLeadsByCounsellorTL),
    fork(watchaddLeads),
    fork(watchUpdateLeads),
    fork(watchDeleteLeads),
    fork(watchGetLeadUser),
    fork(watcGetLeadsRegionalmanger),
  ]);
}

export default LeadsSaga;
