// constants
import { AdminUserActionTypes } from "./constants";

export interface FranchiseUsersActionType {
  type:
    | AdminUserActionTypes.API_RESPONSE_SUCCESS
    | AdminUserActionTypes.API_RESPONSE_ERROR
    | AdminUserActionTypes.GET_FRANCHISE_USERS
    | AdminUserActionTypes.ADD_FRANCHISE_USERS
    | AdminUserActionTypes.UPDATE_FRANCHISE_USERS
    | AdminUserActionTypes.DELETE_FRANCHISE_USERS;
  payload: {} | string;
}

interface UsersData {
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
  profileImage: File | null;
  branch_ids: string;
}

// common success
export const franchiseUsersApiResponseSuccess = (
  actionType: string,
  data: UsersData | {}
): FranchiseUsersActionType => ({
  type: AdminUserActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const franchiseUsersApiResponseError = (
  actionType: string,
  error: string
): FranchiseUsersActionType => ({
  type: AdminUserActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getFranchiseUsers = (): FranchiseUsersActionType => ({
  type: AdminUserActionTypes.GET_FRANCHISE_USERS,
  payload: {},
});

export const addFranchiseUsers = (
  employee_id: string,
  name: string,
  email: string,
  phone: string,
  address: string,
  username: string,
  password: string,
  updated_by: string,
  role_id: string,
  profileImage: File | null,
  branch_ids: string,
  country_id: any,
  franchise_id: string
): FranchiseUsersActionType => ({
  type: AdminUserActionTypes.ADD_FRANCHISE_USERS,
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
    franchise_id
  },
});

export const updateFranchiseUsers = (
  id: string,
  employee_id: string,
  name: string,
  email: string,
  phone: string,
  address: string,
  username: string,
  password: string,
  updated_by: string,
  role_id: string,
  profileImage: File | null,
  branch_ids: string,
  country_id: any,
  franchise_id: string
): FranchiseUsersActionType => ({
  type: AdminUserActionTypes.UPDATE_FRANCHISE_USERS,
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
    franchise_id
  },
});

export const deleteFranchiseUsers = (id: string): FranchiseUsersActionType => ({
  type: AdminUserActionTypes.DELETE_FRANCHISE_USERS,
  payload: { id },
});
