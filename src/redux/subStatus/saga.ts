import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// helpers
import {
  getAllSubStatus as getAllSubStatusApi,
  addSubStatus as addSubStatusApi,
  updateSubStatus as updateSubStatusApi,
  deleteSubStatus as deleteSubStatusApi,
} from "../../helpers/";

// actions
import { SubStatusApiResponseSuccess, SubStatusApiResponseError, getSubStatus } from "./actions";

// constants
import { SubStatusActionTypes } from "./constants";
import axios from "axios";

interface StatusData {
  payload: {
    id: string;
    status_id: string;
    next_status: string;
    updated_by: string;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getSubStatuses(): SagaIterator {
  try {
    const response = yield call(getAllSubStatusApi);
    const data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(SubStatusApiResponseSuccess(SubStatusActionTypes.GET_SUB_STATUS, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(SubStatusApiResponseError(SubStatusActionTypes.GET_SUB_STATUS, error));
  }
}

function* addSubStatus({ payload: { status_id, next_status, updated_by } }: StatusData): SagaIterator {
  try {
    const response = yield call(addSubStatusApi, {
      status_id,
      next_status,
      updated_by,
    });
    const data = response.data;


    yield put(SubStatusApiResponseSuccess(SubStatusActionTypes.ADD_SUB_STATUS, data.message));

    yield put(getSubStatus());
  } catch (error: any) {
    console.log("err", error);

    yield put(SubStatusApiResponseError(SubStatusActionTypes.ADD_SUB_STATUS, error));
  }
}

function* updateSubStatus({ payload: { id, status_id, next_status, updated_by } }: StatusData): SagaIterator {
  try {
    const response = yield call(updateSubStatusApi, id, {
      status_id,
      next_status,
      updated_by,
    });
    const data = response.data.message;


    yield put(SubStatusApiResponseSuccess(SubStatusActionTypes.UPDATE_SUB_STATUS, data));
    yield put(getSubStatus());
  } catch (error: any) {
    yield put(SubStatusApiResponseSuccess(SubStatusActionTypes.UPDATE_SUB_STATUS, error));
  }
}

function* deleteSubStatus({ payload: { id } }: StatusData): SagaIterator {
  try {
    const response = yield call(deleteSubStatusApi, id);
    const data = response.data.message;

    yield put(SubStatusApiResponseSuccess(SubStatusActionTypes.DELETE_SUB_STATUS, data));
    yield put(getSubStatus());
  } catch (error: any) {
    yield put(SubStatusApiResponseError(SubStatusActionTypes.DELETE_SUB_STATUS, error));
  }
}

export function* watchGetSubStatus() {
  yield takeEvery(SubStatusActionTypes.GET_SUB_STATUS, getSubStatuses);
}

export function* watchaddSubStatus() {
  yield takeEvery(SubStatusActionTypes.ADD_SUB_STATUS, addSubStatus);
}

export function* watchUpdateSubStatus(): any {
  yield takeEvery(SubStatusActionTypes.UPDATE_SUB_STATUS, updateSubStatus);
}

export function* watchDeleteSubStatus(): any {
  yield takeEvery(SubStatusActionTypes.DELETE_SUB_STATUS, deleteSubStatus);
}

function* SubStatusSaga() {
  yield all([fork(watchGetSubStatus), fork(watchaddSubStatus), fork(watchUpdateSubStatus), fork(watchDeleteSubStatus)]);
}

export default SubStatusSaga;
