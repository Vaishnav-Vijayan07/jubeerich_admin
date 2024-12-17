import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";
import {
  addFlagsApi,
  deleteFlagsApi,
  getFlagByidApi,
  getFlagsApi,
  updateFlagsApi,
} from "../../helpers/api/flag";
import {
  flagApiResponseError,
  flagApiResponseSuccess,
  getFlag,
} from "./actions";
import { FlagActionTypes } from "./constants";

interface FlagData {
  payload: {
    id: string;
    flag_name: string;
    flag_description: string;
    color: string;
    updated_by: string;
  };
  type: string;
}

function* getFlagSaga(): SagaIterator {
  try {
    const response = yield call(getFlagsApi);
    const data = response.data.data;

    yield put(flagApiResponseSuccess(FlagActionTypes.GET_FLAG, data));
  } catch (error: any) {
    console.log(error);
    yield put(flagApiResponseError(FlagActionTypes.GET_FLAG, error));
  }
}

function* getFlagByIdSaga({ payload: { id } }: FlagData): SagaIterator {
  try {
    const response = yield call(getFlagByidApi, id);
    const data = response.data;

    yield put(flagApiResponseSuccess(FlagActionTypes.GET_FLAG_BY_ID, data));
  } catch (error: any) {
    console.log(error);
    yield put(flagApiResponseError(FlagActionTypes.GET_FLAG_BY_ID, error));
  }
}
function* deleteFlagSaga({ payload: { id } }: FlagData): SagaIterator {
  try {
    const response = yield call(deleteFlagsApi, id);
    const data = response.data.message;

    yield put(flagApiResponseSuccess(FlagActionTypes.DELETE_FLAG, data));
    yield put(getFlag());
  } catch (error: any) {
    console.log(error);
    yield put(flagApiResponseError(FlagActionTypes.DELETE_FLAG, error));
  }
}
function* addFlagSaga({
  payload: { flag_name, updated_by, flag_description, color },
}: FlagData): SagaIterator {
  try {
    const response = yield call(addFlagsApi, {
      flag_name,
      updated_by,
      flag_description,
      color
    });
    const data = response?.data?.message;

    yield put(flagApiResponseSuccess(FlagActionTypes.ADD_FLAG, data));
    yield put(getFlag());
  } catch (error: any) {
    console.log(error);
    yield put(flagApiResponseError(FlagActionTypes.ADD_FLAG, error));
  }
}
function* updateFlagSaga({
  payload: { id, flag_description, flag_name, updated_by, color },
}: FlagData): SagaIterator {
  try {
    console.log('color',color);
    
    const response = yield call(updateFlagsApi, id, {
      updated_by,
      flag_description,
      flag_name,
      color
    });
    const data = response?.data?.message;

    yield put(flagApiResponseSuccess(FlagActionTypes.UPDATE_FLAG, data));
    yield put(getFlag());
  } catch (error: any) {
    console.log(error);
    yield put(flagApiResponseError(FlagActionTypes.UPDATE_FLAG, error));
  }
}

export function* watchGetFlag() {
  yield takeEvery(FlagActionTypes.GET_FLAG, getFlagSaga);
}

export function* watchGetFlagById() {
  yield takeEvery(FlagActionTypes.GET_FLAG_BY_ID, getFlagByIdSaga);
}

export function* watchaddFlagTypes() {
  yield takeEvery(FlagActionTypes.ADD_FLAG, addFlagSaga);
}

export function* watchUpdateFlag(): any {
  yield takeEvery(FlagActionTypes.UPDATE_FLAG, updateFlagSaga);
}

export function* watchDeleteFlag(): any {
  yield takeEvery(FlagActionTypes.DELETE_FLAG, deleteFlagSaga);
}

function* FlagSaga() {
  yield all([
    fork(watchGetFlag),
    fork(watchaddFlagTypes),
    fork(watchUpdateFlag),
    fork(watchDeleteFlag),
    fork(watchGetFlagById),
  ]);
}

export default FlagSaga;
