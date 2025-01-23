import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/campuses";

function getCampusApi() {
  return api.get(`${baseUrl}`, {});
}

function getCampusCourseApi(campus_id: string) {
  return api.get(`get_configured_courses/${campus_id}`, {});
}

function addCampusApi(params: {
  campus_name: string;
  location: string;
  university_id: string;
  // courses: { course_fee: string; application_fee: string; course_link: string; course_id: string | number }[];
}) {
  return api.create(`${baseUrl}`, params);
}

function courseConfigurationApi(params: {
  campus_id: string;
  course_fee: string;
  application_fee: string;
  course_link: string;
  course_id: string | number;
  operation: string
}) {
  return api.create(`configure_courses`, params);
}

function configureCampusCourseApi(params: {
  campus_id: string;
  courses: { course_fee: string; application_fee: string; course_link: string; course_id: string | number }[];
}) {
  return api.create(`${baseUrl}`, params);
}

function updateCampusApi(
  id: string,
  params: {
    campus_name: string;
    location: string;
    university_id: string;
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deleteCampusApi(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

function deleteCourseConfigApi(params: { campus_id: string, course_id: string | number }) {
  return api.delete(`${baseUrl}`, params);
}

export {
  getCampusApi,
  addCampusApi,
  updateCampusApi,
  deleteCampusApi,
  getCampusCourseApi,
  configureCampusCourseApi,
  courseConfigurationApi,
  deleteCourseConfigApi
};
