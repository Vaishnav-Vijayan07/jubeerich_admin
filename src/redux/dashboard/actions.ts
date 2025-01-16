// constants
import { DashboardActionTypes } from "./constants";

export interface DashboardActionType {
  type: DashboardActionTypes.API_RESPONSE_SUCCESS | DashboardActionTypes.API_RESPONSE_ERROR | DashboardActionTypes.GET_DASHBOARD;
  payload: {} | string;
}

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

export const getDashboard = ({
  filterType,
  year,
  month,
  fromDate,
  toDate,
  country_id
}: {
  filterType?: string;
  year?: string;
  month?: string;
  fromDate?: string;
  toDate?: string;
  country_id?: string | number
} = {}): DashboardActionType => ({
  type: DashboardActionTypes.GET_DASHBOARD,
  payload: {
    filterType,
    year,
    month,
    fromDate,
    toDate,
    country_id
  },
});
