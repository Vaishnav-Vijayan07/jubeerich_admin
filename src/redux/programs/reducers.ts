// apicore
import { showErrorAlert, showSuccessAlert } from "../../constants";

// constants
import { ProgramsActionTypes } from "./constants";

const INIT_STATE = {
  programs: [],
  loading: false,
  initialloading: false,
  error: null,
};

interface ProgramData {
  id: string;
  program_name: string;
  university_id: string;
  degree_level: string;
  duration: string;
  tuition_fees: string;
  currency: string;
}

export interface ProgramActionType {
  type:
    | ProgramsActionTypes.API_RESPONSE_SUCCESS
    | ProgramsActionTypes.API_RESPONSE_ERROR
    | ProgramsActionTypes.GET_PROGRAM
    | ProgramsActionTypes.ADD_PROGRAM
    | ProgramsActionTypes.UPDATE_PROGRAM
    | ProgramsActionTypes.DELETE_PROGRAM;
  payload: {
    actionType?: string;
    data?: ProgramData | {};
    error?: string;
  };
}

interface State {
  sources?: ProgramData | {};
  loading?: boolean;
  value?: boolean;
}

const Program = (
  state: State = INIT_STATE,
  action: ProgramActionType
): any => {
  switch (action.type) {
    case ProgramsActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case ProgramsActionTypes.GET_PROGRAM: {
          return {
            ...state,
            programs: action.payload.data,
            loading: false,
            initialloading: false,
          };
        }
        case ProgramsActionTypes.ADD_PROGRAM: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case ProgramsActionTypes.UPDATE_PROGRAM: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case ProgramsActionTypes.DELETE_PROGRAM: {
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

    case ProgramsActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case ProgramsActionTypes.GET_PROGRAM: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case ProgramsActionTypes.ADD_PROGRAM: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case ProgramsActionTypes.UPDATE_PROGRAM: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case ProgramsActionTypes.DELETE_PROGRAM: {
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

    case ProgramsActionTypes.GET_PROGRAM:
      return { ...state, loading: true, initialloading: true };
    case ProgramsActionTypes.ADD_PROGRAM:
      return { ...state, loading: true, initialloading: true };
    case ProgramsActionTypes.UPDATE_PROGRAM:
      return { ...state, loading: true, initialloading: true };
    default:
      return { ...state };
  }
};

export default Program;
