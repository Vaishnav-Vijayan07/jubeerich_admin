// constants
import { ChannelsActionTypes } from "./constants";

export interface ChannelActionType {
  type:
    | ChannelsActionTypes.API_RESPONSE_SUCCESS
    | ChannelsActionTypes.API_RESPONSE_ERROR
    | ChannelsActionTypes.GET_CHANNELS
    | ChannelsActionTypes.ADD_CHANNELS
    | ChannelsActionTypes.UPDATE_CHANNELS
    | ChannelsActionTypes.DELETE_CHANNELS;
  payload: {} | string;
}

interface ChannelData {
  id: string;
  source_id: string;
  channel_name: string;
  channel_description: string;
  updated_by: string;
}

// common success
export const ChannelApiResponseSuccess = (
  actionType: string,
  data: ChannelData | {}
): ChannelActionType => ({
  type: ChannelsActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const ChannelApiResponseError = (
  actionType: string,
  error: string
): ChannelActionType => ({
  type: ChannelsActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getChannel = (): ChannelActionType => ({
  type: ChannelsActionTypes.GET_CHANNELS,
  payload: {},
});

export const addChannel = (
  source_id: string,
  channel_name: string,
  channel_description: string,
  updated_by: string
): ChannelActionType => ({
  type: ChannelsActionTypes.ADD_CHANNELS,
  payload: {
    source_id,
    channel_name,
    channel_description,
    updated_by,
  },
});

export const updateChannel = (
  id: string,
  source_id: string,
  channel_name: string,
  channel_description: string,
  updated_by: string
): ChannelActionType => ({
  type: ChannelsActionTypes.UPDATE_CHANNELS,
  payload: {
    id,
    source_id,
    channel_name,
    channel_description,
    updated_by,
  },
});

export const deleteChannel = (id: string): ChannelActionType => ({
  type: ChannelsActionTypes.DELETE_CHANNELS,
  payload: { id },
});
