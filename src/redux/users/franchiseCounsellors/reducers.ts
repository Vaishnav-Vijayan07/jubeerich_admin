// apicore
import { showErrorAlert, showSuccessAlert } from "../../../constants";

// constants
import { AdminUserActionTypes } from "./constants";

const INIT_STATE = {
  adminUsers: [],
  loading: false,
  error: null,
  initialLoading: false,
};

interface AdminUsersData {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  password: string;
  branch_ids: string;
  updated_by: string;
  role_id: string;
}

export interface SourceActionType {
  type:
    | AdminUserActionTypes.API_RESPONSE_SUCCESS
    | AdminUserActionTypes.API_RESPONSE_ERROR
    | AdminUserActionTypes.GET_FRANCHISE_USERS
    | AdminUserActionTypes.ADD_FRANCHISE_USERS
    | AdminUserActionTypes.UPDATE_FRANCHISE_USERS
    | AdminUserActionTypes.DELETE_FRANCHISE_USERS;
  payload: {
    actionType?: string;
    data?: AdminUsersData | {};
    error?: string;
  };
}

interface State {
  adminUsers?: AdminUsersData | {};
  loading?: boolean;
  value?: boolean;
}

const FranchiseUsers = (state: State = INIT_STATE, action: SourceActionType): any => {
  switch (action.type) {
    case AdminUserActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case AdminUserActionTypes.GET_FRANCHISE_USERS: {
          return {
            ...state,
            adminUsers: action.payload.data,
            loading: false,
            initialLoading: false,
          };
        }
        case AdminUserActionTypes.ADD_FRANCHISE_USERS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            error: null,
            initialLoading: false,
          };
        }
        case AdminUserActionTypes.UPDATE_FRANCHISE_USERS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            error: null,
            initialLoading: false,
          };
        }
        case AdminUserActionTypes.DELETE_FRANCHISE_USERS: {
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

    case AdminUserActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case AdminUserActionTypes.GET_FRANCHISE_USERS: {
          return {
            ...state,
            roles: action.payload.data,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case AdminUserActionTypes.ADD_FRANCHISE_USERS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case AdminUserActionTypes.UPDATE_FRANCHISE_USERS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case AdminUserActionTypes.DELETE_FRANCHISE_USERS: {
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

    case AdminUserActionTypes.GET_FRANCHISE_USERS:
      return { ...state, loading: true , initialLoading: true,};
    case AdminUserActionTypes.ADD_FRANCHISE_USERS:
      return { ...state, loading: true, error: null };
    case AdminUserActionTypes.UPDATE_FRANCHISE_USERS:
      return { ...state, loading: true, error: null };
    default:
      return { ...state };
  }
};

export default FranchiseUsers;
