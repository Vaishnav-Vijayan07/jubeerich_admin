import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// helpers
import {
  getVisaChecklistApi,
  addVisaChecklistApi,
  updateVisaChecklistApi,
  deleteVisaChecklistApi
} from "../../helpers";

// actions
import {
  VisaChecklistApiResponseSuccess,
  VisaChecklistApiResponseError,
  getVisaChecklist,
} from "./actions";

// constants
import { VisaChecklistActionTypes } from "./constants";

interface StatusData {
  payload: {
    id: string;
    step_name: string;
    description: string;
    fields: Array<any>;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getVisaChecklists(): SagaIterator {
  try {
    const response = yield call(getVisaChecklistApi);
    const data = response.data.data;

    // NOTE - You can change this according to response format from your api
    yield put(VisaChecklistApiResponseSuccess(VisaChecklistActionTypes.GET_VISA_CHECKLIST, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(VisaChecklistApiResponseError(VisaChecklistActionTypes.GET_VISA_CHECKLIST, error));
  }
}

function* addVisaChecklist({ payload: { step_name, description, fields } }: StatusData): SagaIterator {
  try {
    const response = yield call(addVisaChecklistApi, {
      step_name, description, fields
    });
    const data = response.data;
 
    yield put(VisaChecklistApiResponseSuccess(VisaChecklistActionTypes.ADD_VISA_CHECKLIST, data.message));

    yield put(getVisaChecklist());
  } catch (error: any) {
    console.log("err", error);
    yield put(VisaChecklistApiResponseError(VisaChecklistActionTypes.ADD_VISA_CHECKLIST, error));
  }
}

function* updateVisaChecklist({
  payload: { id, step_name, description, fields },
}: StatusData): SagaIterator {
  try {
    const response = yield call(updateVisaChecklistApi, id, {
      step_name, description, fields
    });
    const data = response.data.message;

    yield put(VisaChecklistApiResponseSuccess(VisaChecklistActionTypes.UPDATE_VISA_CHECKLIST, data));
    yield put(getVisaChecklist());
  } catch (error: any) {
    yield put(VisaChecklistApiResponseSuccess(VisaChecklistActionTypes.UPDATE_VISA_CHECKLIST, error));
  }
}

function* deleteVisaChecklist({ payload: { id } }: StatusData): SagaIterator {
  try {
    const response = yield call(deleteVisaChecklistApi, id);
    const data = response.data.message;

    yield put(VisaChecklistApiResponseSuccess(VisaChecklistActionTypes.DELETE_VISA_CHECKLIST, data));
    yield put(getVisaChecklist());
  } catch (error: any) {
    yield put(VisaChecklistApiResponseError(VisaChecklistActionTypes.DELETE_VISA_CHECKLIST, error));
  }
}

export function* watchGetVisaChecklists() {
  yield takeEvery(VisaChecklistActionTypes.GET_VISA_CHECKLIST, getVisaChecklists);
}

export function* watchaddVisaChecklists() {
  yield takeEvery(VisaChecklistActionTypes.ADD_VISA_CHECKLIST, addVisaChecklist);
}

export function* watchUpdateVisaChecklists(): any {
  yield takeEvery(VisaChecklistActionTypes.UPDATE_VISA_CHECKLIST, updateVisaChecklist);
}
 
export function* watchDeleteVisaChecklists(): any {
  yield takeEvery(VisaChecklistActionTypes.DELETE_VISA_CHECKLIST, deleteVisaChecklist);
}

function* VisaChecklistSaga() {
  yield all([
    fork(watchGetVisaChecklists),
    fork(watchaddVisaChecklists),
    fork(watchUpdateVisaChecklists),
    fork(watchDeleteVisaChecklists),
  ]);
}

export default VisaChecklistSaga;
