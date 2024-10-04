import { APICore } from "./apiCore";

const api = new APICore();

const baseUrl = "/dropdown";

function getdropdownApi(params: { types: string }) {
  return api.get(`${baseUrl}`, params);
}

export { getdropdownApi };
