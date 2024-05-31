import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// helpers
import { getBranches as getBranchesApi, addBranches as addBranchesApi, updateBranches as updateBranchesApi, deleteBranches as deleteBranchesApi } from "../../helpers/";

// actions
import { BranchApiResponseSuccess, BranchApiResponseError, getBranches } from "./actions";

// constants
import { BranchActionTypes } from "./constants";

interface BranchData {
  payload: {
    id: string;
    branch_name: string;
    branch_address: string;
    branch_city: string;
    branch_country: string;
    currency: string;
    updated_by: string;
  };
  type: string;
}

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getBranch(): SagaIterator {
  try {
    const response = yield call(getBranchesApi);
    const data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(BranchApiResponseSuccess(BranchActionTypes.GET_BRANCHES, { data }));
  } catch (error: any) {
    yield put(BranchApiResponseError(BranchActionTypes.GET_BRANCHES, error));
  }
}

function* addBranches({ payload: { branch_name, branch_address, branch_city, branch_country, currency, updated_by } }: BranchData): SagaIterator {
  try {
    const response = yield call(addBranchesApi, {
      branch_name,
      branch_address,
      branch_city,
      branch_country,
      currency,
      updated_by,
    });
    const data = response.data.message;


    yield put(BranchApiResponseSuccess(BranchActionTypes.ADD_BRANCHES, data));

    yield put(getBranches());
  } catch (error: any) {
    yield put(BranchApiResponseError(BranchActionTypes.ADD_BRANCHES, error));
    throw error;
  }
}

function* updateBranches({ payload: { id, branch_name, branch_address, branch_city, branch_country, currency, updated_by } }: BranchData): SagaIterator {
  try {
    const response = yield call(updateBranchesApi, id, {
      branch_name,
      branch_address,
      branch_city,
      branch_country,
      currency,
      updated_by,
    });
    const data = response.data.message;


    yield put(BranchApiResponseSuccess(BranchActionTypes.UPDATE_BRANCHES, data));
    yield put(getBranches());
  } catch (error: any) {
    yield put(BranchApiResponseSuccess(BranchActionTypes.UPDATE_BRANCHES, error));
    throw error;
  }
}

function* deleteBranches({ payload: { id } }: BranchData): SagaIterator {
  try {
    const response = yield call(deleteBranchesApi, id);
    const data = response.data.message;

    yield put(BranchApiResponseSuccess(BranchActionTypes.DELETE_BRANCHES, data));
    yield put(getBranches());
  } catch (error: any) {
    yield put(BranchApiResponseError(BranchActionTypes.DELETE_BRANCHES, error));
    throw error;
  }
}

export function* watchGetCampaign() {
  yield takeEvery(BranchActionTypes.GET_BRANCHES, getBranch);
}

export function* watchaddBranches() {
  yield takeEvery(BranchActionTypes.ADD_BRANCHES, addBranches);
}

export function* watchUpdateCampaign(): any {
  yield takeEvery(BranchActionTypes.UPDATE_BRANCHES, updateBranches);
}

export function* watchDeleteCampaign(): any {
  yield takeEvery(BranchActionTypes.DELETE_BRANCHES, deleteBranches);
}

function* ChannelSaga() {
  yield all([fork(watchGetCampaign), fork(watchaddBranches), fork(watchUpdateCampaign), fork(watchDeleteCampaign)]);
}

export default ChannelSaga;
