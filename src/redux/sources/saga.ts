import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// helpers
import { getSources as getSourcesApi, addSources as addSourcesApi, updateSources as updateSourcesApi, deleteSources as deleteSourcesApi } from "../../helpers/";

// actions
import { sourceApiResponseSuccess, sourceApiResponseError, getSource } from "./actions";

// constants
import { SourceActionTypes } from "./constants";

interface SourceData {
  payload: {
    id: string;
    source_name: string;
    source_description: string;
    updated_by: string;
    status: string;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getSources(): SagaIterator {
  try {
    const response = yield call(getSourcesApi);
    const data = response.data;


    // NOTE - You can change this according to response format from your api
    yield put(sourceApiResponseSuccess(SourceActionTypes.GET_SOURCES, { data }));
  } catch (error: any) {
    yield put(sourceApiResponseError(SourceActionTypes.GET_SOURCES, error));
  }
}

/**
 * Logout the user
 */
function* addSource({ payload: { source_name, source_description, updated_by } }: SourceData): SagaIterator {
  try {
    const response = yield call(addSourcesApi, {
      source_name,
      source_description,
      updated_by,
    });
    const data = response.data.message;


    yield put(sourceApiResponseSuccess(SourceActionTypes.ADD_SOURCES, data));

    yield put(getSource());
  } catch (error: any) {
    yield put(sourceApiResponseError(SourceActionTypes.ADD_SOURCES, error));
  }
}

function* updateSource({ payload: { id, source_name, source_description, updated_by } }: SourceData): SagaIterator {
  try {

    const response = yield call(updateSourcesApi, id, {
      source_name,
      source_description,
      updated_by,
    });
    const data = response.data.message;


    yield put(sourceApiResponseSuccess(SourceActionTypes.UPDATE_SOURCES, data));
    yield put(getSource());
  } catch (error: any) {
    yield put(sourceApiResponseSuccess(SourceActionTypes.UPDATE_SOURCES, error));
  }
}

function* deleteSource({ payload: { id } }: SourceData): SagaIterator {
  try {
    const response = yield call(deleteSourcesApi, id);
    const data = response.data.message;

    yield put(sourceApiResponseSuccess(SourceActionTypes.DELETE_SOURCES, data));
    yield put(getSource());
  } catch (error: any) {
    yield put(sourceApiResponseError(SourceActionTypes.DELETE_SOURCES, error));
  }
}
export function* watchGetSource() {
  yield takeEvery(SourceActionTypes.GET_SOURCES, getSources);
}

export function* watchaddSource() {
  yield takeEvery(SourceActionTypes.ADD_SOURCES, addSource);
}

export function* watchUpdateSource(): any {
  yield takeEvery(SourceActionTypes.UPDATE_SOURCES, updateSource);
}

export function* watchDeleteSource(): any {
  yield takeEvery(SourceActionTypes.DELETE_SOURCES, deleteSource);
}

function* SourceSaga() {
  yield all([fork(watchGetSource), fork(watchaddSource), fork(watchUpdateSource), fork(watchDeleteSource)]);
}

export default SourceSaga;
