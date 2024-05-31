// constants
import { RolesActionTypes } from "./constants";

export interface RolesActionType {
  type:
    | RolesActionTypes.API_RESPONSE_SUCCESS
    | RolesActionTypes.API_RESPONSE_ERROR
    | RolesActionTypes.GET_ROLES
    | RolesActionTypes.ADD_ROLES
    | RolesActionTypes.UPDATE_ROLES
    | RolesActionTypes.DELETE_ROLES;
  payload: {} | string;
}

interface RolesData {
  id: string;
  power_ids: Array<string>;
  role_name: string;
  updated_by: string;
}

// common success
export const rolesApiResponseSuccess = (
  actionType: string,
  data: RolesData | {}
): RolesActionType => ({
  type: RolesActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const rolesApiResponseError = (
  actionType: string,
  error: string
): RolesActionType => ({
  type: RolesActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getRoles = (): RolesActionType => ({
  type: RolesActionTypes.GET_ROLES,
  payload: {},
});

export const addRoles = (
  role_name: string,
  power_ids: Array<string>,
  updated_by: string
): RolesActionType => ({
  type: RolesActionTypes.ADD_ROLES,
  payload: {
    role_name,
    power_ids,
    updated_by,
  },
});

export const updateRoles = (
  id: string,
  role_name: string,
  power_ids: Array<string>,
  updated_by: string
): RolesActionType => ({
  type: RolesActionTypes.UPDATE_ROLES,
  payload: {
    id,
    role_name,
    power_ids,
    updated_by,
  },
});

export const deleteRoles = (id: string): RolesActionType => ({
  type: RolesActionTypes.DELETE_ROLES,
  payload: { id },
});
