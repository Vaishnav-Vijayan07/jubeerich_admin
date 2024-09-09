import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore } from "../../helpers/api/apiCore";

// helpers
import { getCategory as getCategoryApi, addCategory as addCategoryApi, updateCategory as updateCategoryApi, deleteCategory as deleteCategoryApi } from "../../helpers/";

// actions
import { categoryApiResponseSuccess, categoryApiResponseError, getCategory } from "./actions";

// constants
import { CategoryActionTypes } from "./constants";

interface CategoryData {
  payload: {
    id: number;
    name: string;
    description: string;
  };
  type: string;
}

const api = new APICore();
/**
 * Login the user
 * @param {*} payload - username and password
 */
function* getCategories(): SagaIterator {
  try {
    const response = yield call(getCategoryApi);
    const data = response.data;


    // NOTE - You can change this according to response format from your api
    yield put(categoryApiResponseSuccess(CategoryActionTypes.GET_CATEGORY, { data }));
  } catch (error: any) {
    yield put(categoryApiResponseError(CategoryActionTypes.GET_CATEGORY, error));
  }
}

/**
 * Logout the user
 */
function* addCategory({ payload: { name, description } }: CategoryData): SagaIterator {
  try {
    const response = yield call(addCategoryApi, {
      name,
      description
    });
    const data = response.data.message;

    yield put(categoryApiResponseSuccess(CategoryActionTypes.ADD_CATEGORY, data));
    yield put(getCategory());
  } catch (error: any) {
    console.log("Error", error);

    yield put(categoryApiResponseError(CategoryActionTypes.ADD_CATEGORY, error));
  }
}

function* updateCategory({ payload: { id, name, description } }: CategoryData): SagaIterator {
  try {
    const response = yield call(updateCategoryApi, {
      id,
      name,
      description
    });
    const data = response.data.message;

    yield put(categoryApiResponseSuccess(CategoryActionTypes.UPDATE_CATEGORY, data));
    yield put(getCategory());
  } catch (error: any) {
    yield put(categoryApiResponseSuccess(CategoryActionTypes.UPDATE_CATEGORY, error));
  }
}

function* deleteCategory({ payload: { id } }: CategoryData): SagaIterator {
  try {
    const response = yield call(deleteCategoryApi, { id });
    const data = response.data.message;

    yield put(categoryApiResponseSuccess(CategoryActionTypes.DELETE_CATEGORY, data));
    yield put(getCategory());
  } catch (error: any) {
    yield put(categoryApiResponseError(CategoryActionTypes.DELETE_CATEGORY, error));
  }
}
export function* watchGetCategory() {
  yield takeEvery(CategoryActionTypes.GET_CATEGORY, getCategories);
}

export function* watchAddCategory() {
  yield takeEvery(CategoryActionTypes.ADD_CATEGORY, addCategory);
}

export function* watchUpdateCategory(): any {
  yield takeEvery(CategoryActionTypes.UPDATE_CATEGORY, updateCategory);
}

export function* watchDeleteCategory(): any {
  yield takeEvery(CategoryActionTypes.DELETE_CATEGORY, deleteCategory);
}

function* categorySaga() {
  yield all([fork(watchGetCategory), fork(watchAddCategory), fork(watchUpdateCategory), fork(watchDeleteCategory)]);
}

export default categorySaga;
