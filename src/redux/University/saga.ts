import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// actions
import {
  UniversityApiResponseSuccess,
  UniversityApiResponseError,
  getUniversity,
} from "./actions";

// constants
import { UniversityActionTypes } from "./constants";
import {
  addUniversitysApi,
  deleteUniversitysApi,
  getUniversitysApi,
  updateUniversitysApi,
} from "../../helpers/api/university";

interface UniversityData {
  payload: {
    id: string;
    university_name: string;
    location: string;
    country_id: string;
    website_url: string;
    image_url: string;
    updated_by: string;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getUniversitys(): SagaIterator {
  try {
    const response = yield call(getUniversitysApi);
    const data = response.data.data;

    // NOTE - You can change this according to response format from your api
    yield put(
      UniversityApiResponseSuccess(UniversityActionTypes.GET_UNIVERSITY, {
        data,
      })
    );
  } catch (error: any) {
    yield put(
      UniversityApiResponseError(UniversityActionTypes.GET_UNIVERSITY, error)
    );
    throw error;
  }
}

function* addUniversity({
  payload: {
    university_name,
    location,
    country_id,
    website_url,
    image_url,
    updated_by,
  },
}: UniversityData): SagaIterator {
  try {
    const response = yield call(addUniversitysApi, {
      university_name,
      location,
      country_id,
      website_url,
      image_url,
      updated_by,
    });
    const data = response.data.message;

    yield put(
      UniversityApiResponseSuccess(UniversityActionTypes.ADD_UNIVERSITY, data)
    );

    yield put(getUniversity());
  } catch (error: any) {
    yield put(
      UniversityApiResponseError(UniversityActionTypes.ADD_UNIVERSITY, error)
    );
    throw error;
  }
}

function* updateUniversity({
  payload: {
    id,
    university_name,
    location,
    country_id,
    website_url,
    image_url,
    updated_by,
  },
}: UniversityData): SagaIterator {
  try {
    const response = yield call(updateUniversitysApi, id, {
      university_name,
      location,
      country_id,
      website_url,
      image_url,
      updated_by,
    });
    const data = response.data.message;

    yield put(
      UniversityApiResponseSuccess(
        UniversityActionTypes.UPDATE_UNIVERSITY,
        data
      )
    );
    yield put(getUniversity());
  } catch (error: any) {
    yield put(
      UniversityApiResponseSuccess(
        UniversityActionTypes.UPDATE_UNIVERSITY,
        error
      )
    );
    throw error;
  }
}

function* deleteUniversity({ payload: { id } }: UniversityData): SagaIterator {
  try {
    const response = yield call(deleteUniversitysApi, id);
    const data = response.data.message;

    yield put(
      UniversityApiResponseSuccess(
        UniversityActionTypes.DELETE_UNIVERSITY,
        data
      )
    );
    yield put(getUniversity());
  } catch (error: any) {
    yield put(
      UniversityApiResponseError(UniversityActionTypes.DELETE_UNIVERSITY, error)
    );
    throw error;
  }
}

export function* watchGetUniversity() {
  yield takeEvery(UniversityActionTypes.GET_UNIVERSITY, getUniversitys);
}

export function* watchaddUniversity() {
  yield takeEvery(UniversityActionTypes.ADD_UNIVERSITY, addUniversity);
}

export function* watchUpdateUniversity(): any {
  yield takeEvery(UniversityActionTypes.UPDATE_UNIVERSITY, updateUniversity);
}

export function* watchDeleteUniversity(): any {
  yield takeEvery(UniversityActionTypes.DELETE_UNIVERSITY, deleteUniversity);
}

function* UniversitySaga() {
  yield all([
    fork(watchGetUniversity),
    fork(watchaddUniversity),
    fork(watchUpdateUniversity),
    fork(watchDeleteUniversity),
  ]);
}

export default UniversitySaga;
