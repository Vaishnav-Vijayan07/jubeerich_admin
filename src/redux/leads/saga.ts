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
} from "./actions";

// constants
import { LeadsActionTypes } from "./constants";
import { AUTH_SESSION_KEY } from "../../constants";
import { getAssignedLeadsByCreTl, getLeadsByCreTl, getAssignedLeadsByCounsellorTL as getAssignedLeadsByCounsellorTLAPI, getLeadsByCounsellorTL } from "../../helpers/api/leads";

interface LeadsData {
  payload: {
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
    region_id: string | null;
    counsiler_id: string | null;
    branch_id: string | null;
    updated_by: string;
    remarks: string;
    lead_received_date: string;
    ielts: boolean;
    // exam_details?: any[],
    // exam_documents?: any[]
    zipcode: any,
    exam_details?: any,
    exam_documents?: any,
    franchise_id?:string,
    changedFiles: any
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */

let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
let userRole: any;
if (userInfo) {
  userRole = JSON.parse(userInfo)?.role;
}

function* getLeads(): SagaIterator {
  try {
    let response;
    let data;
    response = yield call(getLeadsApi);
    data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(LeadsApiResponseSuccess(LeadsActionTypes.GET_LEADS, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(LeadsApiResponseError(LeadsActionTypes.GET_LEADS, error));
  }
}

function* getLeadsForTL(): SagaIterator {
  try {
    let response;
    let data;
    console.log("cre_tl");
    response = yield call(getLeadsByCreTl);
    data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(LeadsApiResponseSuccess(LeadsActionTypes.GET_LEADS_TL, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(LeadsApiResponseError(LeadsActionTypes.GET_LEADS_TL, error));
  }
}

function* getAssignedLeads(): SagaIterator {
  try {
    let response = yield call(getAssignedLeadsByCreTl);
    let data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(
      LeadsApiResponseSuccess(LeadsActionTypes.GET_LEADS_ASSIGNED, { data })
    );
  } catch (error: any) {
    console.log("Error", error);
    yield put(
      LeadsApiResponseError(LeadsActionTypes.GET_LEADS_ASSIGNED, error)
    );
  }
}

function* getLeadsForCounsellorTL(): SagaIterator {
  try {
    let response;
    let data;
    response = yield call(getLeadsByCounsellorTL);
    data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(LeadsApiResponseSuccess(LeadsActionTypes.GET_LEADS_BY_COUNSELLOR_TL, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(LeadsApiResponseError(LeadsActionTypes.GET_LEADS_BY_COUNSELLOR_TL, error));
  }
}

function* getAssignedLeadsByCounsellorTL(): SagaIterator {
  try {
    let response = yield call(getAssignedLeadsByCounsellorTLAPI);
    let data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(
      LeadsApiResponseSuccess(LeadsActionTypes.GET_LEADS_ASSIGNED_BY_COUNSELLOR_TL, { data })
    );
  } catch (error: any) {
    console.log("Error", error);
    yield put(
      LeadsApiResponseError(LeadsActionTypes.GET_LEADS_ASSIGNED_BY_COUNSELLOR_TL, error)
    );
  }
}

function* getLeadUsers(): SagaIterator {
  try {
    const response = yield call(getLeadUserApi);
    const data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(
      LeadsApiResponseSuccess(LeadsActionTypes.GET_LEAD_USER, { data })
    );
  } catch (error: any) {
    console.log("Error", error);
    yield put(LeadsApiResponseError(LeadsActionTypes.GET_LEAD_USER, error));
  }
}

function* addLeads({
  payload: {
    full_name,
    email,
    phone,
    lead_type_id,
    source_id,
    channel_id,
    city,
    preferred_country,
    office_type,
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
    franchise_id
  },
}: LeadsData): SagaIterator {

  try {
    const response = yield call(addLeadsApi, {
      full_name,
      email,
      phone,
      lead_type_id,
      source_id,
      channel_id,
      city,
      preferred_country,
      office_type,
      region_id,
      counsiler_id,
      branch_id,
      updated_by,
      remarks,
      lead_received_date,
      ielts,
      zipcode,
      exam_details,
      franchise_id
    }, exam_documents);
    const data = response.data.message;

    yield put(LeadsApiResponseSuccess(LeadsActionTypes.ADD_LEADS, data));

    let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
    console.log("userInfo ===>", userInfo);

    if (userInfo) {
      const { role } = JSON.parse(userInfo);

      console.log("role ==>", role);
      if (role == 4) {
        console.log("getLeadsTL called");
        
        yield put(getLeadsTL());
      } else {
        console.log("getLead called");

        yield put(getLead());
      }
    }
  } catch (error: any) {
    console.log("err", error);

    yield put(LeadsApiResponseError(LeadsActionTypes.ADD_LEADS, error));
  }
}

function* updateLeads({
  payload: {
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
    franchise_id
  },
}: LeadsData): SagaIterator {
  try {
    console.log('lead_type_id',lead_type_id);
    
    const response = yield call(updateLeadsApi, id, {
      full_name,
      email,
      phone,
      lead_type_id,
      source_id,
      channel_id,
      city,
      preferred_country,
      office_type,
      region_id,
      counsiler_id,
      branch_id,
      updated_by,
      remarks,
      lead_received_date,
      ielts,
      zipcode,
      exam_details,
      franchise_id
    }, 
    exam_documents
  );
    const data = response.data.message;

    yield put(LeadsApiResponseSuccess(LeadsActionTypes.UPDATE_LEADS, data));

    let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

    console.log("userInfo ===>", userInfo);

    if (userInfo) {
      const { role } = JSON.parse(userInfo);

      if (role == 4) {
        yield put(getLeadsTL());
      } else {
        yield put(getLead());
      }
    }

  } catch (error: any) {
    yield put(LeadsApiResponseError(LeadsActionTypes.UPDATE_LEADS, error));
  }
}

function* deleteLeads({ payload: { id } }: LeadsData): SagaIterator {
  try {
    const response = yield call(deleteSourcesApi, id);
    const data = response.data.message;

    yield put(LeadsApiResponseSuccess(LeadsActionTypes.DELETE_LEADS, data));
    let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

    console.log("userInfo ===>", userInfo);

    if (userInfo) {
      const { role } = JSON.parse(userInfo);

      if (role == 4) {
        yield put(getLeadsTL());
      } else {
        yield put(getLead());
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
  ]);
}

export default LeadsSaga;
