import { APICore } from "./apiCore";

const api = new APICore();

//
function getDashboard() {
  const baseUrl = "/dashboard";
  return api.get(`${baseUrl}`, {});
}

export { getDashboard };
