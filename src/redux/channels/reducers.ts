// apicore
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { APICore } from "../../helpers/api/apiCore";

// constants
import { ChannelsActionTypes } from "./constants";

const INIT_STATE = {
  channels: [],
  loading: false,
  initialloading: false,
  error: null,
  hasLoadedInitially: false,
};

interface ChannelData {
  id: string;
  source_id: string;
  channel_name: string;
  channel_description: string;
  updated_by: string;
}

export interface ChannelActionType {
  type:
    | ChannelsActionTypes.API_RESPONSE_SUCCESS
    | ChannelsActionTypes.API_RESPONSE_ERROR
    | ChannelsActionTypes.GET_CHANNELS
    | ChannelsActionTypes.ADD_CHANNELS
    | ChannelsActionTypes.UPDATE_CHANNELS
    | ChannelsActionTypes.DELETE_CHANNELS;
  payload: {
    actionType?: string;
    data?: ChannelData | {};
    error?: string;
  };
}

interface State {
  sources?: ChannelData | {};
  loading?: boolean;
  value?: boolean;
  hasLoadedInitially?: boolean;
}

const Channel = (state: State = INIT_STATE, action: ChannelActionType): any => {
  switch (action.type) {
    case ChannelsActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case ChannelsActionTypes.GET_CHANNELS: {
          return {
            ...state,
            channels: action.payload.data,
            loading: false,
            initialloading: false,
            hasLoadedInitially: true,
          };
        }
        case ChannelsActionTypes.ADD_CHANNELS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case ChannelsActionTypes.UPDATE_CHANNELS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case ChannelsActionTypes.DELETE_CHANNELS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        default:
          return { ...state };
      }

    case ChannelsActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case ChannelsActionTypes.GET_CHANNELS: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
            hasLoadedInitially: true,
          };
        }
        case ChannelsActionTypes.ADD_CHANNELS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case ChannelsActionTypes.UPDATE_CHANNELS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case ChannelsActionTypes.DELETE_CHANNELS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        default:
          return { ...state };
      }

    case ChannelsActionTypes.GET_CHANNELS:
      return { ...state, loading: true, initialloading: !state.hasLoadedInitially };
    case ChannelsActionTypes.ADD_CHANNELS:
      return { ...state, loading: true };
    case ChannelsActionTypes.UPDATE_CHANNELS:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default Channel;
