// constants
import { SourceActionTypes } from "./constants";

export interface SourceActionType {
  type:
    | SourceActionTypes.API_RESPONSE_SUCCESS
    | SourceActionTypes.API_RESPONSE_ERROR
    | SourceActionTypes.GET_SOURCES
    | SourceActionTypes.ADD_SOURCES
    | SourceActionTypes.UPDATE_SOURCES
    | SourceActionTypes.DELETE_SOURCES;
  payload: {} | string;
}

interface SourceData {
  id: string;
  source_name: string;
  source_description: string;
  updated_by: string;
  status: string;
}

// common success
export const sourceApiResponseSuccess = (
  actionType: string,
  data: SourceData | {}
): SourceActionType => ({
  type: SourceActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const sourceApiResponseError = (
  actionType: string,
  error: string
): SourceActionType => ({
  type: SourceActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getSource = (): SourceActionType => ({
  type: SourceActionTypes.GET_SOURCES,
  payload: {},
});

export const addSource = (
  source_name: string,
  source_description: string,
  updated_by: string,
  lead_type_id: string
): SourceActionType => ({
  type: SourceActionTypes.ADD_SOURCES,
  payload: {
    source_name,
    source_description,
    updated_by,
    lead_type_id
  },
});

export const updateSource = (
  id: string,
  source_name: string,
  source_description: string,
  updated_by: string,
  lead_type_id: string
): SourceActionType => ({
  type: SourceActionTypes.UPDATE_SOURCES,
  payload: {
    id,
    source_name,
    source_description,
    updated_by,
    lead_type_id
  },
});

export const deleteSource = (id: string): SourceActionType => ({
  type: SourceActionTypes.DELETE_SOURCES,
  payload: { id },
});
