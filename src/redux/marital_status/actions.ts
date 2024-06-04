import { MaritalStatusActionTypes } from "./constants";

export const maritalStatusApiResponseSuccess = (
  actionType: string,
  data: string
) => ({
  type: MaritalStatusActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const maritalStatusApiResponseError = (
  actionType: string,
  error: string
) => ({
  type: MaritalStatusActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getMaritalStatus = () => ({
  type: MaritalStatusActionTypes.GET_MARITAL_STATUS,
  payload: {},
});

export const getMaritalStatusById = (id: string) => ({
  type: MaritalStatusActionTypes.GET_MARITAL_STATUS_BY_ID,
  payload: { id },
});

export const addMaritalStatus = (
  marital_status_name: string,
  marital_status_description: string,
  updated_by: string
) => ({
  type: MaritalStatusActionTypes.ADD_MARITAL_STATUS,
  payload: {
    marital_status_name,
    marital_status_description,
    updated_by,
  },
});

export const updateMaritalStatus = (
  id: string,
  marital_status_name: string,
  marital_status_description: string,
  updated_by: string
) => ({
  type: MaritalStatusActionTypes.UPDATE_MARITAL_STATUS,
  payload: {
    id,
    marital_status_name,
    marital_status_description,
    updated_by,
  },
});

export const deleteMaritalStatus = (id: string) => ({
  type: MaritalStatusActionTypes.DELETE_MARITAL_STATUS,
  payload: { id },
});
