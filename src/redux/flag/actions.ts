import { FlagActionTypes } from "./constants";

interface FlagActionType {
  type:
    | FlagActionTypes.API_RESPONSE_SUCCESS
    | FlagActionTypes.API_RESPONSE_ERROR
    | FlagActionTypes.GET_FLAG
    | FlagActionTypes.GET_FLAG_BY_ID
    | FlagActionTypes.ADD_FLAG
    | FlagActionTypes.UPDATE_FLAG
    | FlagActionTypes.DELETE_FLAG;
  payload: {} | string;
}

interface FlagData {
  id: string;
  region_name: string;
  region_description: string;
  color: string;
  updated_by: string;
}

export const flagApiResponseSuccess = (actionType: string, data: string) => ({
  type: FlagActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const flagApiResponseError = (actionType: string, error: string) => ({
  type: FlagActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getFlag = () => ({
  type: FlagActionTypes.GET_FLAG,
  payload: {},
});

export const getFlagById = (id: string) => ({
  type: FlagActionTypes.GET_FLAG_BY_ID,
  payload: { id },
});

export const addFlag = (
  flag_name: string,
  flag_description: string,
  color: string,
  updated_by: string
) => ({
  type: FlagActionTypes.ADD_FLAG,
  payload: {
    flag_name,
    flag_description,
    color,
    updated_by,
  },
});

export const updateFlag = (
  id: string,
  flag_name: string,
  flag_description: string,
  color: string,
  updated_by: string
) => ({
  type: FlagActionTypes.UPDATE_FLAG,
  payload: {
    id,
    flag_name,
    flag_description,
    color,
    updated_by,
  },
});

export const deleteFlag = (id: string) => ({
  type: FlagActionTypes.DELETE_FLAG,
  payload: { id },
});
