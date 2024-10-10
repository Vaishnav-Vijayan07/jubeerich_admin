// constants
import { AdminUserActionTypes } from "./constants";

export interface AdminUsersActionType {
  type:
    | AdminUserActionTypes.API_RESPONSE_SUCCESS
    | AdminUserActionTypes.API_RESPONSE_ERROR
    | AdminUserActionTypes.GET_ADMIN_USERS
    | AdminUserActionTypes.ADD_ADMIN_USERS
    | AdminUserActionTypes.UPDATE_ADMIN_USERS
    | AdminUserActionTypes.DELETE_ADMIN_USERS
    | AdminUserActionTypes.GET_BRANCH_COUNSELLOR
    | AdminUserActionTypes.GET_BRANCH_COUNSELLOR_TL
    | AdminUserActionTypes.GET_FRANCHISE_COUNSELLOR
    | AdminUserActionTypes.GET_FRANCHISE_COUNSELLOR_TL;
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
  password: string | null;
  updated_by: string;
  role_id: string;
  profileImage: File | null;
  branch_ids: string;
  franchise_id: any
}

// common success
export const adminUsersApiResponseSuccess = (
  actionType: string,
  data: UsersData | {}
): AdminUsersActionType => ({
  type: AdminUserActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const adminUsersApiResponseError = (
  actionType: string,
  error: string
): AdminUsersActionType => ({
  type: AdminUserActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getAdminUsers = (): AdminUsersActionType => ({
  type: AdminUserActionTypes.GET_ADMIN_USERS,
  payload: {},
});

// Update the action creator to accept a branchId parameter
export const getBranchCounsellors = (branchId: any): AdminUsersActionType => ({
  type: AdminUserActionTypes.GET_BRANCH_COUNSELLOR,
  payload: { branchId }, // Pass the branchId in the payload
});


export const getBranchCounsellorsTL = (branchId: any): AdminUsersActionType => ({
  type: AdminUserActionTypes.GET_BRANCH_COUNSELLOR_TL,
  payload: { branchId },
});

export const getFranchiseCounsellors = (franchiseId: any): AdminUsersActionType => ({
  type: AdminUserActionTypes.GET_FRANCHISE_COUNSELLOR,
  payload: { franchiseId },
});

export const getFranchiseCounsellorsTL = (franchiseId: any): AdminUsersActionType => ({
  type: AdminUserActionTypes.GET_FRANCHISE_COUNSELLOR_TL,
  payload: { franchiseId },
});

export const addAdminUsers = (
  employee_id: string,
  name: string,
  email: string,
  phone: string,
  address: string,
  username: string,
  password: string | null,
  updated_by: string,
  role_id: string,
  profileImage: File | null,
  branch_ids: string,
  country_id: any,
  region_id: any,
  branch_id: any,
  country_ids: any,
  franchise_id: any
): AdminUsersActionType => ({
  type: AdminUserActionTypes.ADD_ADMIN_USERS,
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
    region_id,
    branch_id,
    country_ids,
    franchise_id
  },
});

export const updateAdminUsers = (
  id: string,
  employee_id: string,
  name: string,
  email: string,
  phone: string,
  address: string,
  username: string,
  password: string | null,
  updated_by: string,
  role_id: string,
  profileImage: File | null,
  branch_ids: string,
  country_id: any,
  region_id: any,
  branch_id: any,
  country_ids: any,
  franchise_id: any
): AdminUsersActionType => ({
  type: AdminUserActionTypes.UPDATE_ADMIN_USERS,
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
    region_id,
    branch_id,
    country_ids,
    franchise_id
  },
});

export const deleteAdminUsers = (id: string): AdminUsersActionType => ({
  type: AdminUserActionTypes.DELETE_ADMIN_USERS,
  payload: { id },
});
