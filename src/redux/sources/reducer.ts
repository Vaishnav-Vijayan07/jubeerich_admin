// apicore
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { APICore } from "../../helpers/api/apiCore";

// constants
import { SourceActionTypes } from "./constants";

const INIT_STATE = {
  sources: [],
  loading: false,
  initialloading: false,
  error: null,
};

interface SourceData {
  id: string;
  source_name: string;
  source_description: string;
  updated_by: string;
  status: string;
  lead_type_id: string
}

export interface SourceActionType {
  type:
    | SourceActionTypes.API_RESPONSE_SUCCESS
    | SourceActionTypes.API_RESPONSE_ERROR
    | SourceActionTypes.GET_SOURCES
    | SourceActionTypes.ADD_SOURCES
    | SourceActionTypes.UPDATE_SOURCES
    | SourceActionTypes.DELETE_SOURCES;
  payload: {
    actionType?: string;
    data?: SourceData | {};
    error?: string;
  };
}

interface State {
  sources?: SourceData | {};
  loading?: boolean;
  value?: boolean;
}

const Sources = (state: State = INIT_STATE, action: SourceActionType): any => {
  switch (action.type) {
    case SourceActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case SourceActionTypes.GET_SOURCES: {
          return {
            ...state,
            sources: action.payload.data,
            loading: false,
            initialloading: false,
          };
        }
        case SourceActionTypes.ADD_SOURCES: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case SourceActionTypes.UPDATE_SOURCES: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case SourceActionTypes.DELETE_SOURCES: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            // sources: action.payload.data,
            loading: false,
            initialloading: false,
          };
        }
        default:
          return { ...state };
      }

    case SourceActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case SourceActionTypes.GET_SOURCES: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case SourceActionTypes.ADD_SOURCES: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case SourceActionTypes.UPDATE_SOURCES: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case SourceActionTypes.DELETE_SOURCES: {
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

    case SourceActionTypes.GET_SOURCES:
      return { ...state, loading: true, initialloading: true };
    case SourceActionTypes.ADD_SOURCES:
      return { ...state, loading: true, initialloading: true };
    case SourceActionTypes.UPDATE_SOURCES:
      return { ...state, loading: true, initialloading: true };
    default:
      return { ...state };
  }
};

export default Sources;
