import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/leads";

//
function getLeads(
  currentPage: number,
  currentLimit: number,
  keyword?: string | undefined,
  sort_by?: string | undefined,
  sort_order?: string | undefined,
  country?: string | undefined,
  office?: string | undefined,
  source?: string | undefined,
  counselor?: string | undefined
) {
  const params: any = {
    page: currentPage,
    limit: currentLimit,
  };

  if (keyword) {
    params.keyword = keyword;
  }

  if (sort_order) {
    params.sort_level = sort_order;
  }

  if (sort_by) {
    params.sort_by = sort_by;
  }

  if (country) {
    params.country = country;
  }

  if (office) {
    params.office = office;
  }

  if (source) {
    params.source = source;
  }

  if (counselor) {
    params.counselor = counselor;
  }

  return api.get(`${baseUrl}`, params);
}

function getLeadsByCreTl(
  currentPage: number,
  currentLimit: number,
  keyword?: string | undefined,
  sort_by?: string | undefined,
  sort_order?: string | undefined,
  country?: string | undefined,
  office?: string | undefined,
  source?: string | undefined
) {
  const params: any = {
    page: currentPage,
    limit: currentLimit,
  };

  if (keyword) {
    params.keyword = keyword;
  }

  if (sort_order) {
    params.sort_level = sort_order;
  }

  if (sort_by) {
    params.sort_by = sort_by;
  }

  if (country) {
    params.country = country;
  }

  if (office) {
    params.office = office;
  }

  if (source) {
    params.source = source;
  }
  return api.get("/leads_cre_tl", params);
}

function getAssignedLeadsByCreTl(
  currentPage: number,
  currentLimit: number,
  keyword?: string | undefined,
  sort_by?: string | undefined,
  sort_order?: string | undefined,
  country?: string | undefined,
  office?: string | undefined,
  source?: string | undefined,
  assigned_cre?: string | undefined
) {
  const params: any = {
    page: currentPage,
    limit: currentLimit,
  };

  if (keyword) {
    params.keyword = keyword;
  }

  if (assigned_cre) {
    params.assigned_cre = assigned_cre;
  }

  if (sort_order) {
    params.sort_level = sort_order;
  }

  if (sort_by) {
    params.sort_by = sort_by;
  }

  if (country) {
    params.country = country;
  }

  if (office) {
    params.office = office;
  }

  if (source) {
    params.source = source;
  }

  return api.get("/assigned_leads_cre_tl", params);
}

function getLeadsByCounsellorTL() {
  return api.get("/leads_counsellor_tl", {});
}

function getAssignedLeadsRegionalMangersApi(
  currentPage: number,
  currentLimit: number,
  keyword?: string | undefined,
  sort_by?: string | undefined,
  sort_order?: string | undefined,
  country?: string | undefined,
  source?: string | undefined,
  branch?: string | undefined
) {
  const params: any = {
    page: currentPage,
    limit: currentLimit,
  };

  if (keyword) {
    params.keyword = keyword;
  }

  if (sort_order) {
    params.sort_level = sort_order;
  }

  if (sort_by) {
    params.sort_by = sort_by;
  }

  if (country) {
    params.country = country;
  }

  if (branch) {
    params.branch = branch;
  }

  if (source) {
    params.source = source;
  }

  return api.get("/assigned_leads_regional_managers", params);
}

function getAssignedLeadsByCounsellorTL(currentPage: number, currentLimit: number, keyword?: string | undefined) {
  const params: any = {
    page: currentPage,
    limit: currentLimit,
  };

  if (keyword) {
    params.keyword = keyword;
  }
  return api.get("/assigned_leads_counsellor_tl", params);
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
    flag_id: string;
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
    flag_id: string;
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

  // return api.update(`${baseUrl}${id}`, params);
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
