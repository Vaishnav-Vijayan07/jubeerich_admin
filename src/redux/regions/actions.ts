import { RegionActionTypes } from "./constants";

interface RegionActionType {
  type:
    | RegionActionTypes.API_RESPONSE_SUCCESS
    | RegionActionTypes.API_RESPONSE_ERROR
    | RegionActionTypes.GET_REGION
    | RegionActionTypes.GET_REGION_BY_ID
    | RegionActionTypes.ADD_REGION
    | RegionActionTypes.UPDATE_REGION
    | RegionActionTypes.DELETE_REGION;
  payload: {} | string;
}

interface RegionData {
  id: string;
  region_name: string;
  region_description: string;
  updated_by: string;
}

export const regionApiResponseSuccess = (actionType: string, data: string) => ({
  type: RegionActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const regionApiResponseError = (actionType: string, error: string) => ({
  type: RegionActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getRegion = () => ({
  type: RegionActionTypes.GET_REGION,
  payload: {},
});

export const getRegionById = (id: string) => ({
  type: RegionActionTypes.GET_REGION_BY_ID,
  payload: { id },
});

export const addRegion = (
  region_name: string,
  region_description: string,
  updated_by: string
) => ({
  type: RegionActionTypes.ADD_REGION,
  payload: {
    region_name,
    region_description,
    updated_by,
  },
});

export const updateRegion = (
  id: string,
  region_name: string,
  region_description: string,
  updated_by: string
) => ({
  type: RegionActionTypes.UPDATE_REGION,
  payload: {
    id,
    region_name,
    region_description,
    updated_by,
  },
});

export const deleteRegion = (id: string) => ({
  type: RegionActionTypes.DELETE_REGION,
  payload: { id },
});
