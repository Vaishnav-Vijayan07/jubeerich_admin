// constants
import { HistoryActionTypes } from "./constants";

export interface HistoryActionType {
  type:
    | HistoryActionTypes.API_RESPONSE_SUCCESS
    | HistoryActionTypes.API_RESPONSE_ERROR
    | HistoryActionTypes.GET_HISTORY
    | HistoryActionTypes.GET_HISTORY_BY_ID
    | HistoryActionTypes.GET_HISTORY_BY_LEAD_ID
    | HistoryActionTypes.ADD_HISTORY
    | HistoryActionTypes.UPDATE_HISTORY
    | HistoryActionTypes.DELETE_HISTORY;
  payload: {} | string;
}

interface historyData {
  lead_id: string;
  status_id: string;
  action_id: string;
  executive_id: string;
  date: string;
  status: string;
  change_to: string;
  checklist: string;
  comment: string;
  price: string;
  follow_up_date: string;
}

// common success
export const HistoryApiResponseSuccess = (actionType: string, data: historyData | {}): HistoryActionType => ({
  type: HistoryActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const HistoryApiResponseError = (actionType: string, error: string): HistoryActionType => ({
  type: HistoryActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getHistory = (): HistoryActionType => ({
  type: HistoryActionTypes.GET_HISTORY,
  payload: {},
});

export const getHistoryById = (id: string | undefined): HistoryActionType => ({
  type: HistoryActionTypes.GET_HISTORY_BY_ID,
  payload: { id },
});

export const getHistoryByLeadId = (lead_id: string | undefined): HistoryActionType => ({
  type: HistoryActionTypes.GET_HISTORY_BY_LEAD_ID,
  payload: { lead_id },
});

export const addHistory = (
  lead_id: string,
  status_id: string,
  action_id: string,
  executive_id: string,
  date: string,
  status: string,
  change_to: string,
  checklist: string,
  comments: string,
  price: string,
  follow_up_date: string
): HistoryActionType => ({
  type: HistoryActionTypes.ADD_HISTORY,
  payload: {
    lead_id,
    status_id,
    action_id,
    executive_id,
    date,
    status,
    change_to,
    checklist,
    comments,
    price,
    follow_up_date,
  },
});

export const updateHistory = (
  id: string,
  lead_id: string,
  status_id: string,
  action_id: string,
  executive_id: string,
  date: string,
  status: string,
  change_to: string,
  checklist: string,
  comments: string,
  price: string,
  follow_up_date: string
): HistoryActionType => ({
  type: HistoryActionTypes.UPDATE_HISTORY,
  payload: {
    id,
    lead_id,
    status_id,
    action_id,
    executive_id,
    date,
    status,
    change_to,
    checklist,
    comments,
    price,
    follow_up_date,
  },
});

export const deleteHistory = (itemId: string, status_id: string | undefined): HistoryActionType => ({
  type: HistoryActionTypes.DELETE_HISTORY,
  payload: { itemId, status_id },
});
