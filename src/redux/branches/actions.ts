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
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  contact_person_email: string;
  contact_person_name: string;
  contact_person_mobile: string;
  contact_person_designation: string;
  website: string;
  social_media: string;
  account_mail: string;
  support_mail: string;
  office_type: string;
  region_id: string;
  status: boolean;
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
  email: string,
  phone: string,
  address: string,
  city: string,
  state: string,
  country: string,
  pincode: string,
  contact_person_email: string,
  contact_person_name: string,
  contact_person_mobile: string,
  contact_person_designation: string,
  website: string,
  social_media: string,
  account_mail: string,
  support_mail: string,
  office_type: string,
  region_id: string,
  status: boolean,
  updated_by: string
): BranchActionType => ({
  type: BranchActionTypes.ADD_BRANCHES,
  payload: {
    branch_name,
    email,
    phone,
    address,
    city,
    state,
    country,
    pincode,
    contact_person_email,
    contact_person_name,
    contact_person_mobile,
    contact_person_designation,
    website,
    social_media,
    account_mail,
    support_mail,
    office_type,
    region_id,
    status,
    updated_by,
  },
});

export const updateBranches = (
  id: string,
  branch_name: string,
  email: string,
  phone: string,
  address: string,
  city: string,
  state: string,
  country: string,
  pincode: string,
  contact_person_email: string,
  contact_person_name: string,
  contact_person_mobile: string,
  contact_person_designation: string,
  website: string,
  social_media: string,
  account_mail: string,
  support_mail: string,
  office_type: string,
  region_id: string,
  status: boolean,
  updated_by: string
): BranchActionType => ({
  type: BranchActionTypes.UPDATE_BRANCHES,
  payload: {
    id,
    branch_name,
    email,
    phone,
    address,
    city,
    state,
    country,
    pincode,
    contact_person_email,
    contact_person_name,
    contact_person_mobile,
    contact_person_designation,
    website,
    social_media,
    account_mail,
    support_mail,
    office_type,
    region_id,
    status,
    updated_by,
  },
});

export const deleteBranches = (id: string): BranchActionType => ({
  type: BranchActionTypes.DELETE_BRANCHES,
  payload: { id },
});

export const setSessionStorageItem = (key: string, value: string) => ({
  type: BranchActionTypes.SET_BRANCH_ID,
  payload: { key, value },
});

export const fetchBranchIdFromSessionStorage = () => ({
  type: BranchActionTypes.FETCH_BRANCH_ID_FROM_SESSION_STORAGE,
});
