// constants
import { KYCActionTypes } from "./constants";

export interface KYCActionType {
  type:
    | KYCActionTypes.API_RESPONSE_SUCCESS
    | KYCActionTypes.API_RESPONSE_ERROR
    | KYCActionTypes.GET_PENDING
    | KYCActionTypes.GET_REJECTED
    | KYCActionTypes.GET_APPROVED;

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

export const getPendingKYC = (type: string): KYCActionType => ({
  type: KYCActionTypes.GET_PENDING,
  payload: {
    type,
  },
});

export const getRejectedKYC = (): KYCActionType => ({
  type: KYCActionTypes.GET_REJECTED,
  payload: {},
});

export const getApprovedKYC = (): KYCActionType => ({
  type: KYCActionTypes.GET_APPROVED,
  payload: {},
});
