import { APICore } from "../apiCore";

const api = new APICore();

const baseUrl = "/lead_source";

//
function getSources() {
  return api.get(`${baseUrl}`, {});
}

function addSources(params: {
  source_name: string;
  source_description: string;
  updated_by: string;
}) {

  return api.create(`${baseUrl}`, params);
}

function updateSources(
  id: string,
  params: {
    source_name: string;
    source_description: string;
    updated_by: string;
  }
) {

  return api.update(`${baseUrl}/${id}`, params);
}

function deleteSources(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export { getSources, addSources, updateSources, deleteSources };
