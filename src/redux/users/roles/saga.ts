import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../../helpers/api/apiCore";

// helpers

import {
  getAccessRoles as getAccessRolesApi,
  addAccessRole as addAccessRoleApi,
  updateAccessRole as updateAccessRoleApi,
  deleteAccessRoles as deleteAccessRolesApi,
} from "../../../helpers/";

// actions
import { rolesApiResponseSuccess, rolesApiResponseError, getRoles } from "./actions";

// constants
import { RolesActionTypes } from "./constants";

interface ChannelData {
  payload: {
    id: string;
    power_ids: Array<string>;
    role_name: string;
    updated_by: string;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getRole(): SagaIterator {
  try {
    const response = yield call(getAccessRolesApi);
    const data = response.data?.data;    

    // NOTE - You can change this according to response format from your api
    yield put(rolesApiResponseSuccess(RolesActionTypes.GET_ROLES, data));
  } catch (error: any) {
    yield put(rolesApiResponseError(RolesActionTypes.GET_ROLES, error));
  }
}

function* addRoles({ payload: { role_name, power_ids, updated_by } }: ChannelData): SagaIterator {
  try {
    const response = yield call(addAccessRoleApi, {
      role_name,
      power_ids,
      updated_by,
    });
    const data = response.data.message;

    yield put(rolesApiResponseSuccess(RolesActionTypes.ADD_ROLES, data));

    yield put(getRoles());
  } catch (error: any) {
    console.log("error", error);

    yield put(rolesApiResponseError(RolesActionTypes.ADD_ROLES, error));
  }
}

function* updateRoles({ payload: { id, role_name, power_ids, updated_by } }: ChannelData): SagaIterator {
  try {
    const response = yield call(updateAccessRoleApi, id, {
      role_name,
      power_ids,
      updated_by,
    });
    const data = response.data.message;

    yield put(rolesApiResponseSuccess(RolesActionTypes.UPDATE_ROLES, data));
    yield put(getRoles());
  } catch (error: any) {
    yield put(rolesApiResponseSuccess(RolesActionTypes.UPDATE_ROLES, error));
  }
}

function* deleteRoles({ payload: { id } }: ChannelData): SagaIterator {
  try {
    const response = yield call(deleteAccessRolesApi, id);
    const data = response.data.message;

    yield put(rolesApiResponseSuccess(RolesActionTypes.DELETE_ROLES, data));
    yield put(getRoles());
  } catch (error: any) {
    yield put(rolesApiResponseError(RolesActionTypes.DELETE_ROLES, error));
  }
}

export function* watchGetRoles() {
  yield takeEvery(RolesActionTypes.GET_ROLES, getRole);
}

export function* watchaddRoles() {
  yield takeEvery(RolesActionTypes.ADD_ROLES, addRoles);
}

export function* watchUpdateRoles(): any {
  yield takeEvery(RolesActionTypes.UPDATE_ROLES, updateRoles);
}

export function* watchDeleteRoles(): any {
  yield takeEvery(RolesActionTypes.DELETE_ROLES, deleteRoles);
}

function* RolesSaga() {
  yield all([fork(watchGetRoles), fork(watchaddRoles), fork(watchUpdateRoles), fork(watchDeleteRoles)]);
}

export default RolesSaga;
