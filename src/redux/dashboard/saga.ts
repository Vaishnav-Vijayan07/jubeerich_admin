import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

import {
  ApplicationManagerTableDataActionTypeApiResponseError,
  ApplicationManagerTableDataActionTypeApiResponseSuccess,
  DashboardApiResponseError,
  DashboardApiResponseSuccess,
  DashboardCountriesApiResponseError,
  DashboardCountriesApiResponseSuccess,
} from "./actions";

// constants
import { ApplicationManagerTableDataActionTypes, DashboardActionTypes, DashboardCountriesActionTypes } from "./constants";
import { getApplicationManagerTableDataApi, getCountriesApi, getDashboard as getDashboardApi } from "../../helpers/api/dashboard";

interface DashBoard {
  payload: {
    filterType?: string;
    year?: string;
    month?: string;
    fromDate?: string;
    toDate?: string;
    country_id?: string | number;
    status?: string
  };
  type: string;
}

function* getApplicationManagerTableData({ payload: { status } }: DashBoard): SagaIterator {
  try {
    const response = yield call(getApplicationManagerTableDataApi, status);
    const data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(ApplicationManagerTableDataActionTypeApiResponseSuccess(ApplicationManagerTableDataActionTypes.GET_APPLICATION_MANAGER_TABLE_DATA, { data }));
  } catch (error: any) {
    yield put(ApplicationManagerTableDataActionTypeApiResponseError(ApplicationManagerTableDataActionTypes.GET_APPLICATION_MANAGER_TABLE_DATA, error));
  }
}


function* getDashboard({ payload: { filterType, year, month, fromDate, toDate, country_id } }: DashBoard): SagaIterator {
  try {
    const response = yield call(getDashboardApi, filterType, year, month, fromDate, toDate, country_id);
    const data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(DashboardApiResponseSuccess(DashboardActionTypes.GET_DASHBOARD, { data }));
  } catch (error: any) {
    yield put(DashboardApiResponseError(DashboardActionTypes.GET_DASHBOARD, error));
  }
}

function* getDashboardCountries(): SagaIterator {
  try {
    const response = yield call(getCountriesApi);
    const data = response.data.data;

    // NOTE - You can change this according to response format from your api
    yield put(DashboardCountriesApiResponseSuccess(DashboardCountriesActionTypes.GET_DASHBOARD_COUNTRIES, { data }));
  } catch (error: any) {
    yield put(DashboardCountriesApiResponseError(DashboardCountriesActionTypes.GET_DASHBOARD_COUNTRIES, error));
  }
}

export function* watchGetDashboard() {
  yield takeEvery(DashboardActionTypes.GET_DASHBOARD, getDashboard);
}

export function* watchGetDashboardCountries() {
  yield takeEvery(DashboardCountriesActionTypes.GET_DASHBOARD_COUNTRIES, getDashboardCountries);
}

export function* watchGetApplicationManagerTableData() {
  yield takeEvery(ApplicationManagerTableDataActionTypes.GET_APPLICATION_MANAGER_TABLE_DATA, getApplicationManagerTableData);
}

function* DashboardSaga() {
  yield all([fork(watchGetDashboard), fork(watchGetDashboardCountries), fork(watchGetApplicationManagerTableData)]);
}

export default DashboardSaga;
