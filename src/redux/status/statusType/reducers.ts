// constants
import { showErrorAlert, showSuccessAlert } from "../../../constants";
import { StatusTypeActionTypes } from "./constants";

const INIT_STATE = {
  types: [],
  loading: false,
  error: null,
  initialloading: false,
  hasLoadedInitially: false,
};

interface StatusData {
  id: string;
  type_name: string;
  priority: number;
}

export interface StatusActionType {
  type:
    | StatusTypeActionTypes.API_RESPONSE_SUCCESS
    | StatusTypeActionTypes.API_RESPONSE_ERROR
    | StatusTypeActionTypes.GET_STATUS_TYPE
    | StatusTypeActionTypes.ADD_STATUS_TYPE
    | StatusTypeActionTypes.UPDATE_STATUS_TYPE
    | StatusTypeActionTypes.DELETE_STATUS_TYPE;
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
}

const StatusTypes = (state: State = INIT_STATE, action: StatusActionType): any => {
  switch (action.type) {
    case StatusTypeActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case StatusTypeActionTypes.GET_STATUS_TYPE: {
          return {
            ...state,
            types: action.payload.data,
            loading: false,
            initialloading: false,
            hasLoadedInitially: true,
          };
        }

        case StatusTypeActionTypes.ADD_STATUS_TYPE: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case StatusTypeActionTypes.UPDATE_STATUS_TYPE: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case StatusTypeActionTypes.DELETE_STATUS_TYPE: {
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

    case StatusTypeActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case StatusTypeActionTypes.GET_STATUS_TYPE: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
            hasLoadedInitially: false,
          };
        }

        case StatusTypeActionTypes.ADD_STATUS_TYPE: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case StatusTypeActionTypes.UPDATE_STATUS_TYPE: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case StatusTypeActionTypes.DELETE_STATUS_TYPE: {
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

    case StatusTypeActionTypes.GET_STATUS_TYPE:
      return { ...state, loading: true, initialloading: !state.hasLoadedInitially };
    case StatusTypeActionTypes.ADD_STATUS_TYPE:
      return { ...state, loading: true };
    case StatusTypeActionTypes.UPDATE_STATUS_TYPE:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default StatusTypes;
