// constants
import { BranchActionTypes } from "./constants";

export interface BranchActionType {
  type:
    | BranchActionTypes.API_RESPONSE_SUCCESS
    | BranchActionTypes.API_RESPONSE_ERROR
    | BranchActionTypes.GET_BRANCHES
    | BranchActionTypes.ADD_BRANCHES
    | BranchActionTypes.UPDATE_BRANCHES
    | BranchActionTypes.DELETE_BRANCHES
    | BranchActionTypes.SET_BRANCH_ID
    | BranchActionTypes.FETCH_BRANCH_ID_FROM_SESSION_STORAGE;
  payload: {} | string;
}

interface BranchData {
  id: string;
  branch_name: string;
  branch_address: string;
  branch_city: string;
  branch_country: string;
  currency: string;
  updated_by: string;
}

// common success
export const BranchApiResponseSuccess = (
  actionType: string,
  data: BranchData | {}
): BranchActionType => ({
  type: BranchActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const BranchApiResponseError = (
  actionType: string,
  error: string
): BranchActionType => ({
  type: BranchActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getBranches = (): BranchActionType => ({
  type: BranchActionTypes.GET_BRANCHES,
  payload: {},
});

export const addBranches = (
  branch_name: string,
  branch_address: string,
  branch_country: string,
  branch_city: string,
  currency: string,
  updated_by: string
): BranchActionType => ({
  type: BranchActionTypes.ADD_BRANCHES,
  payload: {
    branch_name,
    branch_address,
    branch_country,
    branch_city,
    currency,
    updated_by,
  },
});

export const updateBranches = (
  id: string,
  branch_name: string,
  branch_address: string,
  branch_country: string,
  branch_city: string,
  currency: string,
  updated_by: string
): BranchActionType => ({
  type: BranchActionTypes.UPDATE_BRANCHES,
  payload: {
    id,
    branch_name,
    branch_address,
    branch_country,
    branch_city,
    currency,
    updated_by,
  },
});

export const deleteBranches = (id: string): BranchActionType => ({
  type: BranchActionTypes.DELETE_BRANCHES,
  payload: { id },
});

export const setSessionStorageItem = (key: string, value:string) => ({
  type: BranchActionTypes.SET_BRANCH_ID,
  payload: { key, value },
});

export const fetchBranchIdFromSessionStorage = () => ({
  type: BranchActionTypes.FETCH_BRANCH_ID_FROM_SESSION_STORAGE,
});