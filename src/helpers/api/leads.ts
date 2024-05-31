import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/leads";

//
function getLeads() {
  return api.get(`${baseUrl}`, {});
}

function getLeadUser() {
  return api.get("/leads_user", {});
}

function addLeads(params: {
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
  lead_received_date: string;
}) {
  return api.create(`${baseUrl}`, params);
}

function updateLeads(
  id: string,
  params: {
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
    lead_received_date: string;
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deleteLeads(id: string) {
  return api.update(`${baseUrl}/disable-leads/${id}`, {});
}

export { getLeads, getLeadUser, addLeads, updateLeads, deleteLeads };
