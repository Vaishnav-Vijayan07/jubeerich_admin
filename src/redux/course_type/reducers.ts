// apicore
import { showErrorAlert, showSuccessAlert } from "../../constants";

// constants
import { CourseTypeActionTypes } from "./constants";

const INIT_STATE = {
  courseType: [],
  loading: false,
  initialloading: false,
  error: null,
};

interface CourseTypeData {
  id: string;
  type_name: string;
  description: string;
}

export interface CampusActionType {
  type:
  | CourseTypeActionTypes.API_RESPONSE_SUCCESS
  | CourseTypeActionTypes.API_RESPONSE_ERROR
  | CourseTypeActionTypes.GET_COURSE_TYPE
  | CourseTypeActionTypes.ADD_COURSE_TYPE
  | CourseTypeActionTypes.UPDATE_COURSE_TYPE
  | CourseTypeActionTypes.DELETE_COURSE_TYPE;
  payload: {
    actionType?: string;
    data?: CourseTypeData | {};
    error?: string;
  };
}

interface State {
  courseType?: CourseTypeData | {};
  loading?: boolean;
  value?: boolean;
}

const CourseType = (state: State = INIT_STATE, action: CampusActionType): any => {
  switch (action.type) {
    case CourseTypeActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case CourseTypeActionTypes.GET_COURSE_TYPE: {
          return {
            ...state,
            courseType: action.payload.data,
            loading: false,
            initialloading: false,
          };
        }
        case CourseTypeActionTypes.ADD_COURSE_TYPE: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case CourseTypeActionTypes.UPDATE_COURSE_TYPE: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
            initialloading: false,
          };
        }
        case CourseTypeActionTypes.DELETE_COURSE_TYPE: {
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

    case CourseTypeActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case CourseTypeActionTypes.GET_COURSE_TYPE: {
          return {
            ...state,
            error: action.payload.error,
            courseType: [],
            loading: false,
            initialloading: false,
          };
        }
        case CourseTypeActionTypes.ADD_COURSE_TYPE: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case CourseTypeActionTypes.UPDATE_COURSE_TYPE: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case CourseTypeActionTypes.DELETE_COURSE_TYPE: {
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

    case CourseTypeActionTypes.GET_COURSE_TYPE:
      return { ...state, loading: true, initialloading: true };
    case CourseTypeActionTypes.ADD_COURSE_TYPE:
      return { ...state, loading: true, initialloading: true };
    case CourseTypeActionTypes.UPDATE_COURSE_TYPE:
      return { ...state, loading: true, initialloading: true };
    case CourseTypeActionTypes.DELETE_COURSE_TYPE:
      return { ...state, loading: true, initialloading: true };
    default:
      return { ...state };
  }
};

export default CourseType;
