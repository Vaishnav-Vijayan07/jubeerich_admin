import { showErrorAlert, showSuccessAlert } from "../../constants";
import { RegionActionTypes } from "./constants";

const INIT_STATE = {
  regions: [],
  regionById: null,
  loading: false,
  initialLoading: false,
  error: null,
};

interface RegionData {
  id: string;
  region_name: string;
  region_description: string;
  updated_by: string;
}

interface RegionActionType {
  type:
    | RegionActionTypes.API_RESPONSE_SUCCESS
    | RegionActionTypes.API_RESPONSE_ERROR
    | RegionActionTypes.GET_REGION
    | RegionActionTypes.GET_REGION_BY_ID
    | RegionActionTypes.ADD_REGION
    | RegionActionTypes.UPDATE_REGION
    | RegionActionTypes.DELETE_REGION;
  payload: {
    actionType?: string;
    data?: RegionData | {};
    error?: string;
  };
}

const Region = (state: any = INIT_STATE, action: RegionActionType) => {
  switch (action.type) {
    case RegionActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case RegionActionTypes.GET_REGION: {
          return {
            ...state,
            regions: action.payload.data,
            loading: false,
            initialLoading: false,
          };
        }

        case RegionActionTypes.GET_REGION_BY_ID: {
          return {
            ...state,
            regionById: action.payload.data,
            loading: false,
            initialLoading: false,
          };
        }

        case RegionActionTypes.ADD_REGION: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case RegionActionTypes.UPDATE_REGION: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case RegionActionTypes.DELETE_REGION: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        default:
          return { ...state };
      }

    case RegionActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case RegionActionTypes.GET_REGION: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case RegionActionTypes.GET_REGION_BY_ID: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case RegionActionTypes.ADD_REGION: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case RegionActionTypes.UPDATE_REGION: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case RegionActionTypes.DELETE_REGION: {
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

    case RegionActionTypes.GET_REGION:
      return { ...state, loading: true, initialLoading: true };
    case RegionActionTypes.GET_REGION_BY_ID:
      return { ...state, loading: true, initialLoading: true };
    case RegionActionTypes.ADD_REGION:
      return { ...state, loading: true };
    case RegionActionTypes.UPDATE_REGION:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default Region;
