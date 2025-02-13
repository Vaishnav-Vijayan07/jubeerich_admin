// constants
import { KYCActionTypes } from "./constants";

export interface KYCActionType {
  type:
    | KYCActionTypes.API_RESPONSE_SUCCESS
    | KYCActionTypes.API_RESPONSE_ERROR
    | KYCActionTypes.GET_PENDING
    | KYCActionTypes.GET_REJECTED
    | KYCActionTypes.ASSIGN_APPLICATION_MEMBER
    | KYCActionTypes.AUTO_ASSIGN_APPLICATION_MEMBER
    | KYCActionTypes.GET_APPLICATION_BY_USER
    | KYCActionTypes.GET_APPROVED
    | KYCActionTypes.OPEN_APPROVAL_MODAL
    | KYCActionTypes.CLOSE_APPROVAL_MODAL
    | KYCActionTypes.TOGGLE_APPROVAL_MODAL;

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

export const getApplicationByUser = (status: string): KYCActionType => ({
  type: KYCActionTypes.GET_APPLICATION_BY_USER,
  payload: {
    status
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

export const assignToApplicationMember = (application_ids: any, user_id: any, type: string): KYCActionType => ({
  type: KYCActionTypes.ASSIGN_APPLICATION_MEMBER,
  payload: {
    application_ids,
    user_id,
    type,
  },
});

export const autoAssignToApplicationMember = (application_ids: any, type: string, users_list?: any): KYCActionType => ({
  type: KYCActionTypes.AUTO_ASSIGN_APPLICATION_MEMBER,
  payload: {
    application_ids,
    type,
    users_list
  },
});

export const toggleApprovalModal = (isOpen: boolean): KYCActionType => ({
  type: KYCActionTypes.TOGGLE_APPROVAL_MODAL,
  payload: {
    openModal: isOpen,
  },
});
