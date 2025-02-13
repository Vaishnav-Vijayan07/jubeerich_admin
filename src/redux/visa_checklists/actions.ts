// constants
import { VisaChecklistActionTypes } from "./constants";

export interface VisaChecklistActionType {
  type:
    | VisaChecklistActionTypes.API_RESPONSE_SUCCESS
    | VisaChecklistActionTypes.API_RESPONSE_ERROR
    | VisaChecklistActionTypes.GET_VISA_CHECKLIST
    | VisaChecklistActionTypes.GET_VISA_CONFIG
    | VisaChecklistActionTypes.GET_VISA_CHECKLIST_BY_ID
    | VisaChecklistActionTypes.ADD_VISA_CHECKLIST
    | VisaChecklistActionTypes.UPDATE_VISA_CHECKLIST
    | VisaChecklistActionTypes.DELETE_VISA_CHECKLIST;
  payload: {} | string;
}

interface VisaChecklistData {
  id: string | undefined;
  step_name: string;
  description: string;
  fields: Array<any>;
}

// common success
export const VisaChecklistApiResponseSuccess = (actionType: string, data: VisaChecklistData | {}): VisaChecklistActionType => ({
  type: VisaChecklistActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const VisaChecklistApiResponseError = (actionType: string, error: string): VisaChecklistActionType => ({
  type: VisaChecklistActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getVisaChecklist = (): VisaChecklistActionType => ({
  type: VisaChecklistActionTypes.GET_VISA_CHECKLIST,
  payload: {},
});

export const getVisaConfiguration = (): VisaChecklistActionType => ({
  type: VisaChecklistActionTypes.GET_VISA_CONFIG,
  payload: {},
});

export const getVisaChecklistById = (id: string | undefined): VisaChecklistActionType => ({
  type: VisaChecklistActionTypes.GET_VISA_CHECKLIST_BY_ID,
  payload: { id },
});

export const addVisaChecklist = (step_name: string, description: string, fields: Array<any>): VisaChecklistActionType => ({
  type: VisaChecklistActionTypes.ADD_VISA_CHECKLIST,
  payload: {
    step_name,
    description,
    fields,
  },
});

export const updateVisaCheklist = (id: string, step_name: string, description: string, fields: Array<any>): VisaChecklistActionType => ({
  type: VisaChecklistActionTypes.UPDATE_VISA_CHECKLIST,
  payload: {
    id,
    step_name,
    description,
    fields,
  },
});

export const deleteVisaChecklist = (id: string): VisaChecklistActionType => ({
  type: VisaChecklistActionTypes.DELETE_VISA_CHECKLIST,
  payload: { id },
});
