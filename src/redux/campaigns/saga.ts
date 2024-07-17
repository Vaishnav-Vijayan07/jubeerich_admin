import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// helpers
import { getCampaigns as getCampaignsApi, addCampaigns as addCampaignsApi, updateCampaigns as updateCampaignsApi, deleteCampaigns as deleteCampaignsApi } from "../../helpers/";

// actions
import { CampaignApiResponseSuccess, CampaignApiResponseError, getCampaign } from "./actions";

// constants
import { CampaignActionTypes } from "./constants";

interface CampaignData {
  payload: {
    id: string;
    channel_id: string;
    campaign_name: string;
    campaign_description: string;
    from_date: string;
    to_date: string;
    updated_by: string;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getCampaigns(): SagaIterator {
  try {
    const response = yield call(getCampaignsApi);
    const data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(CampaignApiResponseSuccess(CampaignActionTypes.GET_CAMPAIGNS, { data }));
  } catch (error: any) {
    yield put(CampaignApiResponseError(CampaignActionTypes.GET_CAMPAIGNS, error));
  }
}

function* addCampaign({ payload: { channel_id, campaign_name, campaign_description, from_date, to_date, updated_by } }: CampaignData): SagaIterator {
  try {
    const response = yield call(addCampaignsApi, {
      channel_id,
      campaign_name,
      campaign_description,
      from_date,
      to_date,
      updated_by,
    });
    const data = response.data.message;

    yield put(CampaignApiResponseSuccess(CampaignActionTypes.ADD_CAMPAIGNS, data));

    yield put(getCampaign());
  } catch (error: any) {
    yield put(CampaignApiResponseError(CampaignActionTypes.ADD_CAMPAIGNS, error));
  }
}

function* updateCampaign({ payload: { id, channel_id, campaign_name, campaign_description, from_date, to_date, updated_by } }: CampaignData): SagaIterator {
  try {
    const response = yield call(updateCampaignsApi, id, {
      channel_id,
      campaign_name,
      campaign_description,
      from_date,
      to_date,
      updated_by,
    });
    const data = response.data.message;

    yield put(CampaignApiResponseSuccess(CampaignActionTypes.UPDATE_CAMPAIGNS, data));
    yield put(getCampaign());
  } catch (error: any) {
    yield put(CampaignApiResponseSuccess(CampaignActionTypes.UPDATE_CAMPAIGNS, error));
  }
}

function* deleteCampaign({ payload: { id } }: CampaignData): SagaIterator {
  try {
    const response = yield call(deleteCampaignsApi, id);
    const data = response.data.message;

    yield put(CampaignApiResponseSuccess(CampaignActionTypes.DELETE_CAMPAIGNS, data));
    yield put(getCampaign());
  } catch (error: any) {
    yield put(CampaignApiResponseError(CampaignActionTypes.DELETE_CAMPAIGNS, error));
  }
}

export function* watchGetCampaign() {
  yield takeEvery(CampaignActionTypes.GET_CAMPAIGNS, getCampaigns);
}

export function* watchAddCampaign() {
  yield takeEvery(CampaignActionTypes.ADD_CAMPAIGNS, addCampaign);
}

export function* watchUpdateCampaign(): any {
  yield takeEvery(CampaignActionTypes.UPDATE_CAMPAIGNS, updateCampaign);
}

export function* watchDeleteCampaign(): any {
  yield takeEvery(CampaignActionTypes.DELETE_CAMPAIGNS, deleteCampaign);
}

function* ChannelSaga() {
  yield all([fork(watchGetCampaign), fork(watchAddCampaign), fork(watchUpdateCampaign), fork(watchDeleteCampaign)]);
}

export default ChannelSaga;
