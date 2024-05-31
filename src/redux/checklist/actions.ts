// constants
import { ChecklistActionTypes } from "./constants";

export interface ChecklistActionType {
  type:
    | ChecklistActionTypes.API_RESPONSE_SUCCESS
    | ChecklistActionTypes.API_RESPONSE_ERROR
    | ChecklistActionTypes.GET_CHECKLIST
    | ChecklistActionTypes.GET_CHECKLIST_BY_ID
    | ChecklistActionTypes.ADD_CHECKLIST
    | ChecklistActionTypes.UPDATE_CHECKLIST
    | ChecklistActionTypes.DELETE_CHECKLIST;
  payload: {} | string;
}

interface checklistData {
  id: string | undefined;
  checklist_title: string,
  checklist_description: string,
  priority: number,
  checklist_type: string,
  has_attachment: boolean,
  status_id: number
}

// common success
export const ChecklistApiResponseSuccess = (
  actionType: string,
  data: checklistData | {}
): ChecklistActionType => ({
  type: ChecklistActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const ChecklistApiResponseError = (
  actionType: string,
  error: string
): ChecklistActionType => ({
  type: ChecklistActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getChecklist = (): ChecklistActionType => ({
  type: ChecklistActionTypes.GET_CHECKLIST,
  payload: {},
});

export const getChecklistById = ( id: string | undefined): ChecklistActionType => ({
  type: ChecklistActionTypes.GET_CHECKLIST_BY_ID,
  payload: {id},
});

export const addChecklist = (
    checklist_title: string,
    checklist_description: string,
    priority: number,
    checklist_type: string,
    has_attachment: boolean,
    status_id: string | undefined
): ChecklistActionType => ({
  type: ChecklistActionTypes.ADD_CHECKLIST,
  payload: {
    checklist_title,
    checklist_description,
    priority,
    checklist_type,
    has_attachment,
    status_id
  },
});

export const updateCheklist = (
  id: string,
  checklist_title: string,
  checklist_description: string,
  priority: number,
  checklist_type: string,
  has_attachment: boolean,
  status_id: string | undefined
): ChecklistActionType => ({
  type: ChecklistActionTypes.UPDATE_CHECKLIST,
  payload: {
    id,
    checklist_title,
    checklist_description,
    priority,
    checklist_type,
    has_attachment,
    status_id
  },
});

export const deleteChecklist = (itemId: string, status_id: string | undefined): ChecklistActionType => ({
  type: ChecklistActionTypes.DELETE_CHECKLIST,
  payload: { itemId, status_id },
});
