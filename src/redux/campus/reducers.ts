// apicore
import { stat } from "fs";
import { showErrorAlert, showSuccessAlert } from "../../constants";

// constants
import { CampusActionTypes } from "./constants";

const INIT_STATE = {
  campus: [],
  loading: false,
  initialloading: false,
  error: null,
  hasLoadedInitially: false,
};

interface CampusData {
  id: string;
  campus_name: string;
  location: string;
  university_id: string;
}

export interface CampusActionType {
  type:
  | CampusActionTypes.API_RESPONSE_SUCCESS
  | CampusActionTypes.API_RESPONSE_ERROR
  | CampusActionTypes.GET_CAMPUS
  | CampusActionTypes.ADD_CAMPUS
  | CampusActionTypes.UPDATE_CAMPUS
  | CampusActionTypes.DELETE_CAMPUS;
  payload: {
    actionType?: string;
    data?: CampusData | {};
    error?: string;
  };
}

interface State {
  campus?: CampusData | {};
  loading?: boolean;
  value?: boolean;
  hasLoadedInitially: boolean;
}

const Campus = (state: State = INIT_STATE, action: CampusActionType): any => {
  switch (action.type) {
    case CampusActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case CampusActionTypes.GET_CAMPUS: {
          return {
            ...state,
            campus: action.payload.data,
            loading: false,
            initialloading: false,
            hasLoadedInitially: true,
          };
        }
        case CampusActionTypes.ADD_CAMPUS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case CampusActionTypes.UPDATE_CAMPUS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case CampusActionTypes.DELETE_CAMPUS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        default:
          return { ...state };
      }

    case CampusActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case CampusActionTypes.GET_CAMPUS: {
          return {
            ...state,
            error: action.payload.error,
            campus: [],
            loading: false,
            initialloading: false,
            hasLoadedInitially: true,
          };
        }
        case CampusActionTypes.ADD_CAMPUS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case CampusActionTypes.UPDATE_CAMPUS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case CampusActionTypes.DELETE_CAMPUS: {
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

    case CampusActionTypes.GET_CAMPUS:
      return { ...state, loading: true, initialloading: !state.hasLoadedInitially };
    case CampusActionTypes.ADD_CAMPUS:
      return { ...state, loading: true };
    case CampusActionTypes.UPDATE_CAMPUS:
      return { ...state, loading: true };
    case CampusActionTypes.DELETE_CAMPUS:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default Campus;
