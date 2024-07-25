import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/leads";

//
function getLeads() {
  return api.get(`${baseUrl}`, {});
}

function getLeadsByCreTl() {
  return api.get("/leads_cre_tl", {});
}

function getLeadUser() {
  return api.get("/leads_user", {});
}

function addLeads(params: {
  full_name: string;
  email: string;
  phone: string;
  category_id: string;
  source_id: string;
  channel_id: string;
  city: string;
  preferred_country: string;
  office_type: string;
  region_id: string | null;
  counsiler_id: string | null;
  branch_id: string | null;
  updated_by: string;
  remarks: string;
  lead_received_date: string;
  ielts: boolean;
}) {
  console.log(params);

  return api.create(`${baseUrl}`, params);
}

function updateLeads(
  id: string,
  params: {
    full_name: string;
    email: string;
    phone: string;
    category_id: string;
    source_id: string;
    channel_id: string;
    city: string;
    preferred_country: string;
    office_type: string;
    region_id: string | null;
    counsiler_id: string | null;
    branch_id: string | null;
    updated_by: string;
    remarks: string;
    lead_received_date: string;
    ielts: boolean;
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deleteLeads(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export { getLeads, getLeadUser, addLeads, updateLeads, deleteLeads, getLeadsByCreTl };
