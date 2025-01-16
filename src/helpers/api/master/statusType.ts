import { APICore } from "../apiCore";

const api = new APICore();

const baseUrl = "/status_type";

//
function getStatusTypeApi() {
  return api.get(`${baseUrl}`, {});
}

function addStatusTypeApi(params: { type_name: string; priority: number }) {
  return api.create(`${baseUrl}`, params);
}

function updateStatusTypeApi(
  id: string,
  params: {
    type_name: string;
    priority: number;
  }
) {
  return api.update(`${baseUrl}${id}`, params);
}

function deleteStatusTypeApi(id: string) {
  return api.delete(`${baseUrl}${id}`, {});
}

export { addStatusTypeApi, getStatusTypeApi, deleteStatusTypeApi, updateStatusTypeApi };
