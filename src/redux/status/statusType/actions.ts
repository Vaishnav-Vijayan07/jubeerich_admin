// constants
import { StatusTypeActionTypes } from "./constants";

export interface StatusTypeActionType {
  type:
    | StatusTypeActionTypes.API_RESPONSE_SUCCESS
    | StatusTypeActionTypes.API_RESPONSE_ERROR
    | StatusTypeActionTypes.GET_STATUS_TYPE
    | StatusTypeActionTypes.ADD_STATUS_TYPE
    | StatusTypeActionTypes.UPDATE_STATUS_TYPE
    | StatusTypeActionTypes.DELETE_STATUS_TYPE;
  payload: {} | string;
}

interface StatusTypeData {
  id: string;
  type_name: string;
  priority: number;
}

// common success
export const StatusTypeApiResponseSuccess = (actionType: string, data: StatusTypeData | {}): StatusTypeActionType => ({
  type: StatusTypeActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const StatusTypeApiResponseError = (actionType: string, error: string): StatusTypeActionType => ({
  type: StatusTypeActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getStatusType = (): StatusTypeActionType => ({
  type: StatusTypeActionTypes.GET_STATUS_TYPE,
  payload: {},
});

export const addStatusType = (type_name: string, priority: number): StatusTypeActionType => ({
  type: StatusTypeActionTypes.ADD_STATUS_TYPE,
  payload: {
    type_name,
    priority,
  },
});

export const updateStatusType = (id: string, type_name: string, priority: number): StatusTypeActionType => ({
  type: StatusTypeActionTypes.UPDATE_STATUS_TYPE,
  payload: {
    id,
    type_name,
    priority,
  },
});

export const deleteStatusType = (id: string | number): StatusTypeActionType => ({
  type: StatusTypeActionTypes.DELETE_STATUS_TYPE,
  payload: { id },
});
