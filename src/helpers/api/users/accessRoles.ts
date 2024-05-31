import { APICore } from "../apiCore";

const api = new APICore();

const baseUrl = "/access_roles";

//
function getAccessRoles() {
  return api.get(`${baseUrl}`, {});
}

function addAccessRole(params: {
    power_ids: Array<string>,
    role_name: string;
    updated_by: string
}) {
  return api.create(`${baseUrl}`, params);
}

function updateAccessRole(
  id: string,
  params: {
    power_ids: Array<string>,
    role_name: string;
    updated_by: string
  }
) {

  return api.update(`${baseUrl}/${id}`, params);
}

function deleteAccessRoles(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export { getAccessRoles, addAccessRole, updateAccessRole, deleteAccessRoles };
