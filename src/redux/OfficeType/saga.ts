import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";
import { OfficeTypesActionTypes } from "./constants";
import {
  getOfficeTypeData,
  OfficeTypesApiResponseError,
  OfficeTypesApiResponseSuccess,
} from "./actions";
import {
  addOfficeTypeApi,
  deleteOfficeTypeApi,
  getOfficeTypeApi,
  getOfficeTypeByidApi,
  updateOfficeTypeApi,
} from "../../helpers/api/officeType";

interface OfficeData {
  payload: {
    id: string;
    office_type_name: string;
    office_type_description: string;
    updated_by: string;
  };
  type: string;
}

function* getOfficeTypeDataSaga(): SagaIterator {
  try {
    const response = yield call(getOfficeTypeApi);
    const data = response.data.data;

    yield put(
      OfficeTypesApiResponseSuccess(
        OfficeTypesActionTypes.GET_OFFICE_TYPE,
        data
      )
    );
  } catch (error: any) {
    console.log(error);
    yield put(
      OfficeTypesApiResponseError(OfficeTypesActionTypes.GET_OFFICE_TYPE, error)
    );
  }
}

function* getOfficeTypeDataByIdSaga({
  payload: { id },
}: OfficeData): SagaIterator {
  try {
    const response = yield call(getOfficeTypeByidApi, id);
    console.log(response);
    const data = response.data;

    yield put(
      OfficeTypesApiResponseSuccess(
        OfficeTypesActionTypes.GET_OFFICE_TYPE_BY_ID,
        data
      )
    );
  } catch (error: any) {
    console.log(error);
    yield put(
      OfficeTypesApiResponseError(
        OfficeTypesActionTypes.GET_OFFICE_TYPE_BY_ID,
        error
      )
    );
  }
}
function* deleteOfficeTypeDataSaga({
  payload: { id },
}: OfficeData): SagaIterator {
  try {
    const response = yield call(deleteOfficeTypeApi, id);
    console.log(response);
    const data = response.data.message;

    yield put(
      OfficeTypesApiResponseSuccess(
        OfficeTypesActionTypes.DELETE_OFFICE_TYPE,
        data
      )
    );
    yield put(getOfficeTypeData());
  } catch (error: any) {
    console.log(error);
    yield put(
      OfficeTypesApiResponseError(
        OfficeTypesActionTypes.DELETE_OFFICE_TYPE,
        error
      )
    );
  }
}
function* addOfficeTypeDataSaga({
  payload: { office_type_name, updated_by, office_type_description },
}: OfficeData): SagaIterator {
  try {
    const response = yield call(addOfficeTypeApi, {
      office_type_name,
      updated_by,
      office_type_description,
    });
    console.log(response);
    const data = response.message;

    yield put(
      OfficeTypesApiResponseSuccess(
        OfficeTypesActionTypes.ADD_OFFICE_TYPE,
        data
      )
    );
    yield put(getOfficeTypeData());
  } catch (error: any) {
    console.log(error);
    yield put(
      OfficeTypesApiResponseError(OfficeTypesActionTypes.ADD_OFFICE_TYPE, error)
    );
  }
}
function* updateOfficeTypeDataSaga({
  payload: { id, office_type_description, office_type_name, updated_by },
}: OfficeData): SagaIterator {
  try {
    const response = yield call(updateOfficeTypeApi, id, {
      updated_by,
      office_type_description,
      office_type_name,
    });
    console.log(response);
    const data = response.message;

    yield put(
      OfficeTypesApiResponseSuccess(
        OfficeTypesActionTypes.UPDATE_OFFICE_TYPE,
        data
      )
    );
    yield put(getOfficeTypeData());
  } catch (error: any) {
    console.log(error);
    yield put(
      OfficeTypesApiResponseError(
        OfficeTypesActionTypes.UPDATE_OFFICE_TYPE,
        error
      )
    );
  }
}

export function* watchGetOfficeTypes() {
  yield takeEvery(
    OfficeTypesActionTypes.GET_OFFICE_TYPE,
    getOfficeTypeDataSaga
  );
}

export function* watchGetOfficeTypesById() {
  yield takeEvery(
    OfficeTypesActionTypes.GET_OFFICE_TYPE_BY_ID,
    getOfficeTypeDataByIdSaga
  );
}

export function* watchaddOfficeTypes() {
  yield takeEvery(
    OfficeTypesActionTypes.ADD_OFFICE_TYPE,
    addOfficeTypeDataSaga
  );
}

export function* watchUpdateOfficeTypes(): any {
  yield takeEvery(
    OfficeTypesActionTypes.UPDATE_OFFICE_TYPE,
    updateOfficeTypeDataSaga
  );
}

export function* watchDeleteOfficeTypes(): any {
  yield takeEvery(
    OfficeTypesActionTypes.DELETE_OFFICE_TYPE,
    deleteOfficeTypeDataSaga
  );
}

function* OfficeTypeSaga() {
  yield all([
    fork(watchGetOfficeTypes),
    fork(watchaddOfficeTypes),
    fork(watchUpdateOfficeTypes),
    fork(watchDeleteOfficeTypes),
    fork(watchGetOfficeTypesById),
  ]);
}

export default OfficeTypeSaga;
