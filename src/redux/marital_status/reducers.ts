import { showErrorAlert, showSuccessAlert } from "../../constants";
import { MaritalStatusActionTypes } from "./constants";

const INIT_STATE = {
  maritalStatus: [],
  maritalStatusById: null,
  loading: false,
  initialLoading: false,
  error: null,
};

interface MaritalStatusData {
  id: string;
  marital_status_name: string;
  marital_status_description: string;
  updated_by: string;
}

interface MaritalStatusActionType {
  type:
    | MaritalStatusActionTypes.API_RESPONSE_SUCCESS
    | MaritalStatusActionTypes.API_RESPONSE_ERROR
    | MaritalStatusActionTypes.GET_MARITAL_STATUS
    | MaritalStatusActionTypes.GET_MARITAL_STATUS_BY_ID
    | MaritalStatusActionTypes.ADD_MARITAL_STATUS
    | MaritalStatusActionTypes.UPDATE_MARITAL_STATUS
    | MaritalStatusActionTypes.DELETE_MARITAL_STATUS;
  payload: {
    actionType?: string;
    data?: MaritalStatusData | {};
    error?: string;
  };
}

const MaritalStatus = (state: any = INIT_STATE, action: MaritalStatusActionType) => {
  switch (action.type) {
    case MaritalStatusActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case MaritalStatusActionTypes.GET_MARITAL_STATUS: {
          return {
            ...state,
            maritalStatus: action.payload.data,
            loading: false,
            initialLoading: false,
          };
        }

        case MaritalStatusActionTypes.GET_MARITAL_STATUS_BY_ID: {
          return {
            ...state,
            maritalStatusById: action.payload.data,
            loading: false,
            initialLoading: false,
          };
        }

        case MaritalStatusActionTypes.ADD_MARITAL_STATUS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case MaritalStatusActionTypes.UPDATE_MARITAL_STATUS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case MaritalStatusActionTypes.DELETE_MARITAL_STATUS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        default:
          return { ...state };
      }

    case MaritalStatusActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case MaritalStatusActionTypes.GET_MARITAL_STATUS: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case MaritalStatusActionTypes.GET_MARITAL_STATUS_BY_ID: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case MaritalStatusActionTypes.ADD_MARITAL_STATUS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case MaritalStatusActionTypes.UPDATE_MARITAL_STATUS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case MaritalStatusActionTypes.DELETE_MARITAL_STATUS: {
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

    case MaritalStatusActionTypes.GET_MARITAL_STATUS:
      return { ...state, loading: true, initialLoading: true };
    case MaritalStatusActionTypes.GET_MARITAL_STATUS_BY_ID:
      return { ...state, loading: true, initialLoading: true };
    case MaritalStatusActionTypes.ADD_MARITAL_STATUS:
      return { ...state, loading: true };
    case MaritalStatusActionTypes.UPDATE_MARITAL_STATUS:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default MaritalStatus;
