import { APICore } from "../apiCore";

const api = new APICore();

const baseUrl = "/lead_type";
//
function getCategory() {
  return api.get(`${baseUrl}`, {});
}

function addCategory(params: {
  name: string;
  description: string;
}) {
  return api.create(`${baseUrl}`, params);
}

function updateCategory(params: {
  id: number;
  name: string;
  description: string;
}) {
  return api.update(`${baseUrl}${params.id}`, params);
}

function deleteCategory(params: { id: number }) {
  return api.delete(`${baseUrl}${params.id}`, params);
}

export { getCategory, addCategory, updateCategory, deleteCategory };
