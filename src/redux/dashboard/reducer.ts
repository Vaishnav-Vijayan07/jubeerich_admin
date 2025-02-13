// constants
import { DashboardActionTypes } from "./constants";

const INIT_STATE = {
  dashboard: [],
  loading: false,
  error: {},
};

interface DashboardActionType {
  type: DashboardActionTypes.API_RESPONSE_SUCCESS | DashboardActionTypes.API_RESPONSE_ERROR | DashboardActionTypes.GET_DASHBOARD;
  payload: {
    actionType?: string;
    data?: any;
    error?: string;
  };
}

interface State {
  category?: any;
  loading?: boolean;
  value?: boolean;
}

const Dashboard = (state: State = INIT_STATE, action: DashboardActionType): any => {
  switch (action.type) {
    case DashboardActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case DashboardActionTypes.GET_DASHBOARD: {
          return {
            ...state,
            dashboard: action.payload.data,
            loading: false,
          };
        }
        default:
          return { ...state };
      }

    case DashboardActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case DashboardActionTypes.GET_DASHBOARD: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }

        default:
          return { ...state };
      }

    case DashboardActionTypes.GET_DASHBOARD:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default Dashboard;
