import { OfficeTypesActionTypes } from "./constants";

export interface OfficeTypesActionType {
  type:
    | OfficeTypesActionTypes.API_RESPONSE_SUCCESS
    | OfficeTypesActionTypes.API_RESPONSE_ERROR
    | OfficeTypesActionTypes.GET_OFFICE_TYPE
    | OfficeTypesActionTypes.GET_OFFICE_TYPE_BY_ID
    | OfficeTypesActionTypes.ADD_OFFICE_TYPE
    | OfficeTypesActionTypes.UPDATE_OFFICE_TYPE
    | OfficeTypesActionTypes.DELETE_OFFICE_TYPE;
  payload: {} | string;
}

interface OfficeTypesData {
  id: string;
  office_type_name: string;
  office_type_description: string;
  updated_by: string;
}

export const OfficeTypesApiResponseSuccess = (
  actionType: string,
  data: string
): OfficeTypesActionType => ({
  type: OfficeTypesActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const OfficeTypesApiResponseError = (
  actionType: string,
  error: string
): OfficeTypesActionType => ({
  type: OfficeTypesActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getOfficeTypeData = (): OfficeTypesActionType => ({
  type: OfficeTypesActionTypes.GET_OFFICE_TYPE,
  payload: {},
});

export const getOfficeTypeDataById = (id: string): OfficeTypesActionType => ({
  type: OfficeTypesActionTypes.GET_OFFICE_TYPE_BY_ID,
  payload: { id },
});

export const deleteOfficeTypeData = (id: string): OfficeTypesActionType => ({
  type: OfficeTypesActionTypes.DELETE_OFFICE_TYPE,
  payload: { id },
});

export const addOfficeTypeData = (
  office_type_name: string,
  office_type_description: string,
  updated_by: string
): OfficeTypesActionType => ({
  type: OfficeTypesActionTypes.ADD_OFFICE_TYPE,
  payload: { office_type_description, office_type_name, updated_by },
});

export const updateOfficeTypeData = (
  id: string,
  office_type_name: string,
  office_type_description: string,
  updated_by: string
): OfficeTypesActionType => ({
  type: OfficeTypesActionTypes.UPDATE_OFFICE_TYPE,
  payload: { id, office_type_description, office_type_name, updated_by },
});
