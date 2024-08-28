// constants
import { FranchiseActionTypes } from "./constants";

export interface FranchiseActionType {
  type:
    | FranchiseActionTypes.API_RESPONSE_SUCCESS
    | FranchiseActionTypes.API_RESPONSE_ERROR
    | FranchiseActionTypes.GET_FRANCHISE
    | FranchiseActionTypes.ADD_FRANCHISE
    | FranchiseActionTypes.UPDATE_FRANCHISE
    | FranchiseActionTypes.DELETE_FRANCHISE
    | FranchiseActionTypes.ADD_FRANCHISE_ADMINUSER
    | FranchiseActionTypes.UPDATE_FRANCHISE_ADMINUSER;
  payload: {} | string;
}

interface FranchiseData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  pocName: string;
  slug: string;
}

// common success
export const franchiseApiResponseSuccess = (
  actionType: string,
  data: FranchiseData | {}
): FranchiseActionType => ({
  type: FranchiseActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const franchiseApiResponseError = (
  actionType: string,
  error: string
): FranchiseActionType => ({
  type: FranchiseActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getFranchise = (): FranchiseActionType => ({
  type: FranchiseActionTypes.GET_FRANCHISE,
  payload: {},
});

export const addFranchise = (
  name: string,
  email: string,
  address: string,
  phone: string,
  pocName: string
): FranchiseActionType => ({
  type: FranchiseActionTypes.ADD_FRANCHISE,
  payload: {
    name,
    email,
    phone,
    address,
    pocName,
  },
});

export const updateFranchise = (
  id: string,
  name: string,
  email: string,
  address: string,
  phone: string,
  pocName: string
): FranchiseActionType => ({
  type: FranchiseActionTypes.UPDATE_FRANCHISE,
  payload: {
    id,
    name,
    email,
    phone,
    address,
    pocName,
  },
});

export const deleteFranchise = (id: string): FranchiseActionType => ({
  type: FranchiseActionTypes.DELETE_FRANCHISE,
  payload: { id },
});

export const addFranchiseAdminUser = (
  employee_id: string,
  name: string,
  email: string,
  phone: string,
  address: string,
  username: string,
  password: string,
  updated_by: string,
  role_id: string,
  branch_ids: string | null,
  country_id: string | null,
  franchise_id: string
): FranchiseActionType => ({
  type: FranchiseActionTypes.ADD_FRANCHISE_ADMINUSER,
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
});

export const updateFranchiseAdminUser = (
  id: string,
  employee_id: string,
  name: string,
  email: string,
  phone: string,
  address: string,
  username: string,
  updated_by: string,
  role_id: string,
  branch_ids: string | null,
  country_id: string | null,
  franchise_id: string
): FranchiseActionType => ({
  type: FranchiseActionTypes.UPDATE_FRANCHISE_ADMINUSER,
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
});
