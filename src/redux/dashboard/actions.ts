// constants
import { DashboardActionTypes, DashboardCountriesActionTypes } from "./constants";

export interface DashboardActionType {
  type: DashboardActionTypes.API_RESPONSE_SUCCESS | DashboardActionTypes.API_RESPONSE_ERROR | DashboardActionTypes.GET_DASHBOARD;
  payload: {} | string;
}

export interface DashboardCountriesActionType {
  type: DashboardCountriesActionTypes.API_RESPONSE_SUCCESS | DashboardCountriesActionTypes.API_RESPONSE_ERROR | DashboardCountriesActionTypes.GET_DASHBOARD_COUNTRIES;
  payload: {} | string;
}

export const DashboardCountriesApiResponseSuccess = (actionType: string, data: any | {}): DashboardCountriesActionType => ({
  type: DashboardCountriesActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
export const DashboardCountriesApiResponseError = (actionType: string, error: string): DashboardCountriesActionType => ({
  type: DashboardCountriesActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// common success
export const DashboardApiResponseSuccess = (actionType: string, data: any | {}): DashboardActionType => ({
  type: DashboardActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const DashboardApiResponseError = (actionType: string, error: string): DashboardActionType => ({
  type: DashboardActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getDashCountries = () => ({
  type: DashboardCountriesActionTypes.GET_DASHBOARD_COUNTRIES,
  payload: {},
});

export const getDashboard = ({
  filterType,
  year,
  month,
  fromDate,
  toDate,
  country_id,
}: {
  filterType?: string;
  year?: string;
  month?: string;
  fromDate?: string;
  toDate?: string;
  country_id?: string | number;
} = {}): DashboardActionType => ({
  type: DashboardActionTypes.GET_DASHBOARD,
  payload: {
    filterType,
    year,
    month,
    fromDate,
    toDate,
    country_id,
  },
});
