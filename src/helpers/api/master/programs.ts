import { APICore } from "../apiCore";

const api = new APICore();

const baseUrl = "/programs";

//
function getPrograms() {
  return api.get(`${baseUrl}`, {});
}

function addPrograms(params: {
  program_name: string;
  university_id: number;
  degree_level: string;
  duration: number;
  tuition_fees: number;
  currency: string;
}) {
  return api.create(`${baseUrl}`, params);
}

function updatePrograms(
  id: string,
  params: {
    program_name: string;
    university_id: number;
    degree_level: string;
    duration: number;
    tuition_fees: number;
    currency: string;
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deletePrograms(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export { addPrograms, deletePrograms, getPrograms, updatePrograms };
