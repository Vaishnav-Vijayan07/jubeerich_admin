import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// actions
import {
  CampusApiResponseSuccess,
  CampusApiResponseError,
  getCampus
} from "./actions";

// constants
import { CampusActionTypes } from "./constants";
import {
  addCampusApi,
  deleteCampusApi,
  getCampusApi,
  updateCampusApi
} from "../../helpers";

interface CampusData {
  payload: {
    id: string;
    campus_name: string;
    location: string;
    university_id: string;
    courses: { course_fee: string; application_fee: string; course_link: string; course_id: string | number }[];
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getAllCampus(): SagaIterator {
  try {
    const response = yield call(getCampusApi);
    const data = response.data.data;

    // NOTE - You can change this according to response format from your api
    yield put(
      CampusApiResponseSuccess(CampusActionTypes.GET_CAMPUS, {
        data,
      })
    );
  } catch (error: any) {
    yield put(
      CampusApiResponseError(CampusActionTypes.GET_CAMPUS, error)
    );
  }
}

function* addCampus({
  payload: {
    campus_name,
    location,
    university_id,
    courses
  },
}: CampusData): SagaIterator {
  try {
    const response = yield call(addCampusApi, {
      campus_name,
      location,
      university_id,
      courses
    });
    const data = response.data.message;

    yield put(
      CampusApiResponseSuccess(CampusActionTypes.ADD_CAMPUS, data)
    );

    yield put(getCampus());
  } catch (error: any) {
    yield put(
      CampusApiResponseError(CampusActionTypes.ADD_CAMPUS, error)
    );
  }
}

function* updateCampus({
  payload: {
    id,
    campus_name,
    location,
    university_id,
    courses
  },
}: CampusData): SagaIterator {
  try {
    const response = yield call(updateCampusApi, id, {
      campus_name,
      location,
      university_id,
      courses
    });
    const data = response.data.message;

    yield put(
      CampusApiResponseSuccess(
        CampusActionTypes.UPDATE_CAMPUS,
        data
      )
    );
    yield put(getCampus());
  } catch (error: any) {
    yield put(
      CampusApiResponseSuccess(
        CampusActionTypes.UPDATE_CAMPUS,
        error
      )
    );
  }
}

function* deleteCampus({ payload: { id } }: CampusData): SagaIterator {
  try {
    const response = yield call(deleteCampusApi, id);
    const data = response.data.message;

    yield put(
      CampusApiResponseSuccess(
        CampusActionTypes.DELETE_CAMPUS,
        data
      )
    );
    yield put(getCampus());
  } catch (error: any) {
    yield put(
      CampusApiResponseError(CampusActionTypes.DELETE_CAMPUS, error)
    );
  }
}

export function* watchGetCampus() {
  yield takeEvery(CampusActionTypes.GET_CAMPUS, getAllCampus);
}

export function* watchaddCampus() {
  yield takeEvery(CampusActionTypes.ADD_CAMPUS, addCampus);
}

export function* watchUpdateCampus(): any {
  yield takeEvery(CampusActionTypes.UPDATE_CAMPUS, updateCampus);
}

export function* watchDeleteCampus(): any {
  yield takeEvery(CampusActionTypes.DELETE_CAMPUS, deleteCampus);
}

function* CampusSaga() {
  yield all([
    fork(watchGetCampus),
    fork(watchaddCampus),
    fork(watchUpdateCampus),
    fork(watchDeleteCampus),
  ]);
}

export default CampusSaga;
