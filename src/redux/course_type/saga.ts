import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// actions
import {
  CourseTypeApiResponseSuccess,
  CourseTypeApiResponseError,
  getCourseType
} from "./actions";

// constants
import { CourseTypeActionTypes } from "./constants";
import {
  addCourseTypeApi,
  deleteCourseTypeApi,
  getCourseTypeApi,
  updateCourseTypeApi
} from "../../helpers";

interface CourseTypeData {
  payload: {
    id: string;
    type_name: string;
    description: string;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getAllCourseType(): SagaIterator {
  try {
    const response = yield call(getCourseTypeApi);
    const data = response.data.data;

    // NOTE - You can change this according to response format from your api
    yield put(
      CourseTypeApiResponseSuccess(CourseTypeActionTypes.GET_COURSE_TYPE, {
        data,
      })
    );
  } catch (error: any) {
    yield put(
      CourseTypeApiResponseError(CourseTypeActionTypes.GET_COURSE_TYPE, error)
    );
  }
}

function* addCourseType({
  payload: {
    type_name,
    description
  },
}: CourseTypeData): SagaIterator {
  try {
    const response = yield call(addCourseTypeApi, {
      type_name,
      description
    });
    const data = response.data.message;

    yield put(
      CourseTypeApiResponseSuccess(CourseTypeActionTypes.ADD_COURSE_TYPE, data)
    );

    yield put(getCourseType());
  } catch (error: any) {
    yield put(
      CourseTypeApiResponseError(CourseTypeActionTypes.ADD_COURSE_TYPE, error)
    );
  }
}

function* updateCourseType({
  payload: {
    id,
    type_name,
    description
  },
}: CourseTypeData): SagaIterator {
  try {
    const response = yield call(updateCourseTypeApi, id, {
      type_name,
      description
    });
    const data = response.data.message;

    yield put(
      CourseTypeApiResponseSuccess(
        CourseTypeActionTypes.UPDATE_COURSE_TYPE,
        data
      )
    );
    yield put(getCourseType());
  } catch (error: any) {
    yield put(
      CourseTypeApiResponseSuccess(
        CourseTypeActionTypes.UPDATE_COURSE_TYPE,
        error
      )
    );
  }
}

function* deleteCourseType({ payload: { id } }: CourseTypeData): SagaIterator {
  try {
    const response = yield call(deleteCourseTypeApi, id);
    const data = response.data.message;

    yield put(
      CourseTypeApiResponseSuccess(
        CourseTypeActionTypes.DELETE_COURSE_TYPE,
        data
      )
    );
    yield put(getCourseType());
  } catch (error: any) {
    yield put(
      CourseTypeApiResponseError(CourseTypeActionTypes.DELETE_COURSE_TYPE, error)
    );
  }
}

export function* watchgetCourseType() {
  yield takeEvery(CourseTypeActionTypes.GET_COURSE_TYPE, getAllCourseType);
}

export function* watchAddCourseType() {
  yield takeEvery(CourseTypeActionTypes.ADD_COURSE_TYPE, addCourseType);
}

export function* watchUpdateCourseType(): any {
  yield takeEvery(CourseTypeActionTypes.UPDATE_COURSE_TYPE, updateCourseType);
}

export function* watchDeleteCourseType(): any {
  yield takeEvery(CourseTypeActionTypes.DELETE_COURSE_TYPE, deleteCourseType);
}

function* CourseTypeSaga() {
  yield all([
    fork(watchgetCourseType),
    fork(watchAddCourseType),
    fork(watchUpdateCourseType),
    fork(watchDeleteCourseType),
  ]);
}

export default CourseTypeSaga;
