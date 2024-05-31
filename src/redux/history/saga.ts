import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// helpers
import {
  getAllHistories as getAllHistoriesApi,
  getHistoriesById as getHistoriesByIdApi,
  getHistoriesByLeadId as getHistoriesByLeadIdApi,
  addHistory as addHistoryApi,
  updateHistory as updateHistoryApi,
  deleteHistory as deleteHistoryApi,
} from "../../helpers/";

// actions
import { HistoryApiResponseSuccess, HistoryApiResponseError, getHistory as getAllHistories } from "./actions";

// constants
import { HistoryActionTypes } from "./constants";

interface HistoryData {
  payload: {
    id: string;
    lead_id: string;
    status_id: string;
    action_id: string;
    executive_id: string;
    date: string;
    status: string;
    change_to: string;
    checklist: string;
    comments: string;
    price: string;
    follow_up_date: string;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getHistory(): SagaIterator {
  try {
    const response = yield call(getAllHistoriesApi);
    const data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(HistoryApiResponseSuccess(HistoryActionTypes.GET_HISTORY, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(HistoryApiResponseError(HistoryActionTypes.GET_HISTORY, error));
  }
}

function* getHistoryByLeadId({ payload: { lead_id } }: HistoryData): SagaIterator {
  try {
    const response = yield call(getHistoriesByLeadIdApi, lead_id);
    const data = response.data;


    // NOTE - You can change this according to response format from your api
    yield put(HistoryApiResponseSuccess(HistoryActionTypes.GET_HISTORY_BY_LEAD_ID, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(HistoryApiResponseError(HistoryActionTypes.GET_HISTORY_BY_LEAD_ID, error));
  }
}

function* addHistory({ payload: { lead_id, status_id, action_id, executive_id, date, status, change_to, checklist, comments, price, follow_up_date } }: HistoryData): SagaIterator {
  try {
    const response = yield call(addHistoryApi, {
      lead_id,
      status_id,
      action_id,
      executive_id,
      date,
      status,
      change_to,
      checklist,
      comments,
      price,
      follow_up_date,
    });
    const data = response.data;


    yield put(HistoryApiResponseSuccess(HistoryActionTypes.ADD_HISTORY, data.message));

    yield put(getAllHistories());
  } catch (error: any) {
    console.log("err", error);

    yield put(HistoryApiResponseError(HistoryActionTypes.ADD_HISTORY, error));
    throw error;
  }
}

function* updateHistory({
  payload: { id, lead_id, status_id, action_id, executive_id, date, status, change_to, checklist, comments, price, follow_up_date },
}: HistoryData): SagaIterator {
  try {
    const response = yield call(updateHistoryApi, id, {
      lead_id,
      status_id,
      action_id,
      executive_id,
      date,
      status,
      change_to,
      checklist,
      comments,
      price,
      follow_up_date,
    });
    const data = response.data.message;


    yield put(HistoryApiResponseSuccess(HistoryActionTypes.UPDATE_HISTORY, data));
    yield put(getAllHistories());
  } catch (error: any) {
    yield put(HistoryApiResponseSuccess(HistoryActionTypes.UPDATE_HISTORY, error));
    throw error;
  }
}

function* deleteHistory({ payload: { id } }: HistoryData): SagaIterator {
  try {
    const response = yield call(deleteHistoryApi, id);
    const data = response.data.message;

    yield put(HistoryApiResponseSuccess(HistoryActionTypes.DELETE_HISTORY, data));
    // yield put(getStatus());
  } catch (error: any) {
    yield put(HistoryApiResponseError(HistoryActionTypes.DELETE_HISTORY, error));
    throw error;
  }
}

export function* watchGetHistory() {
  yield takeEvery(HistoryActionTypes.GET_HISTORY, getHistory);
}
export function* watchGetHistoryByLeadId() {
  yield takeEvery(HistoryActionTypes.GET_HISTORY_BY_LEAD_ID, getHistoryByLeadId);
}

export function* watchaddHistory() {
  yield takeEvery(HistoryActionTypes.ADD_HISTORY, addHistory);
}

export function* watchUpdateHistory(): any {
  yield takeEvery(HistoryActionTypes.UPDATE_HISTORY, updateHistory);
}

export function* watchDeleteHistory(): any {
  yield takeEvery(HistoryActionTypes.DELETE_HISTORY, deleteHistory);
}

function* HistorySaga() {
  yield all([fork(watchGetHistory), fork(watchaddHistory), fork(watchUpdateHistory), fork(watchDeleteHistory), fork(watchGetHistoryByLeadId)]);
}

export default HistorySaga;
