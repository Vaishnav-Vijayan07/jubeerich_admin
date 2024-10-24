import { APICore } from "./apiCore";

const api = new APICore();

//
function getPendingKycsApi() {
  return api.get(`/kyc_pending`, {});
}

export { getPendingKycsApi };
