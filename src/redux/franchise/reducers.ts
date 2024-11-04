// constants
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { FranchiseActionTypes } from "./constants";

const INIT_STATE = {
  franchiseUsers: [],
  loading: false,
  error: null,
  initialLoading: false,
  hasLoadedInitially: false,
};

interface FranchiseUsersData {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  pocName: string;
}

export interface SourceActionType {
  type:
    | FranchiseActionTypes.API_RESPONSE_SUCCESS
    | FranchiseActionTypes.API_RESPONSE_ERROR
    | FranchiseActionTypes.GET_FRANCHISE
    | FranchiseActionTypes.ADD_FRANCHISE
    | FranchiseActionTypes.UPDATE_FRANCHISE
    | FranchiseActionTypes.ADD_FRANCHISE_ADMINUSER
    | FranchiseActionTypes.UPDATE_FRANCHISE_ADMINUSER
    | FranchiseActionTypes.DELETE_FRANCHISE;
  payload: {
    actionType?: string;
    data?: FranchiseUsersData | {};
    error?: string;
  };
}

interface State {
  franchiseUsers?: FranchiseUsersData | {};
  loading?: boolean;
  value?: boolean;
  hasLoadedInitially?: boolean
}

const Franchise = (
  state: State = INIT_STATE,
  action: SourceActionType
): any => {
  switch (action.type) {
    case FranchiseActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case FranchiseActionTypes.GET_FRANCHISE: {
          return {
            ...state,
            franchiseUsers: action.payload.data,
            loading: false,
            initialLoading: false,
            hasLoadedInitially: true,
          };
        }
        case FranchiseActionTypes.ADD_FRANCHISE: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            error: null,
            initialLoading: false,
          };
        }
        case FranchiseActionTypes.UPDATE_FRANCHISE: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            error: null,
            initialLoading: false,
          };
        }
        case FranchiseActionTypes.DELETE_FRANCHISE: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            error: null,
            initialLoading: false,
          };
        }
        case FranchiseActionTypes.ADD_FRANCHISE_ADMINUSER: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            error: null,
            initialLoading: false,
          };
        }
        case FranchiseActionTypes.UPDATE_FRANCHISE_ADMINUSER: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            error: null,
            initialLoading: false,
          };
        }
        default:
          return { ...state };
      }

    case FranchiseActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case FranchiseActionTypes.GET_FRANCHISE: {
          return {
            ...state,
            roles: action.payload.data,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
            hasLoadedInitially: true,
          };
        }
        case FranchiseActionTypes.ADD_FRANCHISE: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case FranchiseActionTypes.UPDATE_FRANCHISE: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case FranchiseActionTypes.DELETE_FRANCHISE: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case FranchiseActionTypes.ADD_FRANCHISE_ADMINUSER: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case FranchiseActionTypes.UPDATE_FRANCHISE_ADMINUSER: {
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

    case FranchiseActionTypes.GET_FRANCHISE:
      return { ...state, loading: true, initialLoading: !state.hasLoadedInitially };
    case FranchiseActionTypes.ADD_FRANCHISE:
      return { ...state, loading: true, error: null };
    case FranchiseActionTypes.UPDATE_FRANCHISE:
      return { ...state, loading: true, error: null };
    case FranchiseActionTypes.ADD_FRANCHISE_ADMINUSER:
      return { ...state, loading: true, error: null };
    case FranchiseActionTypes.UPDATE_FRANCHISE_ADMINUSER:
      return { ...state, loading: true, error: null };
    default:
      return { ...state };
  }
};

export default Franchise;
