import { showErrorAlert, showSuccessAlert } from "../../constants";
import { FlagActionTypes } from "./constants";

const INIT_STATE = {
  flags: [],
  flagById: null,
  loading: false,
  initialLoading: false,
  error: null,
  hasLoadedInitially: false,
};

interface FlagData {
  id: string;
  flag_name: string;
  flag_description: string;
  color: string;
  updated_by: string;
}

interface FlagActionType {
  type:
    | FlagActionTypes.API_RESPONSE_SUCCESS
    | FlagActionTypes.API_RESPONSE_ERROR
    | FlagActionTypes.GET_FLAG
    | FlagActionTypes.GET_FLAG_BY_ID
    | FlagActionTypes.ADD_FLAG
    | FlagActionTypes.UPDATE_FLAG
    | FlagActionTypes.DELETE_FLAG;
  payload: {
    actionType?: string;
    data?: FlagData | {};
    error?: string;
  };
}

const Flag = (state: any = INIT_STATE, action: FlagActionType) => {
  switch (action.type) {
    case FlagActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case FlagActionTypes.GET_FLAG: {
          return {
            ...state,
            flags: action.payload.data,
            loading: false,
            initialLoading: false,
            hasLoadedInitially: true,
          };
        }

        case FlagActionTypes.GET_FLAG_BY_ID: {
          return {
            ...state,
            flagById: action.payload.data,
            loading: false,
            initialLoading: false,
          };
        }

        case FlagActionTypes.ADD_FLAG: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case FlagActionTypes.UPDATE_FLAG: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case FlagActionTypes.DELETE_FLAG: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        default:
          return { ...state };
      }

    case FlagActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case FlagActionTypes.GET_FLAG: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
            hasLoadedInitially: true,
          };
        }
        case FlagActionTypes.GET_FLAG_BY_ID: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case FlagActionTypes.ADD_FLAG: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case FlagActionTypes.UPDATE_FLAG: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case FlagActionTypes.DELETE_FLAG: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        default:
          return { ...state };
      }

    case FlagActionTypes.GET_FLAG:
      return { ...state, loading: true, initialLoading: !state.hasLoadedInitially };
    case FlagActionTypes.GET_FLAG_BY_ID:
      return { ...state, loading: true };
    case FlagActionTypes.ADD_FLAG:
      return { ...state, loading: true };
    case FlagActionTypes.UPDATE_FLAG:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default Flag;
