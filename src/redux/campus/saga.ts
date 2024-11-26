import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// actions
import { CampusApiResponseSuccess, CampusApiResponseError, getCampus, getCampusCourses as getCampusCoursAction } from "./actions";

// constants
import { CampusActionTypes } from "./constants";
import {
  addCampusApi,
  courseConfigurationApi,
  deleteCampusApi,
  deleteCourseConfigApi,
  getCampusApi,
  getCampusCourseApi,
  updateCampusApi,
} from "../../helpers";

interface CampusData {
  payload: {
    id: string;
    campus_name: string;
    campus_id: string;
    location: string;
    university_id: string;
    course_fee: string;
    application_fee: string;
    course_link: string;
    course_id: string | number;
    operation: string
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
    yield put(CampusApiResponseError(CampusActionTypes.GET_CAMPUS, error));
  }
}

function* addCampus({ payload: { campus_name, location, university_id } }: CampusData): SagaIterator {
  try {
    const response = yield call(addCampusApi, {
      campus_name,
      location,
      university_id,
    });
    const data = response.data.message;

    yield put(CampusApiResponseSuccess(CampusActionTypes.ADD_CAMPUS, data));

    yield put(getCampus());
  } catch (error: any) {
    yield put(CampusApiResponseError(CampusActionTypes.ADD_CAMPUS, error));
  }
}

function* updateCampus({ payload: { id, campus_name, location, university_id } }: CampusData): SagaIterator {
  try {
    const response = yield call(updateCampusApi, id, {
      campus_name,
      location,
      university_id,
    });
    const data = response.data.message;

    yield put(CampusApiResponseSuccess(CampusActionTypes.UPDATE_CAMPUS, data));
    yield put(getCampus());
  } catch (error: any) {
    yield put(CampusApiResponseSuccess(CampusActionTypes.UPDATE_CAMPUS, error));
  }
}

function* deleteCampus({ payload: { id } }: CampusData): SagaIterator {
  try {
    const response = yield call(deleteCampusApi, id);
    const data = response.data.message;

    yield put(CampusApiResponseSuccess(CampusActionTypes.DELETE_CAMPUS, data));
    yield put(getCampus());
  } catch (error: any) {
    yield put(CampusApiResponseError(CampusActionTypes.DELETE_CAMPUS, error));
  }
}

function* deleteCourseConfiguration({ payload: { campus_id, course_id } }: CampusData): SagaIterator {
  try {
    const response = yield call(deleteCourseConfigApi, {
      campus_id,
      course_id,
    });
    const data = response.data.message;

    yield put(CampusApiResponseSuccess(CampusActionTypes.DELETE_CONFIGURE_COURSES, data));
    yield put(getCampusCoursAction(campus_id));
  } catch (error: any) {
    yield put(CampusApiResponseError(CampusActionTypes.DELETE_CONFIGURE_COURSES, error));
  }
}

function* getCampusCourses({ payload: { campus_id } }: CampusData): SagaIterator {
  try {
    const response = yield call(getCampusCourseApi, campus_id);
    const data = response.data.data;

    yield put(CampusApiResponseSuccess(CampusActionTypes.GET_CAMPUS_COURSES, data));
  } catch (error: any) {
    yield put(CampusApiResponseError(CampusActionTypes.GET_CAMPUS_COURSES, error));
  }
}

function* courseConfiguration({
  payload: { campus_id, course_fee, application_fee, course_link, course_id, operation },
}: CampusData): SagaIterator {
  try {
    const response = yield call(courseConfigurationApi, {
      campus_id,
      course_fee,
      application_fee,
      course_link,
      course_id,
      operation
    });
    const data = response.data.message;

    yield put(CampusApiResponseSuccess(CampusActionTypes.CONFIGURE_COURSES, data));

    yield put(getCampusCoursAction(campus_id));
  } catch (error: any) {
    yield put(CampusApiResponseError(CampusActionTypes.CONFIGURE_COURSES, error));
  }
}

export function* watchGetCampus() {
  yield takeEvery(CampusActionTypes.GET_CAMPUS, getAllCampus);
}

export function* watchgetCampusCourses() {
  yield takeEvery(CampusActionTypes.GET_CAMPUS_COURSES, getCampusCourses);
}

export function* watchaddCampus() {
  yield takeEvery(CampusActionTypes.ADD_CAMPUS, addCampus);
}

export function* watchCourseConfiguration() {
  yield takeEvery(CampusActionTypes.CONFIGURE_COURSES, courseConfiguration);
}

export function* watchUpdateCampus(): any {
  yield takeEvery(CampusActionTypes.UPDATE_CAMPUS, updateCampus);
}

export function* watchDeleteCampus(): any {
  yield takeEvery(CampusActionTypes.DELETE_CAMPUS, deleteCampus);
}

export function* watchDeleteCourseConfiguration(): any {
  yield takeEvery(CampusActionTypes.DELETE_CAMPUS, deleteCourseConfiguration);
}

function* CampusSaga() {
  yield all([
    fork(watchGetCampus),
    fork(watchaddCampus),
    fork(watchUpdateCampus),
    fork(watchDeleteCampus),
    fork(watchgetCampusCourses),
    fork(watchCourseConfiguration),
    fork(watchDeleteCourseConfiguration),
  ]);
}

export default CampusSaga;
