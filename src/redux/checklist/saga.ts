import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// helpers
import {
  getAllChecklists as getAllChecklistsApi,
  getChecklistById as getChecklistByIdApi,
  addChecklist as addChecklistApi,
  updateChecklist as updateChecklistApi,
  deleteChecklist as deleteChecklistApi,
} from "../../helpers/";

// actions
import {
  ChecklistApiResponseSuccess,
  ChecklistApiResponseError,
  getChecklistById,
  // getStatus,
} from "./actions";

// constants
import { ChecklistActionTypes } from "./constants";

interface StatusData {
  payload: {
    id: string;
    checklist_title: string;
    checklist_description: string;
    priority: number;
    checklist_type: string;
    has_attachment: boolean;
    status_id: string;
    itemId: string;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getChecklists(): SagaIterator {
  try {
    const response = yield call(getAllChecklistsApi);
    const data = response.data;


    // NOTE - You can change this according to response format from your api
    yield put(ChecklistApiResponseSuccess(ChecklistActionTypes.GET_CHECKLIST, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(ChecklistApiResponseError(ChecklistActionTypes.GET_CHECKLIST, error));
  }
}

function* getChecklistsById({ payload: { id } }: StatusData): SagaIterator {
  try {
    const response = yield call(getChecklistByIdApi, id);
    const data = response.data;


    // NOTE - You can change this according to response format from your api
    yield put(ChecklistApiResponseSuccess(ChecklistActionTypes.GET_CHECKLIST_BY_ID, { data }));
  } catch (error: any) {
    console.log("Error", error);
    yield put(ChecklistApiResponseError(ChecklistActionTypes.GET_CHECKLIST_BY_ID, error));
  }
}

function* addChecklist({ payload: { checklist_title, checklist_description, priority, checklist_type, has_attachment, status_id } }: StatusData): SagaIterator {

  try {
    const response = yield call(addChecklistApi, {
      checklist_title,
      checklist_description,
      priority,
      checklist_type,
      has_attachment,
      status_id,
    });
    const data = response.data;


    yield put(ChecklistApiResponseSuccess(ChecklistActionTypes.ADD_CHECKLIST, data.message));

    yield put(getChecklistById(status_id));
  } catch (error: any) {
    console.log("err", error);

    yield put(ChecklistApiResponseError(ChecklistActionTypes.ADD_CHECKLIST, error));
  }
}

function* updateChecklist({ payload: { id, checklist_title, checklist_description, priority, checklist_type, has_attachment, status_id } }: StatusData): SagaIterator {

  try {
    const response = yield call(updateChecklistApi, id, {
      checklist_title,
      checklist_description,
      priority,
      checklist_type,
      has_attachment,
      status_id,
    });
    const data = response.data.message;


    yield put(ChecklistApiResponseSuccess(ChecklistActionTypes.UPDATE_CHECKLIST, data));
    yield put(getChecklistById(status_id));
  } catch (error: any) {
    yield put(ChecklistApiResponseSuccess(ChecklistActionTypes.UPDATE_CHECKLIST, error));
  }
}

function* deleteChecklist({ payload: { itemId, status_id } }: StatusData): SagaIterator {
  try {
    const response = yield call(deleteChecklistApi, itemId);
    const data = response.data.message;

    yield put(ChecklistApiResponseSuccess(ChecklistActionTypes.DELETE_CHECKLIST, data));
    yield put(getChecklistById(status_id));
  } catch (error: any) {
    yield put(ChecklistApiResponseError(ChecklistActionTypes.DELETE_CHECKLIST, error));
  }
}

export function* watchGetChecklists() {
  yield takeEvery(ChecklistActionTypes.GET_CHECKLIST, getChecklists);
}

export function* watchGetChecklistsById() {
  yield takeEvery(ChecklistActionTypes.GET_CHECKLIST_BY_ID, getChecklistsById);
}

export function* watchaddChecklists() {
  yield takeEvery(ChecklistActionTypes.ADD_CHECKLIST, addChecklist);
}

export function* watchUpdateChecklists(): any {
  yield takeEvery(ChecklistActionTypes.UPDATE_CHECKLIST, updateChecklist);
}

export function* watchDeleteChecklists(): any {
  yield takeEvery(ChecklistActionTypes.DELETE_CHECKLIST, deleteChecklist);
}

function* ChecklistSaga() {
  yield all([fork(watchGetChecklists), fork(watchGetChecklistsById), fork(watchaddChecklists), fork(watchUpdateChecklists), fork(watchDeleteChecklists)]);
}

export default ChecklistSaga;
