import axios from "axios";
import { APICore } from "../apiCore";

const api = new APICore();

const baseUrl = "/admin_users";

function getAdminUsers() {
  return api.get(`${baseUrl}`, {});
}

function addAdminUsers(params: {
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  password: string;
  updated_by: string;
  role_id: string;
  profileImage: File;
  branch_ids: string;
}) {
  return api.create(`${baseUrl}`, params);
}

function updateAdminUsers(
  id: string,
  params: {
    employee_id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    username: string;
    password: string;
    updated_by: string;
    role_id: string;
    profileImage: File;
    branch_ids: string;
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deleteAdminUsers(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

function updateBranch(id: string, params: { branchIds: string[] }) {
  const baseUrl = "/admin_users_branch";
  return api.update(`${baseUrl}/${id}`, params);
}

export { getAdminUsers, addAdminUsers, updateAdminUsers, deleteAdminUsers, updateBranch };
