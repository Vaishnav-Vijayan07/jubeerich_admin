import { APICore } from "./apiCore";

const api = new APICore();

//Get all Data
function getOfficeTypeApi() {
  return api.get("office_type", {});
}

//Get all by Id
function getOfficeTypeByidApi(id: string) {
  return api.get(`office_type/${id}`, {});
}

//Add data
function addOfficeTypeApi(params: {
  office_type_name: string;
  office_type_description: string;
  updated_by: string;
}) {
  return api.create("office_type", params);
}

//Update data
function updateOfficeTypeApi(
  id: string,
  params: {
    office_type_name: string;
    office_type_description: string;
    updated_by: string;
  }
) {
  return api.update(`office_type/${id}`, params);
}

function deleteOfficeTypeApi(id: string) {
  return api.delete(`office_type/${id}`, {});
}

export {
  getOfficeTypeApi,
  getOfficeTypeByidApi,
  updateOfficeTypeApi,
  deleteOfficeTypeApi,
  addOfficeTypeApi,
};
