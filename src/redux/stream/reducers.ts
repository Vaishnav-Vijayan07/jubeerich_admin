// apicore
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { StreamActionTypes } from "./constants";

// constants

const INIT_STATE = {
  stream: [],
  options: [],
  loading: false,
  initialloading: false,
  error: null,
  hasLoadedInitially: false,
};

type StreamData = {
  stream_name: string;
  stream_description: string;
  updated_by: string | number; // assuming 'updated_by' can be a user ID (number) or a username (string)
};

export interface CampusActionType {
  type:
    | StreamActionTypes.API_RESPONSE_SUCCESS
    | StreamActionTypes.API_RESPONSE_ERROR
    | StreamActionTypes.GET_STREAM
    | StreamActionTypes.ADD_STREAM
    | StreamActionTypes.UPDATE_STREAM
    | StreamActionTypes.DELETE_STREAM;
  payload: {
    actionType?: string;
    data?: any;
    formattedStreams?: any;
    error?: string;
  };
}

interface State {
  stream?: StreamData | {};
  loading?: boolean;
  value?: boolean;
  hasLoadedInitially?: boolean;
}

const Stream = (state: State = INIT_STATE, action: CampusActionType): any => {
  switch (action.type) {
    case StreamActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case StreamActionTypes.GET_STREAM: {
          return {
            ...state,
            stream: action.payload.data.data,
            options: action.payload.formattedStreams,
            loading: false,
            initialloading: false,
            hasLoadedInitially: true,
          };
        }
        case StreamActionTypes.ADD_STREAM: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case StreamActionTypes.UPDATE_STREAM: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case StreamActionTypes.DELETE_STREAM: {
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

    case StreamActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case StreamActionTypes.GET_STREAM: {
          return {
            ...state,
            error: action.payload.error,
            stream: [],
            loading: false,
            initialloading: false,
            hasLoadedInitially: true,
          };
        }
        case StreamActionTypes.ADD_STREAM: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case StreamActionTypes.UPDATE_STREAM: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case StreamActionTypes.DELETE_STREAM: {
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

    case StreamActionTypes.GET_STREAM:
      return { ...state, loading: true, initialloading: !state.hasLoadedInitially };
    case StreamActionTypes.ADD_STREAM:
      return { ...state, loading: true,  };
    case StreamActionTypes.UPDATE_STREAM:
      return { ...state, loading: true,  };
    case StreamActionTypes.DELETE_STREAM:
      return { ...state, loading: true,  };
    default:
      return { ...state };
  }
};

export default Stream;
