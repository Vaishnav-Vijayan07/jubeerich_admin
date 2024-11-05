// apicore
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { APICore } from "../../helpers/api/apiCore";

// constants
import { StatusActionTypes } from "./constants";

const INIT_STATE = {
  status: [],
  statusConfig: [],
  loading: false,
  error: null,
  initialloading: false,
  initialConfigloading: false,
  hasLoadedInitially: false,
  hasConfigLoadedInitially: false,
};

interface StatusData {
  id: string;
  status_name: string;
  status_description: string;
  color: string;
  updated_by: string;
  is_substatus: number;
}

export interface StatusActionType {
  type:
    | StatusActionTypes.API_RESPONSE_SUCCESS
    | StatusActionTypes.API_RESPONSE_ERROR
    | StatusActionTypes.GET_STATUS
    | StatusActionTypes.ADD_STATUS
    | StatusActionTypes.GET_STATUS_CONFIG
    | StatusActionTypes.UPDATE_STATUS
    | StatusActionTypes.DELETE_STATUS;
  payload: {
    actionType?: string;
    data?: StatusData | {};
    error?: string;
  };
}

interface State {
  l?: StatusData | {};
  loading?: boolean;
  value?: boolean;
  hasLoadedInitially?: boolean;
  hasConfigLoadedInitially: boolean;
}

const Status = (state: State = INIT_STATE, action: StatusActionType): any => {
  switch (action.type) {
    case StatusActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case StatusActionTypes.GET_STATUS: {
          return {
            ...state,
            status: action.payload.data,
            loading: false,
            initialloading: false,
            hasLoadedInitially: true,
          };
        }

        case StatusActionTypes.GET_STATUS_CONFIG: {
          return {
            ...state,
            statusConfig: action.payload.data,
            initialConfigloading: false,
            loading: false,
            initialloading: false,
            hasConfigLoadedInitially: true,
          };
        }

        case StatusActionTypes.ADD_STATUS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case StatusActionTypes.UPDATE_STATUS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case StatusActionTypes.DELETE_STATUS: {
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

    case StatusActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case StatusActionTypes.GET_STATUS: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
            hasLoadedInitially: false,
          };
        }

        case StatusActionTypes.GET_STATUS_CONFIG: {
          return {
            ...state,
            error: action.payload.error,
            initialConfigloading: false,
            loading: false,
            initialloading: false,
            hasConfigLoadedInitially: false,
          };
        }
        case StatusActionTypes.ADD_STATUS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case StatusActionTypes.UPDATE_STATUS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case StatusActionTypes.DELETE_STATUS: {
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

    case StatusActionTypes.GET_STATUS:
      return { ...state, loading: true, initialloading: !state.hasLoadedInitially };
    case StatusActionTypes.GET_STATUS_CONFIG:
      return { ...state, loading: true, initialConfigloading: !state.hasConfigLoadedInitially };
    case StatusActionTypes.ADD_STATUS:
      return { ...state, loading: true };
    case StatusActionTypes.UPDATE_STATUS:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default Status;
