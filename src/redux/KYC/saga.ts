import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";
import { KYCActionTypes } from "./constants";
import { KYCApiResponseError, KYCApiResponseSuccess } from "./actions";
import { getPendingKycsApi, getRejectedKycsApi, getApprovedKycsApi, assignToApplicationMemberApi } from "../../helpers/api/kyc";

function* getPendingKYCs({ payload: { type } }: any): SagaIterator {
  try {
    const response = yield call(getPendingKycsApi, type);
    console.log(response.data);

    const data = response.data.data;

    // NOTE - You can change this according to response format from your api
    yield put(KYCApiResponseSuccess(KYCActionTypes.GET_PENDING, { data }));
  } catch (error: any) {
    yield put(KYCApiResponseError(KYCActionTypes.GET_PENDING, error));
  }
}

function* assignToApplicationMember({ payload: {application_ids,user_id,type} }: any): SagaIterator {
  try {
    const response = yield call(assignToApplicationMemberApi, application_ids,user_id);
    console.log(response.data);

    const data = response.data.data;

    // NOTE - You can change this according to response format from your api
    yield put(KYCApiResponseSuccess(KYCActionTypes.ASSIGN_APPLICATION_MEMBER, { data }));
    yield put({type: KYCActionTypes.GET_PENDING, payload: {type}});
    yield put({type: "GET_ADMIN_USERS"});
  } catch (error: any) {
    yield put(KYCApiResponseError(KYCActionTypes.ASSIGN_APPLICATION_MEMBER, error));
  }
}

function* getRejectedKYCs(): SagaIterator {
  try {
    const response = yield call(getRejectedKycsApi);
    console.log(response.data);

    const data = response.data.data;

    yield put(KYCApiResponseSuccess(KYCActionTypes.GET_REJECTED, { data }));
  } catch (error: any) {
    yield put(KYCApiResponseError(KYCActionTypes.GET_REJECTED, error));
  }
}

function* getApprovedKYCs(): SagaIterator {
  try {
    const response = yield call(getApprovedKycsApi);
    console.log(response.data);

    const data = response.data.data;

    yield put(KYCApiResponseSuccess(KYCActionTypes.GET_APPROVED, { data }));
  } catch (error: any) {
    yield put(KYCApiResponseError(KYCActionTypes.GET_APPROVED, error));
  }
}

export function* watchGetKYCPending() {
  yield takeEvery(KYCActionTypes.GET_PENDING, getPendingKYCs);
}

export function* watchAssignToApplicationMember() {
  yield takeEvery(KYCActionTypes.ASSIGN_APPLICATION_MEMBER, assignToApplicationMember);
}

export function* watchGetKYCRejected() {
  yield takeEvery(KYCActionTypes.GET_REJECTED, getRejectedKYCs);
}

export function* watchGetKYCApproved() {
  yield takeEvery(KYCActionTypes.GET_APPROVED, getApprovedKYCs);
}

function* KYCSaga() {
  yield all([fork(watchGetKYCPending), fork(watchGetKYCRejected), fork(watchGetKYCApproved), fork(watchAssignToApplicationMember)]);
}

export default KYCSaga;
