import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// helpers
import { getChannels as getChannelsApi, addChannels as addChannelsApi, updateChannels as updateChannelsApi, deleteChannels as deleteSourcesApi } from "../../helpers/";

// actions
import { ChannelApiResponseSuccess, ChannelApiResponseError, getChannel } from "./actions";

// constants
import { ChannelsActionTypes } from "./constants";

interface ChannelData {
  payload: {
    id: string;
    source_id: string;
    channel_name: string;
    channel_description: string;
    updated_by: string;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getChannels(): SagaIterator {
  try {
    const response = yield call(getChannelsApi);
    const data = response.data;
    console.log(data);
    

    // NOTE - You can change this according to response format from your api
    yield put(ChannelApiResponseSuccess(ChannelsActionTypes.GET_CHANNELS, { data }));
  } catch (error: any) {
    yield put(ChannelApiResponseError(ChannelsActionTypes.GET_CHANNELS, error));
  }
}

function* addChannel({ payload: { source_id, channel_name, channel_description, updated_by } }: ChannelData): SagaIterator {
  try {
    const response = yield call(addChannelsApi, {
      source_id,
      channel_name,
      channel_description,
      updated_by,
    });
    const data = response.data.message;

    yield put(ChannelApiResponseSuccess(ChannelsActionTypes.ADD_CHANNELS, data));

    yield put(getChannel());
  } catch (error: any) {
    yield put(ChannelApiResponseError(ChannelsActionTypes.ADD_CHANNELS, error));
  }
}

function* updateChannel({ payload: { id, source_id, channel_name, channel_description, updated_by } }: ChannelData): SagaIterator {
  try {
    const response = yield call(updateChannelsApi, id, {
      source_id,
      channel_name,
      channel_description,
      updated_by,
    });
    const data = response.data.message;

    yield put(ChannelApiResponseSuccess(ChannelsActionTypes.UPDATE_CHANNELS, data));
    yield put(getChannel());
  } catch (error: any) {
    yield put(ChannelApiResponseSuccess(ChannelsActionTypes.UPDATE_CHANNELS, error));
  }
}

function* deleteChannel({ payload: { id } }: ChannelData): SagaIterator {
  try {
    const response = yield call(deleteSourcesApi, id);
    const data = response.data.message;

    yield put(ChannelApiResponseSuccess(ChannelsActionTypes.DELETE_CHANNELS, data));
    yield put(getChannel());
  } catch (error: any) {
    yield put(ChannelApiResponseError(ChannelsActionTypes.DELETE_CHANNELS, error));
  }
}

export function* watchGetChannel() {
  yield takeEvery(ChannelsActionTypes.GET_CHANNELS, getChannels);
}

export function* watchaddChannel() {
  yield takeEvery(ChannelsActionTypes.ADD_CHANNELS, addChannel);
}

export function* watchUpdateChannel(): any {
  yield takeEvery(ChannelsActionTypes.UPDATE_CHANNELS, updateChannel);
}

export function* watchDeleteChannel(): any {
  yield takeEvery(ChannelsActionTypes.DELETE_CHANNELS, deleteChannel);
}

function* ChannelSaga() {
  yield all([fork(watchGetChannel), fork(watchaddChannel), fork(watchUpdateChannel), fork(watchDeleteChannel)]);
}

export default ChannelSaga;
