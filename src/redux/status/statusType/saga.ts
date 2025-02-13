import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

import { StatusTypeApiResponseSuccess, StatusTypeApiResponseError, getStatusType } from "./actions";

// constants
import { StatusTypeActionTypes } from "./constants";
import { addStatusTypeApi, deleteStatusTypeApi, getStatusTypeApi, updateStatusTypeApi } from "../../../helpers/api/master/statusType";

interface StatusData {
  payload: {
    id: string;
    type_name: string;
    priority: number;
  };
  type: string;
}

function* getStatusesType(): SagaIterator {
  try {
    const response = yield call(getStatusTypeApi);
    const data = response.data?.data;

    // NOTE - You can change this according to response format from your api
    yield put(StatusTypeApiResponseSuccess(StatusTypeActionTypes.GET_STATUS_TYPE, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(StatusTypeApiResponseError(StatusTypeActionTypes.GET_STATUS_TYPE, error));
  }
}

function* addStatusType({ payload: { type_name, priority } }: StatusData): SagaIterator {
  try {
    const response = yield call(addStatusTypeApi, {
      type_name,
      priority,
    });
    const data = response.data;

    yield put(StatusTypeApiResponseSuccess(StatusTypeActionTypes.ADD_STATUS_TYPE, data.message));

    yield put(getStatusType());
  } catch (error: any) {
    console.log("err", error);

    yield put(StatusTypeApiResponseError(StatusTypeActionTypes.ADD_STATUS_TYPE, error));
  }
}

function* updateStatusType({ payload: { id, type_name, priority } }: StatusData): SagaIterator {
  try {
    const response = yield call(updateStatusTypeApi, id, {
      type_name,
      priority,
    });
    const data = response.data.message;

    yield put(StatusTypeApiResponseSuccess(StatusTypeActionTypes.UPDATE_STATUS_TYPE, data));
    yield put(getStatusType());
  } catch (error: any) {
    yield put(StatusTypeApiResponseSuccess(StatusTypeActionTypes.UPDATE_STATUS_TYPE, error));
  }
}

function* deleteStatusType({ payload: { id } }: StatusData): SagaIterator {
  try {
    const response = yield call(deleteStatusTypeApi, id);
    const data = response.data.message;

    yield put(StatusTypeApiResponseSuccess(StatusTypeActionTypes.DELETE_STATUS_TYPE, data));
    yield put(getStatusType());
  } catch (error: any) {
    yield put(StatusTypeApiResponseError(StatusTypeActionTypes.DELETE_STATUS_TYPE, error));
  }
}

export function* watchGetStatus() {
  yield takeEvery(StatusTypeActionTypes.GET_STATUS_TYPE, getStatusesType);
}

export function* watchaddLeads() {
  yield takeEvery(StatusTypeActionTypes.ADD_STATUS_TYPE, addStatusType);
}

export function* watchUpdateLeads(): any {
  yield takeEvery(StatusTypeActionTypes.UPDATE_STATUS_TYPE, updateStatusType);
}

export function* watchDeleteLeads(): any {
  yield takeEvery(StatusTypeActionTypes.DELETE_STATUS_TYPE, deleteStatusType);
}

function* StatusTypeSaga() {
  yield all([fork(watchGetStatus), fork(watchaddLeads), fork(watchUpdateLeads), fork(watchDeleteLeads)]);
}

export default StatusTypeSaga;
