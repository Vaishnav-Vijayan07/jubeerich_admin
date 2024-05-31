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
  category_name: string;
  category_description: string;
  parent_category_id: string;
  status: string;
  updated_by: number;
  //   token: string;
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
  category_name: string,
  category_description: string,
  // parent_category_id: string,
  status: boolean,
  updated_by: number
): CategoryActionType => ({
  type: CategoryActionTypes.ADD_CATEGORY,
  payload: {
    category_name,
    category_description,
    // parent_category_id,
    status,
    updated_by,
  },
});

export const updateCategory = (
  id: string,
  category_name: string,
  category_description: string,
  // parent_category_id: string,
  status: boolean,
  updated_by: number
): CategoryActionType => ({
  type: CategoryActionTypes.UPDATE_CATEGORY,
  payload: {
    id,
    category_name,
    category_description,
    // parent_category_id,
    status,
    updated_by,
  },
});

export const deleteCategory = (
  id: number,
  updated_by: number
): CategoryActionType => ({
  type: CategoryActionTypes.DELETE_CATEGORY,
  payload: { id, updated_by },
});
