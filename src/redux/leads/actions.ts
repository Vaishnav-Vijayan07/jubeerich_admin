// constants
import { LeadsActionTypes } from "./constants";

export interface LeadsActionType {
  type:
    | LeadsActionTypes.API_RESPONSE_SUCCESS
    | LeadsActionTypes.API_RESPONSE_ERROR
    | LeadsActionTypes.GET_LEADS
    | LeadsActionTypes.GET_LEAD_USER
    | LeadsActionTypes.ADD_LEADS
    | LeadsActionTypes.UPDATE_LEADS
    | LeadsActionTypes.DELETE_LEADS;
  payload: {} | string;
}

interface LeadsData {
  id: string;
  name: string;
  email: string;
  phone: string;
  alternate_phone: string;
  enquiry: string;
  status: string;
  category_id: string;
  source_id: string;
  channel_id: string;
  user_id: string;
  branch: string;
  proposal_no: string;
  proposal_amount: string;
  proposal: string;
  company_name: string;
  country: string;
  flag_id: string;
  branch_id: string;
  lead_received_date: string | null
}

// common success
export const LeadsApiResponseSuccess = (actionType: string, data: LeadsData | {}): LeadsActionType => ({
  type: LeadsActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const LeadsApiResponseError = (actionType: string, error: string): LeadsActionType => ({
  type: LeadsActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getLead = (): LeadsActionType => ({
  type: LeadsActionTypes.GET_LEADS,
  payload: {},
});

export const getLeadUser = (): LeadsActionType => ({
  type: LeadsActionTypes.GET_LEAD_USER,
  payload: {},
});

export const addLeads = (
  name: string,
  email: string,
  phone: string,
  alternate_phone: string,
  enquiry: string,
  status: string,
  category_id: string | null,
  source_id: string | null,
  channel_id: string | null,
  user_id: string | null,
  branch: string,
  proposal_no: string | null,
  proposal_amount: string | null,
  proposal: string,
  company_name: string,
  country: string,
  flag_id: string | null,
  branch_id: string | null,
  lead_received_date: string | null
): LeadsActionType => ({
  type: LeadsActionTypes.ADD_LEADS,
  payload: {
    name,
    email,
    phone,
    alternate_phone,
    enquiry,
    status,
    category_id,
    source_id,
    channel_id,
    user_id,
    branch,
    proposal_no,
    proposal_amount,
    proposal,
    company_name,
    country,
    flag_id,
    branch_id,
    lead_received_date
  },
});

export const updateLeads = (
  id: string | null,
  name: string,
  email: string,
  phone: string,
  alternate_phone: string,
  enquiry: string,
  status: string,
  category_id: string | null,
  source_id: string | null,
  channel_id: string | null,
  user_id: string | null,
  branch: string,
  proposal_no: string | null,
  proposal_amount: string | null,
  proposal: string,
  company_name: string,
  country: string,
  flag_id: string | null,
  branch_id: string | null,
  lead_received_date: string | null
): LeadsActionType => ({
  type: LeadsActionTypes.UPDATE_LEADS,
  payload: {
    id,
    name,
    email,
    phone,
    enquiry,
    alternate_phone,
    status,
    category_id,
    source_id,
    channel_id,
    user_id,
    branch,
    proposal_no,
    proposal_amount,
    proposal,
    company_name,
    country,
    flag_id,
    branch_id,
    lead_received_date
  },
});

export const deleteLeads = (id: string): LeadsActionType => ({
  type: LeadsActionTypes.DELETE_LEADS,
  payload: { id },
});
