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

export const getDashboard = (): DashboardActionType => ({
  type: DashboardActionTypes.GET_DASHBOARD,
  payload: {},
});
