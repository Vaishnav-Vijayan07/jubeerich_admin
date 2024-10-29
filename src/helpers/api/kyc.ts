import { APICore } from "./apiCore";

const api = new APICore();

//
function getPendingKycsApi(type: string) {
  return api.get(`/kyc_pending`, { type });
}

function getRejectedKycsApi() {
  return api.get(`/kyc_rejected`, {});
}

function getApprovedKycsApi() {
  return api.get(`/kyc_approved`, {});
}

export { getPendingKycsApi, getRejectedKycsApi, getApprovedKycsApi };
