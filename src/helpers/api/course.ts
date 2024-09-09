import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/courses";

function getCourseApi() {
  return api.get(`${baseUrl}`, {});
}

function addCourseApi(params: {
  course_name: string;
  course_description: string;
  course_type_id: number | string;
  stream_id: number | string;
  updated_by: string;
}) {
  console.log(params);

  return api.create(`${baseUrl}`, params);
}

function updateCourseApi(
  id: string,
  params: {
    course_name: string;
    course_description: string;
    course_type_id: number | string;
    stream_id: number | string;
    updated_by: string;
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deleteCourseApi(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export { getCourseApi, addCourseApi, updateCourseApi, deleteCourseApi };
