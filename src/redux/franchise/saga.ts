import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// constants
import { FranchiseActionTypes } from "./constants";

import {
  getFranchiseUsersApi,
  addFranchiseUsersApi,
  deleteFranchiseUsersApi,
  updateFranchiseUsersApi,
  addFranchiseAdminUsersApi,
  updateFranchiseAdminUsersApi,
} from "../../helpers/api/franchise";
import {
  franchiseApiResponseError,
  franchiseApiResponseSuccess,
  getFranchise,
} from "./actions";

interface FranchiseData {
  payload: {
    id: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    pocName: string;
  };
  type: string;
}
interface FranchiseAdminUserData {
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
    branch_ids: string | null;
    country_id: string | null;
    franchise_id: string;
  };
  type: string;
}

function* getAllFranchiseUsers(): SagaIterator {
  try {
    const response = yield call(getFranchiseUsersApi);
    const data = response.data.data;

    yield put(
      franchiseApiResponseSuccess(FranchiseActionTypes.GET_FRANCHISE, data)
    );
  } catch (error: any) {
    yield put(
      franchiseApiResponseError(FranchiseActionTypes.GET_FRANCHISE, error)
    );
  }
}

function* addFranchiseUser({
  payload: { name, email, phone, address, pocName },
}: FranchiseData): SagaIterator {
  try {
    const response = yield call(addFranchiseUsersApi, {
      name,
      email,
      phone,
      address,
      pocName,
    });
    const data = response.data;

    yield put(
      franchiseApiResponseSuccess(
        FranchiseActionTypes.ADD_FRANCHISE,
        data.message
      )
    );

    yield put(getFranchise());
  } catch (error: any) {
    yield put(
      franchiseApiResponseError(FranchiseActionTypes.ADD_FRANCHISE, error)
    );
  }
}

function* updateFranchiseUser({
  payload: { id, name, email, phone, address, pocName },
}: FranchiseData): SagaIterator {
  try {
    const response = yield call(updateFranchiseUsersApi, id, {
      name,
      email,
      phone,
      address,
      pocName,
    });
    const data = response.data.message;

    yield put(
      franchiseApiResponseSuccess(FranchiseActionTypes.UPDATE_FRANCHISE, data)
    );
    yield put(getFranchise());
  } catch (error: any) {
    console.log(error);
    yield put(
      franchiseApiResponseError(FranchiseActionTypes.UPDATE_FRANCHISE, error)
    );
  }
}

function* deleteFranchiseUser({
  payload: { id },
}: FranchiseData): SagaIterator {
  try {
    const response = yield call(deleteFranchiseUsersApi, id);
    const data = response.data.message;

    yield put(
      franchiseApiResponseSuccess(FranchiseActionTypes.DELETE_FRANCHISE, data)
    );
    yield put(getFranchise());
  } catch (error: any) {
    yield put(
      franchiseApiResponseError(FranchiseActionTypes.DELETE_FRANCHISE, error)
    );
  }
}

function* addFranchiseAdminUser({
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
    branch_ids,
    country_id,
    franchise_id,
  },
}: FranchiseAdminUserData): SagaIterator {
  try {
    const response = yield call(addFranchiseAdminUsersApi, {
      employee_id,
      name,
      email,
      phone,
      address,
      username,
      password,
      updated_by,
      role_id,
      branch_ids,
      country_id,
      franchise_id,
    });
    const data = response.data.message;

    yield put(
      franchiseApiResponseSuccess(
        FranchiseActionTypes.ADD_FRANCHISE_ADMINUSER,
        data
      )
    );
    yield put(getFranchise());
  } catch (error: any) {
    yield put(
      franchiseApiResponseError(
        FranchiseActionTypes.ADD_FRANCHISE_ADMINUSER,
        error
      )
    );
  }
}

function* updateFranchiseAdminUser({
  payload: {
    id,
    employee_id,
    name,
    email,
    phone,
    address,
    username,
    updated_by,
    role_id,
    branch_ids,
    country_id,
    franchise_id,
  },
}: FranchiseAdminUserData): SagaIterator {
  try {
    const response = yield call(updateFranchiseAdminUsersApi, id, {
      employee_id,
      name,
      email,
      phone,
      address,
      username,
      updated_by,
      role_id,
      branch_ids,
      country_id,
      franchise_id,
    });
    const data = response.data.message;

    yield put(
      franchiseApiResponseSuccess(
        FranchiseActionTypes.UPDATE_FRANCHISE_ADMINUSER,
        data
      )
    );
    yield put(getFranchise());
  } catch (error: any) {
    yield put(
      franchiseApiResponseError(
        FranchiseActionTypes.UPDATE_FRANCHISE_ADMINUSER,
        error
      )
    );
  }
}

export function* watchGetFranchiseUsers() {
  yield takeEvery(FranchiseActionTypes.GET_FRANCHISE, getAllFranchiseUsers);
}

export function* watchAddFranchiseUser() {
  yield takeEvery(FranchiseActionTypes.ADD_FRANCHISE, addFranchiseUser);
}

export function* watchUpdateFranchiseUser(): any {
  yield takeEvery(FranchiseActionTypes.UPDATE_FRANCHISE, updateFranchiseUser);
}

export function* watchDeleteFranchiseUser(): any {
  yield takeEvery(FranchiseActionTypes.DELETE_FRANCHISE, deleteFranchiseUser);
}

export function* watchAddFranchiseAdminUser(): any {
  yield takeEvery(
    FranchiseActionTypes.ADD_FRANCHISE_ADMINUSER,
    addFranchiseAdminUser
  );
}

export function* watchUpdateFranchiseAdminUser(): any {
  yield takeEvery(
    FranchiseActionTypes.UPDATE_FRANCHISE_ADMINUSER,
    updateFranchiseAdminUser
  );
}

function* FranchiseUserSaga() {
  yield all([
    fork(watchGetFranchiseUsers),
    fork(watchAddFranchiseUser),
    fork(watchUpdateFranchiseUser),
    fork(watchDeleteFranchiseUser),
    fork(watchAddFranchiseAdminUser),
    fork(watchUpdateFranchiseAdminUser),
  ]);
}

export default FranchiseUserSaga;
