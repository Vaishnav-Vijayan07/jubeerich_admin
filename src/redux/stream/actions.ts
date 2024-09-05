import { StreamActionTypes } from "./constants";

// constants

export interface StreamActionType {
  type:
    | StreamActionTypes.API_RESPONSE_SUCCESS
    | StreamActionTypes.API_RESPONSE_ERROR
    | StreamActionTypes.GET_STREAM
    | StreamActionTypes.ADD_STREAM
    | StreamActionTypes.UPDATE_STREAM
    | StreamActionTypes.DELETE_STREAM;
  payload: {} | string;
}

type StreamData = {
  id: string | number;
  stream_name: string;
  stream_description: string;
  updated_by: string | number; // assuming 'updated_by' can be a user ID (number) or a username (string)
};

// common success
export const StreamApiResponseSuccess = (
  actionType: string,
  data: StreamData | {}
): StreamActionType => ({
  type: StreamActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const StreamApiResponseError = (
  actionType: string,
  error: string
): StreamActionType => ({
  type: StreamActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getStream = (): StreamActionType => ({
  type: StreamActionTypes.GET_STREAM,
  payload: {},
});

export const addStream = (
  stream_name: string,
  stream_description: string,
  updated_by: string | null
): StreamActionType => ({
  type: StreamActionTypes.ADD_STREAM,
  payload: {
    stream_name,
    stream_description,
    updated_by,
  },
});

export const updateStream = (
  id: string,
  stream_name: string,
  stream_description: string,
  updated_by: string | null
): StreamActionType => ({
  type: StreamActionTypes.UPDATE_STREAM,
  payload: {
    id,
    stream_name,
    stream_description,
    updated_by,
  },
});

export const deleteStream = (id: string): StreamActionType => ({
  type: StreamActionTypes.DELETE_STREAM,
  payload: { id },
});
