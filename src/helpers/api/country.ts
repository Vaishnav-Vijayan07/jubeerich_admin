import { APICore } from "./apiCore";

const api = new APICore();
const url = "/country";

//Get all Data
function getCountrysApi() {
  return api.get(`${url}`, {});
}

//Get all by Id
function getCountryByidApi(id: string) {
  return api.get(`${url}/${id}`, {});
}

//Add data
function addCountrysApi(params: {
  country_name: string;
  country_code: string;
  isd: string;
}) {
  return api.create(`${url}`, params);
}

//Update data
function updateCountrysApi(
  id: string,
  params: {
    country_name: string;
    country_code: string;
    isd: string;
  }
) {
  return api.update(`${url}/${id}`, params);
}

function deleteCountrysApi(id: string) {
  return api.delete(`${url}/${id}`, {});
}

export {
  getCountrysApi,
  getCountryByidApi,
  updateCountrysApi,
  deleteCountrysApi,
  addCountrysApi,
};
