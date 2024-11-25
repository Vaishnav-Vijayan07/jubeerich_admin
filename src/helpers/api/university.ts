import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/university";

//
function getUniversitysApi() {
  return api.get(`${baseUrl}`, {});
}

function addUniversitysApi(params: {
  university_name: string;
  location: string;
  country_id: string;
  website_url: string;
  image_url: string;
  portal_link: string;
  username: string;
  password: string;
  updated_by: string;
  description: string;
}) {
  return api.create(`${baseUrl}`, params);
}

function updateUniversitysApi(
  id: string,
  params: {
    university_name: string;
    location: string;
    country_id: string;
    website_url: string;
    image_url: string;
    portal_link: string;
    username: string;
    password: string;
    updated_by: string;
    description: string;
  }
) {
  return api.update(`${baseUrl}/${id}`, params);
}

function deleteUniversitysApi(id: string) {
  return api.delete(`${baseUrl}/${id}`, {});
}

export { getUniversitysApi, addUniversitysApi, updateUniversitysApi, deleteUniversitysApi };
