import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// constants
import { ProgramsActionTypes } from "./constants";
import {
  getProgram,
  programApiResponseError,
  programApiResponseSuccess,
} from "./actions";
import {
  addProgramsApi,
  deleteProgramsApi,
  getProgramsApi,
  updateProgramsApi,
} from "../../helpers/api/program";

interface ProgramData {
  payload: {
    id: string;
    program_name: string;
    university_id: string;
    degree_level: string;
    duration: string;
    tuition_fees: string;
    currency: string;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getPrograms(): SagaIterator {
  try {
    const response = yield call(getProgramsApi);
    const data = response.data.data;

    // NOTE - You can change this according to response format from your api
    yield put(
      programApiResponseSuccess(ProgramsActionTypes.GET_PROGRAM, {
        data,
      })
    );
  } catch (error: any) {
    yield put(programApiResponseError(ProgramsActionTypes.GET_PROGRAM, error));
  }
}

function* addProgram({
  payload: {
    program_name,
    university_id,
    degree_level,
    duration,
    tuition_fees,
    currency,
  },
}: ProgramData): SagaIterator {
  try {
    const response = yield call(addProgramsApi, {
      program_name,
      university_id,
      degree_level,
      duration,
      tuition_fees,
      currency,
    });
    const data = response.data.message;

    yield put(programApiResponseSuccess(ProgramsActionTypes.ADD_PROGRAM, data));

    yield put(getProgram());
  } catch (error: any) {
    yield put(programApiResponseError(ProgramsActionTypes.ADD_PROGRAM, error));
  }
}

function* updateProgram({
  payload: {
    id,
    program_name,
    university_id,
    degree_level,
    duration,
    tuition_fees,
    currency,
  },
}: ProgramData): SagaIterator {
  try {
    const response = yield call(updateProgramsApi, id, {
      program_name,
      university_id,
      degree_level,
      duration,
      tuition_fees,
      currency,
    });
    const data = response.data.message;

    yield put(
      programApiResponseSuccess(ProgramsActionTypes.UPDATE_PROGRAM, data)
    );
    yield put(getProgram());
  } catch (error: any) {
    yield put(
      programApiResponseSuccess(ProgramsActionTypes.UPDATE_PROGRAM, error)
    );
  }
}

function* deleteProgram({ payload: { id } }: ProgramData): SagaIterator {
  try {
    const response = yield call(deleteProgramsApi, id);
    const data = response.data.message;

    yield put(
      programApiResponseSuccess(ProgramsActionTypes.DELETE_PROGRAM, data)
    );
    yield put(getProgram());
  } catch (error: any) {
    yield put(
      programApiResponseError(ProgramsActionTypes.DELETE_PROGRAM, error)
    );
  }
}

export function* watchGetProgram() {
  yield takeEvery(ProgramsActionTypes.GET_PROGRAM, getPrograms);
}

export function* watchaddProgram() {
  yield takeEvery(ProgramsActionTypes.ADD_PROGRAM, addProgram);
}

export function* watchUpdateProgram(): any {
  yield takeEvery(ProgramsActionTypes.UPDATE_PROGRAM, updateProgram);
}

export function* watchDeleteProgram(): any {
  yield takeEvery(ProgramsActionTypes.DELETE_PROGRAM, deleteProgram);
}

function* ProgramSaga() {
  yield all([
    fork(watchGetProgram),
    fork(watchaddProgram),
    fork(watchUpdateProgram),
    fork(watchDeleteProgram),
  ]);
}

export default ProgramSaga;
