import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../../helpers/api/apiCore";

// helpers

import {
  getAdminUsers as getAdminUsersApi,
  addAdminUsers as addAdminUsersApi,
  updateAdminUsers as updateAdminUsersApi,
  deleteAdminUsers as deleteAdminUsersApi,
} from "../../../helpers/";

// actions
import {
  adminUsersApiResponseSuccess,
  adminUsersApiResponseError,
  getAdminUsers,
} from "./actions";

// constants
import { AdminUserActionTypes } from "./constants";
import axios from "axios";

interface UsersData {
  payload: {
    id: string;
    employee_id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    username: string;
    password: string | null;
    updated_by: string;
    role_id: string;
    profileImage: File;
    branch_ids: string;
    country_id: any;
    branch_id: string,
    region_id: string,
    country_ids: string
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getAllAdminUsers(): SagaIterator {
  try {
    const response = yield call(getAdminUsersApi);
    const data = response.data.data;

    // NOTE - You can change this according to response format from your api
    yield put(
      adminUsersApiResponseSuccess(AdminUserActionTypes.GET_ADMIN_USERS, data)
    );
  } catch (error: any) {
    yield put(
      adminUsersApiResponseError(AdminUserActionTypes.GET_ADMIN_USERS, error)
    );
  }
}

function* addAdminUser({
  payload: {
    employee_id,
    name,
    email,
    phone,
    address,
    username,
    password,
    updated_by,
    role_id,
    profileImage,
    branch_ids,
    country_id,
    region_id,
    branch_id,
    country_ids
  },
}: UsersData): SagaIterator {
  try {
    const response = yield call(addAdminUsersApi, {
      employee_id,
      name,
      email,
      phone,
      address,
      username,
      password,
      updated_by,
      role_id,
      profileImage,
      branch_ids,
      country_id,
      region_id,
      branch_id,
      country_ids
    });
    const data = response.data;

    // const branchArray = branch_ids.split(",").map((item) => parseInt(item.trim(), 10));

    // axios
    //   .put(`admin_users_branch/${data.data.id}`, { branchIds: branchArray })
    //   .then((res: any) => {})
    //   .catch((err) => {
    //     console.error(err);
    //   });

    yield put(
      adminUsersApiResponseSuccess(
        AdminUserActionTypes.ADD_ADMIN_USERS,
        data.message
      )
    );

    yield put(getAdminUsers());
  } catch (error: any) {
    yield put(
      adminUsersApiResponseError(AdminUserActionTypes.ADD_ADMIN_USERS, error)
    );
  }
}

function* updateAdminUser({
  payload: {
    id,
    employee_id,
    name,
    email,
    phone,
    address,
    username,
    password,
    updated_by,
    role_id,
    profileImage,
    branch_ids,
    country_id,
    region_id,
    branch_id,
    country_ids
  },
}: UsersData): SagaIterator {
  try {
    const response = yield call(updateAdminUsersApi, id, {
      employee_id,
      name,
      email,
      phone,
      address,
      username,
      password,
      updated_by,
      role_id,
      profileImage,
      branch_ids,
      country_id,
      region_id,
      branch_id,
      country_ids
    });
    const data = response.data.message;

    // const branchArray = branch_ids.split(",").map((item) => parseInt(item.trim(), 10));

    // axios
    //   .put(`admin_users_branch/${id}`, { branchIds: branchArray })
    //   .then((res: any) => {})
    //   .catch((err) => {
    //     console.error(err);
    //   });

    yield put(
      adminUsersApiResponseSuccess(
        AdminUserActionTypes.UPDATE_ADMIN_USERS,
        data
      )
    );
    yield put(getAdminUsers());
  } catch (error: any) {
    yield put(
      adminUsersApiResponseSuccess(
        AdminUserActionTypes.UPDATE_ADMIN_USERS,
        error
      )
    );
  }
}

function* deleteAdminUser({ payload: { id } }: UsersData): SagaIterator {
  try {
    const response = yield call(deleteAdminUsersApi, id);
    const data = response.data.message;

    yield put(
      adminUsersApiResponseSuccess(
        AdminUserActionTypes.DELETE_ADMIN_USERS,
        data
      )
    );
    yield put(getAdminUsers());
  } catch (error: any) {
    yield put(
      adminUsersApiResponseError(AdminUserActionTypes.DELETE_ADMIN_USERS, error)
    );
  }
}

export function* watchGetAdminUsers() {
  yield takeEvery(AdminUserActionTypes.GET_ADMIN_USERS, getAllAdminUsers);
}

export function* watchAddAdminUser() {
  yield takeEvery(AdminUserActionTypes.ADD_ADMIN_USERS, addAdminUser);
}

export function* watchUpdateAdminUser(): any {
  yield takeEvery(AdminUserActionTypes.UPDATE_ADMIN_USERS, updateAdminUser);
}

export function* watchDeleteAdminUser(): any {
  yield takeEvery(AdminUserActionTypes.DELETE_ADMIN_USERS, deleteAdminUser);
}

function* AdminUserSaga() {
  yield all([
    fork(watchGetAdminUsers),
    fork(watchAddAdminUser),
    fork(watchUpdateAdminUser),
    fork(watchDeleteAdminUser),
  ]);
}

export default AdminUserSaga;
