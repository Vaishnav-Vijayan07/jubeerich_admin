import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// constants
import { CourseActionTypes } from "./constants";

import {
  CourseApiResponseError,
  CourseApiResponseSuccess,
  getCourse,
} from "./actions";
import {
  getCourseApi,
  addCourseApi,
  deleteCourseApi,
  updateCourseApi,
} from "../../helpers/api/course";

interface CourseData {
  payload: {
    id: string;
    course_name: string;
    course_description: string;
    course_type_id: number | string;
    stream_id: number | string;
    updated_by: string;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getAllCourse(): SagaIterator {
  try {
    const response = yield call(getCourseApi);
    const data = response.data.data;

    // NOTE - You can change this according to response format from your api
    yield put(
      CourseApiResponseSuccess(CourseActionTypes.GET_COURSE, {
        data,
      })
    );
  } catch (error: any) {
    yield put(CourseApiResponseError(CourseActionTypes.GET_COURSE, error));
  }
}

function* addCourse({
  payload: {
    course_name,
    course_description,
    course_type_id,
    stream_id,
    updated_by,
  },
}: CourseData): SagaIterator {
  try {
    const response = yield call(addCourseApi, {
      course_name,
      course_description,
      course_type_id,
      stream_id,
      updated_by,
    });
    const data = response.data.message;

    yield put(CourseApiResponseSuccess(CourseActionTypes.ADD_COURSE, data));

    yield put(getCourse());
  } catch (error: any) {
    yield put(CourseApiResponseError(CourseActionTypes.ADD_COURSE, error));
  }
}

function* updateCourse({
  payload: {
    id,
    course_name,
    course_description,
    course_type_id,
    stream_id,
    updated_by,
  },
}: CourseData): SagaIterator {
  try {
    const response = yield call(updateCourseApi, id, {
      course_name,
      course_description,
      course_type_id,
      stream_id,
      updated_by,
    });
    const data = response.data.message;

    yield put(CourseApiResponseSuccess(CourseActionTypes.UPDATE_COURSE, data));
    yield put(getCourse());
  } catch (error: any) {
    yield put(CourseApiResponseSuccess(CourseActionTypes.UPDATE_COURSE, error));
  }
}

function* deleteCourse({ payload: { id } }: CourseData): SagaIterator {
  try {
    const response = yield call(deleteCourseApi, id);
    const data = response.data.message;

    yield put(CourseApiResponseSuccess(CourseActionTypes.DELETE_COURSE, data));
    yield put(getCourse());
  } catch (error: any) {
    yield put(CourseApiResponseError(CourseActionTypes.DELETE_COURSE, error));
  }
}

export function* watchgetCourse() {
  yield takeEvery(CourseActionTypes.GET_COURSE, getAllCourse);
}

export function* watchAddCourse() {
  yield takeEvery(CourseActionTypes.ADD_COURSE, addCourse);
}

export function* watchUpdateCourse(): any {
  yield takeEvery(CourseActionTypes.UPDATE_COURSE, updateCourse);
}

export function* watchDeleteCourse(): any {
  yield takeEvery(CourseActionTypes.DELETE_COURSE, deleteCourse);
}

function* CourseSaga() {
  yield all([
    fork(watchgetCourse),
    fork(watchAddCourse),
    fork(watchUpdateCourse),
    fork(watchDeleteCourse),
  ]);
}

export default CourseSaga;
