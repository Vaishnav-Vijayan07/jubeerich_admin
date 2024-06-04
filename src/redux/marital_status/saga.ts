import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";
import {
  addMaritalStatusApi,
  deleteMaritalStatusApi,
  getMaritalStatusApi,
  getMaritalStatusByidApi,
  updateMaritalStatusApi,
} from "../../helpers/api/marital_status";
import {
  getMaritalStatus,
  maritalStatusApiResponseError,
  maritalStatusApiResponseSuccess,
} from "./actions";
import { MaritalStatusActionTypes } from "./constants";

interface MaritalStatusData {
  payload: {
    id: string;
    marital_status_name: string;
    marital_status_description: string;
    updated_by: string;
  };
  type: string;
}

function* getMaritalStatusSaga(): SagaIterator {
  try {
    const response = yield call(getMaritalStatusApi);
    console.log(response);
    const data = response.data.data;

    yield put(
      maritalStatusApiResponseSuccess(
        MaritalStatusActionTypes.GET_MARITAL_STATUS,
        data
      )
    );
  } catch (error: any) {
    console.log(error);
    yield put(
      maritalStatusApiResponseError(
        MaritalStatusActionTypes.GET_MARITAL_STATUS,
        error
      )
    );
  }
}

function* getMaritalStatusByIdSaga({
  payload: { id },
}: MaritalStatusData): SagaIterator {
  try {
    const response = yield call(getMaritalStatusByidApi, id);
    console.log(response);
    const data = response.data;

    yield put(
      maritalStatusApiResponseSuccess(
        MaritalStatusActionTypes.GET_MARITAL_STATUS_BY_ID,
        data
      )
    );
  } catch (error: any) {
    console.log(error);
    yield put(
      maritalStatusApiResponseError(
        MaritalStatusActionTypes.GET_MARITAL_STATUS_BY_ID,
        error
      )
    );
  }
}
function* deleteMaritalStatusSaga({
  payload: { id },
}: MaritalStatusData): SagaIterator {
  try {
    const response = yield call(deleteMaritalStatusApi, id);
    console.log(response);
    const data = response.data.message;

    yield put(
      maritalStatusApiResponseSuccess(
        MaritalStatusActionTypes.DELETE_MARITAL_STATUS,
        data
      )
    );
    yield put(getMaritalStatus());
  } catch (error: any) {
    console.log(error);
    yield put(
      maritalStatusApiResponseError(
        MaritalStatusActionTypes.DELETE_MARITAL_STATUS,
        error
      )
    );
  }
}
function* addMaritalStatusSaga({
  payload: { marital_status_name, updated_by, marital_status_description },
}: MaritalStatusData): SagaIterator {
  try {
    const response = yield call(addMaritalStatusApi, {
      marital_status_name,
      updated_by,
      marital_status_description,
    });
    console.log(response);
    const data = response.message;

    yield put(
      maritalStatusApiResponseSuccess(
        MaritalStatusActionTypes.ADD_MARITAL_STATUS,
        data
      )
    );
    yield put(getMaritalStatus());
  } catch (error: any) {
    console.log(error);
    yield put(
      maritalStatusApiResponseError(
        MaritalStatusActionTypes.ADD_MARITAL_STATUS,
        error
      )
    );
  }
}
function* updateMaritalStatusSaga({
  payload: { id, marital_status_description, marital_status_name, updated_by },
}: MaritalStatusData): SagaIterator {
  try {
    const response = yield call(updateMaritalStatusApi, id, {
      updated_by,
      marital_status_description,
      marital_status_name,
    });
    console.log(response);
    const data = response.message;

    yield put(
      maritalStatusApiResponseSuccess(
        MaritalStatusActionTypes.UPDATE_MARITAL_STATUS,
        data
      )
    );
    yield put(getMaritalStatus());
  } catch (error: any) {
    console.log(error);
    yield put(
      maritalStatusApiResponseError(
        MaritalStatusActionTypes.UPDATE_MARITAL_STATUS,
        error
      )
    );
  }
}

export function* watchGetMaritalStatus() {
  yield takeEvery(
    MaritalStatusActionTypes.GET_MARITAL_STATUS,
    getMaritalStatusSaga
  );
}

export function* watchGetMaritalStatusById() {
  yield takeEvery(
    MaritalStatusActionTypes.GET_MARITAL_STATUS_BY_ID,
    getMaritalStatusByIdSaga
  );
}

export function* watchaddMaritalStatusTypes() {
  yield takeEvery(
    MaritalStatusActionTypes.ADD_MARITAL_STATUS,
    addMaritalStatusSaga
  );
}

export function* watchUpdateMaritalStatus(): any {
  yield takeEvery(
    MaritalStatusActionTypes.UPDATE_MARITAL_STATUS,
    updateMaritalStatusSaga
  );
}

export function* watchDeleteRegion(): any {
  yield takeEvery(
    MaritalStatusActionTypes.DELETE_MARITAL_STATUS,
    deleteMaritalStatusSaga
  );
}

function* MaritalStatusSaga() {
  yield all([
    fork(watchGetMaritalStatus),
    fork(watchaddMaritalStatusTypes),
    fork(watchUpdateMaritalStatus),
    fork(watchDeleteRegion),
    fork(watchGetMaritalStatusById),
  ]);
}

export default MaritalStatusSaga;
