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
} from "./actions";

// constants
import { LeadsActionTypes } from "./constants";
import { AUTH_SESSION_KEY } from "../../constants";

interface LeadsData {
  payload: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    category_id: string;
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
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getLeads(): SagaIterator {
  try {
    const response = yield call(getLeadsApi);
    const data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(LeadsApiResponseSuccess(LeadsActionTypes.GET_LEADS, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(LeadsApiResponseError(LeadsActionTypes.GET_LEADS, error));
    throw error;
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
    throw error;
  }
}

function* addLeads({
  payload: {
    full_name,
    email,
    phone,
    category_id,
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
  },
}: LeadsData): SagaIterator {
  console.log("add leads");
  
  try {
    const response = yield call(addLeadsApi, {
      full_name,
      email,
      phone,
      category_id,
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
    });
    const data = response.data.message;

    yield put(LeadsApiResponseSuccess(LeadsActionTypes.ADD_LEADS, data));
    // let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
    // if (userInfo) {
    //   const { user_id } = JSON.parse(userInfo);

    //   if (user_id == 1) {
    //     yield put(getLead());
    //   } else {
    //     yield put(getLeadUser());
    //   }
    // }
    yield put(getLead());
  } catch (error: any) {
    console.log("err", error);

    yield put(LeadsApiResponseError(LeadsActionTypes.ADD_LEADS, error));
    throw error;
  }
}

function* updateLeads({
  payload: {
    id,
    full_name,
    email,
    phone,
    category_id,
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
  },
}: LeadsData): SagaIterator {
  try {
    const response = yield call(updateLeadsApi, id, {
      full_name,
      email,
      phone,
      category_id,
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
    });
    const data = response.data.message;

    yield put(LeadsApiResponseSuccess(LeadsActionTypes.UPDATE_LEADS, data));
    // let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
    // if (userInfo) {
    //   const { user_id } = JSON.parse(userInfo);

    //   if (user_id == 1) {
    //     yield put(getLead());
    //   } else {
    //     yield put(getLeadUser());
    //   }
    // }
    yield put(getLead());
  } catch (error: any) {
    yield put(LeadsApiResponseSuccess(LeadsActionTypes.UPDATE_LEADS, error));
    throw error;
  }
}

function* deleteLeads({ payload: { id } }: LeadsData): SagaIterator {
  try {
    const response = yield call(deleteSourcesApi, id);
    const data = response.data.message;

    yield put(LeadsApiResponseSuccess(LeadsActionTypes.DELETE_LEADS, data));
    // let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

    // if (userInfo) {
    //   const { user_id } = JSON.parse(userInfo);

    //   if (user_id == 1) {
    //     yield put(getLead());
    //   } else {
    //     yield put(getLeadUser());
    //   }
    // }
    yield put(getLead());
  } catch (error: any) {
    yield put(LeadsApiResponseError(LeadsActionTypes.DELETE_LEADS, error));
    throw error;
  }
}

export function* watchGetLeads() {
  yield takeEvery(LeadsActionTypes.GET_LEADS, getLeads);
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
    fork(watchaddLeads),
    fork(watchUpdateLeads),
    fork(watchDeleteLeads),
    fork(watchGetLeadUser),
  ]);
}

export default LeadsSaga;
