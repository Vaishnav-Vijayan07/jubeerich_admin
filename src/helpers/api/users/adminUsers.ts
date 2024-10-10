import axios from "axios";
import { APICore } from "../apiCore";

const api = new APICore();

const baseUrl = "/admin_users";
const baseUrlBranchCounsellor = "/get_all_counsellors";
const baseUrlBranchCounsellorTL = '/get_all_counsellors_tl'
const baseUrlFranchiseCounsellor = '/get_all_franchise_counsellors'
const baseUrlFranchiseCounsellorTL = '/get_all_franchise_counsellors_tl'

function getAdminUsers() {
  return api.get(`${baseUrl}`, {});
}

function getBranchCounsellors(branchId: any) {
  return api.get(`${baseUrlBranchCounsellor}/${branchId}`, {});
}

function getBranchCounsellorsTL(branchId: any) {
  return api.get(`${baseUrlBranchCounsellorTL}/${branchId}`, {});
}

function getFranchiseCounsellorsByFranchise(franchiseId: any) {
  return api.get(`${baseUrlFranchiseCounsellor}/${franchiseId}`, {});
}

function getFranchiseCounsellorsTLByFranchise(franchiseId: any) {
  return api.get(`${baseUrlFranchiseCounsellorTL}/${franchiseId}`, {});
}


function getFranchiseCounsellors() {
  return api.get(`get_franchise_counsellors`, {});
}

function addAdminUsers(params: {
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  password: string | null;
  updated_by: string;
  role_id: string;
  profileImage: File;
  branch_ids: string;
  country_id: any;
  franchise_id?: string
  region_id?: string
  branch_id?: string,
  country_ids?: string,
}) {
  if (params.country_id == undefined) {
    params.country_id = null;
  }

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
    password: string | null;
    updated_by: string;
    role_id: string;
    profileImage: File;
    branch_ids: string;
    country_id: any;
    franchise_id?: string;
    region_id?: string;
    branch_id?: string;
    country_ids?: string
  }
) {
  console.log(params.country_id);
  if (params.country_id == undefined) {
    params.country_id = null;
  }

  return api.update(`${baseUrl}/${id}`, params);
}

function deleteAdminUsers(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

function updateBranch(id: string, params: { branchIds: string[] }) {
  const baseUrl = "/admin_users_branch";
  return api.update(`${baseUrl}/${id}`, params);
}

export {
  getAdminUsers,
  addAdminUsers,
  updateAdminUsers,
  deleteAdminUsers,
  updateBranch,
  getFranchiseCounsellors,
  getBranchCounsellors,
  getBranchCounsellorsTL,
  getFranchiseCounsellorsByFranchise,
  getFranchiseCounsellorsTLByFranchise
};
