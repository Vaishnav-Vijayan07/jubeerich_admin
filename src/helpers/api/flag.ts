import { APICore } from "./apiCore";

const api = new APICore();
const url = "/flags";

//Get all Data
function getFlagsApi() {
  return api.get(`${url}`, {});
}

//Get all by Id
function getFlagByidApi(id: string) {
  return api.get(`${url}/${id}`, {});
}

//Add data
function addFlagsApi(params: {
  flag_name: string;
  flag_description: string;
  color: string
  updated_by: string;
}) {
  return api.create(`${url}`, params);
}

//Update data
function updateFlagsApi(
  id: string,
  params: {
    flag_name: string;
    flag_description: string;
    color: string;
    updated_by: string;
  }
) {
  console.log('Params',params);
  
  return api.update(`${url}/${id}`, params);
}

function deleteFlagsApi(id: string) {
  return api.delete(`${url}/${id}`, {});
}

export {
  getFlagsApi,
  getFlagByidApi,
  updateFlagsApi,
  deleteFlagsApi,
  addFlagsApi,
};
