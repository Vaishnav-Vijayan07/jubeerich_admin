import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/visa_ckecklist_master";

function getVisaChecklistApi() {
  return api.get(`${baseUrl}`, {});
}

function addVisaChecklistApi(params: {
    step_name: string;
    description: string;
    fields: Array<any>;
}) {
  return api.create(`${baseUrl}`, params);
}

function updateVisaChecklistApi(
  id: string,
  params: {
    step_name: string;
    description: string;
    fields: Array<any>;
  }
) {
  return api.update(`${baseUrl}${id}`, params);
}

function deleteVisaChecklistApi(id: string) {
  return api.delete(`${baseUrl}${id}`, {});
}

export { getVisaChecklistApi, addVisaChecklistApi, updateVisaChecklistApi, deleteVisaChecklistApi };
