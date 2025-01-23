import { APICore } from "../apiCore";

const api = new APICore();

const baseUrl = "/branches/";

//
function getBranches() {
  return api.get(`${baseUrl}`, {});
}

function addBranches(params: {
  branch_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  contact_person_email: string;
  contact_person_name: string;
  contact_person_mobile: string;
  contact_person_designation: string;
  website: string;
  social_media: string;
  account_mail: string;
  support_mail: string;
  office_type: string;
  region_id: string;
  status: boolean;
  updated_by: string;
}) {
  return api.create(`${baseUrl}`, params);
}

function updateBranches(
  id: string,
  params: {
    branch_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    contact_person_email: string;
    contact_person_name: string;
    contact_person_mobile: string;
    contact_person_designation: string;
    website: string;
    social_media: string;
    account_mail: string;
    support_mail: string;
    office_type: string;
    region_id: string;
    status: boolean;
    updated_by: string;
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deleteBranches(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export { getBranches, addBranches, updateBranches, deleteBranches };
