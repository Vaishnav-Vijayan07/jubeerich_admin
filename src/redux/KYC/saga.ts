import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";
import { KYCActionTypes } from "./constants";
import { KYCApiResponseError, KYCApiResponseSuccess } from "./actions";
import { getPendingKycsApi } from "../../helpers/api/kyc";

function* getPendingKYCs(): SagaIterator {
  try {
    const response = yield call(getPendingKycsApi);
    console.log(response.data);

    const data = response.data.data;

    // NOTE - You can change this according to response format from your api
    yield put(KYCApiResponseSuccess(KYCActionTypes.GET_PENDING, { data }));
  } catch (error: any) {
    yield put(KYCApiResponseError(KYCActionTypes.GET_PENDING, error));
  }
}

export function* watchGetKYCPending() {
  yield takeEvery(KYCActionTypes.GET_PENDING, getPendingKYCs);
}

function* KYCSaga() {
  yield all([fork(watchGetKYCPending)]);
}

export default KYCSaga;
