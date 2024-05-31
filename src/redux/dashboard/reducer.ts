// constants
import { DashboardActionTypes } from "./constants";

const INIT_STATE = {
  dashboard: [],
  loading: false,
  error: {},
  success: false,
  message: false,
};

interface LeadStatistics {
  total_leads: number;
  open_leads: number;
  closed_leads: number;
}

interface StatisticsTypes {
  month: string;
  value: number;
}

interface MonthlyStatistics {
  total_leads: number;
  closed_leads: number;
  statistics: Array<StatisticsTypes>;
}

interface HistoryTypes {
  total_leads: number;
  total_spam: number;
  total_closed: number;
  spam: Array<StatisticsTypes>;
  closed: Array<StatisticsTypes>;
}

interface UsersTypes {
  id: number;
  name: string;
  avatar: string;
  role: string;
}

interface DashboardData {
  leads_statistics: LeadStatistics;
  monthly_statistics: MonthlyStatistics;
  leads_history: HistoryTypes;
  executive_users: Array<UsersTypes>;
  recently_closed_leads: any;
}

interface DashboardActionType {
  type: DashboardActionTypes.API_RESPONSE_SUCCESS | DashboardActionTypes.API_RESPONSE_ERROR | DashboardActionTypes.GET_DASHBOARD;
  payload: {
    actionType?: string;
    data?: DashboardData | {};
    error?: string;
  };
}

interface State {
  category?: DashboardData | {};
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
