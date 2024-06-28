import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// helpers
import {
  getBranches as getBranchesApi,
  addBranches as addBranchesApi,
  updateBranches as updateBranchesApi,
  deleteBranches as deleteBranchesApi,
} from "../../helpers/";

// actions
import {
  BranchApiResponseSuccess,
  BranchApiResponseError,
  getBranches,
} from "./actions";

// constants
import { BranchActionTypes } from "./constants";

interface BranchData {
  payload: {
    id: string;
    branch_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    contact_person_email: string;
    contact_person_name: string;
    contact_person_mobile: string;
    contact_person_designation: string;
    website: string;
    social_media: string;
    account_mail: string;
    support_mail: string;
    office_type: string;
    region_id: string;
    status: boolean;
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
    const data = response.data.data;

    // NOTE - You can change this according to response format from your api
    yield put(
      BranchApiResponseSuccess(BranchActionTypes.GET_BRANCHES, { data })
    );
  } catch (error: any) {
    yield put(BranchApiResponseError(BranchActionTypes.GET_BRANCHES, error));
  }
}

function* addBranches({
  payload: {
    branch_name,
    email,
    phone,
    address,
    city,
    state,
    country,
    pincode,
    contact_person_email,
    contact_person_name,
    contact_person_mobile,
    contact_person_designation,
    website,
    social_media,
    account_mail,
    support_mail,
    office_type,
    region_id,
    status,
    updated_by,
  },
}: BranchData): SagaIterator {
  try {
    const response = yield call(addBranchesApi, {
      branch_name,
      email,
      phone,
      address,
      city,
      state,
      country,
      pincode,
      contact_person_email,
      contact_person_name,
      contact_person_mobile,
      contact_person_designation,
      website,
      social_media,
      account_mail,
      support_mail,
      office_type,
      region_id,
      status,
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

function* updateBranches({
  payload: {
    id,
    branch_name,
    email,
    phone,
    address,
    city,
    state,
    country,
    pincode,
    contact_person_email,
    contact_person_name,
    contact_person_mobile,
    contact_person_designation,
    website,
    social_media,
    account_mail,
    support_mail,
    office_type,
    region_id,
    status,
    updated_by,
  },
}: BranchData): SagaIterator {
  try {
    const response = yield call(updateBranchesApi, id, {
      branch_name,
      email,
      phone,
      address,
      city,
      state,
      country,
      pincode,
      contact_person_email,
      contact_person_name,
      contact_person_mobile,
      contact_person_designation,
      website,
      social_media,
      account_mail,
      support_mail,
      office_type,
      region_id,
      status,
      updated_by,
    });
    const data = response.data.message;

    yield put(
      BranchApiResponseSuccess(BranchActionTypes.UPDATE_BRANCHES, data)
    );
    yield put(getBranches());
  } catch (error: any) {
    yield put(
      BranchApiResponseSuccess(BranchActionTypes.UPDATE_BRANCHES, error)
    );
    throw error;
  }
}

function* deleteBranches({ payload: { id } }: BranchData): SagaIterator {
  try {
    const response = yield call(deleteBranchesApi, id);
    const data = response.data.message;

    yield put(
      BranchApiResponseSuccess(BranchActionTypes.DELETE_BRANCHES, data)
    );
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
  yield all([
    fork(watchGetCampaign),
    fork(watchaddBranches),
    fork(watchUpdateCampaign),
    fork(watchDeleteCampaign),
  ]);
}

export default ChannelSaga;
