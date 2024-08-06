import { APICore } from "./apiCore";

const api = new APICore();
const url = "/region";

//Get all Data
function getRegionsApi() {
  return api.get(`${url}`, {});
}

function getRegionsManagerApi() {
  return api.get("/regional_managers", {});
}

//Get all by Id
function getRegionByidApi(id: string) {
  return api.get(`${url}/${id}`, {});
}

//Add data
function addRegionsApi(params: {
  region_name: string;
  region_description: string;
  regional_manager_id: string;
  updated_by: string;
}) {
  return api.create(`${url}`, params);
}

//Update data
function updateRegionsApi(
  id: string,
  params: {
    region_name: string;
    region_description: string;
    regional_manager_id: string;
    updated_by: string;
  }
) {
  return api.update(`${url}/${id}`, params);
}

function deleteRegionsApi(id: string) {
  return api.delete(`${url}/${id}`, {});
}

export {
  getRegionsApi,
  getRegionByidApi,
  updateRegionsApi,
  deleteRegionsApi,
  addRegionsApi,
  getRegionsManagerApi,
};
