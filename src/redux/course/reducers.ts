// apicore
import { showErrorAlert, showSuccessAlert } from "../../constants";

// constants
import { CourseActionTypes } from "./constants";

const INIT_STATE = {
  course: [],
  loading: false,
  initialloading: false,
  error: null,
  hasLoadedInitially: false,
};

interface CourseData {
  id: string;
  type_name: string;
  description: string;
}

export interface CampusActionType {
  type:
    | CourseActionTypes.API_RESPONSE_SUCCESS
    | CourseActionTypes.API_RESPONSE_ERROR
    | CourseActionTypes.GET_COURSE
    | CourseActionTypes.ADD_COURSE
    | CourseActionTypes.UPDATE_COURSE
    | CourseActionTypes.DELETE_COURSE;
  payload: {
    actionType?: string;
    data?: CourseData | {};
    error?: string;
  };
}

interface State {
  course?: CourseData | {};
  loading?: boolean;
  value?: boolean;
  hasLoadedInitially?: boolean;
}

const Course = (state: State = INIT_STATE, action: CampusActionType): any => {
  switch (action.type) {
    case CourseActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case CourseActionTypes.GET_COURSE: {
          return {
            ...state,
            course: action.payload.data,
            loading: false,
            initialloading: false,
            hasLoadedInitially: true,
          };
        }
        case CourseActionTypes.ADD_COURSE: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case CourseActionTypes.UPDATE_COURSE: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case CourseActionTypes.DELETE_COURSE: {
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

    case CourseActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case CourseActionTypes.GET_COURSE: {
          return {
            ...state,
            error: action.payload.error,
            course: [],
            loading: false,
            initialloading: false,
            hasLoadedInitially: true,
          };
        }
        case CourseActionTypes.ADD_COURSE: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case CourseActionTypes.UPDATE_COURSE: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case CourseActionTypes.DELETE_COURSE: {
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

    case CourseActionTypes.GET_COURSE:
      return { ...state, loading: true, initialloading: !state.hasLoadedInitially };
    case CourseActionTypes.ADD_COURSE:
      return { ...state, loading: true };
    case CourseActionTypes.UPDATE_COURSE:
      return { ...state, loading: true };
    case CourseActionTypes.DELETE_COURSE:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default Course;
