import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// constants
import { StreamActionTypes } from "./constants";
import {
  StreamApiResponseError,
  StreamApiResponseSuccess,
  getStream,
} from "./actions";
import {
  getStreamApi,
  addStreamApi,
  deleteStreamApi,
  updateStreamApi,
} from "../../helpers/api/stream";

interface StreamData {
  payload: {
    id: string;
    stream_name: string;
    stream_description: string;
    updated_by: string | null;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getAllStream(): SagaIterator {
  try {
    const response = yield call(getStreamApi);
    const data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(
      StreamApiResponseSuccess(StreamActionTypes.GET_STREAM, {
        data,
      })
    );
  } catch (error: any) {
    yield put(StreamApiResponseError(StreamActionTypes.GET_STREAM, error));
  }
}

function* addStream({
  payload: { stream_name, stream_description, updated_by },
}: StreamData): SagaIterator {
  try {
    const response = yield call(addStreamApi, {
      stream_name,
      stream_description,
      updated_by,
    });
    const data = response.data.message;

    yield put(StreamApiResponseSuccess(StreamActionTypes.ADD_STREAM, data));

    yield put(getStream());
  } catch (error: any) {
    yield put(StreamApiResponseError(StreamActionTypes.ADD_STREAM, error));
  }
}

function* updateStream({
  payload: { id, stream_name, stream_description, updated_by },
}: StreamData): SagaIterator {
  try {
    const response = yield call(updateStreamApi, id, {
      stream_name,
      stream_description,
      updated_by,
    });
    const data = response.data.message;

    yield put(StreamApiResponseSuccess(StreamActionTypes.UPDATE_STREAM, data));
    yield put(getStream());
  } catch (error: any) {
    yield put(StreamApiResponseSuccess(StreamActionTypes.UPDATE_STREAM, error));
  }
}

function* deleteStream({ payload: { id } }: StreamData): SagaIterator {
  try {
    const response = yield call(deleteStreamApi, id);
    const data = response.data.message;

    yield put(StreamApiResponseSuccess(StreamActionTypes.DELETE_STREAM, data));
    yield put(getStream());
  } catch (error: any) {
    yield put(StreamApiResponseError(StreamActionTypes.DELETE_STREAM, error));
  }
}

export function* watchgetStream() {
  yield takeEvery(StreamActionTypes.GET_STREAM, getAllStream);
}

export function* watchAddStream() {
  yield takeEvery(StreamActionTypes.ADD_STREAM, addStream);
}

export function* watchUpdateStream(): any {
  yield takeEvery(StreamActionTypes.UPDATE_STREAM, updateStream);
}

export function* watchDeleteStream(): any {
  yield takeEvery(StreamActionTypes.DELETE_STREAM, deleteStream);
}

function* StreamSaga() {
  yield all([
    fork(watchgetStream),
    fork(watchAddStream),
    fork(watchUpdateStream),
    fork(watchDeleteStream),
  ]);
}

export default StreamSaga;
