// apicore
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { APICore } from "../../helpers/api/apiCore";

// constants
import { ChecklistActionTypes } from "./constants";

const INIT_STATE = {
  checklist: [],
  loading: false,
  error: {},
};

interface checklistData {
  id: string;
  checklist_title: string;
  checklist_description: string;
  priority: number;
  checklist_type: string;
  has_attachment: boolean;
  status_id: number;
}

export interface StatusActionType {
  type:
    | ChecklistActionTypes.API_RESPONSE_SUCCESS
    | ChecklistActionTypes.API_RESPONSE_ERROR
    | ChecklistActionTypes.GET_CHECKLIST
    | ChecklistActionTypes.ADD_CHECKLIST
    | ChecklistActionTypes.UPDATE_CHECKLIST
    | ChecklistActionTypes.DELETE_CHECKLIST;
  payload: {
    actionType?: string;
    data?: checklistData | {};
    error?: string;
  };
}

interface State {
  l?: checklistData | {};
  loading?: boolean;
  value?: boolean;
}

const Status = (state: State = INIT_STATE, action: StatusActionType): any => {
  switch (action.type) {
    case ChecklistActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case ChecklistActionTypes.GET_CHECKLIST: {
          return {
            ...state,
            checklist: action.payload.data,
            loading: false,
          };
        }

        case ChecklistActionTypes.GET_CHECKLIST_BY_ID: {
          return {
            ...state,
            checklist: action.payload.data,
            loading: false,
          };
        }

        case ChecklistActionTypes.ADD_CHECKLIST: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case ChecklistActionTypes.UPDATE_CHECKLIST: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case ChecklistActionTypes.DELETE_CHECKLIST: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        default:
          return { ...state };
      }

    case ChecklistActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case ChecklistActionTypes.GET_CHECKLIST: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case ChecklistActionTypes.ADD_CHECKLIST: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case ChecklistActionTypes.UPDATE_CHECKLIST: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case ChecklistActionTypes.DELETE_CHECKLIST: {
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

    case ChecklistActionTypes.GET_CHECKLIST:
      return { ...state, loading: true };
    case ChecklistActionTypes.ADD_CHECKLIST:
      return { ...state, loading: true };
    case ChecklistActionTypes.UPDATE_CHECKLIST:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default Status;
