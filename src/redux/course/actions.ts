// constants

import { CourseActionTypes } from "./constants";

export interface CourseActionType {
  type:
    | CourseActionTypes.API_RESPONSE_SUCCESS
    | CourseActionTypes.API_RESPONSE_ERROR
    | CourseActionTypes.GET_COURSE
    | CourseActionTypes.ADD_COURSE
    | CourseActionTypes.UPDATE_COURSE
    | CourseActionTypes.DELETE_COURSE;
  payload: {} | string;
}

interface CourseData {
  type_name: string;
  description: string;
}

// common success
export const CourseApiResponseSuccess = (
  actionType: string,
  data: CourseData | {}
): CourseActionType => ({
  type: CourseActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const CourseApiResponseError = (
  actionType: string,
  error: string
): CourseActionType => ({
  type: CourseActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getCourse = (): CourseActionType => ({
  type: CourseActionTypes.GET_COURSE,
  payload: {},
});

export const addCourse = (
  course_name: string,
  course_description: string,
  course_type_id: number | string,
  stream_id: number | string,
  updated_by: string
): CourseActionType => ({
  type: CourseActionTypes.ADD_COURSE,
  payload: {
    course_name,
    course_description,
    course_type_id,
    stream_id,
    updated_by,
  },
});

export const updateCourse = (
  id: string,
  course_name: string,
  course_description: string,
  course_type_id: number | string,
  stream_id: number | string,
  updated_by: string
): CourseActionType => ({
  type: CourseActionTypes.UPDATE_COURSE,
  payload: {
    id,
    course_name,
    course_description,
    course_type_id,
    stream_id,
    updated_by,
  },
});

export const deleteCourse = (id: string): CourseActionType => ({
  type: CourseActionTypes.DELETE_COURSE,
  payload: { id },
});
