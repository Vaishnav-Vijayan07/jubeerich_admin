// constants
import { KYCActionTypes } from "./constants";

export interface KYCActionType {
  type: KYCActionTypes.API_RESPONSE_SUCCESS | KYCActionTypes.API_RESPONSE_ERROR | KYCActionTypes.GET_PENDING;

  payload: {} | string;
}

// common success
export const KYCApiResponseSuccess = (actionType: string, data: any | {}): KYCActionType => ({
  type: KYCActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const KYCApiResponseError = (actionType: string, error: any): KYCActionType => ({
  type: KYCActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getPendingKYC = (): KYCActionType => ({
  type: KYCActionTypes.GET_PENDING,
  payload: {},
});
