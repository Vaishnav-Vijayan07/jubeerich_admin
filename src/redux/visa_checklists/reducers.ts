// apicore
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { APICore } from "../../helpers/api/apiCore";

// constants
import { VisaChecklistActionTypes } from "./constants";

const INIT_STATE = {
  visaChecklist: [],
  visaConfig: [],
  loading: false,
  initialloading: false,
  error: null,
  hasLoadedInitially: false,
};

interface VisaChecklistData {
  id: string;
  step_name: string;
  description: string;
  fields: Array<any>;
}

export interface VisaChecklistActionType {
  type:
    | VisaChecklistActionTypes.API_RESPONSE_SUCCESS
    | VisaChecklistActionTypes.API_RESPONSE_ERROR
    | VisaChecklistActionTypes.GET_VISA_CHECKLIST
    | VisaChecklistActionTypes.GET_VISA_CONFIG
    | VisaChecklistActionTypes.ADD_VISA_CHECKLIST
    | VisaChecklistActionTypes.UPDATE_VISA_CHECKLIST
    | VisaChecklistActionTypes.DELETE_VISA_CHECKLIST;
  payload: {
    actionType?: string;
    data?: VisaChecklistData | {};
    error?: string;
  };
}

interface State {
  visaChecklist?: VisaChecklistData | {};
  loading?: boolean;
  value?: boolean;
  hasLoadedInitially?: boolean;
}

const VisaChecklist = (state: State = INIT_STATE, action: VisaChecklistActionType): any => {
  switch (action.type) {
    case VisaChecklistActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case VisaChecklistActionTypes.GET_VISA_CHECKLIST: {
          return {
            ...state,
            visaChecklist: action.payload.data,
            loading: false,
            initialloading: false,
            hasLoadedInitially: true,
          };
        }

        case VisaChecklistActionTypes.GET_VISA_CONFIG: {
          return {
            ...state,
            visaConfig: action.payload.data,
            loading: false,
            initialloading: false,
            hasLoadedInitially: true,
          };
        }

        case VisaChecklistActionTypes.GET_VISA_CHECKLIST_BY_ID: {
          return {
            ...state,
            checklist: action.payload.data,
            loading: false,
          };
        }

        case VisaChecklistActionTypes.ADD_VISA_CHECKLIST: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case VisaChecklistActionTypes.UPDATE_VISA_CHECKLIST: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case VisaChecklistActionTypes.DELETE_VISA_CHECKLIST: {
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

    case VisaChecklistActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case VisaChecklistActionTypes.GET_VISA_CHECKLIST: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            visaChecklist: [],
            initialloading: false,
            hasLoadedInitially: true,
          };
        }
        case VisaChecklistActionTypes.GET_VISA_CONFIG: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            visaConfig: [],
            initialloading: false,
            hasLoadedInitially: true,
          };
        }
        case VisaChecklistActionTypes.ADD_VISA_CHECKLIST: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case VisaChecklistActionTypes.UPDATE_VISA_CHECKLIST: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case VisaChecklistActionTypes.DELETE_VISA_CHECKLIST: {
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

    case VisaChecklistActionTypes.GET_VISA_CHECKLIST:
      return { ...state, loading: true, initialloading: !state.hasLoadedInitially };

    case VisaChecklistActionTypes.GET_VISA_CONFIG:
      return { ...state, loading: true, initialloading: !state.hasLoadedInitially };
    case VisaChecklistActionTypes.ADD_VISA_CHECKLIST:
      return { ...state, loading: true };
    case VisaChecklistActionTypes.UPDATE_VISA_CHECKLIST:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default VisaChecklist;
