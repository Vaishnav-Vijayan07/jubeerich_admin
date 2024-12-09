// constants
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { BranchActionTypes } from "./constants";

const INIT_STATE = {
  branches: [],
  branch_id: null,
  loading: false,
  initialLoading: false,
  error: null,
};

interface BranchData {
  id: string;
  branch_name: string;
  branch_address: string;
  branch_city: string;
  branch_country: string;
  currency: string;
  updated_by: string;
}

export interface BranchActionType {
  type:
    | BranchActionTypes.API_RESPONSE_SUCCESS
    | BranchActionTypes.API_RESPONSE_ERROR
    | BranchActionTypes.GET_BRANCHES
    | BranchActionTypes.ADD_BRANCHES
    | BranchActionTypes.UPDATE_BRANCHES
    | BranchActionTypes.DELETE_BRANCHES
    | BranchActionTypes.SET_BRANCH_ID
    | BranchActionTypes.FETCH_BRANCH_ID_FROM_SESSION_STORAGE;
  payload: {
    actionType?: string;
    key: string;
    value: string;
    data?: BranchData | {};
    error?: string;
  };
}

interface State {
  branches?: BranchData | {};
  loading?: boolean;
  initialLoading?: boolean;
  value?: boolean;
  hasLoadedInitially?: boolean;
}

const Branch = (state: State = INIT_STATE, action: BranchActionType): any => {
  switch (action.type) {
    case BranchActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case BranchActionTypes.GET_BRANCHES: {
          return {
            ...state,
            branches: action.payload.data,
            loading: false,
            initialLoading: false,
            hasLoadedInitially: true,
          };
        }
        case BranchActionTypes.ADD_BRANCHES: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialLoading: false,
          };
        }
        case BranchActionTypes.UPDATE_BRANCHES: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialLoading: false,
          };
        }
        case BranchActionTypes.DELETE_BRANCHES: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialLoading: false,
          };
        }
        default:
          return { ...state };
      }

    case BranchActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case BranchActionTypes.GET_BRANCHES: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            hasLoadedInitially: true,
          };
        }
        case BranchActionTypes.ADD_BRANCHES: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case BranchActionTypes.UPDATE_BRANCHES: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case BranchActionTypes.DELETE_BRANCHES: {
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

    case BranchActionTypes.SET_BRANCH_ID:
      const { key, value } = action.payload;

      sessionStorage.setItem(key, JSON.stringify(value));
      return {
        ...state,
      };

    case BranchActionTypes.FETCH_BRANCH_ID_FROM_SESSION_STORAGE:
      const branch_id = sessionStorage.getItem("branch_id");
      return {
        ...state,
        branch_id,
      };

    case BranchActionTypes.GET_BRANCHES:
      return { ...state, loading: true, initialLoading: !state.hasLoadedInitially };
    case BranchActionTypes.ADD_BRANCHES:
      return { ...state, loading: true };
    case BranchActionTypes.UPDATE_BRANCHES:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default Branch;
