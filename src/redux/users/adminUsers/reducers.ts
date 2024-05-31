// apicore
import { showErrorAlert, showSuccessAlert } from "../../../constants";
import { APICore } from "../../../helpers/api/apiCore";

// constants
import { AdminUserActionTypes } from "./constants";

const INIT_STATE = {
  adminUsers: [],
  loading: false,
  error: null,
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
    | AdminUserActionTypes.GET_ADMIN_USERS
    | AdminUserActionTypes.ADD_ADMIN_USERS
    | AdminUserActionTypes.UPDATE_ADMIN_USERS
    | AdminUserActionTypes.DELETE_ADMIN_USERS;
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

const AdminUsers = (state: State = INIT_STATE, action: SourceActionType): any => {
  switch (action.type) {
    case AdminUserActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case AdminUserActionTypes.GET_ADMIN_USERS: {
          return {
            ...state,
            adminUsers: action.payload.data,
            loading: false,
          };
        }
        case AdminUserActionTypes.ADD_ADMIN_USERS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            error: null,
          };
        }
        case AdminUserActionTypes.UPDATE_ADMIN_USERS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            error: null,
          };
        }
        case AdminUserActionTypes.DELETE_ADMIN_USERS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            error: null,
          };
        }
        default:
          return { ...state };
      }

    case AdminUserActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case AdminUserActionTypes.GET_ADMIN_USERS: {
          return {
            ...state,
            roles: action.payload.data,
            error: action.payload.error,
            loading: false,
          };
        }
        case AdminUserActionTypes.ADD_ADMIN_USERS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case AdminUserActionTypes.UPDATE_ADMIN_USERS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case AdminUserActionTypes.DELETE_ADMIN_USERS: {
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

    case AdminUserActionTypes.GET_ADMIN_USERS:
      return { ...state, loading: true };
    case AdminUserActionTypes.ADD_ADMIN_USERS:
      return { ...state, loading: true, error: null };
    case AdminUserActionTypes.UPDATE_ADMIN_USERS:
      return { ...state, loading: true, error: null };
    default:
      return { ...state };
  }
};

export default AdminUsers;
