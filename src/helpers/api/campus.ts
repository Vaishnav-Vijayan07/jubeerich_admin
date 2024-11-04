import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/campuses";

function getCampusApi() {
  return api.get(`${baseUrl}`, {});
}

function addCampusApi(params: {
  campus_name: string;
  location: string;
  university_id: string;
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
    courses: { course_fee: string; application_fee: string;  course_link: string; course_id: string | number }[];
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deleteCampusApi(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export { getCampusApi, addCampusApi, updateCampusApi, deleteCampusApi };
