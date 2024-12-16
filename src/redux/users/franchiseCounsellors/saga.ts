import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../../helpers/api/apiCore";

// helpers

import {
  getFranchiseCounsellors as getAdminUsersApi,
  addAdminUsers as addFranchiseUsersApi,
  updateAdminUsers as updateAdminUsersApi,
  deleteAdminUsers as deleteAdminUsersApi,
} from "../../../helpers/";

// actions
import {
  franchiseUsersApiResponseSuccess,
  franchiseUsersApiResponseError,
  getFranchiseUsers,
} from "./actions";

// constants
import { AdminUserActionTypes } from "./constants";

interface UsersData {
  payload: {
    id: string;
    employee_id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    username: string;
    password: string;
    updated_by: string;
    role_id: string;
    profileImage: File;
    branch_ids: string;
    country_ids: any;
    franchise_id: string
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
      franchiseUsersApiResponseSuccess(AdminUserActionTypes.GET_FRANCHISE_USERS, data)
    );
  } catch (error: any) {
    yield put(
      franchiseUsersApiResponseError(AdminUserActionTypes.GET_FRANCHISE_USERS, error)
    );
  }
}

function* addFranchiseUser({
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
    country_ids,
    franchise_id
  },
}: UsersData): SagaIterator {
  try {
    const response = yield call(addFranchiseUsersApi, {
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
      country_ids,
      franchise_id
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
      franchiseUsersApiResponseSuccess(
        AdminUserActionTypes.ADD_FRANCHISE_USERS,
        data.message
      )
    );

    yield put(getFranchiseUsers());
  } catch (error: any) {
    yield put(
      franchiseUsersApiResponseError(AdminUserActionTypes.ADD_FRANCHISE_USERS, error)
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
    country_ids,
    franchise_id
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
      country_ids,
      franchise_id
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
      franchiseUsersApiResponseSuccess(
        AdminUserActionTypes.UPDATE_FRANCHISE_USERS,
        data
      )
    );
    yield put(getFranchiseUsers());
  } catch (error: any) {
    yield put(
      franchiseUsersApiResponseSuccess(
        AdminUserActionTypes.UPDATE_FRANCHISE_USERS,
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
      franchiseUsersApiResponseSuccess(
        AdminUserActionTypes.DELETE_FRANCHISE_USERS,
        data
      )
    );
    yield put(getFranchiseUsers());
  } catch (error: any) {
    yield put(
      franchiseUsersApiResponseError(AdminUserActionTypes.DELETE_FRANCHISE_USERS, error)
    );
  }
}

export function* watchGetAdminUsers() {
  yield takeEvery(AdminUserActionTypes.GET_FRANCHISE_USERS, getAllAdminUsers);
}

export function* watchAddFranchiseUser() {
  yield takeEvery(AdminUserActionTypes.ADD_FRANCHISE_USERS, addFranchiseUser);
}

export function* watchUpdateAdminUser(): any {
  yield takeEvery(AdminUserActionTypes.UPDATE_FRANCHISE_USERS, updateAdminUser);
}

export function* watchDeleteAdminUser(): any {
  yield takeEvery(AdminUserActionTypes.DELETE_FRANCHISE_USERS, deleteAdminUser);
}

function* FranchiseUserSaga() {
  yield all([
    fork(watchGetAdminUsers),
    fork(watchAddFranchiseUser),
    fork(watchUpdateAdminUser),
    fork(watchDeleteAdminUser),
  ]);
}

export default FranchiseUserSaga;
