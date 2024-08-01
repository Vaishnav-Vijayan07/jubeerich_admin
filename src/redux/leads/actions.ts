// constants
import { LeadsActionTypes } from "./constants";

export interface LeadsActionType {
  type:
    | LeadsActionTypes.API_RESPONSE_SUCCESS
    | LeadsActionTypes.API_RESPONSE_ERROR
    | LeadsActionTypes.GET_LEADS
    | LeadsActionTypes.GET_LEADS_TL
    | LeadsActionTypes.GET_LEADS_ASSIGNED
    | LeadsActionTypes.GET_LEAD_USER
    | LeadsActionTypes.ADD_LEADS
    | LeadsActionTypes.UPDATE_LEADS
    | LeadsActionTypes.DELETE_LEADS;
  payload: {} | string;
}

interface LeadsData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  category_id: string;
  source_id: string;
  channel_id: string;
  city: string;
  preferred_country: string;
  office_type: string;
  // Uncomment these fields if they are needed
  // region_id: string;
  // counsiler_id: string;
  // branch_id: string;
  updated_by: string;
  remarks: string;
  lead_received_date: string;
  ielts: boolean;
}

// common success
export const LeadsApiResponseSuccess = (
  actionType: string,
  data: LeadsData | {}
): LeadsActionType => ({
  type: LeadsActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const LeadsApiResponseError = (
  actionType: string,
  error: string
): LeadsActionType => ({
  type: LeadsActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getLead = (): LeadsActionType => ({
  type: LeadsActionTypes.GET_LEADS,
  payload: {},
});

export const getLeadsTL = (): LeadsActionType => ({
  type: LeadsActionTypes.GET_LEADS_TL,
  payload: {},
});

export const getLeadAssigned = (): LeadsActionType => ({
  type: LeadsActionTypes.GET_LEADS_ASSIGNED,
  payload: {},
});

export const getLeadUser = (): LeadsActionType => ({
  type: LeadsActionTypes.GET_LEAD_USER,
  payload: {},
});

export const addLeads = (
  full_name: string | null,
  email: string | null,
  phone: string | null,
  category_id: string | null,
  source_id: string | null,
  channel_id: string | null,
  city: string | null,
  preferred_country: string | null,
  office_type: string | null,
  region_id: string | null,
  counsiler_id: string | null,
  branch_id: string | null,
  updated_by: string | null,
  remarks: string | null,
  lead_received_date: string | null,
  ielts: boolean
): LeadsActionType => ({
  type: LeadsActionTypes.ADD_LEADS,
  payload: {
    full_name,
    email,
    phone,
    category_id,
    source_id,
    channel_id,
    city,
    preferred_country,
    office_type,
    region_id,
    counsiler_id,
    branch_id,
    updated_by,
    remarks,
    lead_received_date,
    ielts,
  },
});

export const updateLeads = (
  id: string | null,
  full_name: string | null,
  email: string | null,
  phone: string | null,
  category_id: string | null,
  source_id: string | null,
  channel_id: string | null,
  city: string | null,
  preferred_country: string | null,
  office_type: string | null,
  region_id: string | null,
  counsiler_id: string | null,
  branch_id: string | null,
  updated_by: string | null,
  remarks: string | null,
  lead_received_date: string | null,
  ielts: boolean
): LeadsActionType => ({
  type: LeadsActionTypes.UPDATE_LEADS,
  payload: {
    id,
    full_name,
    email,
    phone,
    category_id,
    source_id,
    channel_id,
    city,
    preferred_country,
    office_type,
    region_id,
    counsiler_id,
    branch_id,
    updated_by,
    remarks,
    lead_received_date,
    ielts,
  },
});

export const deleteLeads = (id: string): LeadsActionType => ({
  type: LeadsActionTypes.DELETE_LEADS,
  payload: { id },
});
