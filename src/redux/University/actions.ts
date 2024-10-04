// constants
import { UniversityActionTypes } from "./constants";

export interface UniversityActionType {
  type:
    | UniversityActionTypes.API_RESPONSE_SUCCESS
    | UniversityActionTypes.API_RESPONSE_ERROR
    | UniversityActionTypes.GET_UNIVERSITY
    | UniversityActionTypes.ADD_UNIVERSITY
    | UniversityActionTypes.UPDATE_UNIVERSITY
    | UniversityActionTypes.DELETE_UNIVERSITY;
  payload: {} | string;
}

interface UniversityData {
  university_name: string;
  location: string;
  country_id: string;
  website_url: string;
  image_url: string;
  portal_link: string;
  username: string;
  password: string;
  updated_by: string;
}

// common success
export const UniversityApiResponseSuccess = (actionType: string, data: UniversityData | {}): UniversityActionType => ({
  type: UniversityActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const UniversityApiResponseError = (actionType: string, error: string): UniversityActionType => ({
  type: UniversityActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getUniversity = (): UniversityActionType => ({
  type: UniversityActionTypes.GET_UNIVERSITY,
  payload: {},
});

export const addUniversity = (
  university_name: string,
  location: string,
  country_id: string,
  website_url: string,
  image_url: string,
  portal_link: string,
  username: string,
  password: string,
  updated_by: string
): UniversityActionType => ({
  type: UniversityActionTypes.ADD_UNIVERSITY,
  payload: {
    university_name,
    location,
    country_id,
    website_url,
    image_url,
    portal_link,
    username,
    password,
    updated_by,
  },
});

export const updateUniversity = (
  id: string,
  university_name: string,
  location: string,
  country_id: string,
  website_url: string,
  image_url: string,
  portal_link: string,
  username: string,
  password: string,
  updated_by: string
): UniversityActionType => ({
  type: UniversityActionTypes.UPDATE_UNIVERSITY,
  payload: {
    id,
    university_name,
    location,
    country_id,
    website_url,
    image_url,
    portal_link,
    username,
    password,
    updated_by,
  },
});

export const deleteUniversity = (id: string): UniversityActionType => ({
  type: UniversityActionTypes.DELETE_UNIVERSITY,
  payload: { id },
});
