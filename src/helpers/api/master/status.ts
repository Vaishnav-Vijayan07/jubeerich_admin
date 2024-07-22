import { APICore } from "../apiCore";

const api = new APICore();

const baseUrl = "/status";

//
function getStatus() {
  return api.get(`${baseUrl}`, {});
}

function getStatusConfig() {
  return api.get(`status_config`, {});
}

function addStatus(params: {
  status_name: string,
  status_description: string,
  color: string,
  updated_by: string,
}) {
  return api.create(`${baseUrl}`, params);
}

function updateStatus(
  id: string,
  params: {
    status_name: string,
    status_description: string,
    color: string,
    updated_by: string,
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deleteStatus(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export { addStatus, getStatus, deleteStatus, updateStatus, getStatusConfig };
