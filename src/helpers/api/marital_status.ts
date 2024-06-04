import { APICore } from "./apiCore";

const api = new APICore();
const url = "/marital_status";

//Get all Data
function getMaritalStatusApi() {
  return api.get(`${url}`, {});
}

//Get all by Id
function getMaritalStatusByidApi(id: string) {
  return api.get(`${url}/${id}`, {});
}

//Add data
function addMaritalStatusApi(params: {
  marital_status_name: string;
  marital_status_description: string;
  updated_by: string;
}) {
  return api.create(`${url}`, params);
}

//Update data
function updateMaritalStatusApi(
  id: string,
  params: {
    marital_status_name: string;
    marital_status_description: string;
    updated_by: string;
  }
) {
  return api.update(`${url}/${id}`, params);
}

function deleteMaritalStatusApi(id: string) {
  return api.delete(`${url}/${id}`, {});
}

export {
  getMaritalStatusApi,
  getMaritalStatusByidApi,
  updateMaritalStatusApi,
  deleteMaritalStatusApi,
  addMaritalStatusApi,
};
