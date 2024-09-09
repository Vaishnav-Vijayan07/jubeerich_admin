// constants
import { CategoryActionTypes } from "./constants";

export interface CategoryActionType {
  type:
    | CategoryActionTypes.API_RESPONSE_SUCCESS
    | CategoryActionTypes.API_RESPONSE_ERROR
    | CategoryActionTypes.GET_CATEGORY
    | CategoryActionTypes.ADD_CATEGORY
    | CategoryActionTypes.UPDATE_CATEGORY
    | CategoryActionTypes.DELETE_CATEGORY;
  payload: {} | string;
}

interface CategoryData {
  id: number;
  name: string;
  description: string;
}

// common success
export const categoryApiResponseSuccess = (
  actionType: string,
  data: CategoryData | {}
): CategoryActionType => ({
  type: CategoryActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const categoryApiResponseError = (
  actionType: string,
  error: any
): CategoryActionType => ({
  type: CategoryActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getCategory = (): CategoryActionType => ({
  type: CategoryActionTypes.GET_CATEGORY,
  payload: {},
});

export const addCategory = (
  name: string,
  description: string,
): CategoryActionType => ({
  type: CategoryActionTypes.ADD_CATEGORY,
  payload: {
    name,
    description
  },
});

export const updateCategory = (
  id: string,
  name: string,
  description: string
): CategoryActionType => ({
  type: CategoryActionTypes.UPDATE_CATEGORY,
  payload: {
    id,
    name,
    description
  },
});

export const deleteCategory = (
  id: number
): CategoryActionType => ({
  type: CategoryActionTypes.DELETE_CATEGORY,
  payload: { id },
});
