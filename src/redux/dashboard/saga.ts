import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";


// helpers
import { getDashboard as getDashboardApi } from "../../helpers/";

// actions
import { DashboardApiResponseError, DashboardApiResponseSuccess } from "./actions";

// constants
import { DashboardActionTypes } from "./constants";

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getDashboard(): SagaIterator {
  try {
    const response = yield call(getDashboardApi);
    const data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(DashboardApiResponseSuccess(DashboardActionTypes.GET_DASHBOARD, { data }));
  } catch (error: any) {
    yield put(DashboardApiResponseError(DashboardActionTypes.GET_DASHBOARD, error));
  }
}

export function* watchGetDashboard() {
  yield takeEvery(DashboardActionTypes.GET_DASHBOARD, getDashboard);
}

function* DashboardSaga() {
  yield all([fork(watchGetDashboard)]);
}

export default DashboardSaga;
