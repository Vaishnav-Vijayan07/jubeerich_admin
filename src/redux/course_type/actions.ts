// constants
import { CourseTypeActionTypes } from "./constants";

export interface CourseTypeActionType {
  type:
  | CourseTypeActionTypes.API_RESPONSE_SUCCESS
  | CourseTypeActionTypes.API_RESPONSE_ERROR
  | CourseTypeActionTypes.GET_COURSE_TYPE
  | CourseTypeActionTypes.ADD_COURSE_TYPE
  | CourseTypeActionTypes.UPDATE_COURSE_TYPE
  | CourseTypeActionTypes.DELETE_COURSE_TYPE;
  payload: {} | string;
}

interface CourseTypeData {
  type_name: string;
  description: string;
}

// common success
export const CourseTypeApiResponseSuccess = (
  actionType: string,
  data: CourseTypeData | {}
): CourseTypeActionType => ({
  type: CourseTypeActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const CourseTypeApiResponseError = (
  actionType: string,
  error: string
): CourseTypeActionType => ({
  type: CourseTypeActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getCourseType = (): CourseTypeActionType => ({
  type: CourseTypeActionTypes.GET_COURSE_TYPE,
  payload: {},
});

export const addCourseType = (
  type_name: string,
  description: string
): CourseTypeActionType => ({
  type: CourseTypeActionTypes.ADD_COURSE_TYPE,
  payload: {
    type_name,
    description
  },
});

export const updateCourseType = (
  id: string,
  type_name: string,
  description: string
): CourseTypeActionType => ({
  type: CourseTypeActionTypes.UPDATE_COURSE_TYPE,
  payload: {
    id,
    type_name,
    description
  },
});

export const deleteCourseType = (id: string): CourseTypeActionType => ({
  type: CourseTypeActionTypes.DELETE_COURSE_TYPE,
  payload: { id },
});