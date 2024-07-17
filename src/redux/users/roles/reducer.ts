// apicore
import { showErrorAlert, showSuccessAlert } from "../../../constants";

// constants
import { RolesActionTypes } from "./constants";

const INIT_STATE = {
  roles: [],
  loading: false,
  initialLoading: false,
  error: null,
};

interface RolesData {
  id: string;
  power_ids: string;
  role_name: string;
  updated_by: string;
}

export interface SourceActionType {
  type:
  | RolesActionTypes.API_RESPONSE_SUCCESS
  | RolesActionTypes.API_RESPONSE_ERROR
  | RolesActionTypes.GET_ROLES
  | RolesActionTypes.ADD_ROLES
  | RolesActionTypes.UPDATE_ROLES
  | RolesActionTypes.DELETE_ROLES;
  payload: {
    actionType?: string;
    data?: RolesData | {};
    error?: string;
  };
}

interface State {
  roles?: RolesData | {};
  loading?: boolean;
  value?: boolean;
}

const Roles = (state: State = INIT_STATE, action: SourceActionType): any => {
  switch (action.type) {
    case RolesActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case RolesActionTypes.GET_ROLES: {
          return {
            ...state,
            roles: action.payload.data,
            loading: false,
            initialLoading: false,
          };
        }
        case RolesActionTypes.ADD_ROLES: {

          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialLoading: false,

          };
        }
        case RolesActionTypes.UPDATE_ROLES: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialLoading: false,

          };
        }
        case RolesActionTypes.DELETE_ROLES: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            // sources: action.payload.data,
            loading: false,
            initialLoading: false,

          };
        }
        default:
          return { ...state };
      }

    case RolesActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case RolesActionTypes.GET_ROLES: {
          return {
            ...state,
            roles: action.payload.data,
            error: action.payload.error,
            loading: false,
            initialLoading: false,

          };
        }
        case RolesActionTypes.ADD_ROLES: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,

          };
        }
        case RolesActionTypes.UPDATE_ROLES: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,

          };
        }
        case RolesActionTypes.DELETE_ROLES: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,

          };
        }
        default:
          return { ...state };
      }

    case RolesActionTypes.GET_ROLES:

      return { ...state, loading: true, initialLoading: true, };
    case RolesActionTypes.ADD_ROLES:
      return { ...state, loading: true };
    case RolesActionTypes.UPDATE_ROLES:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default Roles;
