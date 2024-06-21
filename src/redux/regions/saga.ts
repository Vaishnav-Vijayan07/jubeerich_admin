import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";
import { RegionActionTypes } from "./constants";
import {
  getRegion,
  regionApiResponseError,
  regionApiResponseSuccess,
} from "./actions";
import {
  addRegionsApi,
  deleteRegionsApi,
  getRegionByidApi,
  getRegionsApi,
  updateRegionsApi,
} from "../../helpers/api/region";

interface RegionData {
  payload: {
    id: string;
    region_name: string;
    region_description: string;
    updated_by: string;
  };
  type: string;
}

function* getRegionSaga(): SagaIterator {
  try {
    const response = yield call(getRegionsApi);
    console.log(response);
    const data = response.data.data;

    yield put(regionApiResponseSuccess(RegionActionTypes.GET_REGION, data));
  } catch (error: any) {
    console.log(error);
    yield put(regionApiResponseError(RegionActionTypes.GET_REGION, error));
  }
}

function* getRegionByIdSaga({ payload: { id } }: RegionData): SagaIterator {
  try {
    const response = yield call(getRegionByidApi, id);
    console.log(response);
    const data = response.data;

    yield put(
      regionApiResponseSuccess(RegionActionTypes.GET_REGION_BY_ID, data)
    );
  } catch (error: any) {
    console.log(error);
    yield put(
      regionApiResponseError(RegionActionTypes.GET_REGION_BY_ID, error)
    );
  }
}
function* deleteRegionSaga({ payload: { id } }: RegionData): SagaIterator {
  try {
    const response = yield call(deleteRegionsApi, id);
    console.log(response);
    const data = response.data.message;

    yield put(regionApiResponseSuccess(RegionActionTypes.DELETE_REGION, data));
    yield put(getRegion());
  } catch (error: any) {
    console.log(error);
    yield put(regionApiResponseError(RegionActionTypes.DELETE_REGION, error));
  }
}
function* addRegionSaga({
  payload: { region_name, updated_by, region_description },
}: RegionData): SagaIterator {
  try {
    const response = yield call(addRegionsApi, {
      region_name,
      updated_by,
      region_description,
    });
    console.log(response);
    const data = response.message;

    yield put(regionApiResponseSuccess(RegionActionTypes.ADD_REGION, data));
    yield put(getRegion());
  } catch (error: any) {
    console.log(error);
    yield put(regionApiResponseError(RegionActionTypes.ADD_REGION, error));
  }
}
function* updateRegionSaga({
  payload: { id, region_description, region_name, updated_by },
}: RegionData): SagaIterator {
  try {
    const response = yield call(updateRegionsApi, id, {
      updated_by,
      region_description,
      region_name,
    });
    console.log(response);
    const data = response.message;

    yield put(regionApiResponseSuccess(RegionActionTypes.UPDATE_REGION, data));
    yield put(getRegion());
  } catch (error: any) {
    console.log(error);
    yield put(regionApiResponseError(RegionActionTypes.UPDATE_REGION, error));
  }
}

export function* watchGetRegion() {
  yield takeEvery(RegionActionTypes.GET_REGION, getRegionSaga);
}

export function* watchGetRegionById() {
  yield takeEvery(RegionActionTypes.GET_REGION_BY_ID, getRegionByIdSaga);
}

export function* watchaddRegionTypes() {
  yield takeEvery(RegionActionTypes.ADD_REGION, addRegionSaga);
}

export function* watchUpdateRegion(): any {
  yield takeEvery(RegionActionTypes.UPDATE_REGION, updateRegionSaga);
}

export function* watchDeleteRegion(): any {
  yield takeEvery(RegionActionTypes.DELETE_REGION, deleteRegionSaga);
}

function* RegionSaga() {
  yield all([
    fork(watchGetRegion),
    fork(watchaddRegionTypes),
    fork(watchUpdateRegion),
    fork(watchDeleteRegion),
    fork(watchGetRegionById),
  ]);
}

export default RegionSaga;
