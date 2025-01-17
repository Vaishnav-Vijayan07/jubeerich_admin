// constants
import { CampusActionTypes } from "./constants";

export interface CampusActionType {
  type:
    | CampusActionTypes.API_RESPONSE_SUCCESS
    | CampusActionTypes.API_RESPONSE_ERROR
    | CampusActionTypes.GET_CAMPUS
    | CampusActionTypes.ADD_CAMPUS
    | CampusActionTypes.UPDATE_CAMPUS
    | CampusActionTypes.GET_CAMPUS_COURSES
    | CampusActionTypes.CONFIGURE_COURSES
    | CampusActionTypes.DELETE_CONFIGURE_COURSES
    | CampusActionTypes.DELETE_CAMPUS;
  payload: {} | string;
}

interface CampusData {
  campus_name: string;
  location: string;
  university_id: string;
  operation: string;
  courses: { course_fee: string; application_fee: string; course_link: string; course_id: string | number }[];
}

// common success
export const CampusApiResponseSuccess = (actionType: string, data: CampusData | {}): CampusActionType => ({
  type: CampusActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const CampusApiResponseError = (actionType: string, error: string): CampusActionType => ({
  type: CampusActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getCampus = (): CampusActionType => ({
  type: CampusActionTypes.GET_CAMPUS,
  payload: {},
});

export const addCampus = (
  campus_name: string,
  location: string,
  university_id: string
  // courses: { course_fee: string; application_fee: string; course_link: string; course_id: string | number }[]
): CampusActionType => ({
  type: CampusActionTypes.ADD_CAMPUS,
  payload: {
    campus_name,
    location,
    university_id,
  },
});

export const updateCampus = (
  id: string,
  campus_name: string,
  location: string,
  university_id: string
  // courses: { course_fee: string; application_fee: string; course_link: string; course_id: string | number }[]
): CampusActionType => ({
  type: CampusActionTypes.UPDATE_CAMPUS,
  payload: {
    id,
    campus_name,
    location,
    university_id,
  },
});

export const deleteCampus = (id: string): CampusActionType => ({
  type: CampusActionTypes.DELETE_CAMPUS,
  payload: { id },
});

export const deleteCourseConfiguration = (campus_id: string, course_id: string | number): CampusActionType => ({
  type: CampusActionTypes.DELETE_CONFIGURE_COURSES,
  payload: { campus_id, course_id },
});

export const getCampusCourses = (campus_id: string | undefined): CampusActionType => ({
  type: CampusActionTypes.GET_CAMPUS_COURSES,
  payload: { campus_id },
});

export const configureCourses = (
  campus_id: string,
  course_fee: string,
  application_fee: string,
  course_link: string,
  course_id: string | number,
  operation: string
): CampusActionType => ({
  type: CampusActionTypes.CONFIGURE_COURSES,
  payload: {
    campus_id,
    course_fee,
    application_fee,
    course_link,
    course_id,
    operation
  },
});
