import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// helpers
import { getStatus as getAllStatusApi, addStatus as addStatusApi, updateStatus as updateStatusApi, deleteStatus as deleteStatusApi, getStatusConfig as getStatusConfigApi } from "../../helpers/";

// actions
import { StatusApiResponseSuccess, StatusApiResponseError, getStatus } from "./actions";

// constants
import { StatusActionTypes } from "./constants";

interface Task {
  checklist_title: string;
  checklist_description: string;
  priority: string;
  checklist_type: string;
  has_attachment: boolean;
}
interface StatusData {
  payload: {
    id: string;
    status_name: string;
    status_description: string;
    color: string;
    updated_by: string;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getStatuses(): SagaIterator {
  try {
    const response = yield call(getAllStatusApi);
    const data = response.data?.data;

    // NOTE - You can change this according to response format from your api
    yield put(StatusApiResponseSuccess(StatusActionTypes.GET_STATUS, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(StatusApiResponseError(StatusActionTypes.GET_STATUS, error));
  }
}

function* getStatusConfig(): SagaIterator {
  try {
    const response = yield call(getStatusConfigApi);
    const data = response.data?.data;

    // NOTE - You can change this according to response format from your api
    yield put(StatusApiResponseSuccess(StatusActionTypes.GET_STATUS_CONFIG, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(StatusApiResponseError(StatusActionTypes.GET_STATUS_CONFIG, error));
  }
}

function* addStatus({ payload: { status_name, status_description, color, updated_by } }: StatusData): SagaIterator {
  try {
    const response = yield call(addStatusApi, {
      status_name,
      status_description,
      color,
      updated_by,
    });
    const data = response.data;


    yield put(StatusApiResponseSuccess(StatusActionTypes.ADD_STATUS, data.message));

    yield put(getStatus());
  } catch (error: any) {
    console.log("err", error);

    yield put(StatusApiResponseError(StatusActionTypes.ADD_STATUS, error));
  }
}

function* updateStatus({ payload: { id, status_name, status_description, color, updated_by } }: StatusData): SagaIterator {
  try {
    const response = yield call(updateStatusApi, id, {
      status_name,
      status_description,
      color,
      updated_by,
    });
    const data = response.data.message;


    yield put(StatusApiResponseSuccess(StatusActionTypes.UPDATE_STATUS, data));
    yield put(getStatus());
  } catch (error: any) {
    yield put(StatusApiResponseSuccess(StatusActionTypes.UPDATE_STATUS, error));
  }
}

function* deleteStatus({ payload: { id } }: StatusData): SagaIterator {
  try {
    const response = yield call(deleteStatusApi, id);
    const data = response.data.message;

    yield put(StatusApiResponseSuccess(StatusActionTypes.DELETE_STATUS, data));
    yield put(getStatus());
  } catch (error: any) {
    yield put(StatusApiResponseError(StatusActionTypes.DELETE_STATUS, error));
  }
}

export function* watchGetStatus() {
  yield takeEvery(StatusActionTypes.GET_STATUS, getStatuses);
}

export function* watchGetStatusConfig() {
  yield takeEvery(StatusActionTypes.GET_STATUS_CONFIG, getStatusConfig);
}

export function* watchaddLeads() {
  yield takeEvery(StatusActionTypes.ADD_STATUS, addStatus);
}

export function* watchUpdateLeads(): any {
  yield takeEvery(StatusActionTypes.UPDATE_STATUS, updateStatus);
}

export function* watchDeleteLeads(): any {
  yield takeEvery(StatusActionTypes.DELETE_STATUS, deleteStatus);
}

function* LeadsSaga() {
  yield all([fork(watchGetStatus), fork(watchaddLeads), fork(watchUpdateLeads), fork(watchDeleteLeads), fork(watchGetStatusConfig)]);
}

export default LeadsSaga;
