// apicore
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { APICore } from "../../helpers/api/apiCore";

// constants
import { HistoryActionTypes } from "./constants";

const INIT_STATE = {
  history: [],
  leadHistory: [],
  loading: false,
  error: {},
};

interface HistoryData {
  id: string;
  lead_id: string;
  status_id: string;
  action_id: string;
  executive_id: string;
  date: string;
  status: string;
  change_to: string;
  checklist: string;
  comment: string;
  price: string;
  follow_up_date: string;
}

export interface HistoryActionType {
  type:
    | HistoryActionTypes.API_RESPONSE_SUCCESS
    | HistoryActionTypes.API_RESPONSE_ERROR
    | HistoryActionTypes.GET_HISTORY
    | HistoryActionTypes.GET_HISTORY_BY_LEAD_ID
    | HistoryActionTypes.ADD_HISTORY
    | HistoryActionTypes.UPDATE_HISTORY
    | HistoryActionTypes.DELETE_HISTORY;
  payload: {
    actionType?: string;
    data?: HistoryData | {};
    error?: string;
  };
}

interface State {
  history?: HistoryData | {};
  loading?: boolean;
  value?: boolean;
}

const History = (state: State = INIT_STATE, action: HistoryActionType): any => {
  switch (action.type) {
    case HistoryActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case HistoryActionTypes.GET_HISTORY: {
          return {
            ...state,
            history: action.payload.data,
            loading: false,
          };
        }
        case HistoryActionTypes.GET_HISTORY_BY_LEAD_ID: {
          return {
            ...state,
            leadHistory: action.payload.data,
            loading: false,
          };
        }
        case HistoryActionTypes.ADD_HISTORY: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case HistoryActionTypes.UPDATE_HISTORY: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case HistoryActionTypes.DELETE_HISTORY: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            // sources: action.payload.data,
            loading: false,
          };
        }
        default:
          return { ...state };
      }

    case HistoryActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case HistoryActionTypes.GET_HISTORY: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case HistoryActionTypes.ADD_HISTORY: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case HistoryActionTypes.UPDATE_HISTORY: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case HistoryActionTypes.DELETE_HISTORY: {
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

    case HistoryActionTypes.GET_HISTORY:
      return { ...state, loading: true };
    case HistoryActionTypes.ADD_HISTORY:
      return { ...state, loading: true };
    case HistoryActionTypes.UPDATE_HISTORY:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default History;
