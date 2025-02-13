import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/course-types";

function getCourseTypeApi() {
  return api.get(`${baseUrl}`, {});
}

function addCourseTypeApi(params: { type_name: string; description: string }) {
  return api.create(`${baseUrl}`, params);
}

function updateCourseTypeApi(
  id: string,
  params: {
    type_name: string;
    description: string;
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deleteCourseTypeApi(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export { getCourseTypeApi, addCourseTypeApi, updateCourseTypeApi, deleteCourseTypeApi };
