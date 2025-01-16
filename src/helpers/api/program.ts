import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/programs";

//
function getProgramsApi() {
  return api.get(`${baseUrl}`, {});
}

function addProgramsApi(params: {
  program_name: string;
  university_id: string;
  degree_level: string;
  duration: string;
  tuition_fees: string;
  currency: string;
}) {
  return api.create(`${baseUrl}`, params);
}

function updateProgramsApi(
  id: string,
  params: {
    program_name: string;
    university_id: string;
    degree_level: string;
    duration: string;
    tuition_fees: string;
    currency: string;
  }
) {
  return api.update(`${baseUrl}${id}`, params);
}

function deleteProgramsApi(id: string) {
  return api.delete(`${baseUrl}${id}`, {});
}

export { getProgramsApi, addProgramsApi, updateProgramsApi, deleteProgramsApi };
