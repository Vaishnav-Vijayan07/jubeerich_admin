import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

import {
  countryApiResponseError,
  countryApiResponseSuccess,
  getCountry,
} from "./actions";
import { CountryActionTypes } from "./constants";
import {
  addCountrysApi,
  deleteCountrysApi,
  getCountryByidApi,
  getCountrysApi,
  updateCountrysApi,
} from "../../helpers/api/country";

interface CountryData {
  payload: {
    id: string;
    country_name: string;
    country_code: string;
    isd: string;
  };
  type: string;
}

function* getCountrySaga(): SagaIterator {
  try {
    const response = yield call(getCountrysApi);
    const data = response.data.data;

    yield put(countryApiResponseSuccess(CountryActionTypes.GET_COUNTRY, data));
  } catch (error: any) {
    console.log(error);
    yield put(countryApiResponseError(CountryActionTypes.GET_COUNTRY, error));
  }
}

function* getCountryByIdSaga({ payload: { id } }: CountryData): SagaIterator {
  try {
    const response = yield call(getCountryByidApi, id);
    console.log(response);
    const data = response.data;

    yield put(
      countryApiResponseSuccess(CountryActionTypes.GET_COUNTRY_BY_ID, data)
    );
  } catch (error: any) {
    console.log(error);
    yield put(
      countryApiResponseError(CountryActionTypes.GET_COUNTRY_BY_ID, error)
    );
  }
}
function* deleteCountrySaga({ payload: { id } }: CountryData): SagaIterator {
  try {
    const response = yield call(deleteCountrysApi, id);
    console.log(response);
    const data = response.data.message;

    yield put(
      countryApiResponseSuccess(CountryActionTypes.DELETE_COUNTRY, data)
    );
    yield put(getCountry());
  } catch (error: any) {
    console.log(error);
    yield put(
      countryApiResponseError(CountryActionTypes.DELETE_COUNTRY, error)
    );
  }
}
function* addCountrySaga({
  payload: { country_name, country_code, isd },
}: CountryData): SagaIterator {
  try {
    const response = yield call(addCountrysApi, {
      country_name,
      country_code,
      isd,
    });
    console.log(response);
    const data = response?.data?.message;

    yield put(countryApiResponseSuccess(CountryActionTypes.ADD_COUNTRY, data));
    yield put(getCountry());
  } catch (error: any) {
    console.log(error);
    yield put(countryApiResponseError(CountryActionTypes.ADD_COUNTRY, error));
  }
}
function* updateCountrySaga({
  payload: { id, country_name, country_code, isd },
}: CountryData): SagaIterator {
  try {
    const response = yield call(updateCountrysApi, id, {
      country_name,
      country_code,
      isd,
    });
    console.log(response);
    const data = response?.data?.message;

    yield put(
      countryApiResponseSuccess(CountryActionTypes.UPDATE_COUNTRY, data)
    );
    yield put(getCountry());
  } catch (error: any) {
    console.log(error);
    yield put(
      countryApiResponseError(CountryActionTypes.UPDATE_COUNTRY, error)
    );
  }
}

export function* watchGetCountry() {
  yield takeEvery(CountryActionTypes.GET_COUNTRY, getCountrySaga);
}

export function* watchGetCountryById() {
  yield takeEvery(CountryActionTypes.GET_COUNTRY_BY_ID, getCountryByIdSaga);
}

export function* watchaddCountryTypes() {
  yield takeEvery(CountryActionTypes.ADD_COUNTRY, addCountrySaga);
}

export function* watchUpdateCountry(): any {
  yield takeEvery(CountryActionTypes.UPDATE_COUNTRY, updateCountrySaga);
}

export function* watchDeleteCountry(): any {
  yield takeEvery(CountryActionTypes.DELETE_COUNTRY, deleteCountrySaga);
}

function* CountrySaga() {
  yield all([
    fork(watchGetCountry),
    fork(watchaddCountryTypes),
    fork(watchUpdateCountry),
    fork(watchDeleteCountry),
    fork(watchGetCountryById),
  ]);
}

export default CountrySaga;
