// apicore
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { APICore } from "../../helpers/api/apiCore";

// constants
import { UniversityActionTypes } from "./constants";

const INIT_STATE = {
  universities: [],
  loading: false,
  initialloading: false,
  error: null,
};

interface UniversityData {
  id: string;
  university_name: string,
  location: string,
  country_id: string,
  website_url: string,
  image_url: string,
  updated_by: string
}

export interface UniversityActionType {
  type:
    | UniversityActionTypes.API_RESPONSE_SUCCESS
    | UniversityActionTypes.API_RESPONSE_ERROR
    | UniversityActionTypes.GET_UNIVERSITY
    | UniversityActionTypes.ADD_UNIVERSITY
    | UniversityActionTypes.UPDATE_UNIVERSITY
    | UniversityActionTypes.DELETE_UNIVERSITY;
  payload: {
    actionType?: string;
    data?: UniversityData | {};
    error?: string;
  };
}

interface State {
  sources?: UniversityData | {};
  loading?: boolean;
  value?: boolean;
}

const University = (state: State = INIT_STATE, action: UniversityActionType): any => {
  switch (action.type) {
    case UniversityActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case UniversityActionTypes.GET_UNIVERSITY: {
          return {
            ...state,
            universities: action.payload.data,
            loading: false,
            initialloading: false,
          };
        }
        case UniversityActionTypes.ADD_UNIVERSITY: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case UniversityActionTypes.UPDATE_UNIVERSITY: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case UniversityActionTypes.DELETE_UNIVERSITY: {
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

    case UniversityActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case UniversityActionTypes.GET_UNIVERSITY: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case UniversityActionTypes.ADD_UNIVERSITY: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case UniversityActionTypes.UPDATE_UNIVERSITY: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case UniversityActionTypes.DELETE_UNIVERSITY: {
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

    case UniversityActionTypes.GET_UNIVERSITY:
      return { ...state, loading: true, initialloading: true };
    case UniversityActionTypes.ADD_UNIVERSITY:
      return { ...state, loading: true, initialloading: true };
    case UniversityActionTypes.UPDATE_UNIVERSITY:
      return { ...state, loading: true, initialloading: true };
    default:
      return { ...state };
  }
};

export default University;
