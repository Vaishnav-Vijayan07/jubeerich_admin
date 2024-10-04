import { takeEvery, call, put } from "redux-saga/effects";
import { DropDownActionTypes } from "./constants";
import {
  dropDownApiResponseSuccess,
  dropDownApiResponseError,
} from "./actions";
import { getdropdownApi } from "../../helpers/api/dropDown";

// constants

function* getDropDowns({ payload: { types } }: any): any {
  try {
    const response = yield call(getdropdownApi, { types });
    const data = response.data;

    // NOTE - You can change this according to response format from your api
    yield put(
      dropDownApiResponseSuccess(DropDownActionTypes.GET_DROP_DOWN, { data })
    );
  } catch (error: any) {
    yield put(
      dropDownApiResponseError(DropDownActionTypes.GET_DROP_DOWN, error)
    );
  }
}

function* dropDownSaga() {
  yield takeEvery(DropDownActionTypes.GET_DROP_DOWN, getDropDowns);
}

export default dropDownSaga;
