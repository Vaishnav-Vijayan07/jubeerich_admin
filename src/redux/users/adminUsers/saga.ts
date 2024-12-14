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
  getBranchCounsellors,
  getBranchCounsellorsTL,
  getFranchiseCounsellors,
  getFranchiseCounsellorsTL,
} from "./actions";

// constants
import { AdminUserActionTypes } from "./constants";
import axios from "axios";
import { getBranchCounsellors as getBranchCounsellorsAPI, getBranchCounsellorsTL as getBranchCounsellorsTLAPI, getFranchiseCounsellorsByFranchise, getFranchiseCounsellorsTLByFranchise } from "../../../helpers/api/users/adminUsers";
import { showSuccessAlert } from "../../../constants";

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
    country_ids: string,
    franchise_id: any
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

function* getAllBranchCounsellors({
  payload: { branchId },
}: any): SagaIterator {
  try {
    const response = yield call(getBranchCounsellorsAPI, branchId);
    const data = response.data.data || [];

    // NOTE - You can change this according to response format from your api
    yield put(
      adminUsersApiResponseSuccess(AdminUserActionTypes.GET_BRANCH_COUNSELLOR, data)
    );
  } catch (error: any) {
    yield put(
      adminUsersApiResponseError(AdminUserActionTypes.GET_BRANCH_COUNSELLOR, error)
    );
  }
}

function* getAllBranchCounsellorsTL({
  payload: { branchId },
}: any): SagaIterator {
  try {
    const response = yield call(getBranchCounsellorsTLAPI, branchId);
    
    const data = response.data.data || [];

    // NOTE - You can change this according to response format from your api
    yield put(
      adminUsersApiResponseSuccess(AdminUserActionTypes.GET_BRANCH_COUNSELLOR_TL, data)
    );
  } catch (error: any) {
    yield put(
      adminUsersApiResponseError(AdminUserActionTypes.GET_BRANCH_COUNSELLOR_TL, error)
    );
  }
}

function* getAllFranchiseCounsellors({
  payload: { franchiseId },
}: any): SagaIterator {
  try {
    const response = yield call(getFranchiseCounsellorsByFranchise, franchiseId);
    const data = response?.data?.data || [];

    // NOTE - You can change this according to response format from your api
    yield put(
      adminUsersApiResponseSuccess(AdminUserActionTypes.GET_FRANCHISE_COUNSELLOR, data)
    );
  } catch (error: any) {
    yield put(
      adminUsersApiResponseError(AdminUserActionTypes.GET_FRANCHISE_COUNSELLOR, error)
    );
  }
}

function* getAllFranchiseCounsellorsTL({
  payload: { franchiseId },
}: any): SagaIterator {
  try {
    const response = yield call(getFranchiseCounsellorsTLByFranchise, franchiseId);
    const data = response?.data?.data || [];

    // NOTE - You can change this according to response format from your api
    yield put(
      adminUsersApiResponseSuccess(AdminUserActionTypes.GET_FRANCHISE_COUNSELLOR_TL, data)
    );
  } catch (error: any) {
    yield put(
      adminUsersApiResponseError(AdminUserActionTypes.GET_FRANCHISE_COUNSELLOR_TL, error)
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
    country_ids,
    franchise_id
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
      country_ids,
      franchise_id
    });
    const data = response.data;

    yield put(
      adminUsersApiResponseSuccess(
        AdminUserActionTypes.ADD_ADMIN_USERS,
        data.message
      )
    );

    yield put(getAdminUsers());
    
    let branchId = branch_id;
    let franchiseId = franchise_id;

    if(branch_id){
      yield put(getBranchCounsellors(branchId))
      yield put(getBranchCounsellorsTL(branchId))
    }
    
    if(franchiseId){
      yield put(getFranchiseCounsellors(franchiseId))
      yield put(getFranchiseCounsellorsTL(franchiseId))
    }
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
      country_id,
      region_id,
      branch_id,
      country_ids,
      franchise_id
    });
    const data = response.data.message;

    yield put(
      adminUsersApiResponseSuccess(
        AdminUserActionTypes.UPDATE_ADMIN_USERS,
        data
      )
    );
    yield put(getAdminUsers());

    let branchId = branch_id;
    let franchiseId = franchise_id;
    
    if(branch_id){
      yield put(getBranchCounsellors(branchId))
      yield put(getBranchCounsellorsTL(branchId))
    }

    if(franchiseId){
      yield put(getFranchiseCounsellors(franchiseId))
      yield put(getFranchiseCounsellorsTL(franchiseId))
    }
    // yield put(getAdminUsers());
  } catch (error: any) {
    yield put(
      adminUsersApiResponseError(
        AdminUserActionTypes.UPDATE_ADMIN_USERS,
        error
      )
    );
  }
}

function* deleteAdminUser({ payload: { id, branch_id, franchise_id } }: UsersData): SagaIterator {
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

    let branchId = branch_id;
    let franchiseId = franchise_id;
    
    if(branch_id){
      yield put(getBranchCounsellors(branchId))
      yield put(getBranchCounsellorsTL(branchId))
    }

    if(franchiseId){
      yield put(getFranchiseCounsellors(franchiseId))
      yield put(getFranchiseCounsellorsTL(franchiseId))
    }
    // yield put(getAdminUsers());
  } catch (error: any) {
    yield put(
      adminUsersApiResponseError(AdminUserActionTypes.DELETE_ADMIN_USERS, error)
    );
  }
}

export function* watchGetAdminUsers() {
  yield takeEvery(AdminUserActionTypes.GET_ADMIN_USERS, getAllAdminUsers);
}
export function* watchBranchCounsellor() {
  yield takeEvery(AdminUserActionTypes.GET_BRANCH_COUNSELLOR, getAllBranchCounsellors);
}

export function* watchBranchCounsellorTL() {
  yield takeEvery(AdminUserActionTypes.GET_BRANCH_COUNSELLOR_TL, getAllBranchCounsellorsTL);
}

export function* watchFranchiseCounsellor() {
  yield takeEvery(AdminUserActionTypes.GET_FRANCHISE_COUNSELLOR, getAllFranchiseCounsellors);
}

export function* watchFranchiseCounsellorTL() {
  yield takeEvery(AdminUserActionTypes.GET_FRANCHISE_COUNSELLOR_TL, getAllFranchiseCounsellorsTL);
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
    fork(watchBranchCounsellor),
    fork(watchBranchCounsellorTL),
    fork(watchFranchiseCounsellor),
    fork(watchFranchiseCounsellorTL)
  ]);
}

export default AdminUserSaga;
