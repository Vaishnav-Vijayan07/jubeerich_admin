// constants
import { SubStatusActionTypes } from "./constants";

export interface SubStatusActionType {
    type:
    | SubStatusActionTypes.API_RESPONSE_SUCCESS
    | SubStatusActionTypes.API_RESPONSE_ERROR
    | SubStatusActionTypes.GET_SUB_STATUS
    | SubStatusActionTypes.ADD_SUB_STATUS
    | SubStatusActionTypes.UPDATE_SUB_STATUS
    | SubStatusActionTypes.DELETE_SUB_STATUS;
    payload: {} | string;
}

interface SubStatusData {
    id: string;
    status_id: string,
    next_status: string,
    updated_by: string,
}

// common success
export const SubStatusApiResponseSuccess = (
    actionType: string,
    data: SubStatusData | {}
): SubStatusActionType => ({
    type: SubStatusActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const SubStatusApiResponseError = (
    actionType: string,
    error: string
): SubStatusActionType => ({
    type: SubStatusActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const getSubStatus = (): SubStatusActionType => ({
    type: SubStatusActionTypes.GET_SUB_STATUS,
    payload: {},
});

export const addSubStatus = (
    status_id: string,
    next_status: string,
    updated_by: string,
): SubStatusActionType => ({
    type: SubStatusActionTypes.ADD_SUB_STATUS,
    payload: {
        status_id,
        next_status,
        updated_by,
    },
});

export const updateSubStatus = (
    id: string,
    status_id: string,
    next_status: string,
    updated_by: string,
): SubStatusActionType => ({
    type: SubStatusActionTypes.UPDATE_SUB_STATUS,
    payload: {
        id,
        status_id,
        next_status,
        updated_by,
    },
});

export const deleteSubStatus = (id: string): SubStatusActionType => ({
    type: SubStatusActionTypes.DELETE_SUB_STATUS,
    payload: { id },
});
