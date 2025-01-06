import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// helpers
import { getDashboard as getDashboardApi } from "../../helpers/";

// actions
import { DashboardApiResponseError, DashboardApiResponseSuccess } from "./actions";

// constants
import { DashboardActionTypes } from "./constants";

interface DashBoard {
  payload: {
    filterType?: string;
    year?: string;
    month?: string;
    fromDate?: string;
    toDate?: string;
  };
  type: string;
}

function* getDashboard({ payload: { filterType, year, month, fromDate, toDate } }: DashBoard): SagaIterator {
  try {
    const response = yield call(getDashboardApi, filterType, year, month, fromDate, toDate);
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
