import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/franchise";

function getFranchiseUsersApi() {
  return api.get(`${baseUrl}`, {});
}

function addFranchiseUsersApi(params: { name: string; email: string; phone: string; address: string; pocName: string }) {
  return api.create(`${baseUrl}`, params);
}

function updateFranchiseUsersApi(
  id: string,
  params: {
    name: string;
    email: string;
    phone: string;
    address: string;
    pocName: string;
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deleteFranchiseUsersApi(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

function addFranchiseAdminUsersApi(params: {
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  password: string;
  updated_by: string;
  role_id: string;
  branch_ids: string | null;
  country_id: string | null;
  franchise_id: string;
}) {
  return api.create("/admin_users", params);
}

function updateFranchiseAdminUsersApi(
  id: string,
  params: {
    employee_id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    username: string;
    updated_by: string;
    role_id: string;
    branch_ids: string | null;
    country_id: string | null;
    franchise_id: string;
  }
) {
  return api.update(`/admin_users/${id}`, params);
}

export {
  getFranchiseUsersApi,
  addFranchiseUsersApi,
  updateFranchiseUsersApi,
  deleteFranchiseUsersApi,
  addFranchiseAdminUsersApi,
  updateFranchiseAdminUsersApi,
};
