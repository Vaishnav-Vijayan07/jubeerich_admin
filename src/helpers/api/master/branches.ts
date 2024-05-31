import { APICore } from "../apiCore";

const api = new APICore();

const baseUrl = "/branches";

//
function getBranches() {
  return api.get(`${baseUrl}`, {});
}

function addBranches(params: { branch_name: string; branch_address: string; branch_city: string; branch_country: string; currency: string; updated_by: string }) {
  return api.create(`${baseUrl}`, params);
}

function updateBranches(
  id: string,
  params: {
    branch_name: string;
    branch_address: string;
    branch_city: string;
    branch_country: string;
    currency: string;
    updated_by: string;
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deleteBranches(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export { getBranches, addBranches, updateBranches, deleteBranches };
