import { APICore } from "../apiCore";

const api = new APICore();

const baseUrl = "/lead_category";
//
function getCategory() {
  return api.get(`${baseUrl}`, {});
}

function addCategory(params: {
  category_name: string;
  category_description: string;
  status: boolean;
  updated_by: number;
}) {
  return api.create(`${baseUrl}`, params);
}

function updateCategory(params: {
  id: number;
  category_name: string;
  category_description: string;
  status: boolean;
  updated_by: number;
}) {
  return api.update(`${baseUrl}/${params.id}`, params);
}

function deleteCategory(params: { id: number; updated_by: number }) {
  return api.delete(`${baseUrl}/${params.id}`, params);
}

export { getCategory, addCategory, updateCategory, deleteCategory };
