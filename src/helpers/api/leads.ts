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

function getAssignedLeadsByCreTl() {
  return api.get("/assigned_leads_cre_tl", {});
}

function getLeadsByCounsellorTL() {
  return api.get("/leads_counsellor_tl", {});
}

function getAssignedLeadsRegionalMangersApi() {
  return api.get("/assigned_leads_regional_managers", {});
}

function getAssignedLeadsByCounsellorTL() {
  return api.get("/assigned_leads_counsellor_tl", {});
}

function getLeadUser() {
  return api.get("/leads_user", {});
}

function addLeads(
  params: {
    full_name: string;
    email: string;
    phone: string;
    lead_type_id: string;
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
    zipcode: string;
    exam_details?: any;
    exam_documents?: any;
    franchise_id?: string;
  },
  exam_documents?: any
) {
  return api.createWithMultipleFile(`${baseUrl}`, params, exam_documents);
}

function updateLeads(
  id: string,
  params: {
    full_name: string;
    email: string;
    phone: string;
    lead_type_id: string;
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
    zipcode: string;
    exam_details?: any;
    franchise_id?: string;
    // exam_documents?: any
  },
  exam_documents?: any
) {
  console.log("params ==>", params);

  // return api.update(`${baseUrl}/${id}`, params);
  return api.updateWithMultipleFile(`${baseUrl}/${id}`, params, exam_documents);
}

function deleteLeads(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export {
  getLeads,
  getLeadUser,
  addLeads,
  updateLeads,
  deleteLeads,
  getLeadsByCreTl,
  getAssignedLeadsByCreTl,
  getAssignedLeadsByCounsellorTL,
  getLeadsByCounsellorTL,
  getAssignedLeadsRegionalMangersApi,
};
