import { APICore } from "./apiCore";

const api = new APICore();

//
function getDashboard() {
  const baseUrl = "/dash_board";
  return api.get(`${baseUrl}`, {});
}

export { getDashboard };
